// Servidor estatico minimo para abrir la demo: node server.mjs  ->  http://localhost:4173
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.dirname(fileURLToPath(import.meta.url));
const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const puerto = process.env.PORT || 4173;

http.createServer((req, res) => {
  let ruta;
  try { ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname); }
  catch { res.writeHead(400); res.end('Solicitud no valida'); return; }
  if (ruta.endsWith('/')) ruta += 'index.html';
  const archivo = path.resolve(raiz, '.' + ruta);
  const relativa = path.relative(raiz, archivo);
  // solo archivos dentro de la carpeta, y nada que empiece por punto (.git, .vercel)
  const fuera = relativa.startsWith('..') || path.isAbsolute(relativa) || relativa.split(path.sep).some((p) => p.startsWith('.'));
  if (fuera || !fs.existsSync(archivo) || fs.statSync(archivo).isDirectory()) { res.writeHead(404); res.end('No encontrado'); return; }
  res.writeHead(200, { 'Content-Type': tipos[path.extname(archivo)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(archivo).pipe(res);
}).listen(puerto, '127.0.0.1', () => console.log(`Demo en http://localhost:${puerto}`));
