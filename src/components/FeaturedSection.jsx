import { CATALOG } from '../data/catalog.js';
import { ProductGrid } from './ProductGrid.jsx';

export function FeaturedSection() {
  const featured = CATALOG.filter((p) => p.featured);
  return (
    <section className="catalogo destacados" id="destacados" aria-labelledby="titulo-destacados">
      <div className="seccion-cabeza">
        <div>
          <p className="sobretitulo">Selección de la comunidad</p>
          <h2 id="titulo-destacados">Diseños que merecen una mirada</h2>
        </div>
        <a href="#catalogo">Ver el catálogo completo</a>
      </div>
      <ProductGrid items={featured} />
    </section>
  );
}
