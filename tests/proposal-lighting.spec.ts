import { expect, test } from "@playwright/test";

test("top controls remain inside every viewport from 320 to 400 pixels", async ({ page }) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/propuesta");
  await expect(page.locator(".tree-canopy-rim")).toBeVisible();
  for (let width = 320; width <= 400; width++) {
    await page.setViewportSize({ width, height: 844 });
    const controls = await page.locator(".proposal-control").evaluateAll(nodes => nodes.map(node => {
      const rect = node.getBoundingClientRect();
      const icon = node.querySelector("svg")!.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      return { left: rect.left, right: rect.right, top: rect.top, width: rect.width, height: rect.height, hit: node.contains(hit), iconInside: icon.left >= rect.left && icon.right <= rect.right && icon.top >= rect.top && icon.bottom <= rect.bottom };
    }));
    expect(controls).toHaveLength(4);
    for (const control of controls) {
      expect(control.left, `left at ${width}px`).toBeGreaterThanOrEqual(8);
      expect(control.right, `right at ${width}px`).toBeLessThanOrEqual(width - 8);
      expect(control.top, `top at ${width}px`).toBeGreaterThanOrEqual(8);
      expect(control.width).toBeGreaterThanOrEqual(44);
      expect(control.height).toBeGreaterThanOrEqual(44);
      expect(control.hit).toBe(true);
      expect(control.iconInside).toBe(true);
    }
    for (let i = 1; i < controls.length; i++) expect(controls[i].left).toBeGreaterThan(controls[i - 1].right);
    if ([320, 360, 375, 390, 400].includes(width)) await page.screenshot({ path: `test-results/lighting-${width}.png` });
  }
});

test("rim light is visible, masked and static with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/propuesta");
  const rim = page.locator(".tree-canopy-rim");
  await expect(rim).toBeVisible();
  expect(await rim.evaluate(node => getComputedStyle(node).mixBlendMode)).toBe("screen");
  expect(await rim.evaluate(node => getComputedStyle(node).backgroundImage)).toContain("linear-gradient");
  expect(await page.locator(".tree-shadow").evaluate(node => getComputedStyle(node).animationName)).toBe("none");
  expect(await page.locator(".tree-shadow").evaluate(node => Number(getComputedStyle(node).opacity))).toBeLessThan(.15);
  const before = await page.locator(".tree-canopy").screenshot();
  await rim.evaluate(node => { (node as HTMLElement).style.visibility = "hidden"; });
  expect(before.equals(await page.locator(".tree-canopy").screenshot())).toBe(false);
  await rim.evaluate(node => { (node as HTMLElement).style.removeProperty("visibility"); });
  await page.getByRole("button", { name: "Abrir álbum", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Álbum de recuerdos" })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar diario", exact: true }).click();
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(rim).toBeVisible();
  await page.waitForTimeout(400);
  await page.screenshot({ path: "test-results/lighting-landscape.png" });
});
