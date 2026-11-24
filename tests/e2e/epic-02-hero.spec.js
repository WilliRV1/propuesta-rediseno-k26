import { test, expect } from '@playwright/test';

test.describe('EPIC-02: Hero inmersivo de concepto', () => {
  test('carga rápido, sin errores de consola, y el h1 es el mensaje de marca', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('El talento creativo merece llegar más lejos.');
    await expect(page.getByText('Diseños originales, artistas independientes')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('el CTA "Descubre más" baja al catálogo sin bloquear la navegación', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Descubre más' }).click();
    await expect(page).toHaveURL(/#catalogo$/);
    await expect(page.locator('#catalogo')).toBeInViewport();
  });

  test('con prefers-reduced-motion la imagen se ve completa sin animación', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const h1 = page.locator('.hero-concepto-texto h1');
    await expect(h1).toHaveCSS('opacity', '1');
    await expect(page.locator('.pincelada-trazo').first()).toHaveCSS('animation-name', 'none');
  });

  test('se ve bien en móvil (390px) y no genera scroll horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasHorizontalScroll).toBe(false);
  });
});
