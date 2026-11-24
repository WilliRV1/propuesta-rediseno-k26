import { ART_WIDTH, ART_HEIGHT } from './three/constants.js';

/** Guía procedural de registro con las tintas del logo, para cuando aún no hay arte subido. */
export function artGuideCanvas() {
  const c = document.createElement('canvas');
  c.width = ART_WIDTH; c.height = ART_HEIGHT;
  const g = c.getContext('2d');
  g.fillStyle = '#fbfbf8'; g.fillRect(0, 0, c.width, c.height);
  // marcas de corte y registro, como en una hoja de prueba de imprenta
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
