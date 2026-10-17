import { test, expect } from '@playwright/test'

test.describe('Delight Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('billu_intro_seen', 'true')
    })
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
  })

  test('custom cursor is present on desktop', async ({ page }) => {
    // Move mouse to trigger cursor visibility
    await page.mouse.move(400, 400)
    // Cursor elements should exist (outer ring + center dot)
    const cursorElements = page.locator('.fixed.top-0.left-0.pointer-events-none')
    const count = await cursorElements.count()
    expect(count).toBeGreaterThanOrEqual(2) // ring + dot
  })

  test('Konami code triggers Director\'s Cut', async ({ page }) => {
    // Type the Konami code: ↑↑↓↓←→←→BA
    const keys = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'b', 'a',
    ]
    for (const key of keys) {
      await page.keyboard.press(key)
    }

    // Director's Cut overlay should appear
    await expect(page.getByText("DIRECTOR'S CUT")).toBeVisible({ timeout: 3000 })
  })

  test('Konami overlay disappears after ~10 seconds', async ({ page }) => {
    const keys = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'b', 'a',
    ]
    for (const key of keys) {
      await page.keyboard.press(key)
    }
    await expect(page.getByText("DIRECTOR'S CUT")).toBeVisible({ timeout: 3000 })

    // Wait for it to disappear (10s + animation buffer)
    await expect(page.getByText("DIRECTOR'S CUT")).toBeHidden({ timeout: 15000 })
  })

  test('footer shows live timecode', async ({ page }) => {
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Footer should have SESSION text with timecode format HH:MM:SS:FF
    const sessionText = page.locator('footer').getByText(/SESSION \d{2}:\d{2}:\d{2}:\d{2}/)
    await expect(sessionText).toBeVisible({ timeout: 3000 })
  })

  test('timecode updates over time', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    const sessionEl = page.locator('footer').getByText(/SESSION \d{2}:\d{2}:\d{2}:\d{2}/)
    const text1 = await sessionEl.textContent()

    await page.waitForTimeout(1100) // Wait just over 1 second

    const text2 = await sessionEl.textContent()
    // Timecode should have changed
    expect(text2).not.toBe(text1)
  })
})
