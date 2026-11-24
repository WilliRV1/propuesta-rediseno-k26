import { CATALOG } from '../data/catalog.js';
import { ProductGrid } from './ProductGrid.jsx';

export function CatalogSection() {
  const rest = CATALOG.filter((p) => !p.featured);
  return (
    <section className="catalogo" id="catalogo" aria-labelledby="titulo-catalogo">
      <div className="seccion-cabeza">
        <div>
          <p className="sobretitulo">Más ideas, más creadores</p>
          <h2 id="titulo-catalogo">Explora el catálogo</h2>
        </div>
        <a href="#tiendas">Conoce las tiendas</a>
      </div>
      <ProductGrid items={rest} />
    </section>
  );
}
