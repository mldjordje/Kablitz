import { PLACES, SEA_LANES, type WorldPlace } from "@/data/kablitz-world";

/**
 * The scroll story of the globe as a pure function: progress (0–1) in, camera + drawn routes out.
 * Nothing here is time-based, so scrolling back plays the film backwards frame-exactly.
 */

export type LatLng = { lat: number; lng: number };
export type Vec = [number, number, number];
/**
 * A film camera anchored near the globe: looks at `target` (a direction, lifted by `alt`), facing
 * along `heading` (a tangent there), from `dist` away, tilted `pitch` degrees off straight-down
 * (0 = top view, ~65 = skimming towards the horizon), with a vertical `fov`.
 */
export type Cam = { target: Vec; alt: number; heading: Vec; dist: number; pitch: number; fov: number };
export type Route = { id: string; kind: "air" | "sea"; points: LatLng[]; to?: string };

export type SceneState = {
  cam: Cam;
  /** How much of each route is drawn, 0–1. Missing = not drawn. */
  draw: Record<string, number>;
  /** Places whose label is shown right now (the engine hides overlaps). */
  labels: string[];
  /** Place the camera is visiting; drives the ring pulse and the chapter's detail line. */
  focus?: string;
  chapter: number;
  /** 0 = globe beside the text, 1 = globe centred (finale). */
  centre: number;
  /** Finale: text is gone and the globe is free to explore. */
  free: boolean;
  counter?: number;
  /** Route being flown right now; its whole path shows faintly ahead of the head. */
  active?: string;
};

const RAD = Math.PI / 180;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (t: number) => t * t * (3 - 2 * t);

/* ── Sphere maths (same axes as three-globe: lat 0 / lng 0 faces +z) ───────────────────── */

export function toVec({ lat, lng }: LatLng): Vec {
  const phi = (90 - lat) * RAD;
  const theta = (90 - lng) * RAD;
  return [Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)];
}

export function toLatLng([x, y, z]: Vec): LatLng {
  const lat = 90 - Math.acos(clamp(y, -1, 1)) / RAD;
  const lng = 90 - Math.atan2(z, x) / RAD;
  return { lat, lng: ((lng + 540) % 360) - 180 };
}

const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const angleBetween = (a: Vec, b: Vec) => Math.acos(clamp(dot(a, b), -1, 1));

export function slerp(a: Vec, b: Vec, t: number): Vec {
  const w = angleBetween(a, b);
  if (w < 1e-6) return a;
  const s = Math.sin(w);
  const ka = Math.sin((1 - t) * w) / s;
  const kb = Math.sin(t * w) / s;
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
}

/** Point at fraction u along a route's waypoints, spaced by true angular length. */
export function routeVec(route: Route, u: number): Vec {
  const vs = route.points.map(toVec);
  const lens = vs.slice(1).map((v, i) => angleBetween(vs[i], v));
  const total = lens.reduce((s, l) => s + l, 0);
  let d = clamp(u) * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) return slerp(vs[i], vs[i + 1], lens[i] ? clamp(d / lens[i]) : 0);
    d -= lens[i];
  }
  return vs[vs.length - 1];
}

export const routeLength = (route: Route) => {
  const vs = route.points.map(toVec);
  return vs.slice(1).reduce((s, v, i) => s + angleBetween(vs[i], v), 0);
};

/** Height of the flight arc above the surface (globe radius = 1) at fraction u. */
export function routeLift(route: Route, u: number) {
  if (route.kind === "sea") return 0.006;
  const len = routeLength(route);
  const h = Math.min(0.26, 0.01 + len * 0.5, len * 1.2);
  return 0.004 + h * Math.sin(Math.PI * u);
}

/* ── Places and routes ─────────────────────────────────────────────────────────────────── */

const P = Object.fromEntries(PLACES.map((p) => [p.id, p])) as Record<string, WorldPlace>;
const at = (id: string): LatLng => ({ lat: P[id].lat, lng: P[id].lng });
const air = (from: string, to: string): Route => ({ id: `${from}-${to}`, kind: "air", points: [at(from), at(to)], to });

export const REFERENCE_ORDER = ["menznau", "sanem", "goch", "rosieres", "mergentheim", "wiesbaden", "brasov", "burgos", "tiszapuspoki"];
const LOOP = ["pemuco", "nordamerika", "neuseeland", "australien", "asien", "lauda"];

export const ROUTES: Route[] = [
  air("riga", "moskau"),
  air("riga", "wartheland"),
  air("wartheland", "lauda"),
  ...SEA_LANES.map((l) => ({ id: l.id, kind: "sea" as const, points: l.points, to: l.to })),
  ...REFERENCE_ORDER.map((id) => air("lauda", id)),
  air("lauda", "pemuco"),
  ...LOOP.slice(1).map((id, i) => air(LOOP[i], id)),
];
const R = Object.fromEntries(ROUTES.map((r) => [r.id, r])) as Record<string, Route>;

/* ── Chapters (the text beside the globe) ──────────────────────────────────────────────── */

export type Chapter = { kicker: string; title: string; text: string };

export const CHAPTERS: Chapter[] = [
  { kicker: "1868 · Riga", title: "Ein Erfinder aus Riga.", text: "Richard Kablitz wird 1868 in Riga geboren. 1899 erfindet er berippte gusseiserne Wärmetauscherplatten." },
  { kicker: "1901", title: "Die Gründung.", text: "In Riga gründet Richard Kablitz die nach ihm benannte Firma. 1920 meldet er das Patent für seinen Universalrost an." },
  { kicker: "Moskau", title: "Ein Büro in Moskau.", text: "Ein Ingenieurbüro in Moskau erhält eine Herstellungs- und Vertriebsgenehmigung." },
  { kicker: "1939–1941", title: "Der Weg nach Deutschland.", text: "Infolge der deutsch-sowjetischen Verträge wird das Unternehmen nach Deutschland überführt und im Wartheland angesiedelt." },
  { kicker: "1945–1951", title: "Neubeginn in Lauda.", text: "1945 kommt Richard Kablitz mit seiner Familie nach Marbach bei Lauda. 1951 entsteht dort der Standort mit eigener Schlosserei und Gießerei, bis heute der Stammsitz." },
  { kicker: "Onassis", title: "24 Großtanker auf allen Meeren.", text: "Neue Märkte, neue Aufträge: 24 Großtanker von Onassis werden mit Kablitz-Fabrikaten ausgerüstet." },
  { kicker: "1990–1993", title: "Vom Bauteil zur Gesamtanlage.", text: "1990 übernimmt Hans E. Mitthof das Unternehmen, Kablitz baut fortan komplette Anlagen. 1993 folgt das Patent für die geneigte Nachbrennkammer." },
  { kicker: "2009–2018", title: "Heizkraftwerke in ganz Europa.", text: "Biomasse- und Altholz-Heizkraftwerke von der Schweiz bis Ungarn, von Spanien bis Rumänien." },
  { kicker: "2015", title: "Bis nach Chile.", text: "In Pemuco entsteht ein Heizkraftwerk mit 62 MW Feuerungswärmeleistung." },
  { kicker: "Heute", title: "Weltweit im Einsatz.", text: "Kablitz-Anlagen arbeiten in Europa, Asien, Nord- und Südamerika, Australien und Neuseeland." },
];
export const FINALE = CHAPTERS.length;

/* ── Camera ───────────────────────────────────────────────────────────────────────────── */

const norm = (v: Vec): Vec => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scale = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k, a[2] * k];
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** Component of `v` tangent to the sphere at `n`, normalised; falls back to north. */
export function tangent(n: Vec, v: Vec): Vec {
  const t = sub(v, scale(n, dot(n, v)));
  if (Math.hypot(t[0], t[1], t[2]) < 1e-6) return tangent(n, [0, 1, 0]);
  return norm(t);
}
const north = (n: Vec) => tangent(n, [0, 1, 0]);
/** Heading at `from` pointing along the great circle towards `to`. */
const towards = (from: Vec, to: Vec) => tangent(from, to);
/** Rotate a tangent around the surface normal by `deg` degrees. */
function turn(h: Vec, n: Vec, deg: number): Vec {
  const a = -deg * RAD;
  return norm(add(add(scale(h, Math.cos(a)), scale(cross(n, h), Math.sin(a))), scale(n, dot(n, h) * (1 - Math.cos(a)))));
}

const logLerp = (a: number, b: number, t: number) => Math.exp(lerp(Math.log(a), Math.log(b), t));

export function blendCam(a: Cam, b: Cam, t: number): Cam {
  const target = slerp(a.target, b.target, t);
  return {
    target,
    alt: lerp(a.alt, b.alt, t),
    heading: tangent(target, slerp(a.heading, b.heading, t)),
    dist: logLerp(a.dist, b.dist, t),
    pitch: lerp(a.pitch, b.pitch, t),
    fov: lerp(a.fov, b.fov, t),
  };
}

const V = (id: string) => toVec(at(id));
/** Parked at a place, facing the next destination, slowly circling (`orbit` degrees over the shot). */
function parked(id: string, next: string | null, dist: number, pitch: number, orbit = 0, t = 0.5): Cam {
  const n = V(id);
  const h = next ? towards(n, V(next)) : north(n);
  return { target: n, alt: 0, heading: turn(h, n, orbit * (t - 0.5)), dist, pitch, fov: 34 };
}
const space = (lat: number, lng: number, dist: number): Cam => {
  const n = toVec({ lat, lng });
  return { target: n, alt: 0, heading: north(n), dist, pitch: 0, fov: 34 };
};

/**
 * Chase camera over a route at head position u: behind and above the glowing head, looking a
 * little ahead so the rest of the line runs up the middle of the frame. `c` (0–1) is the cruise
 * factor: long flights climb, flatten and widen the lens mid-way, then descend again.
 */
function chase(route: Route, u: number, c: number, cruise: { dist: number; pitch: number }): Cam {
  const len = routeLength(route);
  const ahead = Math.min(1, u + 0.07 / Math.max(len, 0.07));
  const target = routeVec(route, ahead);
  const from = routeVec(route, Math.max(0, Math.min(u, 0.95) - 0.02));
  const to = routeVec(route, Math.min(1, Math.min(u, 0.95) + 0.03));
  return {
    target,
    alt: routeLift(route, ahead) * 0.55, // aim between the head and the ground: the land stays in frame
    heading: tangent(target, sub(to, from)),
    dist: lerp(90, cruise.dist, c),
    pitch: lerp(60, cruise.pitch, c),
    fov: lerp(36, 44, c),
  };
}

/* ── Shots ─────────────────────────────────────────────────────────────────────────────── */

type ShotOut = { cam: Cam; draw?: Record<string, number>; focus?: string; labels?: string[]; counter?: number; centre?: number; free?: boolean; active?: string };
type Shot = { chapter: number; weight: number; routes?: string[]; run: (t: number) => ShotOut };

/** Rotate tangent `v` about the surface normal `n` by `rad` (v ⟂ n). */
function rotateAbout(v: Vec, n: Vec, rad: number): Vec {
  return norm(add(scale(v, Math.cos(rad)), scale(cross(n, v), Math.sin(rad))));
}
/** Signed angle turning tangent `a` into tangent `b` around `n`. */
const signedAngle = (a: Vec, b: Vec, n: Vec) => Math.atan2(dot(cross(a, b), n), dot(a, b));

/**
 * Take-off, chase, landing. The flight itself takes the first ~60% of the shot; the rest is the
 * arrival: the camera settles in behind the line, then orbits the city — pulling back and rising —
 * until it faces the next stop, so the following flight leaves exactly from that framing.
 */
function flight(id: string, next: string | null, span: [number, number] = [0.05, 0.62]): (t: number) => ShotOut {
  const route = R[id];
  const from = id.split("-")[0];
  const len = routeLength(route);
  const cruise = { dist: 90 + Math.min(len, 1.8) * 45, pitch: 60 - Math.min(len, 1.2) * 20 };
  const city = V(route.to!);
  const inbound = tangent(city, sub(city, routeVec(route, 0.96)));
  const outbound = next ? towards(city, V(next)) : inbound;
  const swingAngle = signedAngle(inbound, outbound, city);
  return (t) => {
    const d = ease(seg(t, span[0], span[1]));
    const c = Math.sin(Math.PI * d) * Math.min(1, len / 0.5);
    const air = chase(route, d, c, cruise);
    const L = seg(t, span[1] - 0.05, 1);
    const settle = smooth(seg(L, 0, 0.3));
    const swing = ease(seg(L, 0.22, 1));
    const landed: Cam = {
      target: city,
      alt: 0,
      heading: rotateAbout(inbound, city, swingAngle * swing),
      dist: lerp(72, 98, swing) + Math.sin(Math.PI * swing) * 26,
      pitch: lerp(64, 52, swing),
      fov: lerp(36, 34, swing),
    };
    return {
      cam: blendCam(air, landed, settle),
      draw: { [id]: d },
      focus: d > 0.8 ? route.to : from,
      labels: [from, route.to!],
      active: d < 1 ? id : undefined,
    };
  };
}

const orbitAt = (id: string, next: string | null, dist: number, pitch: number, orbit: number) =>
  (t: number): ShotOut => ({ cam: parked(id, next, dist, pitch, orbit, t), focus: id });

const LOOP_LEGS = LOOP.slice(1).map((id, i) => `${LOOP[i]}-${id}`);

const SHOTS: Shot[] = [
  // Out of deep space, straight down onto Riga, tipping forward to face Moscow.
  {
    chapter: 0, weight: 9,
    run: (t) => {
      const cam = blendCam(space(30, -20, 900), parked("riga", "moskau", 88, 60, 0), ease(t));
      cam.pitch = lerp(0, 60, ease(seg(t, 0.45, 1)));
      return { cam, focus: t > 0.55 ? "riga" : undefined };
    },
  },
  { chapter: 1, weight: 7, run: orbitAt("riga", "moskau", 84, 60, 40) },
  {
    chapter: 2, weight: 9, routes: ["riga-moskau"],
    run: (t) => {
      const d = ease(seg(t, 0.12, 0.85));
      const cam = parked("riga", "moskau", lerp(84, 150, smooth(seg(t, 0, 0.5))), lerp(60, 50, smooth(seg(t, 0, 0.5))), 20, t);
      cam.target = slerp(V("riga"), V("moskau"), 0.4 * d);
      return { cam, draw: { "riga-moskau": d }, focus: d > 0.8 ? "moskau" : "riga", labels: ["riga", "moskau"], active: d < 1 ? "riga-moskau" : undefined };
    },
  },
  { chapter: 3, weight: 12, routes: ["riga-wartheland"], run: flight("riga-wartheland", "lauda", [0.14, 0.64]) },
  { chapter: 4, weight: 12, routes: ["wartheland-lauda"], run: flight("wartheland-lauda", "nordsee") },
  { chapter: 4, weight: 6, run: orbitAt("lauda", "nordsee", 80, 60, 70) },
  // Onassis: over to the North Sea, then ride with a tanker through Suez to the Gulf while the
  // Atlantic lane peels off towards America.
  {
    chapter: 5, weight: 16, routes: SEA_LANES.map((l) => l.id),
    run: (t) => {
      const kap = R["sea-suez"];
      const d = ease(seg(t, 0.16, 0.9));
      const quay = parked("nordsee", null, 120, 56, 0);
      quay.heading = towards(V("nordsee"), toVec(kap.points[1]));
      const ride = chase(kap, d, Math.sin(Math.PI * d) * 0.8, { dist: 170, pitch: 50 });
      const arrive = parked("golf", null, 110, 54, 0);
      const cam = blendCam(blendCam(quay, ride, smooth(seg(t, 0.08, 0.2))), arrive, smooth(seg(t, 0.86, 1)));
      return {
        cam,
        draw: { "sea-suez": d, "sea-atlantik": ease(seg(t, 0.16, 0.62)) },
        focus: d > 0.85 ? "golf" : "nordsee",
        labels: ["nordsee", "golf", "ostkueste"],
        active: d < 1 ? "sea-suez" : undefined,
      };
    },
  },
  // Home again: a high sweep back to Lauda.
  { chapter: 6, weight: 8, run: (t) => ({ cam: blendCam(space(20, 30, 420), parked("lauda", "menznau", 120, 46, 0), ease(t)), focus: t > 0.5 ? "lauda" : undefined }) },
  // References: short hops out of Lauda; the camera hangs over Europe and leans after each line.
  {
    chapter: 7, weight: 22, routes: REFERENCE_ORDER.map((id) => `lauda-${id}`),
    run: (t) => {
      const n = REFERENCE_ORDER.length;
      const i = Math.min(n - 1, Math.floor(t * n));
      const local = t * n - i;
      const draw: Record<string, number> = {};
      REFERENCE_ORDER.forEach((id, j) => { draw[`lauda-${id}`] = j < i ? 1 : j === i ? ease(seg(local, 0, 0.7)) : 0; });
      const home = V("lauda");
      const framing = (id: string, u: number): Cam => {
        const tgt = slerp(home, routeVec(R[`lauda-${id}`], u), 0.75);
        return { target: tgt, alt: 0.01, heading: tangent(tgt, towards(home, V(id))), dist: 150, pitch: 50, fov: 38 };
      };
      const prev = i > 0 ? framing(REFERENCE_ORDER[i - 1], 1) : parked("lauda", "menznau", 120, 46, 0);
      const cur = framing(REFERENCE_ORDER[i], draw[`lauda-${REFERENCE_ORDER[i]}`]);
      return { cam: blendCam(prev, cur, smooth(seg(local, 0, 0.55))), draw, focus: REFERENCE_ORDER[i], labels: ["lauda", REFERENCE_ORDER[i]] };
    },
  },
  { chapter: 8, weight: 19, routes: ["lauda-pemuco"], run: flight("lauda-pemuco", "nordamerika") },
  // Around the world, westwards, back home.
  {
    chapter: 9, weight: 40, routes: LOOP_LEGS,
    run: (t) => {
      const n = LOOP_LEGS.length;
      const i = Math.min(n - 1, Math.floor(t * n));
      const out = flight(LOOP_LEGS[i], LOOP[i + 2] ?? null, [0.04, 0.66])(t * n - i);
      const draw: Record<string, number> = {};
      LOOP_LEGS.forEach((id, j) => { draw[id] = j < i ? 1 : j === i ? out.draw![id] : 0; });
      return { ...out, draw, counter: Math.round(6500 * ease(t)) };
    },
  },
  // Finale: rise into space, globe to the centre, hand it to the visitor.
  {
    chapter: FINALE, weight: 20,
    run: (t) => ({ cam: blendCam(parked("lauda", null, 80, 56), space(24, 14, 450), ease(seg(t, 0, 0.5))), centre: ease(seg(t, 0.1, 0.45)), free: t > 0.45, counter: 6500 }),
  },
];

const TOTAL = SHOTS.reduce((s, x) => s + x.weight, 0);
const ENDS = SHOTS.map((s) => s.run(1).cam);

export function sceneAt(progress: number): SceneState {
  const p = clamp(progress);
  const draw: Record<string, number> = {};
  let acc = 0;
  for (let i = 0; i < SHOTS.length; i++) {
    const shot = SHOTS[i];
    const len = shot.weight / TOTAL;
    const last = i === SHOTS.length - 1;
    if (p > acc + len && !last) {
      shot.routes?.forEach((r) => { draw[r] = 1; });
      acc += len;
      continue;
    }
    const t = clamp((p - acc) / len);
    const out = shot.run(t);
    Object.assign(draw, out.draw);
    // Every cut is a camera move: blend in from where the previous shot left the camera.
    const cam = i > 0 ? blendCam(ENDS[i - 1], out.cam, smooth(seg(t, 0, 0.22))) : out.cam;
    const persistent = shot.chapter <= 3 ? ["riga"] : ["lauda"];
    const labels = out.free ? PLACES.map((pl) => pl.id) : [...new Set([...persistent, ...(out.labels ?? []), ...(out.focus ? [out.focus] : [])])];
    return { cam, draw, labels, focus: out.focus, chapter: shot.chapter, centre: out.centre ?? 0, free: out.free ?? false, counter: out.counter, active: out.active };
  }
  return sceneAt(1);
}
