import { useCallback, useEffect, useRef, useState } from 'react';
import { useViewer } from '../hooks/useViewer.js';
import { PRODUCTS_3D } from '../data/products3d.js';
import { useCart } from '../context/CartContext.jsx';

const pesos = (n) => '$ ' + n.toLocaleString('es-CO');

export function HeroSection() {
  const { containerRef, viewer, spinning, ready } = useViewer({ autoSpin: true, start: -0.6 });
  const [product, setProduct] = useState(PRODUCTS_3D[0]);
  const [current, setCurrent] = useState(PRODUCTS_3D[0].designs[0]);
  const [estado, setEstado] = useState('cargando');
  const flatImgRef = useRef(null);
  const { addToCart } = useCart();

  const show = useCallback((nextProduct, design, withSpin) => {
    setProduct(nextProduct);
    setCurrent(design);
    const v = viewer.current;
    if (v) {
      v.setProduct(nextProduct.type);
      v.canvas.setAttribute('aria-label', `${nextProduct.label} ${design.name} de ${design.store} en 3D. Arrastra o usa las flechas para girarlo.`);
      v.load(design.art, { spin: withSpin }).catch(() => {});
    } else if (flatImgRef.current) {
      flatImgRef.current.src = design.art;
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
    if (ready) show(PRODUCTS_3D[0], PRODUCTS_3D[0].designs[0], false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const price = current.price ?? current.priceFrom;

  return (
    <section className="portada" aria-labelledby="titulo-portada">
      <div className="portada-texto">
        <h2 id="titulo-portada">Diseños de creadores colombianos, impresos cuando los pides</h2>
        <p className="bajada">Cada pieza se estampa por encargo y sale hacia tu casa en 4 a 5 días hábiles.</p>
      </div>

      <div className="escenario" id="escenario" ref={containerRef} data-estado={estado}>
        <p className="escenario-carga">Cargando la vista en 3D…</p>
        <img ref={flatImgRef} className="escenario-plano" id="escenario-plano" alt={`Arte de ${product.label.toLowerCase()}`} width="2048" height="952" />
        <div className="escenario-productos" role="group" aria-label="Producto que se muestra en 3D">
          {PRODUCTS_3D.map((p) => (
            <button
              key={p.type}
              type="button"
              className="escenario-producto"
              aria-pressed={p.type === product.type}
              onClick={() => p.type !== product.type && show(p, p.designs[0], true)}
            >
              {p.label}
            </button>
          ))}
        </div>
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
        <h3 id="mug-nombre">{product.label} {current.name}</h3>
        <p className="ficha-tienda">Diseño de <a href="#tiendas" id="mug-tienda">{current.store}</a></p>
        <p className="ficha-detalle">{product.detail}</p>
        <div className="ficha-compra">
          <p className="precio" id="mug-precio">{current.price == null && <span className="precio-desde">Desde </span>}{pesos(price)}</p>
          <button type="button" className="boton" onClick={() => addToCart(product.cartName(current))}>
            {product.addLabel}
          </button>
        </div>
        <h3 className="ficha-otros">Otros {product.plural} para girar</h3>
        <ul className="muestras" id="mugs">
          {product.designs.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                className="muestra"
                aria-pressed={m.id === current.id}
                onClick={() => m.id !== current.id && show(product, m, true)}
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
