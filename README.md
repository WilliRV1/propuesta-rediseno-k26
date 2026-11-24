# Propuesta de rediseño con visor 3D

Demo de una portada de tienda con un mug en 3D que se gira y recibe cualquier diseño como textura. React + Vite.

## Desarrollo

Requiere Node 18 o superior.

```
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto http://localhost:5173).

## Build de producción

```
npm run build
npm run preview
```

`npm run build` genera `dist/`, que es lo que publica Vercel (ver `vercel.json`).

## Tests end-to-end

```
npx playwright install chromium   # solo la primera vez
npm run test:e2e
```

Los tests viven en `tests/e2e/`.

## Estructura

- `index.html`, `src/main.jsx`, `src/App.jsx`: entrada de la página.
- `src/components/`: cabecera, hero con el visor del comprador, catálogo, tiendas, taller del creador, datos de entrega, pie, aviso del carrito.
- `src/lib/three/viewer.js`: el visor 3D (Three.js, vía `npm`). El arte se aplica sobre la pared del mug.
- `src/hooks/useViewer.js`: envuelve el visor como un hook de React.
- `src/context/CartContext.jsx`: contador del carrito y aviso, compartidos entre la cabecera y las fichas de producto.
- `src/data/`: catálogo y mugs de muestra.
- `public/img/`, `public/fonts/`: imágenes (Lato y Ubuntu, licencias OFL y Ubuntu Font Licence).
- `DESIGN.md`: sistema de diseño propuesto para el rediseño.

## Aviso

Es una propuesta, no un sitio oficial. El logo, los nombres y las ilustraciones de `public/img/` pertenecen a sus dueños y se incluyen solo para mostrar la propuesta; no están cubiertos por ninguna licencia de este repositorio.
