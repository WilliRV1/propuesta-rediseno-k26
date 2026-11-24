import { test, expect } from '@playwright/test';

test.describe('EPIC-01+12: cuenta, ayuda, políticas y KREO', () => {
  test('todas las rutas del footer y header abren una página coherente', async ({ page }) => {
    await page.goto('/');
    const rutas = [
      ['/account', 'Mi cuenta'],
      ['/favorites', 'Lista de deseos'],
      ['/help', 'Ayuda y preguntas frecuentes'],
      ['/about', 'Sobre Kreata'],
      ['/legal/terminos-vendedores', 'Términos para vendedores'],
      ['/legal/documentos', 'Documentos legales'],
    ];
    for (const [ruta, titulo] of rutas) {
      await page.goto(ruta);
      await expect(page.locator('h1')).toHaveText(titulo);
    }
  });

  test('entrar sin datos muestra validación y no navega a ningún lado', async ({ page }) => {
    await page.goto('/account');
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    await expect(page.getByText('Escribe tu usuario o correo.')).toBeVisible();
    await expect(page.locator('#campo-usuario')).toBeFocused();
  });

  test('con datos muestra un aviso de maqueta, sin iniciar sesión real', async ({ page }) => {
    await page.goto('/account');
    await page.locator('#campo-usuario').fill('ana@example.com');
    await page.locator('#campo-clave').fill('clave123');
    await page.getByRole('button', { name: 'Entrar', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('maqueta');
    await expect(page).toHaveURL(/\/account$/);
  });

  test('recuperar contraseña valida el correo', async ({ page }) => {
    await page.goto('/account');
    await page.getByRole('button', { name: '¿Olvidaste tu contraseña?' }).click();
    await page.locator('#campo-correoRecuperar').fill('no-valido');
    await page.getByRole('button', { name: 'Enviar instrucciones' }).click();
    await expect(page.getByText('Escribe un correo válido.')).toBeVisible();
  });

  test('Kreo responde con opciones predefinidas y nunca inventa datos de pedidos', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Pregúntale a Kreo' }).click();
    await page.getByRole('button', { name: 'Busco ayuda con una compra' }).click();
    await expect(page.getByText('No tengo acceso a pedidos reales en esta demo.')).toBeVisible();

    const input = page.getByLabel('Escribe tu pregunta');
    await input.fill('¿Dónde está mi pedido #1234?');
    await page.getByRole('button', { name: 'Enviar' }).click();
    await expect(page.getByText('Soy una maqueta sin conexión a pedidos reales.')).toBeVisible();
  });

  test('Kreo se cierra con Escape y devuelve el foco al botón', async ({ page }) => {
    await page.goto('/');
    const boton = page.getByRole('button', { name: 'Pregúntale a Kreo' });
    await boton.click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Kreo' })).toBeHidden();
    await expect(boton).toBeFocused();
  });
});
