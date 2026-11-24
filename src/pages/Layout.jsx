import { Outlet } from 'react-router-dom';
import { CartProvider } from '../context/CartContext.jsx';
import { Header } from '../components/Header.jsx';
import { Footer } from '../components/Footer.jsx';
import { CartToast } from '../components/CartToast.jsx';
import { KreoChat } from '../components/KreoChat.jsx';

/** Marco compartido por todas las páginas de la demo: cabecera, pie y el aviso del carrito. */
export function Layout() {
  return (
    <CartProvider>
      <a className="saltar" href="#contenido">Ir al contenido</a>
      <p className="nota-demo">Propuesta de rediseño para Kreata. Los productos, tiendas y precios son los del catálogo real; el carrito de esta demo no procesa compras.</p>
      <Header />
      <main id="contenido">
        <Outlet />
      </main>
      <Footer />
      <CartToast />
      <KreoChat />
    </CartProvider>
  );
}
