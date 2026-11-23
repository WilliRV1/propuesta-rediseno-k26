// Visor 3D del mug de 11 oz. El arte envolvente se aplica como textura sobre la pared exterior.
import * as THREE from 'three';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';

const R = 0.4;            // radio: 8 cm de diametro
const H = 0.9;            // alto: 9 cm
const ARCO = THREE.MathUtils.degToRad(300); // parte de la vuelta que cubre el arte
export const ARTE_ANCHO = 2048;
export const ARTE_ALTO = Math.round(2048 * 1181 / 2539); // proporcion del arte de Kreata: 2539 x 1181 px

const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
const suave = (t) => 1 - Math.pow(2, -10 * t); // desaceleracion exponencial

function sombraDePiso() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(128, 128, 20, 128, 128, 128);
  grad.addColorStop(0, 'rgba(20,17,15,.34)');
  grad.addColorStop(1, 'rgba(20,17,15,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const malla = new THREE.Mesh(
    new THREE.PlaneGeometry(1.7, 1.7),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })
  );
  malla.rotation.x = -Math.PI / 2;
  malla.position.y = 0.001;
  return malla;
}

function construirMug(materialCeramica, materialArte) {
  const mug = new THREE.Group();
  const g = 0.035; // grosor de la pared
  const perfil = [
    [0, 0], [R - 0.03, 0], [R, 0.03], [R, H - 0.012], [R - 0.012, H],
    [R - g, H - 0.012], [R - g, 0.07], [R - g - 0.03, 0.045], [0, 0.045],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  mug.add(new THREE.Mesh(new THREE.LatheGeometry(perfil, 96), materialCeramica));

  const arte = new THREE.Mesh(
    new THREE.CylinderGeometry(R + 0.0015, R + 0.0015, H * 0.86, 96, 1, true, -ARCO / 2, ARCO),
    materialArte
  );
  arte.position.y = H / 2;
  mug.add(arte);

  const asa = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.036, 20, 64, Math.PI), materialCeramica);
  asa.rotation.z = -Math.PI / 2;
  asa.scale.set(0.82, 1.3, 1);
  asa.position.set(R - 0.02, H / 2, 0);
  const pivoteAsa = new THREE.Group();
  pivoteAsa.rotation.y = Math.PI / 2; // la deja opuesta al centro del arte
  pivoteAsa.add(asa);
  mug.add(pivoteAsa);
  return mug;
}

/** Ajusta cualquier imagen a la proporcion del arte envolvente. */
export function lienzoDesdeImagen(img) {
  const c = document.createElement('canvas');
  c.width = ARTE_ANCHO;
  c.height = ARTE_ALTO;
  const g = c.getContext('2d');
  g.fillStyle = '#fbfbf8';
  g.fillRect(0, 0, c.width, c.height);
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const ancha = w / h >= 1.6;
  const escala = ancha ? Math.max(c.width / w, c.height / h) : c.height / h;
  g.drawImage(img, (c.width - w * escala) / 2, (c.height - h * escala) / 2, w * escala, h * escala);
  return c;
}

export function crearVisor(contenedor, { giroAutomatico = true, inicio = -0.6 } = {}) {
  const lienzo = document.createElement('canvas');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true });
  } catch {
    contenedor.dataset.estado = 'sin-3d';
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  contenedor.prepend(lienzo);

  const escena = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  escena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const luz = new THREE.DirectionalLight(0xffffff, 1.1);
  luz.position.set(1.5, 2.5, 2);
  escena.add(luz);

  const camara = new THREE.PerspectiveCamera(26, 1, 0.1, 20);
  camara.position.set(0, 1.3, 4.0);
  camara.lookAt(0, 0.4, 0);

  const ceramica = new THREE.MeshPhysicalMaterial({ color: 0xfbfbf8, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 0.75 });
  const materialArte = ceramica.clone();
  const mug = construirMug(ceramica, materialArte);
  const inclinacion = new THREE.Group();
  inclinacion.add(mug);
  escena.add(inclinacion, sombraDePiso());

  const INICIO = inicio;
  mug.rotation.y = INICIO;
  let velocidad = 0;
  let girando = giroAutomatico && !sinMovimiento;
  let arrastre = null;
  let animacion = null;
  let cuadro = 0;
  let previo = 0;

  function pintar() { renderer.render(escena, camara); }

  function bucle(ahora) {
    const dt = Math.min((ahora - previo) / 1000, 0.05);
    previo = ahora;
    let activo = false;
    if (animacion) {
      const t = Math.min((ahora - animacion.inicio) / animacion.duracion, 1);
      mug.rotation.y = animacion.desde + animacion.delta * suave(t);
      if (t >= 1) animacion = null;
      activo = true;
    } else if (!arrastre) {
      if (Math.abs(velocidad) > 0.01) { mug.rotation.y += velocidad * dt; velocidad *= Math.pow(0.04, dt); activo = true; }
      else if (girando) { mug.rotation.y += 0.32 * dt; activo = true; }
    } else activo = true;
    pintar();
    cuadro = activo ? requestAnimationFrame(bucle) : 0;
  }
  function despertar() {
    if (!cuadro) { previo = performance.now(); cuadro = requestAnimationFrame(bucle); }
  }

  function medir() {
    const { width, height } = contenedor.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camara.aspect = width / height;
    // en pantallas angostas la camara se aleja para que el asa no se corte
    camara.position.z = camara.aspect < 0.9 ? 4.0 / Math.max(camara.aspect, 0.55) * 0.9 : 4.0;
    camara.lookAt(0, 0.4, 0);
    camara.updateProjectionMatrix();
    pintar();
  }
  new ResizeObserver(medir).observe(contenedor);

  function alCambiarGiro() {
    contenedor.dispatchEvent(new CustomEvent('giro', { detail: girando }));
  }

  lienzo.addEventListener('pointerdown', (e) => {
    lienzo.setPointerCapture(e.pointerId);
    arrastre = { x: e.clientX, y: e.clientY, t: performance.now() };
    animacion = null;
    velocidad = 0;
    if (girando) { girando = false; alCambiarGiro(); }
    contenedor.dataset.arrastrando = '1';
    despertar();
  });
  lienzo.addEventListener('pointermove', (e) => {
    if (!arrastre) return;
    const ahora = performance.now();
    const dx = e.clientX - arrastre.x;
    const dy = e.clientY - arrastre.y;
    mug.rotation.y += dx * 0.011;
    inclinacion.rotation.x = THREE.MathUtils.clamp(inclinacion.rotation.x + dy * 0.004, -0.12, 0.5);
    velocidad = (dx * 0.011) / Math.max((ahora - arrastre.t) / 1000, 0.008);
    arrastre = { x: e.clientX, y: e.clientY, t: ahora };
  });
  const soltar = () => { arrastre = null; delete contenedor.dataset.arrastrando; };
  lienzo.addEventListener('pointerup', soltar);
  lienzo.addEventListener('pointercancel', soltar);

  lienzo.tabIndex = 0;
  lienzo.setAttribute('role', 'img');
  lienzo.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    if (girando) { girando = false; alCambiarGiro(); }
    mug.rotation.y += e.key === 'ArrowLeft' ? -0.3 : 0.3;
    despertar();
  });

  function aplicar(textura, conVuelta) {
    textura.colorSpace = THREE.SRGBColorSpace;
    textura.anisotropy = renderer.capabilities.getMaxAnisotropy();
    materialArte.map?.dispose();
    materialArte.map = textura;
    materialArte.needsUpdate = true;
    contenedor.dataset.estado = 'listo';
    if (conVuelta && !sinMovimiento) {
      // una vuelta completa que termina mostrando el centro del arte
      const base = Math.round((mug.rotation.y - INICIO) / (Math.PI * 2)) * Math.PI * 2 + INICIO;
      animacion = { inicio: performance.now(), duracion: 1100, desde: mug.rotation.y, delta: base + Math.PI * 2 - mug.rotation.y };
    }
    despertar();
  }

  medir();
  return {
    lienzo,
    /** Carga un arte desde una URL. */
    cargar(url, { vuelta = true } = {}) {
      return new Promise((ok, falla) => {
        new THREE.TextureLoader().load(url, (t) => { aplicar(t, vuelta); ok(); }, undefined, () => { contenedor.dataset.estado = 'error'; falla(); });
      });
    },
    /** Usa una imagen o un canvas ya cargado. */
    usar(fuente, { vuelta = true } = {}) {
      const c = fuente instanceof HTMLCanvasElement ? fuente : lienzoDesdeImagen(fuente);
      aplicar(new THREE.CanvasTexture(c), vuelta);
    },
    alternarGiro() { girando = !girando; alCambiarGiro(); despertar(); return girando; },
    get girando() { return girando; },
  };
}
