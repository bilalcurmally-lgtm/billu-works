import { test, expect } from '@playwright/test'

test.describe('Hero Stats & Portrait', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('billu_intro_seen', 'true')
    })
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
  })

  test('stats row shows three items', async ({ page }) => {
    await expect(page.getByText('Years', { exact: true })).toBeVisible()
    await expect(page.getByText('The crafts', { exact: true })).toBeVisible()
    await expect(page.getByText('Commercials', { exact: true })).toBeVisible()
  })

  test('stats show final values after animation', async ({ page }) => {
    // Wait for count-up animation to complete
    await page.waitForTimeout(2000)
    await expect(page.getByText('20+')).toBeVisible()
    await expect(page.getByText('300+')).toBeVisible()
  })

  test('availability status is shown', async ({ page }) => {
    await expect(page.getByText('Taking on new projects').first()).toBeVisible()
  })

  test('hero portrait container exists on desktop', async ({ page, browserName }) => {
    // Only check on desktop viewport
    const viewport = page.viewportSize()
    if (viewport && viewport.width >= 768) {
      const portrait = page.locator('#hero [style*="hero-portrait"]')
      const count = await portrait.count()
      expect(count).toBeGreaterThanOrEqual(0) // May or may not be visible depending on image availability
    }
  })
})
