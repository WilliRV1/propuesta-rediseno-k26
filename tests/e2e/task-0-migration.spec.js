import { test, expect } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe('Tarea 0: migración a React + Vite', () => {
  test('carga la portada sin errores de consola', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

    await page.goto('/');
    await expect(page).toHaveTitle(/Kreata/);
    await expect(page.locator('h1')).toContainText('El talento creativo merece llegar más lejos');
    expect(errors).toEqual([]);
  });

  test('el visor 3D del mug carga y gira con teclado', async ({ page }) => {
    await page.goto('/');
    const stage = page.locator('#escenario');
    await expect(stage).toHaveAttribute('data-estado', 'listo', { timeout: 10000 });

    const canvas = stage.locator('canvas');
    await expect(canvas).toBeVisible();

    await canvas.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    // tras usar las flechas el giro automatico se detiene y aparece "Girar solo"
    await expect(page.getByRole('button', { name: 'Girar solo' })).toBeVisible();
  });

  test('cambiar de mug actualiza nombre, tienda, precio y muestra un aviso al comprar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#escenario')).toHaveAttribute('data-estado', 'listo', { timeout: 10000 });

    await expect(page.locator('#mug-nombre')).toHaveText('Mug Azulejo común');
    await expect(page.locator('#mug-precio')).toHaveText('$ 47.000');

    await page.getByRole('button', { name: /Bichofué/ }).click();
    await expect(page.locator('#mug-nombre')).toHaveText('Mug Bichofué');
    await expect(page.locator('#mug-tienda')).toHaveText('ARTERY');

    await page.getByRole('button', { name: 'Agregar este mug al carrito' }).click();
    await expect(page.locator('#carrito-cuenta')).toHaveText('1');
    await expect(page.locator('#aviso')).toHaveAttribute('data-visible', '1');
    await expect(page.locator('#aviso')).toContainText('El mug Bichofué quedó en el carrito.');
  });

  test('el carrito tiene aria-label correcto en singular y plural', async ({ page }) => {
    await page.goto('/');
    const cart = page.locator('#carrito');
    await expect(cart).toHaveAttribute('aria-label', 'Carrito, 0 productos');
    await page.getByRole('button', { name: 'Agregar este mug al carrito' }).click();
    await expect(cart).toHaveAttribute('aria-label', 'Carrito, 1 producto');
  });

  test('subir arte por drag&drop actualiza el visor del creador', async ({ page }) => {
    await page.goto('/');
    await page.locator('#taller').scrollIntoViewIfNeeded();
    await expect(page.locator('#taller')).toHaveAttribute('data-estado', 'listo', { timeout: 10000 });

    const filePath = path.join(__dirname, 'fixtures', 'sample-art.jpg');
    await page.locator('#arte-archivo').setInputFiles(filePath);

    await expect(page.locator('#arte-estado')).toHaveAttribute('data-tipo', 'ok');
    await expect(page.locator('#arte-estado')).toContainText('px. Así se vería impreso.');
  });

  test('un archivo que no es imagen muestra el error', async ({ page }) => {
    await page.goto('/');
    await page.locator('#taller').scrollIntoViewIfNeeded();
    await expect(page.locator('#taller')).toHaveAttribute('data-estado', 'listo', { timeout: 10000 });

    const filePath = path.join(__dirname, 'fixtures', 'not-an-image.txt');
    await page.locator('#arte-archivo').setInputFiles(filePath);

    await expect(page.locator('#arte-estado')).toHaveAttribute('data-tipo', 'error');
    await expect(page.locator('#arte-estado')).toContainText('no es una imagen');
  });

  test('build de producción expone el catálogo y las tiendas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.producto')).toHaveCount(8);
    await expect(page.getByRole('heading', { name: 'Tiendas de creadores' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ARTERY' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Kokomochi' })).toBeVisible();
  });
});
