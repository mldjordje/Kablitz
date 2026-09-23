import type * as THREE_NS from "three";
import { PLACES, type WorldPlace } from "@/data/kablitz-world";
import { ROUTES, routeLift, routeVec, sceneAt, tangent, toLatLng, toVec, type SceneState } from "./kablitz-world-story";

/**
 * Renders the globe for a scroll progress value. Land, atmosphere, points and rings come from
 * three-globe; the flight lines are our own tubes so the scroll can draw them to the exact frame
 * and the camera can ride their heads. Labels are plain DOM, projected every frame, with overlaps hidden.
 */

export type EngineEvents = {
  /** Fires when the chapter, the focused place or free-explore mode changes. */
  onState: (s: { chapter: number; focus?: string; free: boolean }) => void;
  /** Fires every rendered frame (cheap DOM updates only). */
  onFrame?: (s: SceneState) => void;
};

export type GlobeEngine = {
  setProgress: (p: number) => void;
  setLayout: (narrow: boolean) => void;
  dispose: () => void;
};

const RAD = Math.PI / 180;
const R = 100; // three-globe radius
const PRIORITY: Record<WorldPlace["kind"], number> = { hub: 6, origin: 5, port: 4, history: 3, region: 2, reference: 1 };

export type GlobeLook = "real" | "hex";

/**
 * Photographic Earth: NASA Blue Marble on the lit side, Black Marble city lights on the night side,
 * sun glint on the oceans and a thin blue limb. The sun rides with the camera (from the upper left),
 * so the subject is always lit and the terminator with its city lights sits towards the right.
 */
const EARTH_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;
const EARTH_FRAGMENT = /* glsl */ `
  uniform sampler2D dayTex;
  uniform sampler2D nightTex;
  uniform sampler2D waterTex;
  uniform vec3 sunDir;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(cameraPosition - vWorld);
    float light = dot(n, sunDir);
    float dayK = smoothstep(-0.12, 0.32, light);
    vec3 day = texture2D(dayTex, vUv).rgb;
    vec3 night = texture2D(nightTex, vUv).rgb;
    float water = texture2D(waterTex, vUv).r;
    float glint = pow(max(dot(n, normalize(sunDir + v)), 0.0), 48.0) * water * dayK;
    float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    vec3 col = day * (0.05 + 1.1 * dayK)
      + night * vec3(1.0, 0.7, 0.42) * 1.8 * (1.0 - dayK)
      + vec3(1.0, 0.9, 0.8) * glint * 0.55
      + vec3(0.35, 0.6, 1.0) * rim * (0.12 + 0.45 * dayK);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }`;

function glowTexture(THREE: typeof THREE_NS) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.18, "rgba(255,214,190,.95)");
  grad.addColorStop(0.45, "rgba(255,98,52,.45)");
  grad.addColorStop(1, "rgba(255,60,30,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const KIND_TAG: Record<WorldPlace["kind"], string> = {
  origin: "Gründung", hub: "Stammsitz", history: "Geschichte", reference: "Referenz", region: "Region", port: "Tankerroute",
};

function labelEl(p: WorldPlace) {
  const el = document.createElement("div");
  el.className = "kw-label";
  el.dataset.kind = p.kind;
  el.dataset.visible = "false";
  const meta = [p.detail, p.country].filter(Boolean).join(" · ");
  el.innerHTML = `<div class="kw-card">
    <span class="kw-card-top"><em>${p.year ?? KIND_TAG[p.kind]}</em>${p.year ? `<i>${KIND_TAG[p.kind]}</i>` : ""}</span>
    <b>${p.label}</b>${meta ? `<small>${meta}</small>` : ""}
  </div><span class="kw-stem"></span>`;
  return el;
}

/* Beacons: a light pillar, a glow pooled on the ground and a pulsing disc, tinted by kind. */
const BEACON: Record<WorldPlace["kind"], { color: string; height: number; disc: number }> = {
  hub: { color: "#ff2b3d", height: 12, disc: 5.5 },
  origin: { color: "#ffb08a", height: 9, disc: 4 },
  history: { color: "#ffc9a8", height: 6.5, disc: 3.2 },
  reference: { color: "#ff7a45", height: 5.5, disc: 3 },
  port: { color: "#9fd0ff", height: 5.5, disc: 3.4 },
  region: { color: "#ff9c74", height: 0, disc: 14 },
};

function beamTexture(THREE: typeof THREE_NS) {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, "rgba(255,255,255,0)");
  grad.addColorStop(0.55, "rgba(255,255,255,.35)");
  grad.addColorStop(1, "rgba(255,255,255,1)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 128);
  return new THREE.CanvasTexture(c);
}

function discTexture(THREE: typeof THREE_NS, ring: boolean) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  if (ring) {
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.72, "rgba(255,255,255,0)");
    grad.addColorStop(0.86, "rgba(255,255,255,.9)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
  } else {
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.2, "rgba(255,255,255,.55)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
  }
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export async function createGlobeEngine(host: HTMLElement, labelHost: HTMLElement, events: EngineEvents, opts: { narrow: boolean; progress: number; instant?: boolean; look?: GlobeLook }): Promise<GlobeEngine> {
  const style = opts.look ?? "real";
  const res = opts.narrow ? "2k" : "4k";
  const [THREE, { default: ThreeGlobe }, countries] = await Promise.all([
    import("three"),
    import("three-globe"),
    style === "hex" ? fetch("/globe/countries-110m.json").then((r) => r.json()) : Promise.resolve(null),
  ]);
  let earth: THREE_NS.ShaderMaterial | null = null;
  let clouds: THREE_NS.Texture | null = null;
  if (style === "real") {
    const loader = new THREE.TextureLoader();
    const [day, night, water, cloudTex] = await Promise.all([
      loader.loadAsync(`/globe/earth-day-${res}.webp`),
      loader.loadAsync(`/globe/earth-night-${res}.webp`),
      loader.loadAsync("/globe/earth-water.webp"),
      loader.loadAsync(`/globe/earth-clouds-${opts.narrow ? "1k" : "2k"}.jpg`).catch(() => null),
    ]);
    clouds = cloudTex;
    day.colorSpace = THREE.SRGBColorSpace;
    night.colorSpace = THREE.SRGBColorSpace;
    earth = new THREE.ShaderMaterial({
      uniforms: { dayTex: { value: day }, nightTex: { value: night }, waterTex: { value: water }, sunDir: { value: new THREE.Vector3(0, 0, 1) } },
      vertexShader: EARTH_VERTEX,
      fragmentShader: EARTH_FRAGMENT,
    });
  }

  let narrow = opts.narrow;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, narrow ? 1.75 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = "kw-canvas";
  if (earth) for (const k of ["dayTex", "nightTex"]) (earth.uniforms[k].value as THREE_NS.Texture).anisotropy = renderer.capabilities.getMaxAnisotropy();
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.5, 6000);
  scene.add(camera, new THREE.AmbientLight(0xc9d6ea, 1.15));
  // Lights ride with the camera, so the face we look at is always lit and the horizon glows red.
  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(-160, 220, 60);
  const rim = new THREE.DirectionalLight(0xff4a26, 2.6);
  rim.position.set(260, -40, -520);
  camera.add(key, rim);

  // Star field far behind the globe: gives the low, tilted shots depth.
  const starPos = new Float32Array(2400 * 3);
  for (let i = 0; i < 2400; i++) {
    const u = Math.random() * 2 - 1;
    const a = Math.random() * Math.PI * 2;
    const r = 2600 + Math.random() * 1200;
    const k = Math.sqrt(1 - u * u);
    starPos.set([r * k * Math.cos(a), r * u, r * k * Math.sin(a)], i * 3);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: "#cfd9e8", size: 1.4, sizeAttenuation: false, transparent: true, opacity: 0.55, depthWrite: false });
  scene.add(new THREE.Points(starGeo, starMat));

  type Globe = THREE_NS.Object3D & {
    ringsData: (d: object[]) => Globe;
    getCoords: (lat: number, lng: number, alt?: number) => { x: number; y: number; z: number };
    setPointOfView: (c: THREE_NS.Camera) => void; _destructor?: () => void;
  };
  const place = (d: object) => d as WorldPlace;
  const globe = new ThreeGlobe({ animateIn: false })
    .globeMaterial(earth ?? new THREE.MeshPhongMaterial({ color: "#0b131b", emissive: "#04070b", specular: "#26313c", shininess: 14 }))
    .showAtmosphere(true)
    .atmosphereColor(earth ? "#7db6ff" : "#ff5634")
    .atmosphereAltitude(earth ? 0.14 : 0.17)
    .hexPolygonsData(countries?.features ?? [])
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.32)
    .hexPolygonAltitude(0.006)
    .hexPolygonColor(() => "rgba(206,218,232,0.62)")
    .ringLat((d: object) => place(d).lat)
    .ringLng((d: object) => place(d).lng)
    .ringAltitude(0.008)
    .ringColor((d: object) => ((t: number) => (place(d).kind === "region" ? `rgba(255,140,90,${0.55 * (1 - t)})` : `rgba(255,76,46,${1 - t})`)))
    .ringMaxRadius((d: object) => ({ hub: 6, region: 10, origin: 4 } as Record<string, number>)[place(d).kind] ?? 3)
    .ringPropagationSpeed((d: object) => (place(d).kind === "region" ? 2.6 : 1.6))
    .ringRepeatPeriod((d: object) => (place(d).kind === "hub" ? 1100 : 1600)) as unknown as Globe;
  scene.add(globe);

  // Thin cloud shell drifting just above the surface (photographic look only).
  let cloudMesh: THREE_NS.Mesh | null = null;
  if (clouds) {
    // The cloud map is density only (greyscale), used as an alpha map over white.
    cloudMesh = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.006, 96, 64),
      new THREE.MeshLambertMaterial({ color: "#ffffff", alphaMap: clouds, transparent: true, opacity: 0.6, depthWrite: false }),
    );
    // three-globe turns its sphere so lng 0 faces +z; match it.
    cloudMesh.rotation.y = -Math.PI / 2;
    globe.add(cloudMesh);
  }

  const beamTex = beamTexture(THREE);
  const discTex = discTexture(THREE, false);
  const ringTex = discTexture(THREE, true);
  const UP = new THREE.Vector3(0, 1, 0);
  const beacons = PLACES.map((p) => {
    const spec = BEACON[p.kind];
    const group = new THREE.Group();
    const c = globe.getCoords(p.lat, p.lng, 0.002);
    const normal = new THREE.Vector3(c.x, c.y, c.z).normalize();
    group.position.set(c.x, c.y, c.z);
    group.quaternion.setFromUnitVectors(UP, normal);
    const add = (geo: THREE_NS.BufferGeometry, map: THREE_NS.Texture, opacity: number) => {
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map, color: spec.color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
      group.add(m);
      return m;
    };
    const flat = (r: number) => new THREE.CircleGeometry(r, 48).rotateX(-Math.PI / 2);
    const glowDisc = add(flat(spec.disc), discTex, 0.9);
    const pulse = add(flat(spec.disc * 1.6), ringTex, 0.8);
    let beam: THREE_NS.Mesh | null = null;
    let core: THREE_NS.Mesh | null = null;
    if (spec.height) {
      beam = add(new THREE.CylinderGeometry(0.1, 0.34, spec.height, 16, 1, true).translate(0, spec.height / 2, 0), beamTex, 0.95);
      core = add(new THREE.SphereGeometry(0.42, 16, 12), discTex, 1);
      (core.material as THREE_NS.MeshBasicMaterial).map = null;
      (core.material as THREE_NS.MeshBasicMaterial).color.set("#ffffff");
    }
    group.scale.setScalar(0.0001);
    globe.add(group);
    return { p, spec, group, glowDisc, pulse, beam, core, appear: 0, lift: 1, phase: Math.random() * Math.PI * 2 };
  });

  /* Flight lines: a tube per route, revealed with drawRange; a glowing head rides the tip. */
  const glow = glowTexture(THREE);
  const SEGMENTS = 160;
  const RADIAL = 6;
  const lines = ROUTES.map((route) => {
    const pts = Array.from({ length: 97 }, (_, i) => {
      const u = i / 96;
      const [x, y, z] = routeVec(route, u);
      const r = R * (1 + routeLift(route, u));
      return new THREE.Vector3(x * r, y * r, z * r);
    });
    const curve = new THREE.CatmullRomCurve3(pts);
    const geometry = new THREE.TubeGeometry(curve, SEGMENTS, route.kind === "sea" ? 0.24 : 0.34, RADIAL, false);
    geometry.setDrawRange(0, 0);
    const material = new THREE.MeshBasicMaterial({
      color: route.kind === "sea" ? "#ffc4a6" : "#ff4d2e", transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geometry, material);
    const ghostMat = new THREE.MeshBasicMaterial({ color: "#ff8a5c", transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
    const ghost = new THREE.Mesh(geometry.clone(), ghostMat);
    ghost.geometry.setDrawRange(0, Infinity);
    ghost.scale.setScalar(0.999);
    globe.add(ghost);
    const head = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: "#ffffff", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    head.scale.setScalar(route.kind === "sea" ? 5 : 7);
    head.visible = false;
    globe.add(mesh, head);
    return { route, curve, geometry, material, ghost, ghostMat, head, total: geometry.index!.count, offset: Math.random() };
  });

  /* Labels */
  const labels = PLACES.map((p) => {
    const el = labelEl(p);
    labelHost.append(el);
    return { p, el, w: 0, h: 0, shown: false };
  });

  /* Layout, sizing */
  let width = 1;
  let height = 1;
  const resize = () => {
    const r = host.getBoundingClientRect();
    if (!r.width || !r.height) return;
    width = r.width;
    height = r.height;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  /* Free-explore interaction (finale only) */
  const user = { lat: 0, lng: 0, vLat: 0, vLng: 0, lastInput: 0 };
  let free = false;
  let dragging: { x: number; y: number; t: number } | null = null;
  const onDown = (e: PointerEvent) => {
    if (!free) return;
    dragging = { x: e.clientX, y: e.clientY, t: performance.now() };
    user.vLat = user.vLng = 0;
    host.setPointerCapture(e.pointerId);
    host.dataset.dragging = "true";
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - dragging.x;
    const dy = e.clientY - dragging.y;
    const k = 0.28 * (500 / Math.max(420, Math.min(width, height)));
    user.lng -= dx * k;
    user.lat = Math.max(-50, Math.min(50, user.lat + dy * k * 0.8));
    const dt = Math.max(8, now - dragging.t);
    user.vLng = (-dx * k) / dt;
    user.vLat = (dy * k * 0.8) / dt;
    dragging = { x: e.clientX, y: e.clientY, t: now };
    user.lastInput = now;
  };
  const onUp = () => { dragging = null; delete host.dataset.dragging; user.lastInput = performance.now(); };
  host.addEventListener("pointerdown", onDown);
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerup", onUp);
  host.addEventListener("pointercancel", onUp);

  /* Frame loop */
  let target = opts.progress;
  let progress = opts.progress;
  let lastKey = "";
  let ringsKey = "";
  let raf = 0;
  let visible = true;
  let last = performance.now();
  const v = new THREE.Vector3();
  const nrm = new THREE.Vector3();
  const hdg = new THREE.Vector3();
  const look = new THREE.Vector3();
  const toCam = new THREE.Vector3();

  const frame = (now: number) => {
    const dt = Math.min(64, now - last);
    last = now;
    // Extra inertia on top of Lenis: the camera eases into every scroll position.
    progress = opts.instant ? target : progress + (target - progress) * (1 - Math.exp(-dt / 120));
    if (Math.abs(target - progress) < 1e-5) progress = target;
    const s = sceneAt(progress);

    if (s.free !== free) {
      free = s.free;
      host.dataset.free = String(free);
      if (!free) dragging = null;
    }
    if (free) {
      if (!dragging) {
        user.lng += user.vLng * dt;
        user.lat = Math.max(-50, Math.min(50, user.lat + user.vLat * dt));
        const decay = Math.exp(-dt / 420);
        user.vLng *= decay;
        user.vLat *= decay;
        // Drifts slowly on its own once the visitor lets go for a while.
        if (now - user.lastInput > 2600) user.lng += dt * 0.0035;
      }
    } else {
      const k = 1 - Math.exp(-dt / 260);
      user.lat -= user.lat * k;
      user.lng -= ((((user.lng % 360) + 540) % 360) - 180) * k;
    }

    // Camera: a free film camera flying around a globe that stays put.
    const c = s.cam;
    let tgt = c.target;
    let heading = c.heading;
    if (Math.abs(user.lat) + Math.abs(user.lng) > 1e-3) {
      const ll = toLatLng(tgt);
      tgt = toVec({ lat: Math.max(-70, Math.min(70, ll.lat + user.lat)), lng: ll.lng + user.lng });
      heading = tangent(tgt, heading);
    }
    // Portrait screens pull back, fully for top views, only a little for low chase shots.
    const portrait = Math.pow(Math.max(1, 0.85 / camera.aspect), 0.35 + 0.65 * (1 - Math.min(1, c.pitch / 70)));
    const dist = c.dist * portrait;
    const pitch = c.pitch * RAD;
    nrm.set(tgt[0], tgt[1], tgt[2]);
    hdg.set(heading[0], heading[1], heading[2]);
    look.copy(nrm).multiplyScalar(R * (1 + c.alt));
    camera.position.copy(look).addScaledVector(nrm, dist * Math.cos(pitch)).addScaledVector(hdg, -dist * Math.sin(pitch));
    if (camera.position.length() < R * 1.12) camera.position.setLength(R * 1.12); // never dip into the atmosphere
    camera.up.copy(hdg).multiplyScalar(Math.cos(pitch)).addScaledVector(nrm, Math.sin(pitch));
    camera.lookAt(look);
    camera.fov = c.fov;
    const side = narrow ? { x: 0, y: -0.16 } : { x: 0.16, y: 0 };
    camera.setViewOffset(width, height, -width * side.x * (1 - s.centre), -height * side.y * (1 - s.centre), width, height);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    if (earth) (earth.uniforms.sunDir.value as THREE_NS.Vector3).set(-0.86, 0.4, 0.46).normalize().applyQuaternion(camera.quaternion);

    // Lines and their heads.
    for (const line of lines) {
      const d = s.draw[line.route.id] ?? 0;
      const drawing = d > 0 && d < 1;
      const count = Math.floor((line.total / (6 * RADIAL)) * d) * 6 * RADIAL;
      line.geometry.setDrawRange(0, count);
      // Tanker lanes step back once their chapter is over.
      const base = line.route.kind === "sea" ? (s.chapter > 5 ? 0.22 : 0.55) : 0.5;
      line.material.opacity = d <= 0 ? 0 : drawing ? 0.95 : free ? 0.55 : base;
      line.ghostMat.opacity = s.active === line.route.id ? 0.3 : 0;
      if (drawing) {
        line.head.visible = true;
        line.head.position.copy(line.curve.getPointAt(d));
      } else if (free && line.route.kind === "air") {
        // Finale: every route keeps a slow pulse travelling along it.
        const u = (now / 5200 + line.offset) % 1;
        line.head.visible = true;
        line.head.position.copy(line.curve.getPointAt(u));
      } else {
        line.head.visible = false;
      }
    }

    // Beacons rise where a line has landed; the focused one stands taller and brighter.
    const reached = new Set<string>(["riga"]);
    for (const line of lines) if (line.route.to && (s.draw[line.route.id] ?? 0) > 0.97) reached.add(line.route.to);
    if ((s.draw["sea-suez"] ?? 0) > 0 || (s.draw["sea-atlantik"] ?? 0) > 0) reached.add("nordsee");
    const k = opts.instant ? 1 : 1 - Math.exp(-dt / 220);
    for (const b of beacons) {
      const on = reached.has(b.p.id) || (b.p.kind === "region" && (s.free || s.focus === b.p.id));
      b.appear += ((on ? 1 : 0) - b.appear) * k;
      b.lift += ((s.focus === b.p.id ? 1.45 : 1) - b.lift) * k;
      const a = b.appear < 0.002 ? 0 : b.appear;
      b.group.visible = a > 0;
      if (!a) continue;
      const pop = a < 1 ? 1 + Math.sin(a * Math.PI) * 0.25 : 1; // slight overshoot as it lands
      b.group.scale.set(pop, a * b.lift, pop);
      const beat = 0.5 + 0.5 * Math.sin(now / 520 + b.phase);
      (b.glowDisc.material as THREE_NS.MeshBasicMaterial).opacity = (0.55 + 0.35 * beat) * a;
      const cycle = ((now / 1600 + b.phase) % 1);
      b.pulse.scale.setScalar(0.4 + cycle * 0.9);
      (b.pulse.material as THREE_NS.MeshBasicMaterial).opacity = (1 - cycle) * 0.8 * a;
      if (b.beam) (b.beam.material as THREE_NS.MeshBasicMaterial).opacity = (0.7 + 0.25 * beat) * a;
    }
    const ringIds = new Set<string>(s.free ? ["lauda", "nordamerika", "asien", "australien", "neuseeland"] : s.focus ? [s.focus] : []);
    if (reached.has("lauda")) ringIds.add("lauda");
    const rKey = [...ringIds].sort().join();
    if (rKey !== ringsKey) {
      ringsKey = rKey;
      globe.ringsData(PLACES.filter((p) => ringIds.has(p.id)));
    }

    // Labels: project, drop the ones beyond the horizon, then hide overlaps by priority.
    const wanted = new Set(s.labels);
    const boxes: Array<[number, number, number, number]> = [];
    const order = [...labels].sort((a, b) => (b.p.id === s.focus ? 99 : PRIORITY[b.p.kind]) - (a.p.id === s.focus ? 99 : PRIORITY[a.p.kind]));
    for (const lb of order) {
      let show = wanted.has(lb.p.id);
      let x = 0;
      let y = 0;
      if (show) {
        const bc = beacons[PLACES.indexOf(lb.p)];
        const g = globe.getCoords(lb.p.lat, lb.p.lng, (bc.spec.height * bc.appear * bc.lift + 1.2) / R);
        v.set(g.x, g.y, g.z);
        toCam.copy(camera.position).sub(v).normalize();
        const facing = toCam.dot(nrm.copy(v).normalize());
        v.project(camera);
        x = (v.x + 1) / 2 * width;
        y = (1 - v.y) / 2 * height;
        show = facing > 0.06 && v.z < 1 && x > -40 && x < width + 40 && y > -20 && y < height + 20;
      }
      if (show) {
        if (!lb.w) { const r = (lb.el.firstElementChild as HTMLElement).getBoundingClientRect(); lb.w = r.width + 10; lb.h = r.height + 14; }
        const box: [number, number, number, number] = [x - lb.w / 2, y - lb.h, x + lb.w / 2, y];
        if (boxes.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) show = false;
        else boxes.push(box);
      }
      if (show) lb.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      if (show !== lb.shown) { lb.shown = show; lb.el.dataset.visible = String(show); }
      lb.el.dataset.focus = String(lb.p.id === s.focus);
    }

    if (cloudMesh) cloudMesh.rotation.y = -Math.PI / 2 + now * 0.0000035;
    globe.setPointOfView(camera);
    renderer.render(scene, camera);

    const stateKey = `${s.chapter}|${s.focus ?? ""}|${s.free}`;
    if (stateKey !== lastKey) { lastKey = stateKey; events.onState({ chapter: s.chapter, focus: s.focus, free: s.free }); }
    events.onFrame?.(s);
    if (visible) raf = requestAnimationFrame(frame);
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) { last = performance.now(); raf = requestAnimationFrame(frame); }
  });
  io.observe(host);
  host.dataset.ready = "true";

  return {
    setProgress: (p) => { target = p; },
    setLayout: (n) => { narrow = n; },
    dispose: () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      if (earth) { for (const k of ["dayTex", "nightTex", "waterTex"]) (earth.uniforms[k].value as THREE_NS.Texture).dispose(); earth.dispose(); }
      beacons.forEach((b) => b.group.traverse((o) => { const m = o as THREE_NS.Mesh; if (m.isMesh) { m.geometry.dispose(); (m.material as THREE_NS.Material).dispose(); } }));
      beamTex.dispose(); discTex.dispose(); ringTex.dispose();
      if (cloudMesh) { cloudMesh.geometry.dispose(); (cloudMesh.material as THREE_NS.Material).dispose(); clouds?.dispose(); }
      starGeo.dispose();
      starMat.dispose();
      lines.forEach((l) => { l.geometry.dispose(); l.material.dispose(); l.ghost.geometry.dispose(); l.ghostMat.dispose(); (l.head.material as THREE_NS.SpriteMaterial).dispose(); });
      glow.dispose();
      labels.forEach((l) => l.el.remove());
      globe._destructor?.();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
