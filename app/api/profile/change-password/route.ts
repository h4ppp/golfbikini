import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = verifyToken(token);
        if (!payload)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { newPassword } = await req.json();

        if (!newPassword)
            return NextResponse.json({ error: "New password required" }, { status: 400 });

        const hash = await bcrypt.hash(newPassword, 10);

        await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [
            hash,
            (payload as any).id,
        ]);

        return NextResponse.json({ message: "Password changed successfully" });
    } catch (err) {
        console.error("Error changing password:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
