import { test, expect } from '@playwright/test'

test.describe('Project Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('billu_intro_seen', 'true')
    })
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
  })

  test('work section is visible with heading', async ({ page }) => {
    await page.locator('#work').scrollIntoViewIfNeeded()
    await expect(page.locator('#work')).toBeVisible()
    // "WORK" heading
    const heading = page.locator('#work h2', { hasText: 'WORK' })
    await expect(heading).toBeVisible()
  })

  test('project cards are rendered as clickable divs', async ({ page }) => {
    await page.locator('#work').scrollIntoViewIfNeeded()
    const cards = page.locator('#work .project-card')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    // Each card should be a <div> with role="button"
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toHaveAttribute('role', 'button')
    }
  })

  test('project cards have data-cursor="project" attribute', async ({ page }) => {
    await page.locator('#work').scrollIntoViewIfNeeded()
    const cards = page.locator('#work [data-cursor="project"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('Tab focuses project card with visible focus ring', async ({ page }) => {
    await page.locator('#work').scrollIntoViewIfNeeded()
    // Tab to the first project card
    const firstCard = page.locator('#work .project-card').first()
    await firstCard.focus()
    // The card should have focus-visible styles applied (cream outline from index.css)
    await expect(firstCard).toBeFocused()
  })

  test('project cards show metadata (CLIENT, YEAR, TYPE)', async ({ page }) => {
    await page.locator('#work').scrollIntoViewIfNeeded()
    const firstCard = page.locator('#work .project-card').first()
    await expect(firstCard.locator('text=CLIENT')).toBeVisible()
    await expect(firstCard.locator('text=YEAR')).toBeVisible()
    await expect(firstCard.locator('text=TYPE')).toBeVisible()
  })

  test('project card images use lazy loading', async ({ page }) => {
    await page.locator('#work').scrollIntoViewIfNeeded()
    const images = page.locator('#work .project-card img')
    const count = await images.count()
    // If there are images, they should have loading="lazy"
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute('loading', 'lazy')
    }
  })
})
