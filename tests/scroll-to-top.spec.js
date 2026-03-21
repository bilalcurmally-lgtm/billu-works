import { test, expect } from '@playwright/test'

test.describe('Scroll To Top', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('billu_intro_seen', 'true')
    })
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
  })

  test('button is not interactive when hero is visible', async ({ page }) => {
    const scrollBtn = page.locator('button[aria-label="Scroll to top"]')
    // On page load, hero is visible — button should have pointer-events: none
    const pointerEvents = await scrollBtn.evaluate(el => getComputedStyle(el).pointerEvents)
    expect(pointerEvents).toBe('none')
  })

  test('button becomes interactive after scrolling past hero', async ({ page }) => {
    // Scroll well past the hero section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500) // Allow IntersectionObserver to fire
    const scrollBtn = page.locator('button[aria-label="Scroll to top"]')
    const opacity = await scrollBtn.evaluate(el => getComputedStyle(el).opacity)
    expect(Number(opacity)).toBeGreaterThan(0)
  })

  test('clicking button scrolls back to top', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    const scrollBtn = page.locator('button[aria-label="Scroll to top"]')
    await scrollBtn.click({ force: true })
    // Wait for GSAP smooth scroll to complete (1s animation + buffer)
    await page.waitForTimeout(2000)
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeLessThan(400)
  })
})
