import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        console.log("LOGIN ATTEMPT:", { email });

        // --- 1. Проверяем пользователя ---
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = (rows as any[])[0];
        if (!user) {
            console.log("USER NOT FOUND:", email);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // --- 2. Проверяем пароль ---
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            console.log("INVALID PASSWORD FOR:", email);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // --- 3. Генерируем токен ---
        const token = signToken({ id: user.id, email: user.email });
        console.log("TOKEN GENERATED:", token);

        // --- 4. Создаём ответ и устанавливаем cookie ---
        const res = NextResponse.json(
            { message: "Logged in successfully", token },
            { status: 200 }
        );

        res.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Только HTTPS в проде
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 дней
        });

        console.log("COOKIE SET SUCCESSFULLY");

        return res;
    } catch (err) {
        console.error("LOGIN API ERROR:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
