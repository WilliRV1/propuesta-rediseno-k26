import { CartProvider } from './context/CartContext.jsx';
import { Header } from './components/Header.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { CatalogSection } from './components/CatalogSection.jsx';
import { StoresSection } from './components/StoresSection.jsx';
import { CreatorSection } from './components/CreatorSection.jsx';
import { DeliveryInfo } from './components/DeliveryInfo.jsx';
import { Footer } from './components/Footer.jsx';
import { CartToast } from './components/CartToast.jsx';

export function App() {
  return (
    <CartProvider>
      <a className="saltar" href="#contenido">Ir al contenido</a>

      <p className="nota-demo">Propuesta de rediseño para Kreata. Los productos, tiendas y precios son los del catálogo real; el carrito de esta demo no procesa compras.</p>

      <Header />

      <main id="contenido">
        <HeroSection />
        <CatalogSection />
        <StoresSection />
        <CreatorSection />
        <DeliveryInfo />
      </main>

      <Footer />
      <CartToast />
    </CartProvider>
  );
}
