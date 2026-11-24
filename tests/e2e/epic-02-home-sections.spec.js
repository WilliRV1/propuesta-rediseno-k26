import { test, expect } from '@playwright/test';

test.describe('EPIC-02: secciones del inicio (historia, colecciones, destacados, comunidad, confianza)', () => {
  test('muestra historia y colecciones sin errores de consola', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'De una idea propia a una pieza que encuentra su lugar' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Colecciones para descubrir nuevas historias' })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('una tarjeta de colección lleva a la tienda correspondiente', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Ver diseños Kokomochi/ }).click();
    await expect(page).toHaveURL(/\/#tienda-kokomochi/);
    await expect(page.locator('#tienda-kokomochi')).toBeVisible();
  });

  test('destacados y catálogo completo no repiten productos', async ({ page }) => {
    await page.goto('/');
    const destacados = await page.locator('#destacados .producto h3').allTextContents();
    const catalogo = await page.locator('#catalogo .producto h3').allTextContents();
    expect(destacados).toHaveLength(2);
    expect(catalogo).toHaveLength(6);
    const interseccion = destacados.filter((t) => catalogo.includes(t));
    expect(interseccion).toEqual([]);
  });

  test('el formulario de postulación valida, no envía nada y confirma localmente', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir formulario de postulación' }).click();
    const form = page.locator('#postulacion');
    await expect(form).toBeVisible();
    await expect(form.locator('input[name="nombre"]')).toBeFocused();

    // sin completar, la validacion nativa bloquea el envio
    await form.getByRole('button', { name: 'Enviar postulación' }).click();
    await expect(form.locator('.estado-postulacion')).toHaveText('');

    await form.locator('input[name="nombre"]').fill('Laura Ríos');
    await form.locator('input[name="correo"]').fill('laura@example.com');
    await form.locator('input[name="tienda"]').fill('Estudio Laura');
    await form.locator('textarea[name="descripcion"]').fill('Hago ilustración botánica aplicada a productos textiles.');
    await form.getByRole('button', { name: 'Enviar postulación' }).click();
    await expect(form.locator('.estado-postulacion')).toContainText('¡Gracias, Laura Ríos!');
    await expect(form.locator('.estado-postulacion')).toContainText('No se envió ni se guardó información');
  });

  test('el panel de garantías y soporte se abre, se cierra y su formulario confirma localmente', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Ver garantías y soporte' });
    await toggle.click();
    const panel = page.locator('#garantias');
    await expect(panel).toBeVisible();

    await panel.locator('input[name="nombre"]').fill('Carlos Mora');
    await panel.locator('input[name="correo"]').fill('carlos@example.com');
    await panel.locator('select[name="motivo"]').selectOption('pago');
    await panel.locator('textarea[name="mensaje"]').fill('Quiero confirmar si mi pago ya fue procesado.');
    await panel.getByRole('button', { name: 'Enviar consulta' }).click();
    await expect(panel.locator('.estado-postulacion')).toContainText('¡Gracias, Carlos Mora!');

    await page.getByRole('button', { name: 'Cerrar detalles' }).click();
    await expect(panel).toBeHidden();
  });

  test('el visor del creador también puede pausar y reanudar el giro', async ({ page }) => {
    await page.goto('/');
    await page.locator('#taller').scrollIntoViewIfNeeded();
    await expect(page.locator('#taller')).toHaveAttribute('data-estado', 'listo', { timeout: 10000 });
    const spinButton = page.locator('#taller .escenario-pie button');
    // el visor del creador arranca sin giro automático (a diferencia del visor del comprador)
    await expect(spinButton).toHaveText('Girar solo');
    await spinButton.click();
    await expect(spinButton).toHaveText('Pausar el giro');
  });
});
