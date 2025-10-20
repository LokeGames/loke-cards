// E2E: Project scoping and live update without reload
// Assumes dev server on 8081. Run with: npm test

import { test, expect } from '@playwright/test'

test.describe('Project scoping', () => {
  test('scene belongs to active project and hides on switch', async ({ page }) => {
    const base = 'http://127.0.0.1:8081'
    await page.goto(base + '/settings')

    // Create a new project "proj-e2e" and set active
    await page.getByLabel('New project name').fill('proj-e2e')
    await page.getByRole('button', { name: 'Create' }).click()
    // Set active
    await page.getByRole('button', { name: 'Set Active' }).first().click()

    // Go to new scene
    await page.goto(base + '/scene/new')
    // Fill Scene ID
    await page.locator('#scene-id').fill('scene_e2e_proj')
    // Select Chapter → Create new chapter inline
    await page.locator('#chapter-select').selectOption('__new__')
    await page.getByPlaceholder('chapter01').fill('chapter_e2e')
    await page.getByRole('button', { name: 'Add' }).click()
    // Fill Scene Text
    await page.getByPlaceholder('Notes, communication, or meta info...').click() // focus elsewhere
    // Try to find a textarea for scene text by label
    await page.getByLabel('Scene Text', { exact: false }).fill('E2E Text for proj')
    // Save Scene
    await page.getByRole('button', { name: 'Save Scene' }).click()
    // Navigate to Scenes list
    await page.goto(base + '/scenes')
    // Expect scene visible
    await expect(page.getByText('scene_e2e_proj')).toBeVisible()

    // Switch back to default project via header ProjectPicker
    await page.getByLabel('Project').selectOption('default')
    // Scene should be hidden in default project
    await expect(page.getByText('scene_e2e_proj')).toHaveCount(0)

    // Switch back to proj-e2e
    await page.getByLabel('Project').selectOption('proj-e2e')
    await expect(page.getByText('scene_e2e_proj')).toBeVisible()
  })
})

