"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";

const VERT = `attribute vec2 a_pos; void main(){gl_Position=vec4(a_pos,0.,1.);}`;
const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_scroll;
uniform float u_wind;
uniform float u_power;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+1.7;a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/u_res;
 float aspect=u_res.x/u_res.y;
 float t=u_time;
 float reach=.34+u_scroll*.28;
 float pointer=exp(-pow((uv.x-u_pointer.x)*4.,2.))*(1.-u_pointer.y)*.19;
 vec2 p=vec2(uv.x*aspect*3.8,uv.y*4.5);
 p.x-=uv.y*(u_wind*1.7+(u_pointer.x-.5)*.7);
 float warp=fbm(p*1.25-vec2(0.,t*.8));
 float n=fbm(p*vec2(1.3,1.1)+vec2(warp*1.8,-t*1.5));
 float tongues=pow(max(0.,n),1.3)*(reach+pointer)*2.2;
 float field=tongues-uv.y;
 float flame=smoothstep(-.035,.14,field)*smoothstep(.02,.23,n)*(1.-smoothstep(.5,.82,uv.y));
 float core=smoothstep(.045,.25,field);
 vec3 color=mix(vec3(.82,.055,.008),vec3(1.,.43,.035),core);
 color=mix(color,vec3(1.,.88,.46),pow(core,4.));
 float glow=exp(-uv.y*8.)*(.09+.12*n);
 vec3 light=color*flame+vec3(1.,.14,.018)*glow;
 for(int i=0;i<20;i++){
  float seed=float(i);float speed=.09+hash(vec2(seed,7.))*.12;
  float y=fract(t*speed+hash(vec2(seed,2.)));
  float x=hash(vec2(seed,3.))+sin(t*.8+seed+y*5.)*.028+u_wind*y*.06;
  vec2 d=vec2((uv.x-x)*aspect,uv.y-y*.82);
  float spark=exp(-dot(d*vec2(220.,95.),d*vec2(220.,95.)));
  light+=vec3(1.,.55,.12)*spark*(1.-y)*1.4;
 }
 float alpha=clamp(flame*.87+glow,.0,.92);
 alpha=max(alpha,max(light.r,max(light.g,light.b))*.7);
 gl_FragColor=vec4(light*u_power,alpha*u_power);
}`;

/** Scroll/pointer-responsive fire, with bounded GPU resolution and offscreen suspension. */
export function KablitzFire({ progressRef, variant = "hero" }: {
  progressRef?: RefObject<number>;
  variant?: "hero" | "process";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.closest("section");
    if (!canvas || !host) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const program = gl.createProgram();
    if (!program) return;
    for (const [type, source] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]] as const) {
      const shader = gl.createShader(type);
      if (!shader) return;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        shaders.forEach((s) => gl.deleteShader(s)); gl.deleteProgram(program); return;
      }
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach((s) => gl.deleteShader(s)); gl.deleteProgram(program); return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const uniforms = Object.fromEntries(["res", "pointer", "time", "scroll", "wind", "power"].map((key) => [key, gl.getUniformLocation(program, `u_${key}`)]));
    let frame = 0, visible = false, last = 0, time = 4, scroll = 0, wind = 0;
    let targetScroll = 0, targetWind = 0, previousY = window.scrollY;
    let px = .7, py = .3, tx = .7, ty = .3;
    const resize = () => {
      const width = canvas.clientWidth, height = canvas.clientHeight;
      const scale = Math.min(1, 1100 / Math.max(1, width));
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const onScroll = () => {
      const rect = host.getBoundingClientRect();
      targetScroll = Math.min(1, Math.max(0, -rect.top / rect.height));
      targetWind = Math.max(-1, Math.min(1, (window.scrollY - previousY) / 80));
      previousY = window.scrollY;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height;
    };
    const leave = () => { tx = .7; ty = .3; };
    const render = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || gl.isContextLost()) return;
      const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
      if (!pausedRef.current) time += dt * (1 + Math.abs(wind) * 1.8);
      const ease = 1 - Math.exp(-dt * 7);
      scroll += (targetScroll - scroll) * ease;
      wind += (targetWind - wind) * ease; targetWind *= .93;
      px += (tx - px) * ease; py += (ty - py) * ease;
      const p = progressRef?.current ?? 0;
      const power = variant === "hero" ? 1 : .12 + Math.sin(Math.min(1, p) * Math.PI) * .65;
      gl.uniform2f(uniforms.res, canvas.width, canvas.height);
      gl.uniform2f(uniforms.pointer, px, py);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.scroll, variant === "hero" ? scroll : p);
      gl.uniform1f(uniforms.wind, wind);
      gl.uniform1f(uniforms.power, power);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.rendered = "true";
      if (!pausedRef.current) frame = requestAnimationFrame(render);
    };
    const wake = () => { if (!frame && visible && !document.hidden) { last = 0; frame = requestAnimationFrame(render); } };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake(); else { cancelAnimationFrame(frame); frame = 0; }
    });
    observer.observe(canvas);
    const ro = new ResizeObserver(() => { resize(); wake(); }); ro.observe(canvas);
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else wake(); };
    const lost = () => { cancelAnimationFrame(frame); frame = 0; };
    resize(); onScroll();
    host.addEventListener("pointermove", move, { passive: true }); host.addEventListener("pointerleave", leave);
    host.addEventListener("kablitz-motion-change", wake);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", visibility); canvas.addEventListener("webglcontextlost", lost);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); ro.disconnect();
      host.removeEventListener("pointermove", move); host.removeEventListener("pointerleave", leave);
      host.removeEventListener("kablitz-motion-change", wake);
      window.removeEventListener("scroll", onScroll); document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", lost);
      gl.deleteBuffer(buffer); shaders.forEach((s) => gl.deleteShader(s)); gl.deleteProgram(program);
    };
  }, [progressRef, variant]);

  return <>
    <canvas ref={canvasRef} className={`kablitz-ember-canvas kablitz-fire-${variant}`} aria-hidden="true" />
    <button className="kablitz-motion-toggle" type="button" aria-pressed={paused} onClick={() => {
      pausedRef.current = !paused; setPaused(!paused);
      canvasRef.current?.closest("section")?.dispatchEvent(new Event("kablitz-motion-change"));
    }}>
      {paused ? <Play size={14} /> : <Pause size={14} />}
      {paused ? "Animation fortsetzen" : "Animation pausieren"}
    </button>
  </>;
}
