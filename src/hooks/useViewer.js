import { useEffect, useRef, useState } from 'react';

/**
 * Crea un visor 3D sobre el nodo del ref y lo destruye al desmontar.
 * `active` deja crear el visor de forma perezosa (p. ej. cuando entra en pantalla).
 * El modulo de three.js se importa de forma dinamica: no entra en el chunk principal.
 */
export function useViewer({ autoSpin = true, start = -0.6, active = true } = {}) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [spinning, setSpinning] = useState(autoSpin);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!active || !containerRef.current || viewerRef.current) return undefined;
    const container = containerRef.current;
    let cancelled = false;
    let cleanupSpin = () => {};

    import('../lib/three/viewer.js').then(({ createViewer }) => {
      if (cancelled) return;
      const viewer = createViewer(container, { autoSpin, start });
      viewerRef.current = viewer;
      if (viewer) {
        setSpinning(viewer.spinning);
        const onSpin = (e) => setSpinning(e.detail);
        container.addEventListener('spin', onSpin);
        cleanupSpin = () => container.removeEventListener('spin', onSpin);
      }
      setReady(true); // listo tanto si hay visor como si se cayo a la imagen plana
    });

    return () => {
      cancelled = true;
      cleanupSpin();
      viewerRef.current?.dispose();
      viewerRef.current = null;
    };
  }, [active, autoSpin, start]);

  return { containerRef, viewer: viewerRef, spinning, ready };
}
