import { CATALOG } from '../data/catalog.js';

const pesos = (n) => '$ ' + n.toLocaleString('es-CO');

export function CatalogSection() {
  return (
    <section className="catalogo" id="catalogo" aria-labelledby="titulo-catalogo">
      <div className="seccion-cabeza">
        <h2 id="titulo-catalogo">Lo que están publicando los creadores</h2>
        <a href="#">Ver los 38 diseños</a>
      </div>
      <ul className="rejilla">
        {CATALOG.map((p) => (
          <li className="producto" key={p.id}>
            <a href="#">
              <img src={p.image} alt={p.alt} width="800" height="800" loading="lazy" />
              <h3>{p.title}</h3>
            </a>
            <p className="producto-tienda">de {p.store}</p>
            <p className="producto-precio">{p.priceFrom ? `Desde ${pesos(p.priceFrom)}` : pesos(p.price)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
