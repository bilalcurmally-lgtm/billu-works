import { test, expect } from '@playwright/test'

test.describe('Nav Active State', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('billu_intro_seen', 'true')
    })
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
  })

  test('nav shows active highlight when scrolled to a section', async ({ page }) => {
    // Scroll to Work section
    await page.locator('#work').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500) // Allow IntersectionObserver to fire

    // Open nav
    await page.locator('.fixed.top-5.right-5').click()
    await page.waitForTimeout(500)

    // The "01" number for WORK should have an active background
    const workNum = page.locator('nav button', { hasText: 'WORK' }).locator('span').first()
    const bgColor = await workNum.evaluate(el => getComputedStyle(el).backgroundColor)
    // Active state should have a dark background (#1A1A1A = rgb(26, 26, 26))
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)')
  })
})
