// Modelos 3D de cada producto, construidos en codigo (sin archivos externos).
// Cada constructor devuelve { group, artMaterial, prepare(img) -> canvas, lookAtY }.
// Unidades: 1 = 10 cm. El visor escala cada grupo para que quepa en el escenario.
import * as THREE from 'three';
import { ART_WIDTH, ART_HEIGHT } from './constants.js';

const PAPER = '#fbfbf8';
const CANVAS_CLOTH = '#e9e2d0'; // lona cruda del tote bag

/** Dibuja la imagen cubriendo todo el lienzo (recorta lo que sobre). */
function drawCover(g, img, x, y, w, h) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const s = Math.max(w / iw, h / ih);
  g.save();
  g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.drawImage(img, x + (w - iw * s) / 2, y + (h - ih * s) / 2, iw * s, ih * s);
  g.restore();
}

/** Dibuja la imagen completa dentro del rectangulo (sin recortar). */
function drawContain(g, img, x, y, w, h) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const s = Math.min(w / iw, h / ih);
  g.drawImage(img, x + (w - iw * s) / 2, y + (h - ih * s) / 2, iw * s, ih * s);
}

function makeCanvas(w, h, fill) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = fill;
  g.fillRect(0, 0, w, h);
  return [c, g];
}

/** Trama de tela para que la lona y la panoleta no se vean como plastico. */
function weaveTexture(repeat) {
  const [c, g] = makeCanvas(64, 64, '#808080');
  for (let i = 0; i < 64; i += 4) {
    g.fillStyle = i % 8 ? '#8e8e8e' : '#747474';
    g.fillRect(i, 0, 2, 64);
    g.fillRect(0, i, 64, 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  return t;
}

// ---------- Mug de 11 oz: 8 cm de diametro, 9 cm de alto ----------
function buildMug() {
  const RADIUS = 0.4;
  const HEIGHT = 0.9;
  const ARC = THREE.MathUtils.degToRad(300); // parte de la vuelta que cubre el arte
  const ceramic = new THREE.MeshPhysicalMaterial({ color: 0xfbfbf8, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 0.75 });
  const artMaterial = ceramic.clone();
  const group = new THREE.Group();
  const wall = 0.035;
  const profile = [
    [0, 0], [RADIUS - 0.03, 0], [RADIUS, 0.03], [RADIUS, HEIGHT - 0.012], [RADIUS - 0.012, HEIGHT],
    [RADIUS - wall, HEIGHT - 0.012], [RADIUS - wall, 0.07], [RADIUS - wall - 0.03, 0.045], [0, 0.045],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  group.add(new THREE.Mesh(new THREE.LatheGeometry(profile, 96), ceramic));

  const art = new THREE.Mesh(
    new THREE.CylinderGeometry(RADIUS + 0.0015, RADIUS + 0.0015, HEIGHT * 0.86, 96, 1, true, -ARC / 2, ARC),
    artMaterial
  );
  art.position.y = HEIGHT / 2;
  group.add(art);

  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.036, 20, 64, Math.PI), ceramic);
  handle.rotation.z = -Math.PI / 2;
  handle.scale.set(0.82, 1.3, 1);
  handle.position.set(RADIUS - 0.02, HEIGHT / 2, 0);
  const handlePivot = new THREE.Group();
  handlePivot.rotation.y = Math.PI / 2; // la deja opuesta al centro del arte
  handlePivot.add(handle);
  group.add(handlePivot);

  return {
    group, artMaterial, size: 0.9,
    prepare(img) {
      const [c, g] = makeCanvas(ART_WIDTH, ART_HEIGHT, PAPER);
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (w / h >= 1.6) drawCover(g, img, 0, 0, c.width, c.height);
      else drawContain(g, img, 0, 0, c.width, c.height);
      return c;
    },
  };
}

// ---------- Afiche de 30 x 40 cm con marco ----------
function buildPoster() {
  const W = 3.0, H = 4.0;
  const BAR = 0.16;   // ancho visible del marco
  const DEPTH = 0.14; // fondo del marco
  const group = new THREE.Group();
  const frame = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.55 });
  const back = new THREE.MeshStandardMaterial({ color: 0x9b7b56, roughness: 0.9 }); // tapa trasera de carton
  const artMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75 });

  const bars = [
    [W + BAR * 2, BAR, 0, H / 2 + BAR / 2], [W + BAR * 2, BAR, 0, -H / 2 - BAR / 2],
    [BAR, H, -W / 2 - BAR / 2, 0], [BAR, H, W / 2 + BAR / 2, 0],
  ];
  for (const [w, h, x, y] of bars) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(w, h, DEPTH), frame);
    bar.position.set(x, y, 0);
    group.add(bar);
  }
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(W, H), artMaterial);
  sheet.position.z = DEPTH / 2 - 0.035; // el papel queda un poco hundido, detras del borde del marco
  group.add(sheet);
  const board = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.03), back);
  board.position.z = -DEPTH / 2 + 0.02;
  group.add(board);

  // parado en el piso y recostado unos grados, como apoyado en una repisa
  group.position.y = H / 2 + BAR;
  const lean = new THREE.Group();
  lean.rotation.x = -0.07;
  lean.add(group);

  return {
    group: lean, artMaterial, size: 1.08,
    prepare(img) {
      const [c, g] = makeCanvas(1200, 1600, PAPER);
      drawCover(g, img, 0, 0, c.width, c.height);
      return c;
    },
  };
}

// ---------- Tote bag talla L: lona, 38 x 42 cm, impresion en el frente ----------
function buildTote() {
  const W = 3.8, H = 4.2;
  const SEG = 28;
  const group = new THREE.Group();
  const weave = weaveTexture(46);
  const cloth = new THREE.MeshStandardMaterial({ color: new THREE.Color(CANVAS_CLOTH), roughness: 0.96, bumpMap: weave, bumpScale: 0.6, side: THREE.DoubleSide });
  const artMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.96, bumpMap: weave, bumpScale: 0.6 });

  // dos caras abombadas que se juntan en los bordes: la bolsa se ve con algo adentro
  const bulge = (u, v) => 0.2 * Math.pow(Math.sin(Math.PI * u), 0.7) * Math.pow(Math.sin(Math.PI * (0.08 + v * 0.92)), 0.6);
  function face(sign, material) {
    const geo = new THREE.PlaneGeometry(W, H, SEG, SEG);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i) / W + 0.5;
      const v = pos.getY(i) / H + 0.5;
      pos.setZ(i, sign * (0.015 + bulge(u, v)));
    }
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, material);
    if (sign < 0) mesh.material = cloth;
    return mesh;
  }
  group.add(face(1, artMaterial), face(-1, cloth));

  // asas: dos tiras que suben desde el borde superior
  function strap(z) {
    const x = W * 0.2;
    const top = H / 2;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-x, top - 0.3, 0), new THREE.Vector3(-x, top + 0.7, 0),
      new THREE.Vector3(-x * 0.62, top + 1.5, 0), new THREE.Vector3(0, top + 1.78, 0),
      new THREE.Vector3(x * 0.62, top + 1.5, 0), new THREE.Vector3(x, top + 0.7, 0),
      new THREE.Vector3(x, top - 0.3, 0),
    ]);
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.15, 8, false), cloth);
    mesh.scale.z = 0.16; // tira plana de lona, no un tubo
    mesh.position.z = z;
    mesh.rotation.x = z > 0 ? 0.05 : -0.05; // las dos asas se abren un poco
    return mesh;
  }
  group.add(strap(0.06), strap(-0.06));
  group.position.y = H / 2;
  const holder = new THREE.Group();
  holder.add(group);

  return {
    group: holder, artMaterial, size: 1.12,
    prepare(img) {
      // la textura es la cara completa: lona cruda con el arte en la zona "Frente grande"
      const [c, g] = makeCanvas(1024, Math.round(1024 * H / W), CANVAS_CLOTH);
      const mx = c.width * 0.13;
      drawContain(g, img, mx, c.height * 0.16, c.width - mx * 2, c.height * 0.68);
      return c;
    },
  };
}

// ---------- Panoleta sublimada, cuadrada ----------
function buildScarf() {
  const S = 4.0;
  const SEG = 72;
  const geo = new THREE.PlaneGeometry(S, S, SEG, SEG);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) / S + 0.5;
    const v = pos.getY(i) / S + 0.5;
    // pliegues verticales que se abren hacia abajo, como tela colgada de dos puntas
    const fold = Math.sin(u * Math.PI * 6 + Math.sin(v * 3.1) * 1.1) * 0.24 * (1.1 - v * 0.85);
    const sag = -Math.sin(u * Math.PI) * 0.22 * v; // el borde de arriba cuelga entre las puntas
    pos.setZ(i, fold);
    pos.setY(i, pos.getY(i) + sag * S * 0.3);
  }
  geo.computeVertexNormals();
  const artMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.55, sheen: 1, sheenRoughness: 0.4, sheenColor: new THREE.Color(0xffffff),
    side: THREE.DoubleSide, bumpMap: weaveTexture(110), bumpScale: 0.15,
  });
  const mesh = new THREE.Mesh(geo, artMaterial);
  mesh.position.y = S / 2 + 0.1;
  const group = new THREE.Group();
  group.add(mesh);

  return {
    group, artMaterial, size: 1.02,
    prepare(img) {
      const [c, g] = makeCanvas(1400, 1400, PAPER);
      drawCover(g, img, 0, 0, c.width, c.height);
      return c;
    },
  };
}

const BUILDERS = { mug: buildMug, poster: buildPoster, tote: buildTote, scarf: buildScarf };
export const PRODUCT_TYPES = Object.keys(BUILDERS);

/** Construye el modelo y lo escala para que su alto en escena sea `size`. */
export function buildProduct(type) {
  const product = (BUILDERS[type] || buildMug)();
  const box = new THREE.Box3().setFromObject(product.group);
  const height = box.max.y - box.min.y;
  const scale = product.size / height;
  product.group.scale.setScalar(scale);
  product.group.position.y -= box.min.y * scale;
  product.lookAtY = product.size * 0.42;
  product.footprint = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) * scale;
  return product;
}

/** Libera geometrias, materiales y texturas del modelo. */
export function disposeProduct(product) {
  product.group.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.dispose();
    for (const m of [].concat(o.material)) {
      m.map?.dispose();
      m.bumpMap?.dispose();
      m.dispose();
    }
  });
}
