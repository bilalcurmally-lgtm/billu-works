import { test, expect } from '@playwright/test'

test.describe('Contact Form Enhancements', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('billu_intro_seen', 'true')
    })
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
    await page.locator('#contact').scrollIntoViewIfNeeded()
  })

  test('error state shows retry button', async ({ page }) => {
    await page.route('**/formspree.io/**', async (route) => {
      await route.fulfill({ status: 500, body: 'Server Error' })
    })

    await page.locator('input[name="name"]').fill('Test User')
    await page.locator('input[name="email"]').fill('test@example.com')
    await page.locator('textarea[name="message"]').fill('Hello!')
    await page.getByRole('button', { name: /GET IN TOUCH/i }).click()

    await expect(page.getByText('Send failed')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('RETRY')).toBeVisible()
  })

  test('retry button returns to idle form', async ({ page }) => {
    await page.route('**/formspree.io/**', async (route) => {
      await route.fulfill({ status: 500, body: 'Server Error' })
    })

    await page.locator('input[name="name"]').fill('Test User')
    await page.locator('input[name="email"]').fill('test@example.com')
    await page.locator('textarea[name="message"]').fill('Hello!')
    await page.getByRole('button', { name: /GET IN TOUCH/i }).click()

    await expect(page.getByText('RETRY')).toBeVisible({ timeout: 5000 })
    await page.getByText('RETRY').click()

    // Form should be back to idle — submit button visible again
    await expect(page.getByRole('button', { name: /GET IN TOUCH/i })).toBeVisible()
  })

  test('email copy button shows COPIED! feedback', async ({ page }) => {
    // Grant clipboard permission
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])

    const emailBtn = page.getByText('billu.curmally@gmail.com').first()
    await expect(emailBtn).toBeVisible()
    await emailBtn.click()

    await expect(page.getByText('COPIED!')).toBeVisible({ timeout: 3000 })
  })

  test('form submission timeout shows error state', async ({ page }) => {
    // Simulate a hanging request
    await page.route('**/formspree.io/**', async (route) => {
      // Don't respond — let it timeout
      await new Promise(resolve => setTimeout(resolve, 15000))
      await route.fulfill({ status: 200, body: '{}' })
    })

    await page.locator('input[name="name"]').fill('Test User')
    await page.locator('input[name="email"]').fill('test@example.com')
    await page.locator('textarea[name="message"]').fill('Hello!')
    await page.getByRole('button', { name: /GET IN TOUCH/i }).click()

    // Should show error after ~10s timeout
    await expect(page.getByText('Send failed')).toBeVisible({ timeout: 15000 })
  })
})
