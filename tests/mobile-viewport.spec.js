import { test, expect } from '@playwright/test'

test.describe('Mobile Viewport (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('billu_intro_seen', 'true')
    })
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
  })

  test('no horizontal scrollbar', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
  })

  test('nav stub is visible and clickable', async ({ page }) => {
    const stub = page.locator('.fixed.top-6.right-6')
    await expect(stub).toBeVisible()
    await stub.click()
    // Nav overlay should open
    await expect(page.getByText('WORK').first()).toBeVisible({ timeout: 3000 })
  })

  test('no custom cursor on touch device', async ({ page }) => {
    // Custom cursor should not render on touch/mobile
    // The cursor element is outside <main>, check it doesn't exist
    const cursorOuter = page.locator('.fixed.top-0.left-0.pointer-events-none[style*="z-index: 99999"]')
    await expect(cursorOuter).toBeHidden()
  })

  test('film strip progress is hidden on mobile', async ({ page }) => {
    // Film strip is desktop only — should not be visible
    const filmStrip = page.locator('.fixed.top-0.right-0.h-full[style*="width: 12px"]')
    await expect(filmStrip).toBeHidden()
  })

  test('sections render properly at mobile width', async ({ page }) => {
    // Hero, Work, About, Contact sections should all be present
    await expect(page.locator('#work')).toBeAttached()
    await expect(page.locator('#about')).toBeAttached()
    await expect(page.locator('#contact')).toBeAttached()
  })
})
