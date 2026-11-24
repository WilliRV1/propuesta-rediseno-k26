// Visor 3D de producto. El arte se aplica como textura sobre el modelo (mug, afiche, tote bag o panoleta).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ART_WIDTH, ART_HEIGHT } from './constants.js';
import { buildProduct, disposeProduct } from './products.js';

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
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.001;
  return mesh;
}

/** Ajusta cualquier imagen a la proporcion del arte envolvente del mug. */
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

export function createViewer(container, { autoSpin = true, start = -0.6, product: initialProduct = 'mug' } = {}) {
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
  const CAMERA_Z = 4.0;

  // `turntable` gira sobre Y; `tilt` se inclina con el arrastre vertical
  const turntable = new THREE.Group();
  const tilt = new THREE.Group();
  tilt.add(turntable);
  const shadow = floorShadow();
  scene.add(tilt, shadow);

  let product = null;
  let productType = null;
  let disposed = false;

  const START = start;
  turntable.rotation.y = START;
  let velocity = 0;
  let spinning = autoSpin && !prefersReducedMotion;
  let drag = null;
  let animation = null;
  let frame = 0;
  let previous = 0;

  function paint() { if (!disposed) renderer.render(scene, camera); }

  function loop(now) {
    if (disposed) return;
    const dt = Math.min((now - previous) / 1000, 0.05);
    previous = now;
    let active = false;
    if (animation) {
      const t = Math.min((now - animation.start) / animation.duration, 1);
      turntable.rotation.y = animation.from + animation.delta * easeOut(t);
      if (t >= 1) animation = null;
      active = true;
    } else if (!drag) {
      if (Math.abs(velocity) > 0.01) { turntable.rotation.y += velocity * dt; velocity *= Math.pow(0.04, dt); active = true; }
      else if (spinning) { turntable.rotation.y += 0.32 * dt; active = true; }
    } else active = true;
    paint();
    frame = active ? requestAnimationFrame(loop) : 0;
  }
  function wake() {
    if (!frame && !disposed) { previous = performance.now(); frame = requestAnimationFrame(loop); }
  }

  function frameCamera() {
    const lookAtY = product ? product.lookAtY : 0.4;
    // en pantallas angostas la camara se aleja para que el producto no se corte
    camera.position.set(0, lookAtY + 0.9, camera.aspect < 0.9 ? CAMERA_Z / Math.max(camera.aspect, 0.55) * 0.9 : CAMERA_Z);
    camera.lookAt(0, lookAtY, 0);
    camera.updateProjectionMatrix();
  }

  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    frameCamera();
    paint();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

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
    turntable.rotation.y += dx * 0.011;
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
    turntable.rotation.y += e.key === 'ArrowLeft' ? -0.3 : 0.3;
    wake();
  });

  /** Cambia el modelo. Conserva el giro; el arte se carga despues con load() o useImage(). */
  function setProduct(type) {
    if (type === productType) return;
    if (product) { turntable.remove(product.group); disposeProduct(product); }
    product = buildProduct(type);
    productType = type;
    turntable.add(product.group);
    const s = Math.max(product.footprint * 1.9, 0.9);
    shadow.scale.set(s, s, 1);
    frameCamera();
    wake();
  }

  function apply(texture, withSpin) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const material = product.artMaterial;
    material.map?.dispose();
    material.map = texture;
    material.needsUpdate = true;
    container.dataset.estado = 'listo';
    if (withSpin && !prefersReducedMotion) {
      // una vuelta completa que termina mostrando el frente del producto
      const base = Math.round((turntable.rotation.y - START) / (Math.PI * 2)) * Math.PI * 2 + START;
      animation = { start: performance.now(), duration: 1100, from: turntable.rotation.y, delta: base + Math.PI * 2 - turntable.rotation.y };
    }
    wake();
  }

  setProduct(initialProduct);
  resize();
  return {
    canvas,
    setProduct,
    get product() { return productType; },
    /** Carga un arte desde una URL y lo ajusta a la zona de impresion del producto actual. */
    load(url, { spin = true } = {}) {
      const target = productType;
      return new Promise((ok, fail) => {
        const img = new Image();
        img.onload = () => {
          // si entre tanto cambiaron de producto o de arte, este ya no aplica
          if (disposed || target !== productType) { ok(); return; }
          apply(new THREE.CanvasTexture(product.prepare(img)), spin);
          ok();
        };
        img.onerror = () => { container.dataset.estado = 'error'; fail(); };
        img.src = url;
      });
    },
    /** Usa una imagen o un canvas ya cargado. Un canvas se toma tal cual (ya viene en la proporcion del producto). */
    useImage(source, { spin = true } = {}) {
      const c = source instanceof HTMLCanvasElement ? source : product.prepare(source);
      apply(new THREE.CanvasTexture(c), spin);
    },
    toggleSpin() { spinning = !spinning; onSpinChange(); wake(); return spinning; },
    get spinning() { return spinning; },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      container.dispatchEvent = () => {};
      if (product) disposeProduct(product);
      pmrem.dispose();
      canvas.remove();
      renderer.dispose();
    },
  };
}
