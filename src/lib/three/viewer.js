// Visor 3D del mug de 11 oz. El arte envolvente se aplica como textura sobre la pared exterior.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ART_WIDTH, ART_HEIGHT } from './constants.js';

const RADIUS = 0.4; // radio: 8 cm de diametro
const HEIGHT = 0.9; // alto: 9 cm
const ARC = THREE.MathUtils.degToRad(300); // parte de la vuelta que cubre el arte
export { ART_WIDTH, ART_HEIGHT };

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeOut = (t) => 1 - Math.pow(2, -10 * t); // desaceleracion exponencial

function floorShadow() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(128, 128, 20, 128, 128, 128);
  grad.addColorStop(0, 'rgba(20,17,15,.34)');
  grad.addColorStop(1, 'rgba(20,17,15,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.7, 1.7),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.001;
  return mesh;
}

function buildMug(ceramicMaterial, artMaterial) {
  const mug = new THREE.Group();
  const wall = 0.035; // grosor de la pared
  const profile = [
    [0, 0], [RADIUS - 0.03, 0], [RADIUS, 0.03], [RADIUS, HEIGHT - 0.012], [RADIUS - 0.012, HEIGHT],
    [RADIUS - wall, HEIGHT - 0.012], [RADIUS - wall, 0.07], [RADIUS - wall - 0.03, 0.045], [0, 0.045],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  mug.add(new THREE.Mesh(new THREE.LatheGeometry(profile, 96), ceramicMaterial));

  const art = new THREE.Mesh(
    new THREE.CylinderGeometry(RADIUS + 0.0015, RADIUS + 0.0015, HEIGHT * 0.86, 96, 1, true, -ARC / 2, ARC),
    artMaterial
  );
  art.position.y = HEIGHT / 2;
  mug.add(art);

  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.036, 20, 64, Math.PI), ceramicMaterial);
  handle.rotation.z = -Math.PI / 2;
  handle.scale.set(0.82, 1.3, 1);
  handle.position.set(RADIUS - 0.02, HEIGHT / 2, 0);
  const handlePivot = new THREE.Group();
  handlePivot.rotation.y = Math.PI / 2; // la deja opuesta al centro del arte
  handlePivot.add(handle);
  mug.add(handlePivot);
  return mug;
}

/** Ajusta cualquier imagen a la proporcion del arte envolvente. */
export function canvasFromImage(img) {
  const c = document.createElement('canvas');
  c.width = ART_WIDTH;
  c.height = ART_HEIGHT;
  const g = c.getContext('2d');
  g.fillStyle = '#fbfbf8';
  g.fillRect(0, 0, c.width, c.height);
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const wide = w / h >= 1.6;
  const scale = wide ? Math.max(c.width / w, c.height / h) : c.height / h;
  g.drawImage(img, (c.width - w * scale) / 2, (c.height - h * scale) / 2, w * scale, h * scale);
  return c;
}

export function createViewer(container, { autoSpin = true, start = -0.6 } = {}) {
  const canvas = document.createElement('canvas');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    container.dataset.estado = 'sin-3d';
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.prepend(canvas);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const light = new THREE.DirectionalLight(0xffffff, 1.1);
  light.position.set(1.5, 2.5, 2);
  scene.add(light);

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 20);
  camera.position.set(0, 1.3, 4.0);
  camera.lookAt(0, 0.4, 0);

  const ceramic = new THREE.MeshPhysicalMaterial({ color: 0xfbfbf8, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 0.75 });
  const artMaterial = ceramic.clone();
  const mug = buildMug(ceramic, artMaterial);
  const tilt = new THREE.Group();
  tilt.add(mug);
  scene.add(tilt, floorShadow());

  const START = start;
  mug.rotation.y = START;
  let velocity = 0;
  let spinning = autoSpin && !prefersReducedMotion;
  let drag = null;
  let animation = null;
  let frame = 0;
  let previous = 0;

  function paint() { renderer.render(scene, camera); }

  function loop(now) {
    const dt = Math.min((now - previous) / 1000, 0.05);
    previous = now;
    let active = false;
    if (animation) {
      const t = Math.min((now - animation.start) / animation.duration, 1);
      mug.rotation.y = animation.from + animation.delta * easeOut(t);
      if (t >= 1) animation = null;
      active = true;
    } else if (!drag) {
      if (Math.abs(velocity) > 0.01) { mug.rotation.y += velocity * dt; velocity *= Math.pow(0.04, dt); active = true; }
      else if (spinning) { mug.rotation.y += 0.32 * dt; active = true; }
    } else active = true;
    paint();
    frame = active ? requestAnimationFrame(loop) : 0;
  }
  function wake() {
    if (!frame) { previous = performance.now(); frame = requestAnimationFrame(loop); }
  }

  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // en pantallas angostas la camara se aleja para que el asa no se corte
    camera.position.z = camera.aspect < 0.9 ? 4.0 / Math.max(camera.aspect, 0.55) * 0.9 : 4.0;
    camera.lookAt(0, 0.4, 0);
    camera.updateProjectionMatrix();
    paint();
  }
  new ResizeObserver(resize).observe(container);

  function onSpinChange() {
    container.dispatchEvent(new CustomEvent('spin', { detail: spinning }));
  }

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    drag = { x: e.clientX, y: e.clientY, t: performance.now() };
    animation = null;
    velocity = 0;
    if (spinning) { spinning = false; onSpinChange(); }
    container.dataset.arrastrando = '1';
    wake();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const now = performance.now();
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    mug.rotation.y += dx * 0.011;
    tilt.rotation.x = THREE.MathUtils.clamp(tilt.rotation.x + dy * 0.004, -0.12, 0.5);
    velocity = (dx * 0.011) / Math.max((now - drag.t) / 1000, 0.008);
    drag = { x: e.clientX, y: e.clientY, t: now };
  });
  const release = () => { drag = null; delete container.dataset.arrastrando; };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    if (spinning) { spinning = false; onSpinChange(); }
    mug.rotation.y += e.key === 'ArrowLeft' ? -0.3 : 0.3;
    wake();
  });

  function apply(texture, withSpin) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    artMaterial.map?.dispose();
    artMaterial.map = texture;
    artMaterial.needsUpdate = true;
    container.dataset.estado = 'listo';
    if (withSpin && !prefersReducedMotion) {
      // una vuelta completa que termina mostrando el centro del arte
      const base = Math.round((mug.rotation.y - START) / (Math.PI * 2)) * Math.PI * 2 + START;
      animation = { start: performance.now(), duration: 1100, from: mug.rotation.y, delta: base + Math.PI * 2 - mug.rotation.y };
    }
    wake();
  }

  resize();
  return {
    canvas,
    /** Carga un arte desde una URL. */
    load(url, { spin = true } = {}) {
      return new Promise((ok, fail) => {
        new THREE.TextureLoader().load(url, (t) => { apply(t, spin); ok(); }, undefined, () => { container.dataset.estado = 'error'; fail(); });
      });
    },
    /** Usa una imagen o un canvas ya cargado. */
    useImage(source, { spin = true } = {}) {
      const c = source instanceof HTMLCanvasElement ? source : canvasFromImage(source);
      apply(new THREE.CanvasTexture(c), spin);
    },
    toggleSpin() { spinning = !spinning; onSpinChange(); wake(); return spinning; },
    get spinning() { return spinning; },
    dispose() {
      container.dispatchEvent = () => {};
      canvas.remove();
      renderer.dispose();
    },
  };
}
