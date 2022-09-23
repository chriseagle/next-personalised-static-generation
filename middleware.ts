import { NextRequest, NextResponse } from "next/server";

interface RewriteParams {
  geoBucket: string;
  preference: string;
}

export const config = {
  matcher: '/',
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const rewriteParams = <RewriteParams>{};

  rewriteParams.geoBucket = req?.geo?.country?.toLowerCase() || "uk";
  rewriteParams.preference = req.cookies.get("hm_pref") || "hats";

  const params = Object.keys(rewriteParams).map((key) => {
    return `${key}=${rewriteParams[key as keyof RewriteParams]}`;
  });
  const pathname = `/${params.join("?")}${url.pathname}`;
  url.pathname = pathname;
  return NextResponse.rewrite(url);
}
