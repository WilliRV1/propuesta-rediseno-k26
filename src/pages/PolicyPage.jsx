/**
 * Paginas de ayuda/politicas de la maqueta: texto de ejemplo marcado como
 * pendiente de aprobacion real, para que ningun enlace del header/footer
 * quede muerto (EPIC-01+12).
 */
export function PolicyPage({ title, sections }) {
  return (
    <section className="politica" aria-labelledby="titulo-politica">
      <h1 id="titulo-politica">{title}</h1>
      <p className="politica-aviso">Pendiente de aprobación de KREATA — texto de ejemplo para la demo.</p>
      {sections.map((s) => (
        <div className="politica-seccion" key={s.heading}>
          <h2>{s.heading}</h2>
          <p>{s.body}</p>
        </div>
      ))}
    </section>
  );
}
