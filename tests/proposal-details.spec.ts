import { expect, test } from "@playwright/test";

test("sky captions are opt-in, handwritten and clear of the controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/propuesta");
  await expect(page.locator(".sky-label-layer")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".proposal-sky-peek")).toHaveCount(0);
  await expect(page.locator(".sky-label-layer .historic-sky-labels")).toHaveCSS("visibility", "hidden");
  await page.getByRole("button", { name: "Mostrar constelaciones del jardín", exact: true }).click();
  for (const width of [320, 360, 390, 400]) {
    await page.setViewportSize({ width, height: 844 });
    await page.waitForTimeout(200);
    const captions = page.locator(".sky-label-layer text");
    expect(await captions.count()).toBeGreaterThan(0);
    for (const caption of await captions.all()) {
      const box = (await caption.boundingBox())!;
      expect(box.x).toBeGreaterThan(10);
      expect(box.x + box.width).toBeLessThan(width - 10);
      expect(box.y).toBeGreaterThan(65);
      expect(await caption.evaluate(node => getComputedStyle(node).fontFamily)).toContain("Garden Caveat");
    }
    await page.screenshot({ path: `test-results/details-${width}.png` });
  }
  await expect(page.locator(".proposal-notebook")).toHaveCSS("rotate", /^(0deg|none)$/);
  const backgrounds = await page.locator(".proposal-shortcuts .proposal-control").evaluateAll(nodes => nodes.map(node => getComputedStyle(node).background));
  expect(new Set(backgrounds).size).toBe(1);
  expect(await page.locator(".proposal-world").evaluate(node => getComputedStyle(node, "::before").opacity)).toBe("0.07");
  await page.getByRole("button", { name: "Abrir carta del tulipán" }).click();
  await expect(page.getByRole("button", { name: "volver al jardin" })).toBeVisible();
  await page.getByRole("button", { name: "volver al jardin" }).click();
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "test-results/details-landscape.png" });
});
