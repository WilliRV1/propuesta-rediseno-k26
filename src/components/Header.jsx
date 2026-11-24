import { useCart } from '../context/CartContext.jsx';

export function Header() {
  const { count } = useCart();
  return (
    <header className="cabecera">
      <a className="logo" href="#" aria-label="Kreata, inicio">
        <img src="/img/kreata-logo.png" alt="Kreata" width="700" height="213" />
      </a>
      <nav className="menu" aria-label="Categorías">
        <ul>
          <li><a href="#catalogo">Camisetas</a></li>
          <li><a href="#catalogo">Hoodies</a></li>
          <li><a href="#catalogo">Pañoletas</a></li>
          <li><a href="#contenido">Mugs</a></li>
          <li><a href="#catalogo">Afiches</a></li>
          <li><a href="#catalogo">Bolsos</a></li>
          <li><a href="#tiendas">Tiendas</a></li>
        </ul>
      </nav>
      <div className="cabecera-acciones">
        <a className="enlace-creador" href="#creadores">Vender mis diseños</a>
        <a href="#" className="accion">Mi cuenta</a>
        <a href="#" className="accion carrito" id="carrito" aria-label={`Carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`}>
          Carrito <span id="carrito-cuenta">{count}</span>
        </a>
      </div>
    </header>
  );
}
