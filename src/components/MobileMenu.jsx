import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon } from './icons.jsx';

const CATEGORIES = [
  { label: 'Camisetas', slug: 'camisetas' },
  { label: 'Hoodies', slug: 'hoodies' },
  { label: 'Pañoletas', slug: 'panoletas' },
  { label: 'Mugs', slug: 'mugs' },
  { label: 'Afiches', slug: 'afiches' },
  { label: 'Bolsos', slug: 'bolsos' },
];

/** Drawer de categorías para mobile: foco atrapado, Escape cierra, el foco vuelve al botón que lo abrió. */
export function MobileMenu({ open, onClose, triggerRef }) {
  const closeButtonRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    closeButtonRef.current?.focus();

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = panelRef.current?.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      triggerRef.current?.focus();
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div className="menu-movil-capa" onClick={onClose}>
      <nav
        ref={panelRef}
        className="menu-movil"
        aria-label="Categorías"
        aria-modal="true"
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="menu-movil-cerrar" ref={closeButtonRef} onClick={onClose} aria-label="Cerrar menú">
          <CloseIcon />
        </button>
        <ul>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link to={`/catalog?category=${c.slug}`} onClick={onClose}>{c.label}</Link>
            </li>
          ))}
          <li><Link to="/#tiendas" onClick={onClose}>Tiendas</Link></li>
        </ul>
      </nav>
    </div>
  );
}
