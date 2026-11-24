import { useState } from 'react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AccountPage() {
  const [modo, setModo] = useState('entrar'); // 'entrar' | 'recuperar'
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [correoRecuperar, setCorreoRecuperar] = useState('');
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState('');

  function onEntrar(e) {
    e.preventDefault();
    const next = {};
    if (!usuario.trim()) next.usuario = 'Escribe tu usuario o correo.';
    if (!clave) next.clave = 'Escribe tu contraseña.';
    setErrores(next);
    if (Object.keys(next).length > 0) {
      document.getElementById(`campo-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setAviso('Esta es una maqueta: el inicio de sesión real llega con el backend de identidad.');
  }

  function onRecuperar(e) {
    e.preventDefault();
    if (!EMAIL_RE.test(correoRecuperar)) {
      setErrores({ correoRecuperar: 'Escribe un correo válido.' });
      document.getElementById('campo-correoRecuperar')?.focus();
      return;
    }
    setErrores({});
    setAviso(`Si ${correoRecuperar} tiene una cuenta, enviaremos instrucciones para recuperarla (maqueta, no se envía nada todavía).`);
  }

  return (
    <section className="cuenta" aria-labelledby="titulo-cuenta">
      <h1 id="titulo-cuenta">Mi cuenta</h1>

      <div className="cuenta-paneles">
        <div className="cuenta-panel">
          {modo === 'entrar' ? (
            <form onSubmit={onEntrar} noValidate>
              <h2>Entrar</h2>
              <div className="campo">
                <label htmlFor="campo-usuario">Usuario o correo electrónico</label>
                <input
                  id="campo-usuario" type="text" autoComplete="username"
                  value={usuario} onChange={(e) => setUsuario(e.target.value)}
                  aria-invalid={Boolean(errores.usuario)} aria-describedby={errores.usuario ? 'error-usuario' : undefined}
                />
                {errores.usuario && <p className="campo-error" id="error-usuario">{errores.usuario}</p>}
              </div>
              <div className="campo">
                <label htmlFor="campo-clave">Contraseña</label>
                <div className="campo-clave">
                  <input
                    id="campo-clave" type={verClave ? 'text' : 'password'} autoComplete="current-password"
                    value={clave} onChange={(e) => setClave(e.target.value)}
                    aria-invalid={Boolean(errores.clave)} aria-describedby={errores.clave ? 'error-clave' : undefined}
                  />
                  <button type="button" onClick={() => setVerClave((v) => !v)} aria-label={verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                    {verClave ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                {errores.clave && <p className="campo-error" id="error-clave">{errores.clave}</p>}
              </div>
              <button type="submit" className="boton">Entrar</button>
              <button type="button" className="boton-texto" onClick={() => { setModo('recuperar'); setErrores({}); setAviso(''); }}>
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          ) : (
            <form onSubmit={onRecuperar} noValidate>
              <h2>Recuperar contraseña</h2>
              <p>Escribe tu correo y te contaremos cómo recuperarla.</p>
              <div className="campo">
                <label htmlFor="campo-correoRecuperar">Correo electrónico</label>
                <input
                  id="campo-correoRecuperar" type="email" autoComplete="email"
                  value={correoRecuperar} onChange={(e) => setCorreoRecuperar(e.target.value)}
                  aria-invalid={Boolean(errores.correoRecuperar)} aria-describedby={errores.correoRecuperar ? 'error-correoRecuperar' : undefined}
                />
                {errores.correoRecuperar && <p className="campo-error" id="error-correoRecuperar">{errores.correoRecuperar}</p>}
              </div>
              <button type="submit" className="boton">Enviar instrucciones</button>
              <button type="button" className="boton-texto" onClick={() => { setModo('entrar'); setErrores({}); setAviso(''); }}>
                Volver a entrar
              </button>
            </form>
          )}
          {aviso && <p className="cuenta-aviso" role="status">{aviso}</p>}
        </div>

        <div className="cuenta-panel cuenta-panel-registro">
          <h2>Registrarse</h2>
          <p>Al registrarte podrás consultar fácilmente el estado y el historial de tus pedidos.</p>
          <p className="politica-aviso">El registro real llega con el backend de identidad (EPIC-01).</p>
        </div>
      </div>
    </section>
  );
}
