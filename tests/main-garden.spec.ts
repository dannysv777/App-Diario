import { expect, test } from "@playwright/test";

test("welcome enters the new main garden and the previous garden remains accessible", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Omitir bienvenida e ir al jardin" }).click({ timeout: 20000 });
  await expect(page.getByRole("button", { name: "Tocar al perrito" })).toBeVisible();
  await page.getByRole("button", { name: "Abrir álbum", exact: true }).click();
  await expect(page.getByRole("button", { name: "Cerrar diario" })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar diario" }).click();
  await page.getByRole("link", { name: "Ver jardín anterior" }).click();
  await expect(page).toHaveURL(/\/anterior$/);
  await page.getByRole("button", { name: "Omitir bienvenida e ir al jardin" }).click({ timeout: 20000 });
  await expect(page.getByRole("button", { name: "Abrir diario", exact: true })).toBeVisible();
  await expect(page.locator(".garden-companion")).toHaveCount(0);
});
