/**
 * Envío de formularios de demo: valida con las reglas nativas del navegador y nunca
 * manda ni guarda nada. Devuelve el nombre ingresado, o null si la validación falló.
 */
export function submitDemoForm(e) {
  e.preventDefault();
  const form = e.currentTarget;
  if (!form.reportValidity()) return null;
  return form.elements.namedItem('nombre')?.value?.trim() ?? '';
}
