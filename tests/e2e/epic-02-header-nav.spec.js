import { test, expect } from '@playwright/test';

test.describe('EPIC-02: cabecera, menú de categorías, footer y navegación', () => {
  test('el buscador navega a /catalog?q=', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Buscar productos').fill('azulejo');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await expect(page).toHaveURL(/\/catalog\?q=azulejo/);
    await expect(page.getByRole('heading', { name: 'Resultados para “azulejo”' })).toBeVisible();
  });

  test('buscar sin texto navega a /catalog sin filtro', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await expect(page).toHaveURL(/\/catalog$/);
    await expect(page.getByRole('heading', { name: 'Catálogo' })).toBeVisible();
  });

  test('una categoría de la cabecera navega a /catalog?category=', async ({ page, viewport }) => {
    test.skip(viewport.width < 820, 'el menú de categorías de escritorio está oculto en mobile');
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Categorías' }).getByRole('link', { name: 'Mugs' }).click();
    await expect(page).toHaveURL(/\/catalog\?category=mugs/);
    await expect(page.getByRole('heading', { name: 'Mugs' })).toBeVisible();
  });

  test('el menú móvil se abre con el botón, se recorre con teclado y Escape lo cierra', async ({ page, viewport }) => {
    test.skip(viewport.width >= 820, 'el menú móvil solo existe bajo 820px');
    await page.goto('/');
    const openButton = page.getByRole('button', { name: 'Abrir menú de categorías' });
    await openButton.click();

    const drawer = page.getByRole('dialog', { name: 'Categorías' });
    await expect(drawer).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar menú' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(openButton).toBeFocused();

    await openButton.click();
    await drawer.getByRole('link', { name: 'Hoodies' }).click();
    await expect(page).toHaveURL(/\/catalog\?category=hoodies/);
    await expect(drawer).toBeHidden();
  });

  test('los enlaces del pie llevan a páginas reales, ninguna rota', async ({ page }) => {
    await page.goto('/');
    const links = [
      ['Sobre Kreata', 'Sobre Kreata'],
      ['Términos para vendedores', 'Términos para vendedores'],
      ['Documentos legales', 'Documentos legales'],
      ['Preguntas frecuentes', 'Ayuda y preguntas frecuentes'],
    ];
    for (const [linkName, heading] of links) {
      await page.goto('/');
      await page.locator('footer').getByRole('link', { name: linkName }).click();
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }
  });

  test('cuenta y favoritos tienen destino y nombre accesible', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Mi cuenta' }).click();
    await expect(page.getByRole('heading', { name: 'Mi cuenta' })).toBeVisible();
    await page.goto('/');
    await page.getByRole('link', { name: 'Lista de deseos' }).click();
    await expect(page.getByRole('heading', { name: 'Lista de deseos' })).toBeVisible();
  });

  test('una ruta desconocida muestra la página de error con salida al inicio', async ({ page }) => {
    await page.goto('/esto-no-existe');
    await expect(page.getByRole('heading', { name: 'Página no encontrada' })).toBeVisible();
    await page.getByRole('link', { name: 'Volver al inicio' }).click();
    await expect(page).toHaveURL('/');
  });
});
