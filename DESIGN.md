# DESIGN.md — KREATA (propuesta, Fase 1)

Sistema de diseño para la demo navegable de rediseño de kreatastore.com. Construido con el vocabulario real de `design-taste-frontend` 2.5.1 (no existen los diales `variación/movimiento/densidad` ni una plantilla `DESIGN.md` en la skill instalada — ver nota al final). Pendiente de tu aprobación antes de Tarea 0.

## 1. Kind & deal

- **Kind:** `product`. **Site-kind:** `other` (marketplace de bienes físicos, no software/gaming/tech).
- Consecuencia directa de la regla de la skill (`SKILL.md` regla 8): **sin efectos de shader, fondos CSS decorativos, grain, gradientes ni "big scenes"** en ningún punto del sitio. Esas herramientas quedan reservadas a sitios de software/gaming/tech y KREATA no lo es.
- **Excepción explícita que sí aplica:** un producto cuyo brief pide 3D cuenta como "su propia imagen", no como un efecto (`references/effects-objects.md`). Los visores 3D de mug/camiseta/hoodie/pañoleta/afiche/tote bag entran por esta puerta: lideran el hero de producto, aparecen completos en como máximo dos secciones más, cada una con una vista distinta, en stills por defecto y en vivo (rotable) solo cuando el usuario lo pide — nunca sobre un fondo con shader, grano o moment detrás.
- El "deal" fino (variante exacta de hero, pairing tipográfico, qué 2 moments caen) se resuelve en el momento de construir cada pantalla con `start.mjs deal` / `moments.mjs pick`, no se fija aquí de antemano — así lo pide el propio mecanismo de la skill.

## 2. Paleta — con la jerarquía que hoy falta

Fuente: `img/kreata-logo.png` (negro + 3 gotas de tinta: cian, rojo, amarillo) + `theme-color` real del sitio en producción (`#e8501a`, confirmado en el HTML servido). El repo local ya trae un sistema de tokens (`css/estilos.css:9-18`) con semántica propia (rojo="comprar", cian="del creador", amarillo="selección y foco") — **se mantiene tal cual, decisión del cliente**. El naranja de producción se incorpora como acento de marca/campaña, nunca como color de acción.

| Token | Valor | Rol | Peso en pantalla |
|---|---|---|---|
| `--ink` | `#1c1c1c` (cerca de `--tinta` actual `#242424`) | texto, superficies oscuras, el negro del logo | 90-95% junto con neutros |
| `--accent` | `#db3340` (rojo, "gota roja" del logo, igual que hoy) | **el único acento de acción**: CTA primario de compra, precios, estado activo del carrito | <3% de cada pantalla |
| `--brand` | `#e8501a` | acento de identidad/campaña — franja del header, badges "nuevo"/colección, nunca en botones de compra | uso puntual, no compite con `--accent` |
| `--ink-cyan` | `#00aeef` | identidad "comunidad / creador" — etiquetas de artista, sección comunidad | uso puntual, tag/acento secundario |
| `--ink-yellow` | `#fff200` | foco de teclado / selección — accesibilidad, no decorativo | uso funcional únicamente |
| `--g-main` | `#ffffff` | fondo principal | — |
| `--g-alt` | `#f4f2ef` (cálido, no gris puro — cerca de `--mesa` actual) | bandas alternas, tarjetas | — |
| `--g-dark` | `#121212` | sección comunidad / footer (único lugar con fondo oscuro) | — |

## 3. Tipografía

- Una familia redondeada y amigable (decisión 9), peso variable para dar jerarquía sin mezclar familias — ejemplo de candidata libre: **Fredoka** o **Baloo 2** para títulos/branding, pareada con una sans neutra y muy legible (**Inter** o **Figtree**) para cuerpo y UI densa (precios, filtros, formularios). El pairing fino lo deals la skill al construir; esto fija la dirección (redondeada + neutra), no el par exacto.
- Escala de tokens `--t-h1`..`--t-small` (patrón `system.md`), cuerpo mínimo 16px, medida de línea ≤62 caracteres, sentence case (nunca TODO MAYÚSCULAS como el nav actual del sitio en vivo).

## 4. Espaciado y grid

- Reusar la escala existente del repo (`--e1`..`--e9` en `css/estilos.css`) en vez de inventar una nueva — ya es consistente y portable a CSS modules bajo Vite.
- Grid de 12 columnas, `--nav/--padt/--padb/--gut` por breakpoint (`system.md`), bordes/respiración iguales entre secciones (principio "equal edges" de la skill) — hoy el sitio en vivo tiene densidad inconsistente entre el hero (denso, 3 columnas de banners) y el resto.

## 5. Radius y componentes

- `data-radius="soft"` — consumo creativo/joven, ni `sharp` (fintech/dev-tools) ni `round` total.
- Componentes: header con buscador + categorías + cuenta/favoritos/carrito (ya existe en el sitio real, se rehace limpio); tarjeta de producto con imagen, nombre, tienda, categoría **como campo único y normalizado** (no texto libre concatenado como hoy: "de ARTERY", "Azulejo, camiseta"); badges de colección/artista/edición; banda de confianza con datos concretos (reemplaza los 4 íconos genéricos actuales "100% SEGURO Y CONFIABLE" sin contenido real — decisión 8 del equipo).

## 6. Movimiento

- **Hero entrance** (una vez, al cargar, en toda página): h1 por líneas desde máscaras de palabra, luego lead/botones suben con fade, luego el objeto 3D o foto del hero se asienta — secuencia ≈1.1s, nunca se repite al hacer scroll (`motion.md`).
- **1-2 "dealt moments"** por página (1 si es corta, 2 si tiene 8+ secciones) — del pool foto-/tipo-liderado únicamente (nada de shader/liquid, por la regla de kind `other`): candidatos razonables para KREATA son `photo-chapters` (la historia del diseño, p. ej. Azulejo/Bichofué/Cali Pachanguero) y `word-highlight` (la frase de marca del hero). El pick exacto se deals al construir cada página.
- Capa de hover discreta en tarjetas de producto y botones; todo respeta `prefers-reduced-motion`.

## 7. Integración de los visores 3D

- Librería: Three.js (ya vendorizado en el repo, migrar a `npm install three` en Tarea 0), lógica procedural de `js/visor.js` reutilizable casi tal cual, envuelta en un componente/hook de React (o migrada a React Three Fiber + drei si el equipo prefiere esa vía — justificar la dependencia extra en Tarea 0).
- Un visor por producto con arte-como-textura: mug (ya existe), camiseta, hoodie, pañoleta, afiche, tote bag — mismo mecanismo de intercambio de textura que ya funciona para el mug.
- Fallback a imagen estática si WebGL falla (igual que hoy, `data-estado="sin-3d"`), lazy-load cuando entra en viewport, rotable con mouse/touch/teclado, respeta `prefers-reduced-motion`.
- Modelos: geometría procedural donde ya exista (mug) o GLB CC0/CC-BY con fuente y licencia anotadas en un archivo de créditos para las piezas nuevas (camiseta, hoodie, etc.) — pendiente de decidir modelo por modelo en cada tarea del ciclo.

## 8. Qué corrige esta propuesta del sitio en vivo

Ver hallazgos detallados en el mensaje de Fase 1, decisión 5 del equipo: nombres de categoría sin duplicar mayúscula/plural, sin mezclar inglés/español, catálogo con un solo vocabulario de campos (`id, name, store, category, price, priceFrom?, image, alt, collection?, artist?, edition?`).

---

**Nota sobre el pedido original de diales:** la versión instalada de `design-taste-frontend` (2.5.1) no tiene los diales `variación/movimiento/densidad` — pertenecen a releases `v1`/`v2-experimental` no instalados, y la skill tampoco produce un `DESIGN.md` como entregable propio (construye la página y entrega un plan + reporte). Este documento es una adaptación hecha a mano con el vocabulario real de la 2.5.1 (kind/deal, radius, hero entrance, dealt moments, excepción de product-render), como acordamos.
