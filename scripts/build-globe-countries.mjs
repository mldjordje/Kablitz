// Converts Natural Earth 110m countries (world-atlas TopoJSON) into the GeoJSON the globe loads at runtime.
// Run once: node scripts/build-globe-countries.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { polygonToCells } from "h3-js";
import { feature } from "topojson-client";

const topo = JSON.parse(readFileSync("node_modules/world-atlas/countries-110m.json", "utf8"));
const geo = feature(topo, topo.objects.countries);

const round = ([lng, lat]) => [Math.round(lng * 100) / 100, Math.round(lat * 100) / 100];
const cleanRing = (ring) => ring.map(round).filter((p, i, a) => i === 0 || p[0] !== a[i - 1][0] || p[1] !== a[i - 1][1]);
// three-globe tessellates land with h3; a polygon h3 rejects would throw inside the render loop.
const tessellates = (poly) => { try { polygonToCells(poly, 3, true); return true; } catch { return false; } };

const features = geo.features
  // Antarctica only adds a white smear at the bottom of the globe.
  .filter((f) => f.properties.name !== "Antarctica")
  .map((f) => {
    const polys = (f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates)
      .map((poly) => poly.map(cleanRing))
      .map((poly) => (tessellates(poly) ? poly : [poly[0]]))
      .filter(tessellates);
    if (polys.length < (f.geometry.type === "Polygon" ? 1 : f.geometry.coordinates.length)) console.warn(`dropped part of ${f.properties.name}`);
    return polys.length ? { type: "Feature", properties: { name: f.properties.name }, geometry: { type: "MultiPolygon", coordinates: polys } } : null;
  })
  .filter(Boolean);

writeFileSync("public/globe/countries-110m.json", JSON.stringify({ type: "FeatureCollection", features }));
console.log(`${features.length} countries written`);
