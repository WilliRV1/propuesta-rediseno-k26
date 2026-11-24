import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATALOG, SIZES } from '../data/catalog.js';
import { ProductGrid } from '../components/ProductGrid.jsx';

const CATEGORY_LABELS = {
  camisetas: 'Camisetas',
  hoodies: 'Hoodies',
  panoletas: 'Pañoletas',
  mugs: 'Mugs',
  afiches: 'Afiches',
  bolsos: 'Bolsos',
};
const SORTS = { relevancia: 'Relevancia', 'precio-asc': 'Precio: menor a mayor', 'precio-desc': 'Precio: mayor a menor' };

const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g'); // marcas de acento tras normalize('NFD')
const normalize = (s) => s.normalize('NFD').replace(DIACRITICS, '').toLowerCase();
const priceOf = (p) => p.price ?? p.priceFrom;

export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const store = params.get('store') ?? '';
  const size = params.get('size') ?? '';
  const sort = params.get('sort') ?? 'relevancia';

  // las opciones de filtro salen de lo que de verdad hay en el catalogo: nunca se ofrece un filtro vacio
  const categories = useMemo(() => [...new Set(CATALOG.map((p) => p.category))], []);
  const stores = useMemo(() => [...new Set(CATALOG.map((p) => p.store))], []);
  const showSizeFilter = CATALOG.some((p) => (category ? p.category === category : true) && p.sizes);

  const results = useMemo(() => {
    const needle = q ? normalize(q) : '';
    let items = CATALOG.filter((p) => {
      if (needle && !normalize(`${p.title} ${p.collection}`).includes(needle)) return false;
      if (category && p.category !== category) return false;
      if (store && p.store !== store) return false;
      if (size && !p.sizes?.includes(size)) return false;
      return true;
    });
    if (sort === 'precio-asc') items = [...items].sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === 'precio-desc') items = [...items].sort((a, b) => priceOf(b) - priceOf(a));
    return items;
  }, [q, category, store, size, sort]);

  function setParam(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  }
  function clearFilters() {
    setParams({}, { replace: true });
  }

  const hasFilters = Boolean(q || category || store || size || (sort && sort !== 'relevancia'));
  let heading = 'Catálogo';
  if (q) heading = `Resultados para “${q}”`;
  else if (category && CATEGORY_LABELS[category]) heading = CATEGORY_LABELS[category];

  return (
    <section className="catalogo-pagina" aria-labelledby="titulo-catalogo-pagina">
      <div className="seccion-cabeza">
        <h1 id="titulo-catalogo-pagina">{heading}</h1>
        {hasFilters && (
          <button type="button" className="boton-texto" onClick={clearFilters}>Limpiar filtros</button>
        )}
      </div>

      <div className="catalogo-filtros">
        <div className="filtro-grupo" role="group" aria-label="Categoría">
          {categories.map((c) => (
            <button
              key={c} type="button" className="filtro-boton"
              aria-pressed={category === c}
              onClick={() => setParam('category', category === c ? '' : c)}
            >
              {CATEGORY_LABELS[c] ?? c}
            </button>
          ))}
        </div>
        <div className="filtro-grupo" role="group" aria-label="Tienda">
          {stores.map((s) => (
            <button
              key={s} type="button" className="filtro-boton"
              aria-pressed={store === s}
              onClick={() => setParam('store', store === s ? '' : s)}
            >
              {s}
            </button>
          ))}
        </div>
        {showSizeFilter && (
          <div className="filtro-grupo" role="group" aria-label="Talla">
            {SIZES.map((s) => (
              <button
                key={s} type="button" className="filtro-boton"
                aria-pressed={size === s}
                onClick={() => setParam('size', size === s ? '' : s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <label className="filtro-orden">
          Ordenar por
          <select value={sort} onChange={(e) => setParam('sort', e.target.value)}>
            {Object.entries(SORTS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      {results.length === 0 ? (
        <div className="catalogo-vacio" role="status">
          <p>No encontramos productos con esos filtros.</p>
          <button type="button" className="boton" onClick={clearFilters}>Limpiar filtros</button>
        </div>
      ) : (
        <ProductGrid items={results} />
      )}
    </section>
  );
}
