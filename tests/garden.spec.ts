import { expect, test, Page } from "@playwright/test";

async function enterGarden(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Omitir bienvenida e ir al jardin" }).click({ timeout: 45000 });
  await expect(page.getByRole("button", { name: "Abrir diario" })).toBeVisible({ timeout: 20000 });
}

test("portrait, landscape and desktop keep the garden and album usable", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await enterGarden(page);
  await page.screenshot({ path: "test-results/garden-portrait.png" });
  await page.getByRole("button", { name: "Abrir diario" }).click();
  await expect(page.getByRole("heading", { name: "Álbum de recuerdos" })).toBeVisible();
  await expect(page.getByText("Tu primera página está esperando")).toBeVisible();
  await expect(page.locator(".album-overlay")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "test-results/album-empty.png" });
  await page.getByRole("button", { name: "Una página", exact: true }).first().click();
  await page.getByLabel("título", { exact: true }).fill("Un recuerdo de prueba");
  await page.getByLabel("mensaje", { exact: true }).fill("Una página para comprobar los márgenes.\n" + "Un recuerdo bonito. ".repeat(80));
  const photo = await page.evaluate(() => {
    const canvas = document.createElement("canvas"); canvas.width = 300; canvas.height = 200;
    const ctx = canvas.getContext("2d")!; ctx.fillStyle = "#497b73"; ctx.fillRect(0, 0, 300, 200);
    ctx.fillStyle = "#ffc977"; ctx.fillRect(80, 40, 140, 120);
    return canvas.toDataURL("image/png").split(",")[1];
  });
  await page.locator('input[type="file"]').setInputFiles({ name: "prueba.png", mimeType: "image/png", buffer: Buffer.from(photo, "base64") });
  await expect(page.getByAltText("Vista previa")).toBeVisible();
  await page.getByRole("button", { name: "guardar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Un recuerdo de prueba" })).toBeVisible();
  await expect(page.locator(".album-page")).toHaveCSS("opacity", "1");
  expect(await page.locator(".album-scroll").evaluate(el => el.scrollTop)).toBe(0);
  await page.screenshot({ path: "test-results/album-portrait.png" });
  await page.getByRole("button", { name: "Cerrar diario" }).click();
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "test-results/garden-landscape.png" });
  // Tap the actual canvas flower after resizing, not only the shortcut.
  await page.locator("canvas").click({ position: { x: 422, y: 90 } });
  await expect(page.getByRole("button", { name: "Cerrar carta" })).toBeVisible();
  await page.getByRole("button", { name: "Cerrar carta" }).click({ position: { x: 5, y: 5 } });
  await page.getByRole("button", { name: "Abrir diario" }).click();
  await expect(page.locator(".album-overlay")).toHaveCSS("opacity", "1");
  await expect(page.locator(".album-page")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "test-results/album-landscape.png" });
  await expect(page.getByRole("heading", { name: "Un recuerdo de prueba" })).toBeVisible();
  const overflow = await page.locator(".album-book").evaluate(el => el.scrollWidth > el.clientWidth + 1);
  expect(overflow).toBe(false);
  await page.getByRole("button", { name: "Cerrar diario" }).click();
  await page.reload();
  await page.getByRole("button", { name: "Omitir bienvenida e ir al jardin" }).click();
  await page.getByRole("button", { name: "Abrir diario" }).click({ timeout: 20000 });
  await expect(page.getByRole("heading", { name: "Un recuerdo de prueba" })).toBeVisible();
  await page.getByRole("button", { name: "Editar recuerdo" }).click();
  await page.getByLabel("título", { exact: true }).fill("Recuerdo editado");
  await page.getByRole("button", { name: "guardar", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Recuerdo editado" })).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Descargar copia del álbum" }).click();
  expect((await downloadPromise).suggestedFilename()).toContain("album-de-recuerdos");
  await page.getByRole("button", { name: "Cerrar diario" }).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "test-results/garden-desktop.png" });
  await page.getByRole("button", { name: "Abrir diario" }).click();
  await expect(page.locator(".album-overlay")).toHaveCSS("opacity", "1");
  await expect(page.locator(".album-page")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "test-results/album-desktop.png" });
  expect(errors).toEqual([]);
});

test("legacy memories migrate once without changing their text", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("nuestro-jardin-diary-v2", JSON.stringify([{ id: "legacy-1", title: "Mi Cumpleaños", message: "estuvo bien!!!", createdAt: "04 ago 2026" }])));
  await enterGarden(page);
  await page.getByRole("button", { name: "Abrir diario" }).click();
  await expect(page.getByRole("heading", { name: "Mi Cumpleaños" })).toBeVisible();
  await expect(page.getByText("estuvo bien!!!")).toBeVisible();
  await page.getByRole("button", { name: "Eliminar recuerdo" }).click();
  await page.getByRole("button", { name: "Eliminar", exact: true }).click();
  await expect(page.getByText("Tu primera página está esperando")).toBeVisible();
  await page.getByRole("button", { name: "Cerrar diario" }).click();
  await page.getByRole("button", { name: "Abrir diario" }).click();
  await expect(page.getByText("Tu primera página está esperando")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("nuestro-jardin-diary-v2"))).toContain("estuvo bien!!!");
});

test("small phone touch targets, long titles, photo rejection and draft protection", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await enterGarden(page);
  const canvas = page.locator("canvas");
  const frame = await canvas.screenshot();
  await page.waitForTimeout(700);
  expect(frame.equals(await canvas.screenshot())).toBe(false);
  // A visible foreground rose retains the original double-tap behavior.
  await canvas.dblclick({ position: { x: 32, y: 410 } });
  await expect(page.getByText("Una flor para ti")).toBeVisible();
  await page.keyboard.press("Escape");
  // The existing message overlay has its own close control.
  await page.getByRole("button", { name: /Recordarlo/ }).click();
  await page.getByRole("button", { name: "Abrir diario" }).click();
  await page.getByRole("button", { name: "Una página", exact: true }).first().click();
  await page.getByLabel("título", { exact: true }).fill("UnRecuerdoMuyLargoSinEspacios".repeat(5));
  await page.locator('input[type="file"]').setInputFiles({ name: "bad.png", mimeType: "image/png", buffer: Buffer.from("not an image") });
  await expect(page.locator(".album-error")).toBeVisible();
  page.once("dialog", async dialog => dialog.dismiss());
  await page.getByRole("button", { name: "Cerrar diario" }).click();
  await expect(page.getByLabel("título", { exact: true })).not.toBeEmpty();
  await page.getByRole("button", { name: "guardar", exact: true }).click();
  await expect(page.locator(".album-page")).toHaveCSS("opacity", "1");
  expect(await page.locator(".album-scroll").evaluate(el => el.scrollWidth > el.clientWidth + 1)).toBe(false);
  await page.screenshot({ path: "test-results/album-small-phone.png" });
});
