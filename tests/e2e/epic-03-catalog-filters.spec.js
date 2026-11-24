import { test, expect } from '@playwright/test';

test.describe('EPIC-03: catálogo, búsqueda, filtros y ordenamiento', () => {
  test('buscar "azulejo" muestra solo los productos de esa colección', async ({ page }) => {
    await page.goto('/catalog?q=azulejo');
    const grid = page.locator('.rejilla .producto');
    await expect(grid).toHaveCount(2);
    await expect(grid).toContainText(['Azulejo, camiseta', 'Azulejo, pañoleta']);
  });

  test('el filtro de categoría solo muestra categorías con productos reales (sin Mugs ni Hoodies)', async ({ page }) => {
    await page.goto('/catalog');
    const categoryGroup = page.getByRole('group', { name: 'Categoría' });
    await expect(categoryGroup.getByRole('button', { name: 'Camisetas' })).toBeVisible();
    await expect(categoryGroup.getByRole('button', { name: 'Mugs' })).toHaveCount(0);
    await expect(categoryGroup.getByRole('button', { name: 'Hoodies' })).toHaveCount(0);
  });

  test('combinar categoría + tienda + orden funciona y queda en la URL', async ({ page }) => {
    await page.goto('/catalog');
    await page.getByRole('group', { name: 'Categoría' }).getByRole('button', { name: 'Camisetas' }).click();
    await page.getByRole('group', { name: 'Tienda' }).getByRole('button', { name: 'Kokomochi' }).click();
    await page.getByLabel('Ordenar por').selectOption('precio-desc');

    await expect(page).toHaveURL(/category=camisetas/);
    await expect(page).toHaveURL(/store=Kokomochi/);
    await expect(page).toHaveURL(/sort=precio-desc/);

    const titles = page.locator('.producto h3');
    await expect(titles).toHaveCount(2);
    await expect(titles.first()).toHaveText('Cali pachanguero, camiseta'); // 87.900, mayor primero
    await expect(titles.last()).toHaveText('Catastrophic, camiseta'); // 77.900
  });

  test('la talla solo aparece cuando la categoría es ropa', async ({ page }) => {
    await page.goto('/catalog?category=camisetas');
    await expect(page.getByRole('group', { name: 'Talla' })).toBeVisible();

    await page.goto('/catalog?category=afiches');
    await expect(page.getByRole('group', { name: 'Talla' })).toHaveCount(0);
  });

  test('sin resultados muestra el mensaje y el botón de limpiar funciona', async ({ page }) => {
    await page.goto('/catalog?q=esto-no-existe-en-ningun-lado');
    await expect(page.getByText('No encontramos productos con esos filtros.')).toBeVisible();

    await page.getByRole('status').getByRole('button', { name: 'Limpiar filtros' }).click();
    await expect(page).toHaveURL(/\/catalog$/);
    await expect(page.locator('.producto')).toHaveCount(8);
  });

  test('el enlace "Limpiar filtros" de la cabecera solo aparece con filtros activos', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page.getByRole('button', { name: 'Limpiar filtros' })).toHaveCount(0);
    await page.goto('/catalog?category=bolsos');
    await expect(page.getByRole('button', { name: 'Limpiar filtros' })).toBeVisible();
  });
});
