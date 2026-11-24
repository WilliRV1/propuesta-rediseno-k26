import { useSearchParams } from 'react-router-dom';
import { CATALOG } from '../data/catalog.js';
import { ProductGrid } from '../components/ProductGrid.jsx';

const CATEGORY_LABELS = {
  camisetas: 'Camisetas',
  hoodies: 'Hoodies',
  panoletas: 'Pañoletas',
  mugs: 'Mugs',
  afiches: 'Afiches',
  bolsos: 'Bolsos',
};

export function CatalogPage() {
  const [params] = useSearchParams();
  const q = params.get('q');
  const category = params.get('category');

  let heading = 'Catálogo';
  if (q) heading = `Resultados para “${q}”`;
  else if (category && CATEGORY_LABELS[category]) heading = CATEGORY_LABELS[category];

  return (
    <section className="catalogo-pagina" aria-labelledby="titulo-catalogo-pagina">
      <div className="seccion-cabeza">
        <h1 id="titulo-catalogo-pagina">{heading}</h1>
      </div>
      {/* El filtro real por búsqueda y categoría llega en EPIC-03; por ahora se muestra el catálogo completo. */}
      <ProductGrid items={CATALOG} />
    </section>
  );
}
