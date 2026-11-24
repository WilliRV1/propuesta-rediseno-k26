export function StoresSection() {
  return (
    <section className="tiendas" id="tiendas" aria-labelledby="titulo-tiendas">
      <h2 id="titulo-tiendas">Tiendas de creadores</h2>
      <article className="tienda" id="tienda-artery">
        <img src="/img/wrap-bichofue.jpg" alt="Lámina del bichofué, de ARTERY" width="2048" height="952" loading="lazy" />
        <div>
          <h3>ARTERY</h3>
          <p>Láminas de aves del Valle del Cauca, dibujadas como un atlas antiguo, en camisetas, mugs, pañoletas y bolsos.</p>
          <a href="#catalogo">Explorar los diseños de ARTERY</a>
        </div>
      </article>
      <article className="tienda tienda-invertida" id="tienda-kokomochi">
        <img src="/img/wrap-juancho.jpg" alt="Juancho y Conchita, de Kokomochi" width="2048" height="952" loading="lazy" />
        <div>
          <h3>Kokomochi</h3>
          <p>Personajes ilustrados, café y Cali en camisetas, mugs, afiches, pañoletas y bolsos.</p>
          <a href="#catalogo">Explorar los diseños de Kokomochi</a>
        </div>
      </article>
    </section>
  );
}
