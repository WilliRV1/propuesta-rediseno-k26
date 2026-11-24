import { useEffect, useRef, useState } from 'react';
import { artGuideCanvas } from '../lib/artGuide.js';

export function CreatorSection() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const uploadedRef = useRef(false);
  const [estado, setEstado] = useState('cargando');
  const [artStatus, setArtStatus] = useState({
    text: 'También puedes soltar el archivo sobre el mug. La imagen no sale de tu navegador.',
    type: null,
  });
  const [dropping, setDropping] = useState(false);

  // el visor del creador se arma solo cuando la sección entra en pantalla
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const observer = new IntersectionObserver((entries, obs) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      obs.disconnect();
      import('../lib/three/viewer.js').then(({ createViewer }) => {
        const viewer = createViewer(container, { autoSpin: false, start: 0 });
        viewerRef.current = viewer;
        if (!viewer) { setEstado('sin-3d'); return; }
        viewer.canvas.setAttribute('aria-label', 'Mug en 3D para probar tu arte. Arrastra o usa las flechas para girarlo.');
        viewer.useImage(artGuideCanvas(), { spin: false });
        setEstado(container.dataset.estado);
        document.fonts.load('700 118px Ubuntu').then(() => {
          if (!uploadedRef.current) viewer.useImage(artGuideCanvas(), { spin: false });
        });
      });
    }, { rootMargin: '300px' });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  function receiveFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setArtStatus({ text: 'Ese archivo no es una imagen. Prueba con PNG o JPG.', type: 'error' });
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      uploadedRef.current = true;
      viewerRef.current?.useImage(img);
      setArtStatus({ text: `${file.name}: ${img.naturalWidth} × ${img.naturalHeight} px. Así se vería impreso.`, type: 'ok' });
    };
    img.onerror = () => setArtStatus({ text: 'No se pudo abrir la imagen. Prueba con otro archivo.', type: 'error' });
    img.src = url;
  }

  return (
    <section className="creadores" id="creadores" aria-labelledby="titulo-creadores">
      <div className="creadores-texto">
        <h2 id="titulo-creadores">¿Dibujas? Mira tu arte en un mug antes de abrir tu tienda</h2>
        <p>Sube una imagen y gírala. Kreata imprime, empaca y despacha cada pedido; tú no compras inventario.</p>
        <label className="boton boton-claro" htmlFor="arte-archivo">Subir mi arte</label>
        <input
          className="oculto"
          type="file"
          id="arte-archivo"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => receiveFile(e.target.files[0])}
        />
        <p className="arte-estado" id="arte-estado" role="status" data-tipo={artStatus.type ?? undefined}>
          {artStatus.text}
        </p>
        <dl className="requisitos">
          <dt>Para abrir tienda necesitas</dt>
          <dd>Ser mayor de edad, tener RUT vigente y registrar tus datos de pago.</dd>
          <dt>Antes de publicarse</dt>
          <dd>Cada producto pasa por revisión manual de Kreata.</dd>
        </dl>
        <a className="enlace-fuerte" href="#">Abrir mi tienda en Kreata</a>
      </div>
      <div
        className="escenario escenario-oscuro"
        id="taller"
        ref={containerRef}
        data-estado={estado}
        data-soltar={dropping ? '1' : undefined}
        onDragOver={(e) => { e.preventDefault(); setDropping(true); }}
        onDragLeave={() => setDropping(false)}
        onDrop={(e) => { e.preventDefault(); setDropping(false); receiveFile(e.dataTransfer.files[0]); }}
      >
        <p className="escenario-carga">Cargando la vista en 3D…</p>
      </div>
    </section>
  );
}
