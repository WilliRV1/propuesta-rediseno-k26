import { Link } from 'react-router-dom';
import { CATALOG } from '../data/catalog.js';
import { ProductGrid } from './ProductGrid.jsx';

export function CatalogSection() {
  return (
    <section className="catalogo" id="catalogo" aria-labelledby="titulo-catalogo">
      <div className="seccion-cabeza">
        <h2 id="titulo-catalogo">Lo que están publicando los creadores</h2>
        <Link to="/catalog">Ver los 38 diseños</Link>
      </div>
      <ProductGrid items={CATALOG} />
    </section>
  );
}
