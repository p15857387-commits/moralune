import { expect, test } from "@playwright/test";

test("root opens the English home and language switch still reaches Chinese", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("A quieter way to furnish");
  await page.getByRole("link", { name: "切换到中文" }).click();
  await expect(page).toHaveURL(/\/zh-CN\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("刚刚好的美");
  await page.getByRole("link", { name: "Switch to English" }).click();
  await expect(page).toHaveURL(/\/en\/?$/);
});

test("browse, select and submit an inquiry", async ({ page }) => {
  await page.goto("/zh-CN");
  await page.getByRole("link", { name: "探索" }).first().click();
  await page.getByRole("link", { name: "山岚胡桃木托盘" }).first().click();
  await page.getByRole("button", { name: /加入清单/ }).click();
  await page.getByLabel(/选物清单/).click();
  await page.getByLabel("你的姓名").fill("林清");
  await page.getByLabel("邮箱").fill("lin@example.com");
  await page.getByLabel("所在地区").fill("上海");
  await page.getByRole("button", { name: "提交选品意向" }).click();
  await expect(page.getByText("谢谢，让我们接着聊。")).toBeVisible();
});

test("language switch preserves the selection", async ({ page }) => {
  await page.goto("/zh-CN/products/walnut-landing-tray");
  await page.getByRole("button", { name: /加入清单/ }).click();
  await page.getByRole("link", { name: "Switch to English" }).click();
  await page.getByLabel(/Selection 1/).click();
  await expect(page.getByRole("heading", { name: "Mist walnut landing tray" })).toBeVisible();
});
