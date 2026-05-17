import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from 'fs/promises';
import path from 'path';

export async function PUT(request: Request) {
    try {
        const token = cookies().get("admin_token");
        if (!token || token.value !== "authenticated") {
            return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });
        }

        const data = await request.json();
        const dataPath = path.join(process.cwd(), 'src', 'data', 'projects-page.json');
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error guardando projects-page:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
