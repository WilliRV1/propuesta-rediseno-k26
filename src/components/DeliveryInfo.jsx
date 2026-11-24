import { useEffect, useRef, useState } from 'react';
import { submitDemoForm } from '../lib/demoForm.js';
import { useDisclosure } from '../hooks/useDisclosure.js';

export function DeliveryInfo() {
  const [supportOpen, setSupportOpen] = useDisclosure('garantias');
  const [supportStatus, setSupportStatus] = useState('');
  const panelRef = useRef(null);

  useEffect(() => {
    if (!supportOpen) return;
    panelRef.current?.scrollIntoView({ block: 'start' });
    panelRef.current?.querySelector('input:not([type="hidden"])')?.focus({ preventScroll: true });
  }, [supportOpen]);

  function onSubmitSupport(e) {
    const nombre = submitDemoForm(e);
    if (nombre === null) return;
    setSupportStatus(`¡Gracias, ${nombre}! Tu consulta quedó lista en esta demo. No se envió ni se guardó información.`);
  }

  return (
    <section className="datos" id="politicas" aria-labelledby="titulo-datos">
      <div className="seccion-cabeza">
        <div>
          <p className="sobretitulo">Compra con claridad</p>
          <h2 id="titulo-datos">Lo que necesitas saber antes de pedir</h2>
        </div>
        <button
          type="button"
          className="enlace-fuerte enlace-desplegable"
          aria-controls="garantias"
          aria-expanded={supportOpen}
          onClick={() => setSupportOpen((v) => !v)}
        >
          {supportOpen ? 'Cerrar detalles' : 'Ver garantías y soporte'}
        </button>
      </div>
      <dl>
        <div><dt>Envíos</dt><dd>Despachos a todo el país con Aveonline.</dd></div>
        <div><dt>Tiempos</dt><dd>4 a 5 días hábiles; hoodies y pañoletas, de 8 a 10.</dd></div>
        <div><dt>Pagos</dt><dd>Procesados por Wompi. Cada pieza se imprime bajo pedido.</dd></div>
        <div><dt>Soporte y garantías</dt><dd>Consulta las condiciones vigentes o solicita ayuda con tu pedido.</dd></div>
      </dl>
      <div className="panel-soporte" id="garantias" ref={panelRef} aria-labelledby="titulo-soporte" hidden={!supportOpen}>
        <h3 id="titulo-soporte">Soporte y garantías</h3>
        <p>Cuéntanos si tienes una duda sobre envíos, pagos o las condiciones de garantía de tu pedido.</p>
        <form className="formulario-demo" aria-labelledby="titulo-formulario-soporte" onSubmit={onSubmitSupport}>
          <h4 id="titulo-formulario-soporte">Enviar una consulta</h4>
          <p className="formulario-nota">Prototipo: la consulta no se envía ni se guarda. Las condiciones definitivas deben confirmarse con KREATA.</p>
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
              Motivo de la consulta
              <select name="motivo" required defaultValue="">
                <option value="" disabled>Selecciona una opción</option>
                <option value="envio">Envíos o tiempos de entrega</option>
                <option value="pago">Pagos</option>
                <option value="garantia">Garantía</option>
                <option value="otro">Otro</option>
              </select>
            </label>
            <label>
              Número de pedido <span>(opcional)</span>
              <input name="pedido" type="text" />
            </label>
            <label className="campo-completo">
              Describe tu consulta (mínimo 20 caracteres)
              <textarea name="mensaje" rows="4" minLength={20} required />
            </label>
          </div>
          <button className="boton" type="submit">Enviar consulta</button>
          <p className="estado-postulacion" role="status" aria-live="polite" data-tipo={supportStatus ? 'ok' : undefined}>
            {supportStatus}
          </p>
        </form>
      </div>
    </section>
  );
}
