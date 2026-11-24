import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="pie">
      <img src="/img/kreata-logo.png" alt="Kreata" width="700" height="213" loading="lazy" />

      {/* [correo de contacto] y las redes reales las pone el cliente; el sitio en vivo no publica ninguna */}
      <nav className="pie-contacto" aria-label="Contacto y redes">
        <p>[correo de contacto] · Bogotá, Colombia</p>
        <ul>
          <li><a href="#">[Instagram]</a></li>
          <li><a href="#">[Facebook]</a></li>
          <li><a href="#">[TikTok]</a></li>
        </ul>
      </nav>

      <nav aria-label="Enlaces del pie">
        <ul>
          <li><Link to="/about">Sobre Kreata</Link></li>
          <li><Link to="/legal/terminos-vendedores">Términos para vendedores</Link></li>
          <li><Link to="/legal/documentos">Documentos legales</Link></li>
          <li><Link to="/help">Preguntas frecuentes</Link></li>
          <li><Link to="/help">Soporte</Link></li>
        </ul>
      </nav>

      <p>© 2026 Kreata Store. Los diseños, marcas y contenidos exhibidos pertenecen a sus creadores.</p>
    </footer>
  );
}
