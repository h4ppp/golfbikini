import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // Пользователь авторизован → не пускаем на sign-in и create-account
    if (token && (pathname.startsWith("/sign-in") || pathname.startsWith("/create-account"))) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = "/account";
        return NextResponse.redirect(redirectUrl);
    }

    // Пользователь не авторизован → не пускаем на /account
    if (!token && pathname.startsWith("/account")) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = "/sign-in";
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/sign-in", "/create-account", "/account/:path*"],
};
