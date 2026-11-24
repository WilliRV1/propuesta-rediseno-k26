import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './pages/Layout.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { CatalogPage } from './pages/CatalogPage.jsx';
import { CommunityPage } from './pages/CommunityPage.jsx';
import { ComingSoonPage } from './pages/ComingSoonPage.jsx';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/account" element={<ComingSoonPage title="Mi cuenta" description="Inicio de sesión, registro y pedidos. Llega con el backend de identidad." />} />
          <Route path="/favorites" element={<ComingSoonPage title="Lista de deseos" />} />
          <Route path="/help" element={<ComingSoonPage title="Ayuda y preguntas frecuentes" />} />
          <Route path="/about" element={<ComingSoonPage title="Sobre Kreata" />} />
          <Route path="/legal/terminos-vendedores" element={<ComingSoonPage title="Términos para vendedores" />} />
          <Route path="/legal/documentos" element={<ComingSoonPage title="Documentos legales" />} />
          <Route path="*" element={<ComingSoonPage title="Página no encontrada" description="Revisa la dirección o vuelve al inicio." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
