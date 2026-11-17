import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canonicalProductSlug, redirectCategorySlug } from "@/lib/legacy-routes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const product = pathname.match(/^\/(en|zh-CN)\/products\/([^/]+)$/);
  if (product) {
    const canonical = canonicalProductSlug(decodeURIComponent(product[2]));
    if (canonical) {
      const url = request.nextUrl.clone();
      url.pathname = `/${product[1]}/products/${canonical}`;
      return NextResponse.redirect(url, 307);
    }
  }
  const shop = pathname.match(/^\/(en|zh-CN)\/shop$/);
  if (shop) {
    const category = request.nextUrl.searchParams.get("category") ?? undefined;
    const next = redirectCategorySlug(category);
    if (category && next) {
      const url = request.nextUrl.clone();
      url.searchParams.set("category", next);
      return NextResponse.redirect(url, 307);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/en/:path*", "/zh-CN/:path*"],
};
