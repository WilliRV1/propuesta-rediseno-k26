import { useCallback, useEffect, useRef, useState } from 'react';
import { useViewer } from '../hooks/useViewer.js';
import { MUGS } from '../data/mugs.js';
import { useCart } from '../context/CartContext.jsx';

const pesos = (n) => '$ ' + n.toLocaleString('es-CO');

export function HeroSection() {
  const { containerRef, viewer, spinning, ready } = useViewer({ autoSpin: true, start: -0.6 });
  const [current, setCurrent] = useState(MUGS[0]);
  const [estado, setEstado] = useState('cargando');
  const flatImgRef = useRef(null);
  const { addToCart } = useCart();

  const show = useCallback((mug, withSpin) => {
    setCurrent(mug);
    const v = viewer.current;
    if (v) {
      v.canvas.setAttribute('aria-label', `Mug ${mug.name} de ${mug.store} en 3D. Arrastra o usa las flechas para girarlo.`);
      v.load(mug.art, { spin: withSpin }).catch(() => {});
    } else if (flatImgRef.current) {
      flatImgRef.current.src = mug.art;
    }
  }, [viewer]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const onStateChange = () => setEstado(container.dataset.estado || 'cargando');
    const observer = new MutationObserver(onStateChange);
    observer.observe(container, { attributes: true, attributeFilter: ['data-estado'] });
    onStateChange();
    return () => observer.disconnect();
  }, []);

  // la primera carga espera a que el modulo de three.js (importado de forma dinamica) este listo
  useEffect(() => {
    if (ready) show(MUGS[0], false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <section className="portada" aria-labelledby="titulo-portada">
      <div className="portada-texto">
        <h1 id="titulo-portada">Diseños de creadores colombianos, impresos cuando los pides</h1>
        <p className="bajada">Cada pieza se estampa por encargo y sale hacia tu casa en 4 a 5 días hábiles.</p>
      </div>

      <div className="escenario" id="escenario" ref={containerRef} data-estado={estado}>
        <p className="escenario-carga">Cargando la vista en 3D…</p>
        <img ref={flatImgRef} className="escenario-plano" id="escenario-plano" alt="Arte del mug" width="2048" height="952" />
        <div className="escenario-pie">
          <span>Arrástralo para girarlo</span>
          {viewer.current && (
            <button
              type="button"
              className="boton-texto"
              aria-pressed={spinning}
              onClick={() => viewer.current.toggleSpin()}
            >
              {spinning ? 'Pausar el giro' : 'Girar solo'}
            </button>
          )}
        </div>
      </div>

      <div className="ficha">
        <h2 id="mug-nombre">Mug {current.name}</h2>
        <p className="ficha-tienda">Diseño de <a href="#tiendas" id="mug-tienda">{current.store}</a></p>
        <p className="ficha-detalle">Cerámica de 11&nbsp;oz con impresión en los 360°.</p>
        <div className="ficha-compra">
          <p className="precio" id="mug-precio">{pesos(current.price)}</p>
          <button type="button" className="boton" onClick={() => addToCart(`El mug ${current.name}`)}>
            Agregar este mug al carrito
          </button>
        </div>
        <h3 className="ficha-otros">Otros mugs para girar</h3>
        <ul className="muestras" id="mugs">
          {MUGS.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                className="muestra"
                aria-pressed={m.id === current.id}
                onClick={() => m.id !== current.id && show(m, true)}
              >
                <img src={m.art} alt="" width="96" height="64" loading="lazy" />
                <span className="muestra-nombre">{m.name}</span>
                <span className="muestra-tienda">{m.store}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
