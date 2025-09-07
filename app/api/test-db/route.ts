import { NextResponse } from "next/server";
import { checkDBConnection } from "@/lib/db";

export async function GET() {
    const result = await checkDBConnection();
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
