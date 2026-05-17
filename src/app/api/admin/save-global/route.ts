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

        const payload = await request.json();
        const dataPath = path.join(process.cwd(), 'src', 'data', 'global.json');
        
        let currentData: any = {};
        try {
            const fileData = await fs.readFile(dataPath, 'utf-8');
            currentData = JSON.parse(fileData);
        } catch (e) {
            // File doesn't exist or is invalid
        }
        
        // Deep merge data
        const newData = { ...currentData, ...payload };
        
        // For nested objects like navbar, footer, theme:
        if (payload.navbar) newData.navbar = { ...currentData.navbar, ...payload.navbar };
        if (payload.footer) newData.footer = { ...currentData.footer, ...payload.footer };
        if (payload.theme) newData.theme = { ...currentData.theme, ...payload.theme };

        await fs.writeFile(dataPath, JSON.stringify(newData, null, 4), 'utf-8');

        revalidatePath("/", "layout");

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error guardando settings globales:", error);
        return NextResponse.json({ success: false, message: error.message || "Error interno del servidor" }, { status: 500 });
    }
}
