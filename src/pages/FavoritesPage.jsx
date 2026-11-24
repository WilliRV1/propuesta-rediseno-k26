import { Link } from 'react-router-dom';

export function FavoritesPage() {
  return (
    <section className="favoritos-vacio" aria-labelledby="titulo-favoritos">
      <h1 id="titulo-favoritos">Lista de deseos</h1>
      <p>Aún no tienes diseños guardados. Explora el catálogo y toca el corazón de los que te gusten.</p>
      <Link to="/catalog" className="boton">Ver el catálogo</Link>
    </section>
  );
}
