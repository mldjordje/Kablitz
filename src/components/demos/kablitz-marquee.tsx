const ROWS = [
  ["Biomasse", "Agriwaste", "RDF / SRF", "Altholz", "Rinde", "Hackschnitzel"],
  ["Prozessdampf", "Strom", "Fernwärme", "Heißgas", "Thermalöl", "Heißwasser"],
];

/**
 * Two counter-running type bands: fuels in, energy out. KablitzMotion loops them and lets
 * scroll velocity speed them up, flip their direction and skew them.
 */
export function KablitzMarquee() {
  return (
    <section className="kmarquee" aria-label="Brennstoffe und Energieformen">
      {ROWS.map((row, r) => (
        <div className="kmarquee-row" data-marquee={r % 2 ? "-1" : "1"} key={r}>
          {[0, 1].map((copy) => (
            <div className="kmarquee-track" aria-hidden={copy === 1} key={copy}>
              {row.map((word) => (
                <span key={word}>{word}<i aria-hidden="true" /></span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
