import { expect, test } from "@playwright/test";

test("companion strolls, drinks and pauses without blocking the garden", async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => .5; });
  await page.goto("/propuesta");
  const dog = page.locator(".garden-companion");
  await expect(dog).toBeVisible();
  await expect(page.locator(".companion-flowers")).toHaveCount(2);
  await expect(dog).toHaveCSS("pointer-events", "none");
  await expect(dog).toHaveAttribute("data-action", "walk", { timeout: 10000 });
  await expect(dog).toHaveAttribute("data-action", "drink", { timeout: 20000 });
  await page.screenshot({ path: "test-results/companion-drinking.png" });
  await page.getByRole("button", { name: "Tocar al perrito" }).click();
  await expect(dog).toHaveAttribute("data-action", "rest");
  await page.waitForTimeout(10200);
  await expect(dog).toHaveAttribute("data-action", "sleep");
  await page.getByRole("button", { name: "Tocar al perrito" }).click();
  await expect(dog).toHaveAttribute("data-action", "walk");
  await page.screenshot({ path: "test-results/companion-sniffing.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(dog).toHaveAttribute("data-reduced", "true");
  await expect(dog).toHaveAttribute("data-action", "rest");
  await expect(page.locator(".dog-tail")).toHaveCSS("animation-name", "none");
  for (const viewport of [{ width: 320, height: 568 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(300);
    const box = (await page.locator(".companion-dog").boundingBox())!;
    expect(box.x).toBeGreaterThan(0);
    expect(box.x + box.width).toBeLessThan(viewport.width);
    expect(box.y + box.height).toBeLessThan(viewport.height);
    await page.screenshot({ path: `test-results/companion-${viewport.width}.png` });
  }
});
