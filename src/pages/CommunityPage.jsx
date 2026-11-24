import { useState } from 'react';

const STEPS = [
  { title: 'Tú creas, nosotros producimos', body: 'Puedes emprender sin comprar inventario, sin invertir en maquinaria y sin asumir los riesgos de una producción tradicional.' },
  { title: 'Construye tu marca', body: 'Mientras tú diseñas, construyes tu marca y promocionas tu tienda, Kreata se encarga de producir, imprimir, empacar y despachar cada pedido con calidad profesional.' },
  { title: 'Una comunidad de creadores', body: 'Como en otras plataformas de economía colaborativa, en Kreata los partners forman parte de una comunidad basada en la confianza, la transparencia y el respeto por las normas.' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CommunityPage() {
  const [values, setValues] = useState({ nombre: '', correo: '', propuesta: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  function onChange(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!values.nombre.trim()) next.nombre = 'Cuéntanos tu nombre.';
    if (!values.correo.trim()) next.correo = 'El correo es obligatorio.';
    else if (!EMAIL_RE.test(values.correo)) next.correo = 'Revisa el formato del correo.';
    if (!values.propuesta.trim()) next.propuesta = 'Cuéntanos qué quieres vender.';
    return next;
  }

  function onSubmit(e) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById(`campo-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setSent(true);
  }

  return (
    <section className="comunidad" aria-labelledby="titulo-comunidad">
      <div className="comunidad-intro">
        <h1 id="titulo-comunidad">Convierte tu pasión y tu creatividad en un negocio.</h1>
        <p>En Kreata creemos que el talento no debería tener que invertir millones para empezar a vender. Por eso construimos una plataforma basada en un modelo de economía colaborativa, donde cada uno aporta lo que mejor sabe hacer.</p>
      </div>

      <ol className="comunidad-pasos">
        {STEPS.map((s) => (
          <li key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="comunidad-formulario">
        <h2 id="titulo-postula">Postula tu tienda</h2>
        {sent ? (
          <p className="comunidad-exito" role="status">
            ¡Listo! Recibimos tu postulación. Kreata te escribirá a {values.correo} con los próximos pasos.
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate aria-labelledby="titulo-postula">
            <div className="campo">
              <label htmlFor="campo-nombre">Nombre</label>
              <input
                id="campo-nombre" name="nombre" type="text" autoComplete="name"
                value={values.nombre} onChange={onChange('nombre')}
                aria-invalid={Boolean(errors.nombre)} aria-describedby={errors.nombre ? 'error-nombre' : undefined}
              />
              {errors.nombre && <p className="campo-error" id="error-nombre">{errors.nombre}</p>}
            </div>
            <div className="campo">
              <label htmlFor="campo-correo">Correo electrónico</label>
              <input
                id="campo-correo" name="correo" type="email" autoComplete="email"
                value={values.correo} onChange={onChange('correo')}
                aria-invalid={Boolean(errors.correo)} aria-describedby={errors.correo ? 'error-correo' : undefined}
              />
              {errors.correo && <p className="campo-error" id="error-correo">{errors.correo}</p>}
            </div>
            <div className="campo">
              <label htmlFor="campo-propuesta">¿Qué quieres vender?</label>
              <textarea
                id="campo-propuesta" name="propuesta" rows="4"
                value={values.propuesta} onChange={onChange('propuesta')}
                aria-invalid={Boolean(errors.propuesta)} aria-describedby={errors.propuesta ? 'error-propuesta' : undefined}
              />
              {errors.propuesta && <p className="campo-error" id="error-propuesta">{errors.propuesta}</p>}
            </div>
            <button type="submit" className="boton">Quiero ser partner de Kreata</button>
          </form>
        )}
      </div>
    </section>
  );
}
