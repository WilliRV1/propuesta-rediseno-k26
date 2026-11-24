# Propuesta de rediseño con visor 3D

Demo de una portada de tienda con un mug en 3D que se gira y recibe cualquier diseño como textura. Los formularios de postulación y soporte validan los campos y muestran una confirmación local; no envían ni guardan datos.

## Abrirla

Requiere Node 18 o superior.

```
node server.mjs
```

Luego abrir http://localhost:4173. En Windows también sirve el doble clic en `abrir-demo.bat`.

## Estructura

- `index.html`, `css/estilos.css`: la página.
- `js/visor.js`: el visor 3D (Three.js). El arte se aplica sobre la pared del mug.
- `js/app.js`: cambio de diseño, subida de arte y contador del carrito.
- `vendor/`: Three.js 0.160.0 (licencia MIT).
- `fonts/`: Lato y Ubuntu (licencias OFL y Ubuntu Font Licence).

## Aviso

Es una propuesta, no un sitio oficial. El logo, los nombres y las ilustraciones de `img/` pertenecen a sus dueños y se incluyen solo para mostrar la propuesta; no están cubiertos por ninguna licencia de este repositorio.
