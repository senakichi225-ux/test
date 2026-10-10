import { expect, test } from "@playwright/test";

test.describe("言語の振り分け", () => {
  test("/ は日本語のブラウザなら /ja へ", async ({ browser }) => {
    const context = await browser.newContext({ locale: "ja-JP" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/ja$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("光を抱く、紙。");
    await context.close();
  });

  test("/ は英語のブラウザなら /en へ", async ({ browser }) => {
    const context = await browser.newContext({ locale: "en-US" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Paper that holds the light.");
    await context.close();
  });

  test("言語切り替えで同じページの日本語版へ", async ({ page }) => {
    await page.goto("/en/privacy");
    await page.getByRole("link", { name: "日本語" }).click();
    await expect(page).toHaveURL(/\/ja\/privacy$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("プライバシーポリシー");
  });
});

test.describe("LP", () => {
  test("主なセクションがそろい、横にはみ出さない", async ({ page }) => {
    await page.goto("/en");
    for (const name of ["What SŌN stands for", "Directions we are exploring", "Made by many hands", "Join the waitlist"]) {
      await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("同意しないと登録できない", async ({ page }) => {
    await page.goto("/en#waitlist");
    await page.getByLabel("Email", { exact: true }).fill("no-consent@example.com");
    await page.getByLabel("I am a…").selectOption("designer");
    await page.getByRole("button", { name: "Join the waitlist", exact: true }).click();
    await expect(page.getByText("Please agree to the privacy policy to continue.")).toBeVisible();
    // 入力した内容は消えない
    await expect(page.getByLabel("Email", { exact: true })).toHaveValue("no-consent@example.com");
  });

  test("登録できて、同じメールで2回目は「更新」になる", async ({ page }, testInfo) => {
    const email = `e2e-${testInfo.project.name}-${Date.now()}@example.com`;
    const expectations = ["Thank you. You are on the list.", "You were already on the list — we have updated your details."];
    for (const [round, expected] of expectations.entries()) {
      // 毎回ページを読み直す（同じURL＋#だけだと読み直されない）
      await page.goto(`/en?round=${round}#waitlist`);
      await page.getByLabel("Email", { exact: true }).fill(email);
      await page.getByLabel("I am a…").selectOption("architect");
      await page.getByRole("group", { name: /Which would you/ }).getByText("Frame kits").click();
      await expect(page.getByRole("radio", { name: "Frame kits" })).toBeChecked();
      await page.getByRole("checkbox").check();
      await page.getByRole("button", { name: "Join the waitlist", exact: true }).click();
      await expect(page.getByRole("status")).toHaveText(expected);
    }
  });
});

test.describe("リサーチ管理画面", () => {
  test("認証がないと見られない", async ({ page }) => {
    const res = await page.goto("/en/research");
    expect(res?.status()).toBe(401);
  });

  test("認証すると表示され、検索エンジンに載せない設定になっている", async ({ browser }) => {
    const context = await browser.newContext({ httpCredentials: { username: "e2e", password: "secret" } });
    const page = await context.newPage();
    await page.goto("/ja/research");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("リサーチダッシュボード");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByRole("heading", { name: /製品規格/ })).toBeVisible();
    await context.close();
  });
});
