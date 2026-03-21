import { test, expect } from '@playwright/test'

test.describe('Project Lightbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('billu_intro_seen', 'true')
    })
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
    await page.locator('#work').scrollIntoViewIfNeeded()
  })

  test('clicking a project card opens the lightbox', async ({ page }) => {
    const firstCard = page.locator('#work .project-card').first()
    await firstCard.click()
    await expect(page.getByText('PROJECT DETAILS')).toBeVisible({ timeout: 3000 })
  })

  test('lightbox shows project title and metadata', async ({ page }) => {
    const firstCard = page.locator('#work .project-card').first()
    await firstCard.click()
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible({ timeout: 3000 })
    await expect(dialog.locator('text=CLIENT')).toBeVisible()
    await expect(dialog.locator('text=TYPE')).toBeVisible()
  })

  test('lightbox shows WATCH CTA for projects with URL', async ({ page }) => {
    const firstCard = page.locator('#work .project-card').first()
    await firstCard.click()
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible({ timeout: 3000 })
    await expect(dialog.getByText('WATCH')).toBeVisible()
  })

  test('clicking overlay background closes lightbox', async ({ page }) => {
    const firstCard = page.locator('#work .project-card').first()
    await firstCard.click()
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible({ timeout: 3000 })
    // Click the overlay (not the card content)
    await dialog.click({ position: { x: 10, y: 10 } })
    await expect(dialog).toBeHidden({ timeout: 3000 })
  })

  test('pressing Escape closes lightbox', async ({ page }) => {
    const firstCard = page.locator('#work .project-card').first()
    await firstCard.click()
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible({ timeout: 3000 })
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden({ timeout: 3000 })
  })

  test('close button closes lightbox', async ({ page }) => {
    const firstCard = page.locator('#work .project-card').first()
    await firstCard.click()
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible({ timeout: 3000 })
    await dialog.getByLabel('Close lightbox').click()
    await expect(dialog).toBeHidden({ timeout: 3000 })
  })

  test('keyboard Enter opens lightbox on focused card', async ({ page }) => {
    const firstCard = page.locator('#work .project-card').first()
    await firstCard.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByText('PROJECT DETAILS')).toBeVisible({ timeout: 3000 })
  })
})
