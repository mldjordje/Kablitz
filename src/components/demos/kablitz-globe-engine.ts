import type * as THREE_NS from "three";
import { PLACES, type WorldPlace } from "@/data/kablitz-world";
import { blendCam, ROUTES, routeLift, routeVec, sceneAt, signedAngle, tangent, toLatLng, toVec, type Cam, type SceneState, type Vec } from "./kablitz-world-story";

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
  /** A place was picked (click/tap on its beacon or card) in the finale, or the pick was cleared. */
  onSelect?: (id: string | null) => void;
};

export type GlobeEngine = {
  setProgress: (p: number) => void;
  setLayout: (narrow: boolean) => void;
  /** Explore mode: the wheel and pinch zoom the globe instead of scrolling the page. */
  setExplore: (on: boolean) => void;
  zoomBy: (factor: number) => void;
  /** Fly to a place (or clear the pick with null). */
  select: (id: string | null) => void;
  resetView: () => void;
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
  uniform float grade;
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
    float glint = pow(max(dot(n, normalize(sunDir + v)), 0.0), 120.0) * water * dayK;
    float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    vec3 col = day * (0.05 + 1.1 * dayK)
      + night * vec3(1.0, 0.7, 0.42) * 1.8 * (1.0 - dayK)
      + vec3(1.0, 0.9, 0.8) * glint * 0.35
      + vec3(0.35, 0.6, 1.0) * rim * (0.12 + 0.45 * dayK);
    // Era grade: the early chapters read like an old print, warm and desaturated.
    vec3 sepia = vec3(dot(col, vec3(0.393, 0.769, 0.189)), dot(col, vec3(0.349, 0.686, 0.168)), dot(col, vec3(0.272, 0.534, 0.131)));
    col = mix(mix(col, sepia * vec3(1.0, 0.93, 0.8), 0.82), col, grade);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }`;

function glowTexture(THREE: typeof THREE_NS) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,240,228,.95)");
  grad.addColorStop(0.14, "rgba(255,190,150,.7)");
  grad.addColorStop(0.38, "rgba(255,98,52,.22)");
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

/** Marker fill per kind (the dot at the heart of each place). */
const MARKER: Record<WorldPlace["kind"], string> = {
  hub: "#e3061f", origin: "#ff9a63", history: "#ffc29e", reference: "#ff6a3a", port: "#6fbcff", region: "#ff9c74",
};

/* Beacons: a light pillar, a glow pooled on the ground and a pulsing disc, tinted by kind. */
const BEACON: Record<WorldPlace["kind"], { color: string; height: number; disc: number }> = {
  hub: { color: "#ff2b3d", height: 5.5, disc: 2.6 },
  origin: { color: "#ffb08a", height: 4, disc: 1.8 },
  history: { color: "#ffc9a8", height: 3, disc: 1.5 },
  reference: { color: "#ff7a45", height: 2.6, disc: 1.3 },
  port: { color: "#9fd0ff", height: 2.6, disc: 1.4 },
  region: { color: "#ff9c74", height: 0, disc: 7 },
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
  // 4K maps everywhere (phones included); only devices reporting little memory fall back to 2K.
  const lowMemory = ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) < 4;
  const res = lowMemory ? "2k" : "4k";
  const [THREE, { default: ThreeGlobe }, countries, { Line2 }, { LineGeometry }, { LineMaterial }] = await Promise.all([
    import("three"),
    import("three-globe"),
    style === "hex" ? fetch("/globe/countries-110m.json").then((r) => r.json()) : Promise.resolve(null),
    import("three/addons/lines/Line2.js"),
    import("three/addons/lines/LineGeometry.js"),
    import("three/addons/lines/LineMaterial.js"),
  ]);
  let earth: THREE_NS.ShaderMaterial | null = null;
  let clouds: THREE_NS.Texture | null = null;
  if (style === "real") {
    const loader = new THREE.TextureLoader();
    const [day, night, water, cloudTex] = await Promise.all([
      loader.loadAsync(`/globe/earth-day-${res}.webp`),
      loader.loadAsync(`/globe/earth-night-${res}.webp`),
      loader.loadAsync("/globe/earth-water.webp"),
      loader.loadAsync(`/globe/earth-clouds-${lowMemory ? "1k" : "2k"}.jpg`).catch(() => null),
    ]);
    clouds = cloudTex;
    day.colorSpace = THREE.SRGBColorSpace;
    night.colorSpace = THREE.SRGBColorSpace;
    earth = new THREE.ShaderMaterial({
      uniforms: { dayTex: { value: day }, nightTex: { value: night }, waterTex: { value: water }, sunDir: { value: new THREE.Vector3(0, 0, 1) }, grade: { value: 1 } },
      vertexShader: EARTH_VERTEX,
      fragmentShader: EARTH_FRAGMENT,
    });
  }

  let narrow = opts.narrow;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
      new THREE.MeshLambertMaterial({ color: "#ffffff", alphaMap: clouds, transparent: true, opacity: 0.45, depthWrite: false }),
    );
    // three-globe turns its sphere so lng 0 faces +z; match it.
    cloudMesh.rotation.y = -Math.PI / 2;
    globe.add(cloudMesh);
  }

  const beamTex = beamTexture(THREE);
  const discTex = discTexture(THREE, false);
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
    let beam: THREE_NS.Mesh | null = null;
    if (spec.height) beam = add(new THREE.CylinderGeometry(0.05, 0.18, spec.height, 12, 1, true).translate(0, spec.height / 2, 0), beamTex, 0.95);

    // The marker itself: soft dark shadow, white rim, solid dot in the kind colour, thin outer ring.
    // Drawn normally (no additive glow) and kept at a constant size on screen, above the clouds.
    const badge = new THREE.Group();
    badge.position.y = 0.75;
    const mat = (color: string, opacity = 1, map: THREE_NS.Texture | null = null) =>
      new THREE.MeshBasicMaterial({ color, map, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide });
    const part = (geo: THREE_NS.BufferGeometry, m: THREE_NS.MeshBasicMaterial, order: number) => {
      const mesh = new THREE.Mesh(geo.rotateX(-Math.PI / 2), m);
      mesh.renderOrder = 10 + order;
      badge.add(mesh);
      return mesh;
    };
    const fill = MARKER[p.kind];
    let ring: THREE_NS.Mesh;
    if (p.kind === "region") {
      ring = part(new THREE.RingGeometry(2.1, 2.24, 72), mat(fill, 0.55), 2);
    } else {
      part(new THREE.CircleGeometry(1.05, 40), mat("#000000", 0.32, discTex), 0);
      part(new THREE.CircleGeometry(0.56, 40), mat("#ffffff"), 1);
      part(new THREE.CircleGeometry(0.42, 40), mat(fill), 2);
      ring = part(new THREE.RingGeometry(0.86, 0.94, 56), mat(fill, 0.55), 3);
    }
    const halo = part(new THREE.RingGeometry(0.9, 1.02, 56), mat(fill, 0), 4);
    group.add(badge);
    group.scale.setScalar(0.0001);
    globe.add(group);
    return { p, spec, group, glowDisc, beam, badge, ring, halo, world: group.position.clone(), appear: 0, lift: 1, phase: Math.random() * Math.PI * 2 };
  });

  /* Flight lines: screen-space lines (same pixel width on every screen and at every distance),
     revealed segment by segment; the one being drawn carries a bright trail that fades behind its
     glowing head. A dashed ghost shows the whole route ahead while it is flown. */
  const glow = glowTexture(THREE);
  const N = 97;
  const lines = ROUTES.map((route) => {
    const pts = Array.from({ length: N }, (_, i) => {
      const u = i / (N - 1);
      const [x, y, z] = routeVec(route, u);
      const r = R * (1 + routeLift(route, u));
      return new THREE.Vector3(x * r, y * r, z * r);
    });
    const curve = new THREE.CatmullRomCurve3(pts);
    // Even arc-length samples, so segment i lines up with curve.getPointAt(i / segs).
    const flat = new Float32Array(curve.getSpacedPoints(N - 1).flatMap((v) => [v.x, v.y, v.z]));
    const geometry = new LineGeometry();
    geometry.setPositions(flat);
    geometry.setColors(new Float32Array(N * 3).fill(1));
    const colorData = (geometry.attributes.instanceColorStart as THREE_NS.InterleavedBufferAttribute).data;
    geometry.instanceCount = 0;
    const material = new LineMaterial({
      color: route.kind === "sea" ? 0xffd2bc : 0xff5a36, vertexColors: true, linewidth: 2, worldUnits: false, transparent: true, opacity: 0, depthWrite: false,
    });
    const mesh = new Line2(geometry, material);
    mesh.renderOrder = 5;
    const ghostGeo = new LineGeometry();
    ghostGeo.setPositions(flat);
    const ghostMat = new LineMaterial({ color: 0xffb08a, linewidth: 1.2, worldUnits: false, transparent: true, opacity: 0, depthWrite: false, dashed: true, dashSize: 1.6, gapSize: 1.4 });
    const ghost = new Line2(ghostGeo, ghostMat);
    ghost.computeLineDistances();
    globe.add(ghost);
    const head = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: "#ffffff", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    head.scale.setScalar(route.kind === "sea" ? 4 : 5.5);
    head.visible = false;
    globe.add(mesh, head);
    return { route, curve, geometry, material, ghost, ghostMat, head, colorData, segs: N - 1, trail: false, offset: Math.random() };
  });

  /* Labels */
  const labels = PLACES.map((p) => {
    const el = labelEl(p);
    el.addEventListener("click", () => { if (free) select(p.id); });
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
  let explore = false;
  let zoom = 1;
  let zoomTarget = 1;
  let selected: string | null = null;
  let fly: { lat: number; lng: number } | null = null;
  let base = { lat: 0, lng: 0 };
  let aside = 0;
  const screen = new Map<string, { x: number; y: number; on: boolean }>();
  const pointers = new Map<number, { x: number; y: number }>();
  let pinch = 0;
  let press: { x: number; y: number; t: number } | null = null;
  let dragging: { x: number; y: number; t: number } | null = null;
  const wrap = (d: number) => ((d % 360) + 540) % 360 - 180;

  const select = (id: string | null) => {
    selected = id;
    const p = id ? PLACES.find((pl) => pl.id === id) : undefined;
    if (p) {
      fly = { lat: p.lat - base.lat, lng: user.lng + wrap(p.lng - base.lng - user.lng) };
      zoomTarget = Math.min(zoomTarget, p.kind === "region" ? 0.8 : 0.5);
      user.vLat = user.vLng = 0;
    }
    events.onSelect?.(id);
  };
  const pick = (cx: number, cy: number) => {
    const r = host.getBoundingClientRect();
    const x = cx - r.left;
    const y = cy - r.top;
    let best: string | null = null;
    let bestScore = Infinity;
    for (const [id, pt] of screen) {
      if (!pt.on) continue;
      const d = Math.hypot(pt.x - x, pt.y - y);
      if (d > 34) continue;
      // Near-ties go to the more important place (Lauda over a plant a few km away).
      const score = d - PRIORITY[PLACES.find((pl) => pl.id === id)!.kind] * 2.5;
      if (score < bestScore) { bestScore = score; best = id; }
    }
    if (best) select(best);
  };

  const onDown = (e: PointerEvent) => {
    if (!free) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = Math.hypot(a.x - b.x, a.y - b.y);
      dragging = null;
      return;
    }
    press = { x: e.clientX, y: e.clientY, t: performance.now() };
    dragging = { x: e.clientX, y: e.clientY, t: performance.now() };
    user.vLat = user.vLng = 0;
    host.setPointerCapture(e.pointerId);
    host.dataset.dragging = "true";
  };
  const onMove = (e: PointerEvent) => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2 && explore) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch) zoomTarget = Math.max(0.3, Math.min(1.5, zoomTarget * (pinch / d)));
      pinch = d;
      return;
    }
    if (!dragging) return;
    if (Math.hypot(e.clientX - (press?.x ?? 0), e.clientY - (press?.y ?? 0)) > 5) fly = null;
    const now = performance.now();
    const dx = e.clientX - dragging.x;
    const dy = e.clientY - dragging.y;
    const k = 0.28 * zoom * (500 / Math.max(420, Math.min(width, height)));
    user.lng -= dx * k;
    user.lat += dy * k * 0.8;
    const dt = Math.max(8, now - dragging.t);
    user.vLng = (-dx * k) / dt;
    user.vLat = (dy * k * 0.8) / dt;
    dragging = { x: e.clientX, y: e.clientY, t: now };
    user.lastInput = now;
  };
  const onUp = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = 0;
    // A short press that barely moved is a click: pick the nearest place under it.
    if (press && e.type === "pointerup" && Math.hypot(e.clientX - press.x, e.clientY - press.y) < 6 && performance.now() - press.t < 450) pick(e.clientX, e.clientY);
    press = null;
    dragging = null;
    delete host.dataset.dragging;
    user.lastInput = performance.now();
  };
  const onWheel = (e: WheelEvent) => {
    if (!explore) return;
    e.preventDefault();
    zoomTarget = Math.max(0.3, Math.min(1.5, zoomTarget * Math.exp(e.deltaY * 0.0012)));
  };
  host.addEventListener("wheel", onWheel, { passive: false });
  host.addEventListener("pointerdown", onDown);
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerup", onUp);
  host.addEventListener("pointercancel", onUp);

  /* Frame loop */
  let target = opts.progress;
  let progress = opts.progress;
  let lastKey = "";
  let raf = 0;
  let visible = true;
  let last = performance.now();
  const v = new THREE.Vector3();
  const nrm = new THREE.Vector3();
  const hdg = new THREE.Vector3();
  const look = new THREE.Vector3();
  const toCam = new THREE.Vector3();
  // Camera rig: follows the story's camera through a critically damped spring (an operator's lag),
  // banks into turns and breathes a little while holding.
  let rig: Cam | null = null;
  let prevHeading: Vec | null = null;
  let roll = 0;
  // Adaptive resolution: if frames run long, drop the pixel ratio a step; climb back when there is headroom.
  const maxRatio = Math.min(window.devicePixelRatio, 2);
  let ratio = maxRatio;
  let frameAvg = 16;
  let lastTune = 0;
  let fastSince = 0;

  const frame = (now: number) => {
    const dt = Math.min(64, now - last);
    last = now;
    if (!opts.instant && dt > 0) {
      frameAvg += (dt - frameAvg) * 0.05;
      if (now - lastTune > 1000) {
        lastTune = now;
        const slow = frameAvg > 30 && ratio > 1;
        const fast = frameAvg < 17 && ratio < maxRatio;
        if (!fast) fastSince = now;
        if (slow || (fast && now - fastSince > 4000)) {
          ratio = Math.max(1, Math.min(maxRatio, ratio + (slow ? -0.25 : 0.25)));
          renderer.setPixelRatio(ratio);
          renderer.setSize(width, height, false);
          fastSince = now;
        }
      }
    }
    // Extra inertia on top of Lenis: the camera eases into every scroll position.
    progress = opts.instant ? target : progress + (target - progress) * (1 - Math.exp(-dt / 120));
    if (Math.abs(target - progress) < 1e-5) progress = target;
    const s = sceneAt(progress);

    if (s.free !== free) {
      free = s.free;
      host.dataset.free = String(free);
      if (!free) dragging = null;
    }
    base = toLatLng(s.cam.target);
    if (free) {
      if (fly) {
        const kf = opts.instant ? 1 : 1 - Math.exp(-dt / 380);
        user.lat += (fly.lat - user.lat) * kf;
        user.lng += (fly.lng - user.lng) * kf;
        if (Math.abs(fly.lat - user.lat) + Math.abs(fly.lng - user.lng) < 0.01) fly = null;
      } else if (!dragging) {
        user.lng += user.vLng * dt;
        user.lat += user.vLat * dt;
        const decay = Math.exp(-dt / 420);
        user.vLng *= decay;
        user.vLat *= decay;
        // Drifts slowly on its own once the visitor lets go for a while (not while exploring).
        if (!explore && !selected && now - user.lastInput > 2600) user.lng += dt * 0.0035;
      }
      user.lat = Math.max(-68 - base.lat, Math.min(68 - base.lat, user.lat));
    } else {
      const k = 1 - Math.exp(-dt / 260);
      user.lat -= user.lat * k;
      user.lng -= wrap(user.lng) * k;
      fly = null;
      if (selected) select(null);
      zoomTarget = 1;
    }
    zoom += (zoomTarget - zoom) * (opts.instant ? 1 : 1 - Math.exp(-dt / 200));
    const focusId = selected ?? s.focus;

    // Camera: a free film camera flying around a globe that stays put.
    const c = s.cam;
    let tgt = c.target;
    let heading = c.heading;
    if (Math.abs(user.lat) + Math.abs(user.lng) > 1e-3) {
      const ll = toLatLng(tgt);
      tgt = toVec({ lat: Math.max(-70, Math.min(70, ll.lat + user.lat)), lng: ll.lng + user.lng });
      heading = tangent(tgt, heading);
    }
    const want: Cam = { ...c, target: tgt, heading };
    const lag = opts.instant ? 1 : 1 - Math.exp(-dt / (free ? 90 : 170));
    rig = rig ? blendCam(rig, want, lag) : want;
    const r = rig;
    // Bank into turns: roll follows how fast the heading swings, like an aircraft.
    if (prevHeading && dt > 0 && !free) {
      const rate = signedAngle(prevHeading, r.heading, r.target) / dt;
      const bank = Math.max(-0.14, Math.min(0.14, -rate * 900));
      roll += (bank - roll) * (opts.instant ? 1 : 1 - Math.exp(-dt / 320));
    } else {
      roll *= opts.instant ? 0 : Math.exp(-dt / 300);
    }
    prevHeading = r.heading;
    // Portrait screens pull back, fully for top views, only a little for low chase shots.
    const portrait = Math.pow(Math.max(1, 0.85 / camera.aspect), 0.35 + 0.65 * (1 - Math.min(1, r.pitch / 70)));
    const dist = r.dist * portrait * zoom;
    const pitch = r.pitch * RAD;
    nrm.set(r.target[0], r.target[1], r.target[2]);
    hdg.set(r.heading[0], r.heading[1], r.heading[2]);
    look.copy(nrm).multiplyScalar(R * (1 + r.alt));
    camera.position.copy(look).addScaledVector(nrm, dist * Math.cos(pitch)).addScaledVector(hdg, -dist * Math.sin(pitch));
    if (camera.position.length() < R * 1.12) camera.position.setLength(R * 1.12); // never dip into the atmosphere
    camera.up.copy(hdg).multiplyScalar(Math.cos(pitch)).addScaledVector(nrm, Math.sin(pitch));
    camera.lookAt(look);
    camera.rotateZ(roll);
    if (!free && !opts.instant) {
      // Handheld breath: a fraction of a degree, never enough to notice, enough to feel alive.
      const tt = now / 1000;
      camera.rotateX((Math.sin(tt * 0.61) * 0.6 + Math.sin(tt * 1.37) * 0.25) * 0.0035);
      camera.rotateY((Math.sin(tt * 0.47 + 1.3) * 0.6 + Math.sin(tt * 1.11) * 0.3) * 0.0035);
    }
    camera.fov = r.fov;
    const side = narrow ? { x: 0, y: -0.16 } : { x: 0.16, y: 0 };
    aside += ((selected ? 1 : 0) - aside) * (opts.instant ? 1 : 1 - Math.exp(-dt / 300));
    const card = narrow ? { x: 0, y: -0.17 } : { x: -0.15, y: 0 };
    camera.setViewOffset(width, height, -width * (side.x * (1 - s.centre) + card.x * aside), -height * (side.y * (1 - s.centre) + card.y * aside), width, height);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    if (earth) {
      (earth.uniforms.sunDir.value as THREE_NS.Vector3).set(-0.86, 0.4, 0.46).normalize().applyQuaternion(camera.quaternion);
      earth.uniforms.grade.value = free ? 1 : s.era;
    }

    // Lines and their heads.
    for (const line of lines) {
      const d = s.draw[line.route.id] ?? 0;
      const drawing = d > 0 && d < 1;
      line.geometry.instanceCount = Math.floor(line.segs * d);
      line.material.resolution.set(width, height);
      line.ghostMat.resolution.set(width, height);
      // Tanker lanes step back once their chapter is over.
      const rest = line.route.kind === "sea" ? (s.chapter > 5 ? 0.12 : 0.4) : 0.26;
      const linked = selected && (line.route.to === selected || line.route.id.startsWith(`${selected}-`));
      line.material.opacity = d <= 0 ? 0 : drawing ? 1 : linked ? 0.95 : free ? 0.45 : rest + 0.14;
      line.material.linewidth = drawing ? 3.2 : linked ? 2.6 : line.route.kind === "sea" ? 1.3 : 1.7;
      // Trail: bright at the head, fading to a quarter behind it.
      if (drawing || line.trail) {
        const arr = line.colorData.array as Float32Array;
        for (let j = 0; j < line.segs; j++) {
          const k0 = drawing ? Math.max(0.22, Math.min(1, 1 - (d - j / line.segs) / 0.3)) : 1;
          const k1 = drawing ? Math.max(0.22, Math.min(1, 1 - (d - (j + 1) / line.segs) / 0.3)) : 1;
          arr.fill(k0, j * 6, j * 6 + 3);
          arr.fill(k1, j * 6 + 3, j * 6 + 6);
        }
        line.colorData.needsUpdate = true;
        line.trail = drawing;
      }
      line.ghostMat.opacity = s.active === line.route.id ? 0.55 : 0;
      const headMat = line.head.material as THREE_NS.SpriteMaterial;
      if (drawing) {
        line.head.visible = true;
        line.head.scale.setScalar(line.route.kind === "sea" ? 4 : 5.5);
        headMat.opacity = 1;
        line.head.position.copy(line.curve.getPointAt(d));
      } else if (free && line.route.kind === "air" && (!selected || linked)) {
        const u = 0.12 + ((now / 6400 + line.offset) % 1) * 0.8;
        line.head.visible = true;
        line.head.scale.setScalar(linked ? 3 : 2.2);
        headMat.opacity = Math.sin(((u - 0.12) / 0.8) * Math.PI) * (linked ? 0.9 : 0.5);
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
      const on = reached.has(b.p.id) || ((b.p.kind === "region" || b.p.projectId !== undefined) && (s.free || s.focus === b.p.id));
      b.appear += ((on ? 1 : 0) - b.appear) * k;
      const hot = focusId === b.p.id;
      b.lift += ((hot ? 1.9 : 1) - b.lift) * k;
      const a = b.appear < 0.002 ? 0 : b.appear;
      b.group.visible = a > 0;
      if (!a) continue;
      const pop = a < 1 ? 1 + Math.sin(a * Math.PI) * 0.25 : 1; // slight overshoot as it lands
      b.group.scale.set(pop, a * b.lift, pop);
      const beat = 0.5 + 0.5 * Math.sin(now / 520 + b.phase);
      // Quiet by default; only the place in focus pulses and glows.
      (b.glowDisc.material as THREE_NS.MeshBasicMaterial).opacity = (hot ? 0.32 + 0.14 * beat : b.p.kind === "region" ? 0.1 : b.p.kind === "hub" ? 0.12 : 0.1) * a;
      b.glowDisc.scale.setScalar(hot ? 1.3 : 1);
      const cycle = ((now / 1700 + b.phase) % 1);
      // Same size on screen whether the camera is in orbit or skimming the surface.
      const onScreen = Math.max(0.42, Math.min(2.7, camera.position.distanceTo(b.world) / 125)) * Math.tan((camera.fov / 2) * RAD) / Math.tan(17 * RAD); // fov-aware, so the dolly zoom does not inflate markers
      const size = onScreen * (b.p.kind === "hub" ? 1.75 : 1) * (hot ? 1.3 : 1);
      b.badge.scale.set(size / pop, size / Math.max(0.001, a * b.lift), size / pop);
      (b.ring.material as THREE_NS.MeshBasicMaterial).opacity = (hot || b.p.kind === "hub" ? 0.85 : 0.45) * a;
      b.halo.visible = hot || b.p.kind === "hub";
      b.halo.scale.setScalar(1 + cycle * (hot ? 1.8 : 1.1));
      (b.halo.material as THREE_NS.MeshBasicMaterial).opacity = (1 - cycle) * (hot ? 0.7 : 0.55) * a;
      if (b.beam) (b.beam.material as THREE_NS.MeshBasicMaterial).opacity = (hot ? 0.55 : b.p.kind === "hub" ? 0.5 : 0.2) * a;
    }

    // Labels: project, drop the ones beyond the horizon, then hide overlaps by priority.
    const wanted = new Set(s.labels);
    if (selected) wanted.add(selected);
    const boxes: Array<[number, number, number, number]> = [];
    const rank = (id: string, kind: WorldPlace["kind"]) => (id === focusId ? 99 : PRIORITY[kind]);
    const order = [...labels].sort((a, b) => rank(b.p.id, b.p.kind) - rank(a.p.id, a.p.kind));
    for (const lb of order) {
      const bc = beacons[PLACES.indexOf(lb.p)];
      const g = globe.getCoords(lb.p.lat, lb.p.lng, (bc.spec.height * bc.appear * bc.lift + 1.2) / R);
      v.set(g.x, g.y, g.z);
      toCam.copy(camera.position).sub(v).normalize();
      const facing = toCam.dot(nrm.copy(v).normalize());
      v.project(camera);
      const x = (v.x + 1) / 2 * width;
      const y = (1 - v.y) / 2 * height;
      const onScreen = facing > 0.06 && v.z < 1 && x > -40 && x < width + 40 && y > -20 && y < height + 20;
      // Picking uses the dot on the ground, not the top of the (variable-height) pillar.
      const gp = globe.getCoords(lb.p.lat, lb.p.lng, 0.004);
      v.set(gp.x, gp.y, gp.z).project(camera);
      screen.set(lb.p.id, { x: (v.x + 1) / 2 * width, y: (1 - v.y) / 2 * height, on: onScreen && bc.appear > 0.5 });
      let show = wanted.has(lb.p.id) && onScreen;
      if (show) {
        if (!lb.w) { const r = (lb.el.firstElementChild as HTMLElement).getBoundingClientRect(); lb.w = r.width + 10; lb.h = r.height + 14; }
        const box: [number, number, number, number] = [x - lb.w / 2, y - lb.h, x + lb.w / 2, y];
        if (boxes.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) show = false;
        else boxes.push(box);
      }
      if (show) lb.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      if (show !== lb.shown) { lb.shown = show; lb.el.dataset.visible = String(show); }
      lb.el.dataset.focus = String(lb.p.id === focusId);
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

  // Sharper Earth for big screens: once the 4K globe is up and the browser is idle, fetch the 8K
  // day map, upload it to the GPU ahead of time, then swap it in. Phones, low-memory machines,
  // GPUs without 8K textures and data-saver visitors keep the 4K map.
  let alive = true;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const canSharpen = earth && !opts.narrow && !lowMemory && !nav.connection?.saveData
    && renderer.capabilities.maxTextureSize >= 8192 && (nav.hardwareConcurrency ?? 8) >= 6;
  let idle = 0;
  if (canSharpen && earth) {
    const mat = earth;
    const upgrade = async () => {
      try {
        const tex = await new THREE.TextureLoader().loadAsync("/globe/earth-day-8k.webp");
        if (!alive) { tex.dispose(); return; }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        renderer.initTexture(tex);
        const old = mat.uniforms.dayTex.value as THREE_NS.Texture;
        mat.uniforms.dayTex.value = tex;
        old.dispose();
      } catch {
        /* keep the 4K map */
      }
    };
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    idle = w.requestIdleCallback ? w.requestIdleCallback(() => void upgrade(), { timeout: 4000 }) : window.setTimeout(() => void upgrade(), 2500);
  }

  return {
    setProgress: (p) => { target = p; },
    setLayout: (n) => { narrow = n; },
    setExplore: (on) => { explore = on; host.dataset.explore = String(on); if (!on) { zoomTarget = 1; select(null); } },
    zoomBy: (f) => { zoomTarget = Math.max(0.3, Math.min(1.5, zoomTarget * f)); },
    select,
    resetView: () => { fly = { lat: 0, lng: Math.round(user.lng / 360) * 360 }; zoomTarget = 1; select(null); },
    dispose: () => {
      alive = false;
      const w = window as Window & { cancelIdleCallback?: (id: number) => void };
      if (w.cancelIdleCallback) w.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointerdown", onDown);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerup", onUp);
      host.removeEventListener("pointercancel", onUp);
      host.removeEventListener("wheel", onWheel);
      if (earth) { for (const k of ["dayTex", "nightTex", "waterTex"]) (earth.uniforms[k].value as THREE_NS.Texture).dispose(); earth.dispose(); }
      beacons.forEach((b) => b.group.traverse((o) => { const m = o as THREE_NS.Mesh; if (m.isMesh) { m.geometry.dispose(); (m.material as THREE_NS.Material).dispose(); } }));
      beamTex.dispose(); discTex.dispose();
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
