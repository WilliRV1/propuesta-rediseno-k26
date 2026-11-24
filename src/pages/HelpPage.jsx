import { Link } from 'react-router-dom';

const FAQS = [
  { q: '¿Cuánto tarda mi pedido?', a: '4 a 5 días hábiles para la mayoría de productos. Hoodies y pañoletas, 8 a 10 días. Envíos a todo el país con Aveonline.' },
  { q: '¿Cómo pago?', a: 'Los pagos se procesan por Wompi.' },
  { q: '¿Puedo devolver un producto?', a: 'Pendiente de aprobación de KREATA — texto de ejemplo para la demo.' },
  { q: '¿Cómo abro mi propia tienda?', a: 'Postúlate en la página de comunidad: ' },
];

export function HelpPage() {
  return (
    <section className="ayuda" aria-labelledby="titulo-ayuda">
      <h1 id="titulo-ayuda">Ayuda y preguntas frecuentes</h1>
      <div className="ayuda-faqs">
        {FAQS.map((f) => (
          <details key={f.q} className="ayuda-item">
            <summary>{f.q}</summary>
            <p>
              {f.a}
              {f.q.startsWith('¿Cómo abro') && <Link to="/community">Postula tu tienda</Link>}
            </p>
          </details>
        ))}
      </div>
      <p className="ayuda-contacto">
        ¿No encontraste tu respuesta? Escríbele a <strong>Kreo</strong>, el asistente de Kreata, con el botón de la esquina inferior.
      </p>
    </section>
  );
}
