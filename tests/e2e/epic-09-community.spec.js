import { test, expect } from '@playwright/test';

test.describe('EPIC-09: comunidad y formulario "Postula tu tienda"', () => {
  test('los CTA del inicio llevan a /community', async ({ page, viewport }) => {
    test.skip(viewport.width < 820, '"Vender mis diseños" se oculta en mobile, igual que en EPIC-02');
    await page.goto('/');
    await page.getByRole('link', { name: 'Vender mis diseños' }).click();
    await expect(page).toHaveURL(/\/community$/);
    await expect(page.locator('h1')).toContainText('Convierte tu pasión');
  });

  test('campos obligatorios y correo se validan con mensajes junto al campo', async ({ page }) => {
    await page.goto('/community');
    await page.getByRole('button', { name: 'Quiero ser partner de Kreata' }).click();
    await expect(page.getByText('Cuéntanos tu nombre.')).toBeVisible();
    await expect(page.locator('#campo-nombre')).toBeFocused();

    await page.locator('#campo-nombre').fill('Ana');
    await page.locator('#campo-correo').fill('no-es-un-correo');
    await page.locator('#campo-propuesta').fill('Afiches');
    await page.getByRole('button', { name: 'Quiero ser partner de Kreata' }).click();
    await expect(page.getByText('Revisa el formato del correo.')).toBeVisible();
  });

  test('con datos válidos muestra el mensaje de éxito', async ({ page }) => {
    await page.goto('/community');
    await page.locator('#campo-nombre').fill('Ana');
    await page.locator('#campo-correo').fill('ana@example.com');
    await page.locator('#campo-propuesta').fill('Afiches de aves');
    await page.getByRole('button', { name: 'Quiero ser partner de Kreata' }).click();
    await expect(page.getByRole('status')).toContainText('ana@example.com');
  });
});
