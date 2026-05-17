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
        if (payload.navbar) {
            newData.navbar = { ...currentData.navbar, ...payload.navbar };
        } else if (payload.siteName) {
            newData.navbar = { ...currentData.navbar, siteName: payload.siteName };
        }

        if (payload.footer) {
            newData.footer = { ...currentData.footer, ...payload.footer };
        } else {
            newData.footer = {
                ...currentData.footer,
                contactEmail: payload.contactEmail !== undefined ? payload.contactEmail : currentData.footer?.contactEmail,
                whatsappNumber: payload.whatsappNumber !== undefined ? payload.whatsappNumber : currentData.footer?.whatsappNumber,
                footerTitle: payload.footerTitle !== undefined ? payload.footerTitle : currentData.footer?.footerTitle,
                address: payload.address !== undefined ? payload.address : currentData.footer?.address,
                hours: payload.hours !== undefined ? payload.hours : currentData.footer?.hours,
            };
        }

        if (payload.theme) newData.theme = { ...currentData.theme, ...payload.theme };

        try {
            await fs.writeFile(dataPath, JSON.stringify(newData, null, 4), 'utf-8');
        } catch (fsError: any) {
            console.warn("Fallo al guardar archivo local de global (Vercel):", fsError.message);
        }

        // Sync with Strapi single type 'global' so that settings persist in production
        const strapiPayload: any = {
            publishedAt: new Date().toISOString()
        };
        if (payload.navbar && payload.navbar.siteName) {
            strapiPayload.siteName = payload.navbar.siteName;
        } else if (payload.siteName) {
            strapiPayload.siteName = payload.siteName;
        }

        if (payload.footer && payload.footer.contactEmail) {
            strapiPayload.contactEmail = payload.footer.contactEmail;
            strapiPayload.whatsappNumber = payload.footer.whatsappNumber;
            strapiPayload.footerTitle = payload.footer.footerTitle;
            strapiPayload.address = payload.footer.address;
            strapiPayload.hours = payload.footer.hours;
        } else {
            if (payload.contactEmail) strapiPayload.contactEmail = payload.contactEmail;
            if (payload.whatsappNumber) strapiPayload.whatsappNumber = payload.whatsappNumber;
            if (payload.footerTitle) strapiPayload.footerTitle = payload.footerTitle;
            if (payload.address) strapiPayload.address = payload.address;
            if (payload.hours) strapiPayload.hours = payload.hours;
        }

        if (Object.keys(strapiPayload).length > 0) {
            try {
                const { fetchStrapi } = require("@/lib/strapi");
                const endpoint = "global";
                await fetchStrapi(endpoint, undefined, {
                    method: "PUT",
                    body: JSON.stringify({ data: strapiPayload })
                });
            } catch (strapiError: any) {
                console.error("Error al sincronizar ajustes globales con Strapi:", strapiError.message);
            }
        }

        revalidatePath("/", "layout");

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error guardando settings globales:", error);
        return NextResponse.json({ success: false, message: error.message || "Error interno del servidor" }, { status: 500 });
    }
}
