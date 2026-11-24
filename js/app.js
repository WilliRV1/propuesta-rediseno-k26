import { crearVisor, ARTE_ANCHO, ARTE_ALTO } from './visor.js';

// Mugs reales del catalogo de Kreata (nombre, tienda y precio tomados de kreatastore.com).
const MUGS = [
  { id: 'azulejo', nombre: 'Azulejo común', tienda: 'ARTERY', precio: 47000, arte: 'img/wrap-azulejo.jpg' },
  { id: 'bichofue', nombre: 'Bichofué', tienda: 'ARTERY', precio: 47000, arte: 'img/wrap-bichofue.jpg' },
  { id: 'salsita', nombre: 'Salsita', tienda: 'ARTERY', precio: 47000, arte: 'img/wrap-salsita.jpg' },
  { id: 'juancho', nombre: 'Juancho y Conchita', tienda: 'Kokomochi', precio: 47000, arte: 'img/wrap-juancho.jpg' },
  { id: 'cafeleche', nombre: 'Café pero con leche', tienda: 'Kokomochi', precio: 47000, arte: 'img/wrap-cafeleche.jpg' },
];
const PRODUCTOS = [
  { id: 'calena-afiche', nombre: 'Caleña, afiche', tienda: 'Kokomochi', precio: 'Desde $ 46.900', imagen: 'img/p-54170.jpg', alt: 'Afiche Caleña con una ilustración de Kokomochi' },
  { id: 'tangara-tote', nombre: 'Tangara multicolor, tote bag', tienda: 'ARTERY', precio: '$ 68.000', imagen: 'img/p-53867.jpg', alt: 'Tote bag con la lámina de la tangara multicolor' },
  { id: 'azulejo-camiseta', nombre: 'Azulejo, camiseta', tienda: 'ARTERY', precio: '$ 94.900', imagen: 'img/p-53766.jpg', alt: 'Camiseta negra con la lámina del azulejo común' },
  { id: 'cali-pachanguero', nombre: 'Cali pachanguero, camiseta', tienda: 'Kokomochi', precio: '$ 87.900', imagen: 'img/p-54272.jpg', alt: 'Camiseta blanca Cali pachanguero' },
  { id: 'catastrophic-camiseta', nombre: 'Catastrophic, camiseta', tienda: 'Kokomochi', precio: '$ 77.900', imagen: 'img/p-53651.jpg', alt: 'Camiseta negra Catastrophic con gatos ilustrados' },
  { id: 'pacifico-caribe-panueleta', nombre: 'Pacífico y Caribe, pañoleta', tienda: 'Kokomochi', precio: 'Desde $ 120.900', imagen: 'img/p-53133.jpg', alt: 'Pañoleta Pacífico y Caribe' },
];
const PRODUCTOS_DESTACADOS = ['calena-afiche', 'tangara-tote'];
const productosMostrados = new Set();
const pesos = (n) => '$ ' + n.toLocaleString('es-CO');
const $ = (s, raiz = document) => raiz.querySelector(s);

function renderizarProductos(ids, destino) {
  const productos = [];
  ids.forEach((id) => {
    const producto = PRODUCTOS.find((p) => p.id === id);
    if (!producto) throw new Error(`No existe el producto "${id}".`);
    if (productosMostrados.has(producto.id)) return;
    productosMostrados.add(producto.id);
    productos.push(producto);
  });
  $(destino).innerHTML = productos.map((producto) => `
    <li class="producto" data-producto="${producto.id}">
      <a href="#catalogo">
        <img src="${producto.imagen}" alt="${producto.alt}" width="800" height="800" loading="lazy">
        <h3>${producto.nombre}</h3>
      </a>
      <p class="producto-tienda">de ${producto.tienda}</p>
      <p class="producto-precio">${producto.precio}</p>
    </li>`).join('');
}

renderizarProductos(PRODUCTOS_DESTACADOS, '#productos-destacados');
renderizarProductos(PRODUCTOS.map((producto) => producto.id), '#productos-catalogo');

// ---------- Carrito (solo cuenta, la demo no procesa compras) ----------
let enCarrito = 0;
const contador = $('#carrito-cuenta');
const aviso = $('#aviso');
let avisoTemporizador;
function agregarAlCarrito(nombre) {
  enCarrito += 1;
  contador.textContent = enCarrito;
  $('#carrito').setAttribute('aria-label', `Carrito, ${enCarrito} ${enCarrito === 1 ? 'producto' : 'productos'}`);
  aviso.textContent = `${nombre} quedó en el carrito.`;
  aviso.dataset.visible = '1';
  clearTimeout(avisoTemporizador);
  avisoTemporizador = setTimeout(() => delete aviso.dataset.visible, 2600);
}
document.addEventListener('click', (e) => {
  const boton = e.target.closest('[data-agregar]');
  if (boton) agregarAlCarrito(boton.dataset.agregar);
});

// ---------- Visor del comprador ----------
const escenario = $('#escenario');
const visor = crearVisor(escenario);
const botonGiro = $('#giro');
let actual = MUGS[0];

function mostrar(mug, vuelta) {
  actual = mug;
  $('#mug-nombre').textContent = `Mug ${mug.nombre}`;
  $('#mug-tienda').textContent = mug.tienda;
  $('#mug-precio').textContent = pesos(mug.precio);
  $('#mug-agregar').dataset.agregar = `El mug ${mug.nombre}`;
  document.querySelectorAll('[data-mug]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mug === mug.id)));
  if (visor) {
    visor.lienzo.setAttribute('aria-label', `Mug ${mug.nombre} de ${mug.tienda} en 3D. Arrastra o usa las flechas para girarlo.`);
    visor.cargar(mug.arte, { vuelta }).catch(() => {});
  } else {
    $('#escenario-plano').src = mug.arte;
  }
}

const lista = $('#mugs');
lista.innerHTML = MUGS.map((m) => `
  <li><button type="button" class="muestra" data-mug="${m.id}" aria-pressed="false">
    <img src="${m.arte}" alt="" width="96" height="64" loading="lazy">
    <span class="muestra-nombre">${m.nombre}</span>
    <span class="muestra-tienda">${m.tienda}</span>
  </button></li>`).join('');
lista.addEventListener('click', (e) => {
  const b = e.target.closest('[data-mug]');
  if (b && b.dataset.mug !== actual.id) mostrar(MUGS.find((m) => m.id === b.dataset.mug), true);
});
mostrar(actual, false);

if (visor) {
  const pintarGiro = (g) => { botonGiro.textContent = g ? 'Pausar el giro' : 'Girar solo'; botonGiro.setAttribute('aria-pressed', String(g)); };
  pintarGiro(visor.girando);
  botonGiro.addEventListener('click', () => visor.alternarGiro());
  escenario.addEventListener('giro', (e) => pintarGiro(e.detail));
} else {
  botonGiro.hidden = true;
}

// ---------- Visor del creador: se arma cuando entra en pantalla ----------
const taller = $('#taller');
let visorCreador = null;
let arteSubido = false;
const botonGiroCreador = $('#taller-giro');

function pintarGiroCreador(girando) {
  botonGiroCreador.textContent = girando ? 'Pausar el giro' : 'Girar solo';
  botonGiroCreador.setAttribute('aria-pressed', String(girando));
}
botonGiroCreador.addEventListener('click', () => {
  if (visorCreador) pintarGiroCreador(visorCreador.alternarGiro());
});
taller.addEventListener('giro', (evento) => pintarGiroCreador(evento.detail));

function guiaDeArte() {
  const c = document.createElement('canvas');
  c.width = ARTE_ANCHO; c.height = ARTE_ALTO;
  const g = c.getContext('2d');
  g.fillStyle = '#fbfbf8'; g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = '#242424'; g.lineWidth = 5;
  const m = 70, l = 90;
  for (const [x, y, sx, sy] of [[m, m, 1, 1], [c.width - m, m, -1, 1], [m, c.height - m, 1, -1], [c.width - m, c.height - m, -1, -1]]) {
    g.beginPath(); g.moveTo(x, y + l * sy); g.lineTo(x, y); g.lineTo(x + l * sx, y); g.stroke();
  }
  ['#00aeef', '#ed1c24', '#fff200', '#14110f'].forEach((color, i) => { g.fillStyle = color; g.fillRect(c.width / 2 - 180 + i * 90, c.height - 190, 90, 60); });
  g.fillStyle = '#14110f'; g.textAlign = 'center';
  g.font = '700 118px Ubuntu, sans-serif'; g.fillText('Tu arte aquí', c.width / 2, c.height / 2 - 20);
  g.font = '400 62px Lato, sans-serif'; g.fillText('2539 × 1181 px', c.width / 2, c.height / 2 + 90);
  return c;
}

new IntersectionObserver((entradas, obs) => {
  if (!entradas.some((e) => e.isIntersecting)) return;
  obs.disconnect();
  visorCreador = crearVisor(taller, { giroAutomatico: false, inicio: 0 });
  if (!visorCreador) return;
  visorCreador.lienzo.setAttribute('aria-label', 'Mug en 3D para probar tu arte. Arrastra o usa las flechas para girarlo.');
  pintarGiroCreador(visorCreador.girando);
  visorCreador.usar(guiaDeArte(), { vuelta: false });
  document.fonts.load('700 118px Ubuntu').then(() => { if (!arteSubido) visorCreador.usar(guiaDeArte(), { vuelta: false }); });
}, { rootMargin: '300px' }).observe(taller);

const estadoArte = $('#arte-estado');
function recibirArchivo(archivo) {
  if (!archivo) return;
  if (!archivo.type.startsWith('image/')) { estadoArte.textContent = 'Ese archivo no es una imagen. Prueba con PNG o JPG.'; estadoArte.dataset.tipo = 'error'; return; }
  const url = URL.createObjectURL(archivo);
  const img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(url);
    arteSubido = true;
    visorCreador?.usar(img);
    estadoArte.textContent = `${archivo.name}: ${img.naturalWidth} × ${img.naturalHeight} px. Así se vería impreso.`;
    estadoArte.dataset.tipo = 'ok';
  };
  img.onerror = () => { estadoArte.textContent = 'No se pudo abrir la imagen. Prueba con otro archivo.'; estadoArte.dataset.tipo = 'error'; };
  img.src = url;
}
$('#arte-archivo').addEventListener('change', (e) => recibirArchivo(e.target.files[0]));
taller.addEventListener('dragover', (e) => { e.preventDefault(); taller.dataset.soltar = '1'; });
taller.addEventListener('dragleave', () => delete taller.dataset.soltar);
taller.addEventListener('drop', (e) => { e.preventDefault(); delete taller.dataset.soltar; recibirArchivo(e.dataTransfer.files[0]); });

function configurarPanelDesplegable(panel, boton, enlaces, textoCerrado, textoAbierto) {
  function actualizar(abierto) {
    panel.hidden = !abierto;
    boton.setAttribute('aria-expanded', String(abierto));
    boton.textContent = abierto ? textoAbierto : textoCerrado;
    enlaces.forEach((enlace) => enlace.setAttribute('aria-expanded', String(abierto)));
    if (abierto) {
      panel.scrollIntoView({ block: 'start' });
      panel.querySelector('input:not([type="hidden"])')?.focus({ preventScroll: true });
    }
  }
  boton.addEventListener('click', () => actualizar(panel.hidden));
  enlaces.forEach((enlace) => enlace.addEventListener('click', () => {
    if (panel.hidden) actualizar(true);
  }));
  if (window.location.hash === `#${panel.id}`) actualizar(true);
}

configurarPanelDesplegable(
  $('#postulacion'),
  $('#abrir-postulacion'),
  document.querySelectorAll('a[href="#postulacion"]'),
  'Abrir formulario de postulación',
  'Cerrar formulario'
);
configurarPanelDesplegable(
  $('#garantias'),
  $('#abrir-soporte'),
  document.querySelectorAll('a[href="#garantias"]'),
  'Ver garantías y soporte',
  'Cerrar detalles'
);

function configurarFormularioDemo(formulario, mensajeExito) {
  const estado = formulario.querySelector('[role="status"]');
  const camposTextoRequeridos = formulario.querySelectorAll('input[required][type="text"], textarea[required]');
  camposTextoRequeridos.forEach((campo) => campo.addEventListener('input', () => campo.setCustomValidity('')));
  formulario.addEventListener('input', () => {
    estado.textContent = '';
    delete estado.dataset.tipo;
  });
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    camposTextoRequeridos.forEach((campo) => {
      campo.setCustomValidity(campo.value.trim() ? '' : 'Completa este campo.');
    });
    if (!formulario.reportValidity()) return;
    const nombre = formulario.elements.namedItem('nombre').value.trim();
    estado.textContent = mensajeExito(nombre);
    estado.dataset.tipo = 'ok';
  });
}

configurarFormularioDemo(
  $('#postulacion'),
  (nombre) => `¡Gracias, ${nombre}! Tu postulación quedó lista en esta demo. No se envió ni se guardó información.`
);
configurarFormularioDemo(
  $('#solicitud-soporte'),
  (nombre) => `¡Gracias, ${nombre}! Tu consulta quedó lista en esta demo. No se envió ni se guardó información.`
);
