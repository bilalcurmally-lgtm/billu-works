import { test, expect } from '@playwright/test'

test.describe('404 Page', () => {
  test('unknown path shows FILM NOT FOUND', async ({ page }) => {
    await page.goto('/nonexistent-page')
    await expect(page.getByText('FILM NOT FOUND')).toBeVisible({ timeout: 5000 })
  })

  test('back link navigates to home', async ({ page }) => {
    await page.goto('/nonexistent-page')
    await expect(page.getByText('FILM NOT FOUND')).toBeVisible({ timeout: 5000 })
    const backLink = page.getByText('BACK TO MAIN FEATURE')
    await expect(backLink).toBeVisible()
    await backLink.click()
    await expect(page).toHaveURL('/')
  })
})
