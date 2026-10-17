import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('billu_intro_seen', 'true')
    })
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
    // Scroll to contact section
    await page.locator('#contact').scrollIntoViewIfNeeded()
  })

  test('form has name, email, and message fields', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('textarea[name="message"]')).toBeVisible()
  })

  test('form header says GET IN TOUCH', async ({ page }) => {
    await expect(page.getByText('GET IN TOUCH').first()).toBeVisible()
  })

  test('can fill and submit form', async ({ page }) => {
    // Intercept the Formspree request to avoid real submission
    await page.route('**/formspree.io/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.locator('input[name="name"]').fill('Test User')
    await page.locator('input[name="email"]').fill('test@example.com')
    await page.locator('textarea[name="message"]').fill('Hello from Playwright!')
    await page.getByRole('button', { name: /SEND IT/i }).click()

    // Should show success with the submitted name
    await expect(page.getByText('TICKET RECEIVED')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Test User')).toBeVisible()
  })

  test('shows error message on submit failure', async ({ page }) => {
    await page.route('**/formspree.io/**', async (route) => {
      await route.fulfill({ status: 500, body: 'Server Error' })
    })

    await page.locator('input[name="name"]').fill('Test User')
    await page.locator('input[name="email"]').fill('test@example.com')
    await page.locator('textarea[name="message"]').fill('Hello!')
    await page.getByRole('button', { name: /SEND IT/i }).click()

    // Should show error fallback text
    await expect(page.getByText('Send failed')).toBeVisible({ timeout: 5000 })
  })

  test('honeypot field is hidden', async ({ page }) => {
    const honeypot = page.locator('input[name="_gotcha"]')
    await expect(honeypot).toBeHidden()
  })

  test('textarea has maxLength of 2000', async ({ page }) => {
    const textarea = page.locator('textarea[name="message"]')
    await expect(textarea).toHaveAttribute('maxlength', '2000')
  })
})
