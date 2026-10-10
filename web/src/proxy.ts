import { NextResponse, type NextRequest } from "next/server";
import { isLocale, pickLocale } from "@/i18n/config";

/**
 * 1. 言語のない URL（例：/ や /privacy）を、ブラウザの言語に合わせて /en または /ja へ移動する
 * 2. リサーチ管理画面（/{locale}/research）を守る
 *    - RESEARCH_BASIC_AUTH（"ユーザー名:パスワード"）があれば Basic 認証
 *    - 本番（next start）で未設定なら 404（うっかり公開しないため）
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first, second] = pathname.split("/");

  if (!first || !isLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${pickLocale(request.headers.get("accept-language"))}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  if (second === "research") {
    const credentials = process.env.RESEARCH_BASIC_AUTH;
    if (!credentials) {
      if (process.env.NODE_ENV === "production") {
        return new NextResponse("Not found", { status: 404 });
      }
    } else {
      const header = request.headers.get("authorization") ?? "";
      const expected = `Basic ${btoa(credentials)}`;
      if (header !== expected) {
        return new NextResponse("Authentication required", {
          status: 401,
          headers: { "WWW-Authenticate": 'Basic realm="SON research", charset="UTF-8"' },
        });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Next.js の内部ファイル・画像・拡張子つきのファイル（favicon など）は対象外
  matcher: ["/((?!_next|api|.*\\.[\\w]+$).*)"],
};
