import { useState } from 'react';
import { useLocation } from 'react-router-dom';

/** Panel que empieza abierto si la URL llega con #anchorId (enlace directo desde otra página). */
export function useDisclosure(anchorId) {
  const location = useLocation();
  const [open, setOpen] = useState(() => location.hash === `#${anchorId}`);
  return [open, setOpen];
}
