import { test, expect } from '@playwright/test'

test.describe('Scroll Stacking & Film Strip', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('billu_intro_seen', 'true')
    })
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
  })

  test('sections have data-scroll attributes', async ({ page }) => {
    // Hero wrapper should have data-scroll="stack"
    const heroWrapper = page.locator('[data-scroll="stack"]').first()
    await expect(heroWrapper).toBeAttached()

    // Work wrapper should have data-scroll="self"
    const workWrapper = page.locator('[data-scroll="self"]')
    await expect(workWrapper).toBeAttached()
  })

  test('sections have correct z-index stacking order', async ({ page }) => {
    const sections = page.locator('main > div[data-scroll]')
    const count = await sections.count()
    expect(count).toBeGreaterThanOrEqual(3)

    // Each section should have increasing z-index
    let prevZ = 0
    for (let i = 0; i < count; i++) {
      const zIndex = await sections.nth(i).evaluate(el => {
        return parseInt(el.style.zIndex || '0', 10)
      })
      expect(zIndex).toBeGreaterThan(prevZ)
      prevZ = zIndex
    }
  })

  test('film strip progress bar is visible on desktop', async ({ page }) => {
    // Film strip should be on the right edge
    const filmStrip = page.locator('.fixed.top-0.right-0.h-full')
    await expect(filmStrip).toBeVisible()
  })

  test('film strip fills on scroll', async ({ page }) => {
    // Get initial progress fill height
    const progressFill = page.locator('.fixed.top-0.right-0.h-full .absolute.top-0.left-0.right-0').first()
    const initialHeight = await progressFill.evaluate(el => parseFloat(el.style.height) || 0)

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(300) // Wait for RAF-throttled update

    const newHeight = await progressFill.evaluate(el => parseFloat(el.style.height) || 0)
    expect(newHeight).toBeGreaterThan(initialHeight)
  })

  test('stack sections have will-change property', async ({ page }) => {
    const stackSections = page.locator('[data-scroll="stack"]')
    const count = await stackSections.count()

    for (let i = 0; i < count; i++) {
      const willChange = await stackSections.nth(i).evaluate(el => el.style.willChange)
      expect(willChange).toContain('transform')
    }
  })
})
