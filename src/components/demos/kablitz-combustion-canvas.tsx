"use client";

import { useEffect, type RefObject } from "react";

/**
 * WebGL combustion background for the process scroll story.
 *
 * Reads a scroll-progress ref (0..1) every frame and morphs the scene through
 * four moods — cold biomass → ignition → full fire+steam → clean exhaust — with
 * FBM flames, rising embers, heat distortion, steam, vignette and grain.
 *
 * Degrades to nothing when WebGL is unavailable or reduced motion is set;
 * pauses when scrolled out of view.
 */
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_progress;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x),
             mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float p = u_progress;
  float t = u_time;

  // Stage envelopes
  float ignite = smoothstep(0.04, 0.30, p);
  float fire   = clamp(ignite - smoothstep(0.62, 0.96, p), 0.0, 1.0);
  float burn   = smoothstep(0.30, 0.55, p) * (1.0 - smoothstep(0.78, 1.0, p));
  float clean  = smoothstep(0.66, 1.0, p);

  // Heat distortion of sample coords
  vec2 duv = uv;
  float warp = fbm(uv * 4.0 + vec2(0.0, -t * 0.5));
  duv.x += (warp - 0.5) * 0.06 * fire;

  // Background mood gradient
  vec3 cold = vec3(0.035, 0.045, 0.065);
  vec3 warm = vec3(0.11, 0.02, 0.02);
  vec3 cleanCol = vec3(0.10, 0.13, 0.17);
  vec3 bg = mix(cold, warm, fire);
  bg = mix(bg, cleanCol, clean);
  bg *= mix(0.65, 1.12, uv.y * 0.6 + 0.3);

  // Flames concentrated at the bottom
  float flameMask = pow(max(0.0, 1.0 - uv.y * 1.25), 2.2);
  float fl = fbm(vec2(duv.x * 3.0, duv.y * 3.2 - t * 1.25));
  float flame = fl * flameMask * fire * 1.9;
  vec3 fireCol = mix(vec3(0.72, 0.04, 0.05), vec3(1.0, 0.58, 0.12), fl);
  fireCol = mix(fireCol, vec3(1.0, 0.92, 0.55), smoothstep(0.55, 1.0, flame));

  // Rising embers
  float emb = smoothstep(0.86, 1.0, fbm(vec2(duv.x * 8.0, duv.y * 8.0 - t * 2.2))) * flameMask * fire;

  // Steam in the upper half during burn + clean
  float steamMask = smoothstep(0.25, 0.95, uv.y);
  float st = fbm(vec2(uv.x * 3.0 + t * 0.2, uv.y * 3.0 - t * 0.85));
  float steam = st * steamMask * max(burn, clean) * 0.55;

  vec3 col = bg;
  col += fireCol * flame;
  col += vec3(1.0, 0.8, 0.4) * emb * 1.6;
  col = mix(col, col + vec3(0.9, 0.95, 1.0) * steam, 0.65);
  col += clean * vec3(0.05, 0.08, 0.10);

  // Vignette + grain for a filmic, premium feel
  vec2 q = uv - 0.5;
  col *= 1.0 - dot(q, q) * 0.85;
  col += hash(uv * u_res.xy * 0.5 + t) * 0.045 - 0.0225;

  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

export function KablitzCombustionCanvas({ progressRef }: { progressRef: RefObject<number> }) {
  useEffect(() => {
    const canvas = document.getElementById("kablitz-combustion-gl") as HTMLCanvasElement | null;
    if (!canvas || typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
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
    const uProg = gl.getUniformLocation(program, "u_progress");

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
    let smooth = 0;
    const start = performance.now();
    const render = () => {
      if (!running) return;
      resize();
      const target = progressRef.current ?? 0;
      smooth += (target - smooth) * 0.08; // buttery scene morph
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform1f(uProg, smooth);
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
  }, [progressRef]);

  return <canvas id="kablitz-combustion-gl" className="kablitz-process-gl" aria-hidden="true" />;
}
