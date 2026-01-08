import { test, expect, type Page } from '@playwright/test'

// Use an existing seeded user
const EMAIL = 'alice@example.com'
const PASSWORD = 'password123'

// Helper login
async function login(page: Page) {
    await page.goto('/login')
    await page.fill('input#email', EMAIL)
    await page.fill('input#password', PASSWORD)
    await Promise.all([
        page.waitForNavigation(),
        page.click('button:has-text("Log\u00A0In")'),
    ])
    await expect(page).toHaveURL(/\//);
}

test.describe('Kanban drag/drop', () => {
    test('drags a card fully into another column', async ({ page }) => {
        await login(page)

        await page.goto('/board')
        // wait for columns to render
        await expect(page.locator('text=To Do')).toBeVisible()

        // choose a seeded task card from any column (first visible task title entry)
        // Kanban cards render task titles in `h4` within the draggable card
        const sourceCard = page.locator('h4').first().locator('xpath=ancestor::div[contains(@class, "cursor-pointer") or contains(@class, "Card")]')
        await expect(sourceCard).toBeVisible({ timeout: 5000 })

        // choose destination column (different from source): 'In Progress'
        const destColumn = page.locator('text=In Progress').first()
        await expect(destColumn).toBeVisible({ timeout: 5000 })

        // find column content area (closest ancestor that contains droppable items)
        const destColumnContainer = destColumn.locator('xpath=ancestor::div[contains(@class, "w-80") or contains(@class, "min-h")]').first()

        // compute centers
        const start = await sourceCard.boundingBox()
        const dest = await destColumnContainer.boundingBox()
        if (!start || !dest) throw new Error('Could not measure elements for drag')

        // perform drag: move pointer to center of source, press, move to center of dest, release
        const startX = start.x + start.width / 2
        const startY = start.y + start.height / 2
        const destX = dest.x + dest.width / 2 + 5 // slight offset to ensure within column
        const destY = dest.y + dest.height / 2 + 5 // slight offset to ensure within column

        await page.mouse.move(startX, startY)
        await page.mouse.down()
        // move in steps to ensure full placement
        await page.mouse.move((startX + destX) / 2, (startY + destY) / 2, { steps: 10 })
        await page.mouse.move(destX, destY, { steps: 10 })
        await page.mouse.up()

        // verify the card appears under the destination column by checking it now has ancestor column containing "In Progress"
        // find the card by matching text of the dragged card
        const cardText = await sourceCard.locator('h4, h3').first().innerText().catch(() => '')
        if (!cardText) throw new Error('Could not determine card title')

        // Ensure there's a card with this title inside destination column area
        const destMatch = destColumnContainer.locator(`text=${cardText}`).first()
        await expect(destMatch).toBeVisible({ timeout: 5000 })
    })
})
