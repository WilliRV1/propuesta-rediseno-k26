const pesos = (n) => '$ ' + n.toLocaleString('es-CO');

export function ProductGrid({ items }) {
  return (
    <ul className="rejilla">
      {items.map((p) => (
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
  );
}
