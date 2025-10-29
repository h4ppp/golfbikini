import { NextResponse, NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        // 1️⃣ Проверяем наличие токена
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2️⃣ Проверяем JWT
        const payload = verifyToken(token);
        if (!payload || !(payload as any).id) {
            // ❌ Если токен просрочен — сразу чистим cookie
            const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            res.cookies.set("token", "", {
                httpOnly: true,
                path: "/",
                maxAge: 0,
            });
            return res;
        }

        // 3️⃣ Получаем пользователя по ID
        const [rows] = await db.query(
            "SELECT id, email, first_name, second_name, favorite_videos FROM users WHERE id = ?",
            [(payload as any).id]
        );
        const user = (rows as any[])[0];

        if (!user) {
            const res = NextResponse.json({ error: "User not found" }, { status: 404 });
            // Можно дополнительно удалить cookie
            res.cookies.set("token", "", {
                httpOnly: true,
                path: "/",
                maxAge: 0,
            });
            return res;
        }

        // 4️⃣ Обрабатываем список избранных видео
        let favoriteVideos: string[] = [];
        try {
            favoriteVideos = user.favorite_videos
                ? JSON.parse(user.favorite_videos)
                : [];
        } catch {
            favoriteVideos = [];
        }

        // 5️⃣ Формируем ответ
        return NextResponse.json(
            {
                id: user.id,
                email: user.email,
                first_name: user.first_name || "",
                second_name: user.second_name || "",
                favorite_videos: favoriteVideos,
            },
            { status: 200 }
        );

    } catch (err) {
        console.error("PROFILE API ERROR:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
