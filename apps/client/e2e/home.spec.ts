import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Momotombo Travels/);
  });

  test('should display the navbar', async ({ page }) => {
    await page.goto('/');
    const navbar = page.locator('#main-navbar');
    await expect(navbar).toBeVisible();
  });

  test('should navigate to explore page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Destinos');
    await expect(page).toHaveURL('/explorar');
  });

  test('should navigate to blog page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Blog');
    await expect(page).toHaveURL('/blog');
  });
});

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('h1')).toContainText('Bienvenido');
  });

  test('should show register page', async ({ page }) => {
    await page.goto('/auth/registro');
    await expect(page.locator('h1')).toContainText('Crear Cuenta');
  });

  test('should navigate from login to register', async ({ page }) => {
    await page.goto('/auth/login');
    await page.click('text=Regístrate gratis');
    await expect(page).toHaveURL('/auth/registro');
  });
});

test.describe('Explore Page', () => {
  test('should load explore page', async ({ page }) => {
    await page.goto('/explorar');
    await expect(page.locator('h1')).toContainText('Descubre');
  });

  test('should display destination cards', async ({ page }) => {
    await page.goto('/explorar');
    // Wait for destinations to load
    await page.waitForSelector('[id^="dest-card-"]', { timeout: 10000 });
    const cards = page.locator('[id^="dest-card-"]');
    await expect(cards.first()).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    await page.goto('/explorar');
    await page.click('text=Volcanes');
    // Wait for filter to apply
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/category=volcanes/);
  });
});

test.describe('Blog Page', () => {
  test('should load blog page', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('h1')).toContainText('Blog');
  });

  test('should display blog posts', async ({ page }) => {
    await page.goto('/blog');
    // Wait for posts to load
    await page.waitForSelector('article', { timeout: 10000 });
    const posts = page.locator('article');
    await expect(posts.first()).toBeVisible();
  });
});

test.describe('Footer', () => {
  test('should display footer on public pages', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should not display footer on auth pages', async ({ page }) => {
    await page.goto('/auth/login');
    const footer = page.locator('footer');
    await expect(footer).not.toBeVisible();
  });
});
