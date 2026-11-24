import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { MobileMenu } from './MobileMenu.jsx';
import { AccountIcon, BagIcon, HeartIcon, MenuIcon, SearchIcon } from './icons.jsx';

const CATEGORIES = [
  { label: 'Camisetas', slug: 'camisetas' },
  { label: 'Hoodies', slug: 'hoodies' },
  { label: 'Pañoletas', slug: 'panoletas' },
  { label: 'Mugs', slug: 'mugs' },
  { label: 'Afiches', slug: 'afiches' },
  { label: 'Bolsos', slug: 'bolsos' },
];

export function Header() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  function onSearch(e) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get('q')?.toString().trim();
    navigate(q ? `/catalog?q=${encodeURIComponent(q)}` : '/catalog');
  }

  return (
    <header className="cabecera">
      <button
        type="button"
        className="menu-abrir"
        ref={menuButtonRef}
        aria-expanded={menuOpen}
        aria-controls="menu-movil"
        aria-label="Abrir menú de categorías"
        onClick={() => setMenuOpen(true)}
      >
        <MenuIcon />
      </button>

      <Link className="logo" to="/" aria-label="Kreata, inicio">
        <img src="/img/kreata-logo.png" alt="Kreata" width="700" height="213" />
      </Link>

      <nav className="menu" aria-label="Categorías">
        <ul>
          {CATEGORIES.map((c) => (
            <li key={c.slug}><Link to={`/catalog?category=${c.slug}`}>{c.label}</Link></li>
          ))}
          <li><Link to="/#tiendas">Tiendas</Link></li>
        </ul>
      </nav>

      <form className="buscador" role="search" onSubmit={onSearch}>
        <label className="oculto" htmlFor="buscador-campo">Buscar productos</label>
        <input id="buscador-campo" name="q" type="search" placeholder="Busca un diseño…" autoComplete="off" />
        <button type="submit" aria-label="Buscar"><SearchIcon /></button>
      </form>

      <div className="cabecera-acciones">
        <Link className="enlace-creador" to="/community">Vender mis diseños</Link>
        <Link to="/account" className="accion-icono" aria-label="Mi cuenta"><AccountIcon /></Link>
        <Link to="/favorites" className="accion-icono" aria-label="Lista de deseos"><HeartIcon /></Link>
        <a href="#" className="accion-icono carrito" id="carrito" aria-label={`Carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`}>
          <BagIcon />
          <span id="carrito-cuenta">{count}</span>
        </a>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} triggerRef={menuButtonRef} />
    </header>
  );
}
