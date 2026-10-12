import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { E2E_INQUIRY_FILE } from "../../playwright.config";

async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe("言語の振り分け", () => {
  test("/ は日本語のブラウザなら /ja へ", async ({ browser }) => {
    const context = await browser.newContext({ locale: "ja-JP" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/ja$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Beyond the Frame.");
    await expect(page.getByRole("navigation", { name: "メイン" }).getByRole("link", { name: "作品" })).toBeVisible();
    await context.close();
  });

  test("/ は英語のブラウザなら /en へ", async ({ browser }) => {
    const context = await browser.newContext({ locale: "en-US" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Beyond the Frame.");
    await context.close();
  });

  test("言語切り替えで同じページの日本語版へ", async ({ page }) => {
    await page.goto("/en/story");
    await page.getByRole("link", { name: "日本語" }).click();
    await expect(page).toHaveURL(/\/ja\/story$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("ストーリー");
  });
});

test.describe("ページ", () => {
  for (const [path, h1] of [
    ["/en", "Beyond the Frame."],
    ["/en/works", "Works"],
    ["/en/works/word-art", "Word Art"],
    ["/en/works/four-word-pair", "Four-Word Pair"],
    ["/en/works/name-art", "Name Art"],
    ["/en/story", "Story"],
    ["/en/commissions", "Commissions"],
    ["/en/contact", "Contact"],
    ["/en/shipping-care", "Shipping & Care"],
    ["/ja/works/name-art", "名前アート"],
  ] as const) {
    test(`${path} が表示され、横にはみ出さない`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
      await noHorizontalOverflow(page);
    });
  }

  test("存在しない作品は、初めてのアクセスでも 404", async ({ page }, testInfo) => {
    const res = await page.goto(`/en/works/does-not-exist-${testInfo.project.name}-${Date.now()}`);
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  });

  test("構想中の作品は価格を出さず、作品番号は未定と表示する", async ({ page }) => {
    await page.goto("/en/works/word-art");
    await expect(page.getByText("Not yet available")).toBeVisible();
    await expect(page.getByText("Assigned when the work is completed")).toBeVisible();
    await expect(page.getByText("60 × 90 × 2 cm / 23.6 × 35.4 × 0.8 in", { exact: false })).toBeVisible();
  });

  test("和道の意味は独自の解釈だと明記している", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByText("not the etymology of the name.", { exact: false })).toBeVisible();
  });
});

test.describe("ウェイティングリスト", () => {
  test("同意しないと登録できない（入力は消えない）", async ({ page }) => {
    await page.goto("/en#waitlist");
    await page.getByLabel("Email", { exact: true }).fill("no-consent@example.com");
    await page.getByLabel("I am a…").selectOption("designer");
    await page.getByRole("button", { name: "Join the waitlist", exact: true }).click();
    await expect(page.getByText("Agree to the privacy policy to join the waitlist.")).toBeVisible();
    await expect(page.getByLabel("Email", { exact: true })).toHaveValue("no-consent@example.com");
  });

  test("登録できて、同じメールで2回目は「更新」になる", async ({ page }, testInfo) => {
    const email = `e2e-${testInfo.project.name}-${Date.now()}@example.com`;
    const expectations = ["Thank you. You are on the list.", "You were already on the list — we have updated your details."];
    for (const [round, expected] of expectations.entries()) {
      await page.goto(`/en?round=${round}#waitlist`);
      await page.getByLabel("Email", { exact: true }).fill(email);
      await page.getByLabel("I am a…").selectOption("architect");
      await page.getByRole("group", { name: /Which kind of work/ }).getByText("Name Art", { exact: true }).click();
      await expect(page.getByRole("radio", { name: "Name Art" })).toBeChecked();
      await page.getByRole("checkbox").check();
      await page.getByRole("button", { name: "Join the waitlist", exact: true }).click();
      await expect(page.getByRole("status")).toHaveText(expected);
    }
  });
});

test.describe("問い合わせ", () => {
  test("作品ページから問い合わせると、作品と種類が選ばれた状態で送れる", async ({ page }, testInfo) => {
    const email = `inquiry-${testInfo.project.name}-${Date.now()}@example.com`;
    await page.goto("/en/works/four-word-pair");
    await page.getByRole("link", { name: "Inquire about this work" }).click();
    await expect(page).toHaveURL(/\/en\/contact\?work=four-word-pair$/);
    await expect(page.getByLabel(/^Work/)).toHaveValue("four-word-pair");
    await expect(page.getByRole("radio", { name: "A work" })).toBeChecked();
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Message", { exact: true }).fill("Is the Four-Word Pair available in a larger size?");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByRole("status")).toContainText("Your message has been received");

    const saved = JSON.parse(readFileSync(E2E_INQUIRY_FILE, "utf8")) as { entries: { email: string; work?: string; type: string }[] };
    expect(saved.entries.find((e) => e.email === email)).toMatchObject({ work: "four-word-pair", type: "purchase" });
  });

  test("特注ページからは「特注」が選ばれる", async ({ page }) => {
    await page.goto("/en/commissions");
    await page.getByRole("link", { name: "Start a conversation" }).click();
    await expect(page.getByRole("radio", { name: "A commission (doors)" })).toBeChecked();
  });

  test("必須の項目が空だと、それぞれの理由を表示する", async ({ page }) => {
    await page.goto("/ja/contact");
    await page.getByRole("button", { name: "送信する" }).click();
    for (const msg of ["お問い合わせの種類を選んでください。", "メールアドレスを正しく入力してください", "メッセージを入力してください", "プライバシーポリシーへの同意が必要です"]) {
      await expect(page.getByText(msg, { exact: false })).toBeVisible();
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
    await context.close();
  });
});
