import { expect, test } from "@playwright/test";

test("house finish follows both compositions without intercepting the diary", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/propuesta");
  const finish = page.locator(".proposal-house-finish");
  await expect(finish).toBeVisible();
  await expect(finish).toHaveCSS("pointer-events", "none");
  await expect(page.locator("#house-plaster-clip path")).toHaveAttribute("clip-rule", "evenodd");
  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(300);
    await expect(finish).toHaveAttribute("viewBox", viewport.width < viewport.height ? "0 0 941 1672" : "0 0 1600 900");
    await page.screenshot({ path: `test-results/house-finish-${viewport.width}.png` });
    await page.getByRole("button", { name: "Abrir diario", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Álbum de recuerdos" })).toBeVisible();
    await page.getByRole("button", { name: "Cerrar diario" }).click();
  }
});
