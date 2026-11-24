import { useEffect, useRef, useState } from 'react';
import { artGuideCanvas } from '../lib/artGuide.js';
import { submitDemoForm } from '../lib/demoForm.js';
import { useDisclosure } from '../hooks/useDisclosure.js';

export function CreatorSection() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const uploadedRef = useRef(false);
  const [estado, setEstado] = useState('cargando');
  const [spinning, setSpinning] = useState(false);
  const [artStatus, setArtStatus] = useState({
    text: 'También puedes soltar el archivo sobre el mug. La imagen no sale de tu navegador.',
    type: null,
  });
  const [dropping, setDropping] = useState(false);
  const [applicationOpen, setApplicationOpen] = useDisclosure('postulacion');
  const [applicationStatus, setApplicationStatus] = useState('');
  const applicationRef = useRef(null);

  useEffect(() => {
    if (!applicationOpen) return;
    applicationRef.current?.scrollIntoView({ block: 'start' });
    applicationRef.current?.querySelector('input:not([type="hidden"])')?.focus({ preventScroll: true });
  }, [applicationOpen]);

  // el visor del creador se arma solo cuando la sección entra en pantalla
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const onSpin = (e) => setSpinning(e.detail);
    container.addEventListener('spin', onSpin);
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
    return () => {
      observer.disconnect();
      container.removeEventListener('spin', onSpin);
    };
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

  function onSubmitApplication(e) {
    const nombre = submitDemoForm(e);
    if (nombre === null) return;
    setApplicationStatus(`¡Gracias, ${nombre}! Tu postulación quedó lista en esta demo. No se envió ni se guardó información.`);
  }

  return (
    <section className="creadores" id="comunidad" aria-labelledby="titulo-creadores">
      <div className="creadores-texto">
        <p className="sobretitulo">La comunidad detrás de cada diseño</p>
        <h2 id="titulo-creadores">¿Creas? Aquí tu arte puede encontrar nuevas personas</h2>
        <p>Prueba tu diseño en un mug, conoce los requisitos y postula tu tienda para compartir tus creaciones en KREATA.</p>
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
        <button
          type="button"
          className="enlace-fuerte enlace-desplegable"
          aria-controls="postulacion"
          aria-expanded={applicationOpen}
          onClick={() => setApplicationOpen((v) => !v)}
        >
          {applicationOpen ? 'Cerrar formulario' : 'Abrir formulario de postulación'}
        </button>
        <form className="formulario-demo" id="postulacion" ref={applicationRef} aria-labelledby="titulo-postulacion" hidden={!applicationOpen} onSubmit={onSubmitApplication}>
          <h3 id="titulo-postulacion">Postula tu tienda</h3>
          <p className="formulario-nota">Completa los campos obligatorios. Prototipo: tus datos no se envían ni se guardan.</p>
          <div className="formulario-campos">
            <label>
              Nombre completo
              <input name="nombre" type="text" autoComplete="name" required />
            </label>
            <label>
              Correo electrónico
              <input name="correo" type="email" autoComplete="email" spellCheck={false} required />
            </label>
            <label>
              Nombre de tu tienda o proyecto
              <input name="tienda" type="text" required />
            </label>
            <label>
              Portafolio o red social <span>(opcional)</span>
              <input name="portafolio" type="url" placeholder="https://instagram.com/tu-tienda…" />
            </label>
            <label className="campo-completo">
              Cuéntanos qué creas (mínimo 20 caracteres)
              <textarea name="descripcion" rows="4" minLength={20} required />
            </label>
          </div>
          <button className="boton boton-claro" type="submit">Enviar postulación</button>
          <p className="estado-postulacion" role="status" aria-live="polite" data-tipo={applicationStatus ? 'ok' : undefined}>
            {applicationStatus}
          </p>
        </form>
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
        {estado !== 'sin-3d' && estado !== 'cargando' && (
          <div className="escenario-pie">
            <span>Arrastra el mug para girarlo</span>
            <button type="button" className="boton-texto" aria-pressed={spinning} onClick={() => viewerRef.current?.toggleSpin()}>
              {spinning ? 'Pausar el giro' : 'Girar solo'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
