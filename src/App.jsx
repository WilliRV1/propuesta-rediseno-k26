import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './pages/Layout.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { CatalogPage } from './pages/CatalogPage.jsx';
import { CommunityPage } from './pages/CommunityPage.jsx';
import { AccountPage } from './pages/AccountPage.jsx';
import { FavoritesPage } from './pages/FavoritesPage.jsx';
import { HelpPage } from './pages/HelpPage.jsx';
import { PolicyPage } from './pages/PolicyPage.jsx';
import { ComingSoonPage } from './pages/ComingSoonPage.jsx';

const SOBRE_KREATA = [
  { heading: '¿Qué es Kreata?', body: 'Una tienda multimarca y una comunidad: conectamos artistas, diseñadores y marcas con la impresión bajo demanda, para que su talento llegue más lejos sin invertir en inventario.' },
  { heading: 'Nuestro modelo', body: 'Cada diseño se imprime cuando se pide. Kreata se encarga de producir, empacar y despachar; el creador se encarga de diseñar y promocionar su marca.' },
  { heading: 'Dónde operamos', body: 'Pendiente de aprobación de KREATA — texto de ejemplo para la demo.' },
];
const TERMINOS_VENDEDORES = [
  { heading: 'Elegibilidad', body: 'Ser mayor de edad, tener RUT vigente y registrar datos de pago válidos.' },
  { heading: 'Comisiones y pagos', body: 'Pendiente de aprobación de KREATA — texto de ejemplo para la demo.' },
  { heading: 'Calidad del contenido y propiedad intelectual', body: 'Cada producto pasa por revisión manual antes de publicarse. El creador declara ser dueño de los derechos del diseño que sube.' },
  { heading: 'Suspensión de la tienda', body: 'Pendiente de aprobación de KREATA — texto de ejemplo para la demo.' },
];
const DOCUMENTOS_LEGALES = [
  { heading: 'Política de datos personales', body: 'Pendiente de aprobación de KREATA — texto de ejemplo para la demo.' },
  { heading: 'Términos y condiciones de compra', body: 'Pendiente de aprobación de KREATA — texto de ejemplo para la demo.' },
  { heading: 'Política de propiedad intelectual', body: 'Los diseños, marcas y contenidos exhibidos pertenecen a sus respectivos creadores y propietarios.' },
];

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/about" element={<PolicyPage title="Sobre Kreata" sections={SOBRE_KREATA} />} />
          <Route path="/legal/terminos-vendedores" element={<PolicyPage title="Términos para vendedores" sections={TERMINOS_VENDEDORES} />} />
          <Route path="/legal/documentos" element={<PolicyPage title="Documentos legales" sections={DOCUMENTOS_LEGALES} />} />
          <Route path="*" element={<ComingSoonPage title="Página no encontrada" description="Revisa la dirección o vuelve al inicio." />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
