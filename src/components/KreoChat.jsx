import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Respuestas predefinidas: nunca inventa informacion de pedidos (EPIC-01+12),
// siempre deriva a /account, /community o /help.
const OPCIONES = [
  { texto: 'Ya tengo tienda', respuesta: 'Entra a tu cuenta para ver tu tienda.', to: '/account', enlace: 'Ir a Mi cuenta' },
  { texto: 'Quiero abrir una', respuesta: 'Postúlate aquí y te contamos cómo funciona.', to: '/community', enlace: 'Postula tu tienda' },
  { texto: 'Busco ayuda con una compra', respuesta: 'No tengo acceso a pedidos reales en esta demo. Revisa la página de ayuda o escríbenos por soporte.', to: '/help', enlace: 'Ir a Ayuda' },
];

export function KreoChat() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const botonRef = useRef(null);
  const cerrarRef = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    cerrarRef.current?.focus();
    function onKeyDown(e) { if (e.key === 'Escape') setAbierto(false); }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      botonRef.current?.focus();
    };
  }, [abierto]);

  function elegir(opcion) {
    setMensajes((m) => [...m, { autor: 'tu', texto: opcion.texto }, { autor: 'kreo', texto: opcion.respuesta, to: opcion.to, enlace: opcion.enlace }]);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    setMensajes((m) => [...m, { autor: 'tu', texto },
      { autor: 'kreo', texto: 'Soy una maqueta sin conexión a pedidos reales. Para dudas de compra o envío, visita la página de ayuda.', to: '/help', enlace: 'Ir a Ayuda' }]);
    setTexto('');
  }

  return (
    <div className="kreo">
      {abierto && (
        <div className="kreo-panel" role="dialog" aria-label="Kreo, asistente de Kreata">
          <div className="kreo-encabezado">
            <div>
              <strong>Kreo</strong>
              <p>Tu asistente de Kreata · maqueta, sin backend</p>
            </div>
            <button type="button" ref={cerrarRef} onClick={() => setAbierto(false)} aria-label="Cerrar chat">✕</button>
          </div>
          <div className="kreo-mensajes">
            <p className="kreo-mensaje kreo-mensaje-bot">
              ¡Hola! Soy Kreo. ¿Ya tienes tienda, quieres abrir una, o buscas ayuda con una compra?
            </p>
            {mensajes.map((m, i) => (
              <p key={i} className={`kreo-mensaje kreo-mensaje-${m.autor === 'tu' ? 'tu' : 'bot'}`}>
                {m.texto}
                {m.to && <Link to={m.to} onClick={() => setAbierto(false)}> {m.enlace}</Link>}
              </p>
            ))}
            {mensajes.length === 0 && (
              <div className="kreo-opciones">
                {OPCIONES.map((o) => (
                  <button key={o.texto} type="button" onClick={() => elegir(o)}>{o.texto}</button>
                ))}
              </div>
            )}
          </div>
          <form className="kreo-form" onSubmit={onSubmit}>
            <label className="oculto" htmlFor="kreo-campo">Escribe tu pregunta</label>
            <input id="kreo-campo" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe tu pregunta…" />
            <button type="submit" aria-label="Enviar">➤</button>
          </form>
        </div>
      )}
      <button
        type="button" className="kreo-boton" ref={botonRef}
        aria-expanded={abierto} aria-label="Pregúntale a Kreo"
        onClick={() => setAbierto((v) => !v)}
      >
        Pregúntale a KREO
      </button>
    </div>
  );
}
