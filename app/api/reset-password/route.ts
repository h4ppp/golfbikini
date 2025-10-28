import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();
        if (!token || !password)
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        // Проверяем токен в таблице password_resets
        const [rows]: any = await db.query(
            "SELECT user_id, expires_at FROM password_resets WHERE token = ?",
            [token]
        );
        const reset = rows?.[0];
        if (!reset) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

        if (new Date(reset.expires_at).getTime() < Date.now())
            return NextResponse.json({ error: "Token expired" }, { status: 400 });

        // Обновляем пароль пользователя
        const hash = await bcrypt.hash(password, 10);
        await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [
            hash,
            reset.user_id,
        ]);

        // Удаляем использованный токен
        await db.query("DELETE FROM password_resets WHERE token = ?", [token]);

        return NextResponse.json({ message: "Password successfully updated" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
