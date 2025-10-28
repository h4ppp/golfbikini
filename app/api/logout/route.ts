import { NextResponse } from "next/server";

export async function POST() {
    // Создаём JSON-ответ
    const res = NextResponse.json({ message: "Logged out successfully" });

    // Удаляем cookie "token"
    res.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // важно для HTTPS на Vercel
        sameSite: "lax",
        path: "/",
        expires: new Date(0), // гарантированное удаление
    });

    return res;
}
