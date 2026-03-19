import { test, expect } from '@playwright/test'

test.describe('Opening Animation & Site Entry', () => {
  test.beforeEach(async ({ context }) => {
    // Clear sessionStorage so intro plays each time
    await context.clearCookies()
  })

  test('shows BILLU name and ticket on load', async ({ page }) => {
    await page.goto('/')
    // The opening overlay should be visible
    const overlay = page.locator('.fixed.inset-0.z-\\[9999\\]')
    await expect(overlay).toBeVisible()
    // BILLU text is present
    await expect(page.getByText('BILLU')).toBeVisible()
    // Ticket with BILAL CURMALLY
    await expect(page.getByText('BILAL CURMALLY')).toBeVisible()
    // CLICK TO ENTER hint
    await expect(page.getByText('CLICK TO ENTER')).toBeVisible()
  })

  test('clicking ticket reveals main site', async ({ page }) => {
    await page.goto('/')
    // Wait for ticket to be interactive
    const ticket = page.getByRole('button', { name: 'Enter site' })
    await expect(ticket).toBeVisible({ timeout: 5000 })
    await ticket.click()
    // Main site should appear — hero section with "WORK" heading or nav
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
    // Opening overlay should be gone
    await expect(page.locator('.fixed.inset-0.z-\\[9999\\]')).toBeHidden({ timeout: 3000 })
  })

  test('sessionStorage skip: second visit skips intro', async ({ page }) => {
    await page.goto('/')
    // Click ticket to enter
    const ticket = page.getByRole('button', { name: 'Enter site' })
    await expect(ticket).toBeVisible({ timeout: 5000 })
    await ticket.click()
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
    // Now reload — intro should be skipped
    await page.reload()
    await expect(page.locator('main')).toBeVisible({ timeout: 3000 })
    // Opening overlay should NOT appear
    await expect(page.locator('.fixed.inset-0.z-\\[9999\\]')).toBeHidden()
  })

  test('ADMIT ONE text visible on ticket', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Admit One')).toBeVisible({ timeout: 5000 })
  })
})
