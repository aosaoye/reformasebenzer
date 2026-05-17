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

        // Guardamos en un archivo local.
        // NOTA: En producción (Vercel) esto requeriría una base de datos o un campo JSON en Strapi.
        const layoutPath = path.join(process.cwd(), 'src', 'data', 'layout.json');
        await fs.writeFile(layoutPath, JSON.stringify(data.layout, null, 4), 'utf-8');

        revalidatePath("/");

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error guardando layout:", error);
        return NextResponse.json({ success: false, message: "Error al guardar el layout" }, { status: 500 });
    }
}
