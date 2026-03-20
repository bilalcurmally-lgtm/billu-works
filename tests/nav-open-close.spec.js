import { test, expect } from '@playwright/test'

test.describe('Ticket Nav', () => {
  test.beforeEach(async ({ page }) => {
    // Skip intro via sessionStorage
    await page.addInitScript(() => {
      sessionStorage.setItem('billu_intro_seen', 'true')
    })
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
  })

  test('nav stub is visible on page load', async ({ page }) => {
    // The collapsed ticket stub contains "billu.works" text
    await expect(page.locator('text=billu.works').first()).toBeVisible()
  })

  test('clicking stub opens nav overlay', async ({ page }) => {
    // Click the nav stub (has Menu icon)
    const stub = page.locator('.fixed.top-5.right-5')
    await stub.click()
    // Nav overlay should appear with nav items
    await expect(page.getByText('WORK').first()).toBeVisible({ timeout: 3000 })
    await expect(page.getByText('ABOUT').first()).toBeVisible()
    await expect(page.getByText('CONTACT').first()).toBeVisible()
  })

  test('clicking nav item scrolls to section', async ({ page }) => {
    const stub = page.locator('.fixed.top-5.right-5')
    await stub.click()
    // Click WORK nav item
    const workBtn = page.locator('nav button', { hasText: 'WORK' })
    await expect(workBtn).toBeVisible({ timeout: 3000 })
    await workBtn.click()
    // Nav should close and page should scroll — work section should become visible
    await expect(page.locator('#work')).toBeInViewport({ timeout: 5000 })
  })

  test('Escape key closes nav', async ({ page }) => {
    const stub = page.locator('.fixed.top-5.right-5')
    await stub.click()
    // Verify overlay is open
    await expect(page.getByText('WORK').first()).toBeVisible({ timeout: 3000 })
    // Press Escape
    await page.keyboard.press('Escape')
    // Nav overlay should close — stub should become clickable again
    await expect(stub).toHaveCSS('opacity', '1', { timeout: 3000 })
  })

  test('clicking backdrop closes nav', async ({ page }) => {
    const stub = page.locator('.fixed.top-5.right-5')
    await stub.click()
    await expect(page.getByText('WORK').first()).toBeVisible({ timeout: 3000 })
    // Click the backdrop (the semi-transparent overlay behind the nav)
    const backdrop = page.locator('.fixed.inset-0').last()
    await backdrop.click({ position: { x: 10, y: 300 }, force: true })
    // Nav should close
    await expect(stub).toHaveCSS('opacity', '1', { timeout: 3000 })
  })
})
