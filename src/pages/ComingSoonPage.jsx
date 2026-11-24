import { Link } from 'react-router-dom';

/**
 * Página mínima para rutas que otra tarjeta de Trello construye más adelante
 * (cuenta, ayuda, legales). Existe para que los enlaces del header/footer
 * de esta tarea no queden rotos; el contenido real lo reemplaza esa tarjeta.
 */
export function ComingSoonPage({ title, description }) {
  return (
    <section className="proximamente" aria-labelledby="titulo-proximamente">
      <h1 id="titulo-proximamente">{title}</h1>
      <p>{description ?? 'Esta página está en construcción.'}</p>
      <Link to="/" className="enlace-fuerte">Volver al inicio</Link>
    </section>
  );
}
