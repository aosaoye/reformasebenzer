import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import fs from 'fs/promises';
import path from 'path';

export async function PUT(request: Request) {
    try {
        const token = cookies().get("admin_token");
        if (!token || token.value !== "authenticated") {
            return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });
        }

        const data = await request.json();

        const dataPath = path.join(process.cwd(), 'src', 'data', 'contact.json');
        await fs.writeFile(dataPath, JSON.stringify(data, null, 4), 'utf-8');

        revalidatePath("/contact");

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error guardando contact:", error);
        return NextResponse.json({ success: false, message: "Error al guardar" }, { status: 500 });
    }
}
