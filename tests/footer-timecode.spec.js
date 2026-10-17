import { test, expect } from '@playwright/test'

test.describe('Footer Timecode', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('billu_intro_seen', 'true')
    })
    await page.goto('/')
    await expect(page.locator('main')).toBeVisible({ timeout: 5000 })
  })

  test('footer shows SESSION timecode', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded()
    await expect(page.getByText(/SESSION \d{2}:\d{2}:\d{2}:\d{2}/)).toBeVisible({ timeout: 3000 })
  })

  test('timecode updates over time', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded()
    const tcElement = page.getByText(/SESSION \d{2}:\d{2}:\d{2}:\d{2}/)
    await expect(tcElement).toBeVisible({ timeout: 3000 })

    const firstValue = await tcElement.textContent()
    await page.waitForTimeout(1000)
    const secondValue = await tcElement.textContent()

    expect(secondValue).not.toBe(firstValue)
  })

  test('footer shows vibe coded credit', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded()
    await expect(page.getByText('vibe coded by myself')).toBeVisible()
  })

  test('footer shows copyright', async ({ page }) => {
    await page.locator('footer').scrollIntoViewIfNeeded()
    await expect(page.locator('footer').getByText('©2026 Bilal Curmally')).toBeVisible()
  })
})
