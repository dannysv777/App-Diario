import { expect, test } from "@playwright/test";

test("house sign edits persist and the new details fit both orientations", async ({ page }) => {
  await page.goto("/propuesta");
  await page.getByRole("button", { name: "Editar letrero de la casa" }).click();
  await page.getByLabel("Texto del letrero", { exact: true }).fill("Dany y Violeta");
  await page.getByRole("button", { name: "Guardar", exact: true }).click();
  await expect(page.locator(".house-sign span")).toHaveText("Dany y Violeta");
  await page.reload();
  await expect(page.locator(".house-sign span")).toHaveText("Dany y Violeta");
  for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(350);
    await page.screenshot({ path: `test-results/house-details-${viewport.width}.png` });
    await page.getByRole("button", { name: "Editar letrero de la casa" }).click();
    const dialog = (await page.getByRole("dialog").boundingBox())!;
    expect(dialog.x).toBeGreaterThanOrEqual(0);
    expect(dialog.x + dialog.width).toBeLessThanOrEqual(viewport.width);
    expect(dialog.y + dialog.height).toBeLessThanOrEqual(viewport.height);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".house-lantern")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".house-chime-sway")).toHaveCSS("animation-name", "none");
});
