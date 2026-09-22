"use client";

import { useEffect, useRef } from "react";

/**
 * Raw WebGL ember/heat layer for the Kablitz hero.
 *
 * A single fullscreen quad runs an FBM-noise fragment shader that paints a
 * drifting ember + heat-shimmer field in the brand red→orange palette. It is
 * meant to sit over the plant photo with `mix-blend-mode: screen`.
 *
 * Degrades gracefully: renders nothing when WebGL is unavailable or the user
 * prefers reduced motion. Pauses when scrolled out of view.
 */
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;

// hash + value noise + fbm
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), u.x),
             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv;
  p.x *= u_res.x / u_res.y;

  // rising heat: scroll the noise field upward over time
  float t = u_time * 0.06;
  float n = fbm(p * 3.0 + vec2(0.0, -t * 4.0));
  float n2 = fbm(p * 6.0 + vec2(t, -t * 6.0));

  // embers concentrate toward the bottom, fade toward the top
  float vert = pow(1.0 - uv.y, 1.6);
  float heat = vert * (n * 0.7 + n2 * 0.5);

  // sparse glowing embers
  float ember = smoothstep(0.72, 0.95, n2) * vert;

  vec3 deep = vec3(0.50, 0.015, 0.09);   // brand red #c00418-ish
  vec3 hot  = vec3(1.0, 0.45, 0.08);     // orange
  vec3 col = mix(deep, hot, clamp(heat * 1.6, 0.0, 1.0));
  col += hot * ember * 1.4;

  float alpha = clamp(heat * 1.3 + ember * 0.9, 0.0, 0.85);
  gl_FragColor = vec4(col, alpha);
}
`;

const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

export function KablitzEmberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uTime = gl.getUniformLocation(program, "u_time");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    let raf = 0;
    let running = true;
    const start = performance.now();
    const render = () => {
      if (!running) return;
      resize();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };

    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !running) {
              running = true;
              raf = requestAnimationFrame(render);
            } else if (!entry.isIntersecting && running) {
              running = false;
              cancelAnimationFrame(raf);
            }
          })
        : null;
    observer?.observe(canvas);

    raf = requestAnimationFrame(render);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className="kablitz-ember-canvas" aria-hidden="true" />;
}
