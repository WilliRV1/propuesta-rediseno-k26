// Productos que se pueden girar en 3D en la portada. Nombres, tiendas y precios tomados de kreatastore.com.
// `type` es el modelo que arma src/lib/three/products.js.
import { MUGS } from './mugs.js';

export const PRODUCTS_3D = [
  {
    type: 'mug',
    label: 'Mug',
    plural: 'mugs',
    detail: 'Cerámica de 11 oz con impresión en los 360°.',
    addLabel: 'Agregar este mug al carrito',
    cartName: (d) => `El mug ${d.name}`,
    designs: MUGS,
  },
  {
    type: 'poster',
    label: 'Afiche',
    plural: 'afiches',
    detail: 'Afiche de 30 × 40 cm. Con marco negro o blanco, $ 49.000 más.',
    addLabel: 'Agregar este afiche al carrito',
    cartName: (d) => `El afiche ${d.name}`,
    designs: [
      { id: 'afiche-calena', name: 'Caleña', store: 'Kokomochi', priceFrom: 46900, art: '/img/afiche-calena.jpg' },
      { id: 'afiche-toys', name: 'Toys', store: 'Kokomochi', priceFrom: 46900, art: '/img/afiche-toys.jpg' },
      { id: 'afiche-happy', name: 'Happy', store: 'Kokomochi', priceFrom: 46900, art: '/img/afiche-happy.jpg' },
    ],
  },
  {
    type: 'tote',
    label: 'Tote bag',
    plural: 'tote bags',
    detail: 'Tote bag talla L, con impresión en el frente.',
    addLabel: 'Agregar este tote bag al carrito',
    cartName: (d) => `El tote bag ${d.name}`,
    designs: [
      { id: 'tote-tangara', name: 'Tangara multicolor', store: 'ARTERY', price: 68000, art: '/img/tote-tangara.jpg' },
      { id: 'tote-azulejo', name: 'Azulejo', store: 'ARTERY', price: 68000, art: '/img/tote-azulejo.jpg' },
      { id: 'tote-calena', name: 'Caleña', store: 'Kokomochi', price: 68000, art: '/img/tote-calena.jpg' },
      { id: 'tote-loveyourself', name: 'Love Yourself', store: 'Kokomochi', price: 68000, art: '/img/tote-loveyourself.jpg' },
    ],
  },
  {
    type: 'scarf',
    label: 'Pañoleta',
    plural: 'pañoletas',
    detail: 'Pañoleta sublimada, en 55, 70 o 90 cm de lado.',
    addLabel: 'Agregar esta pañoleta al carrito',
    cartName: (d) => `La pañoleta ${d.name}`,
    designs: [
      { id: 'panoleta-azulejo', name: 'Azulejo', store: 'ARTERY', priceFrom: 120900, art: '/img/panoleta-azulejo.jpg' },
      { id: 'panoleta-pacifico', name: 'Pacífico y Caribe', store: 'Kokomochi', priceFrom: 120900, art: '/img/panoleta-pacifico.jpg' },
      { id: 'panoleta-happykoko', name: 'Happy Koko', store: 'Kokomochi', priceFrom: 120900, art: '/img/panoleta-happykoko.jpg' },
    ],
  },
];
