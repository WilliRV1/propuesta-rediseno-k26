// Catalogo estatico de la portada (8 piezas de muestra). category/collection normalizados
// por decision 5 del equipo (sin duplicar mayuscula/plural, sin mezclar ingles/espanol).
// sizes solo en ropa (camisetas) -- regla clave de EPIC-03: la talla no aplica a mugs/afiches/bolsos/panoletas.
// addedAt: fecha de alta (mock) para el orden "Novedades". available: false = "Agotado".
export const SIZES = ['S', 'M', 'L', 'XL'];

export const CATALOG = [
  { id: 'p-53766', title: 'Azulejo, camiseta', collection: 'Azulejo', category: 'camisetas', store: 'ARTERY', price: 94900, sizes: SIZES, available: true, addedAt: '2026-09-02', image: '/img/p-53766.jpg', alt: 'Camiseta negra con la lámina del azulejo común' },
  { id: 'p-54170', title: 'Caleña, afiche', collection: 'Caleña', category: 'afiches', store: 'Kokomochi', priceFrom: 46900, available: true, addedAt: '2026-11-10', image: '/img/p-54170.jpg', alt: 'Afiche Caleña con una ilustración de Kokomochi' },
  { id: 'p-53867', title: 'Tangara multicolor, tote bag', collection: 'Tangara multicolor', category: 'bolsos', store: 'ARTERY', price: 68000, available: true, addedAt: '2026-10-05', image: '/img/p-53867.jpg', alt: 'Tote bag con la lámina de la tangara multicolor' },
  { id: 'p-54272', title: 'Cali pachanguero, camiseta', collection: 'Cali pachanguero', category: 'camisetas', store: 'Kokomochi', price: 87900, sizes: SIZES, available: true, addedAt: '2026-11-18', image: '/img/p-54272.jpg', alt: 'Camiseta blanca Cali pachanguero' },
  { id: 'p-54118', title: 'Azulejo, pañoleta', collection: 'Azulejo', category: 'panoletas', store: 'ARTERY', priceFrom: 120900, available: false, addedAt: '2026-08-20', image: '/img/p-54118.jpg', alt: 'Pañoleta con la lámina del azulejo común' },
  { id: 'p-53651', title: 'Catastrophic, camiseta', collection: 'Catastrophic', category: 'camisetas', store: 'Kokomochi', price: 77900, sizes: SIZES, available: true, addedAt: '2026-07-14', image: '/img/p-53651.jpg', alt: 'Camiseta negra Catastrophic con gatos ilustrados' },
  { id: 'p-53133', title: 'Pacífico y Caribe, pañoleta', collection: 'Pacífico y Caribe', category: 'panoletas', store: 'Kokomochi', priceFrom: 120900, available: true, addedAt: '2026-09-28', image: '/img/p-53133.jpg', alt: 'Pañoleta Pacífico y Caribe' },
  { id: 'p-53171', title: 'Caleña, tote bag', collection: 'Caleña', category: 'bolsos', store: 'Kokomochi', price: 68000, available: true, addedAt: '2026-11-21', image: '/img/p-53171.jpg', alt: 'Tote bag Caleña' },
];
