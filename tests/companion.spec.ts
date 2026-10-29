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
  await page.getByRole("button", { name: "Abrir álbum", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Álbum de recuerdos" })).toBeVisible();
  await expect(dog).toHaveAttribute("data-active", "false");
  const position = await page.locator(".companion-position").getAttribute("style");
  await page.waitForTimeout(500);
  expect(await page.locator(".companion-position").getAttribute("style")).toBe(position);
  await page.getByRole("button", { name: "Cerrar diario" }).click();
  await expect(dog).toHaveAttribute("data-active", "true");
  await expect(dog).toHaveAttribute("data-action", "sniff", { timeout: 25000 });
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
