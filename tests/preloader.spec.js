import { test, expect } from '@playwright/test'

test.describe('Preloader', () => {
  test('preloader appears on fresh visit and shows loading text', async ({ page }) => {
    // Don't set sessionStorage — this is a fresh visit
    await page.goto('/')
    // Preloader should be visible first
    await expect(page.getByText('LOADING REEL')).toBeVisible({ timeout: 3000 })
  })

  test('preloader shows percentage', async ({ page }) => {
    await page.goto('/')
    // Should show a percentage
    const pctText = page.locator('text=/%/')
    await expect(pctText).toBeVisible({ timeout: 3000 })
  })

  test('preloader is skipped on return visit', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('billu_intro_seen', 'true')
    })
    await page.goto('/')
    // Should go straight to main content, no preloader
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('LOADING REEL')).toBeHidden()
  })

  test('preloader completes and transitions to intro', async ({ page }) => {
    await page.goto('/')
    // Wait for preloader to finish — should see BILLU or the intro within 6 seconds
    await expect(page.getByText('BILLU')).toBeVisible({ timeout: 8000 })
  })
})
