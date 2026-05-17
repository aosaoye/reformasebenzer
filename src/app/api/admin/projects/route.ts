import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchStrapi } from "@/lib/strapi";

// Create a new project
export async function POST(request: Request) {
    try {
        const token = cookies().get("admin_token");
        if (!token || token.value !== "authenticated") {
            return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });
        }

        const { mainImage, galleryUrls, videoUrls, ...strapiData } = await request.json();

        // Create in Strapi 5
        const response = await fetchStrapi("projects", undefined, {
            method: "POST",
            body: JSON.stringify({ data: strapiData })
        });

        if (response.error) {
            return NextResponse.json({ success: false, message: "Error al crear proyecto", details: response.error }, { status: 400 });
        }

        const newId = response.data?.documentId || response.data?.id;

        if (newId) {
            // Save media locally
            const fs = require('fs/promises');
            const path = require('path');
            const mediaPath = path.join(process.cwd(), 'src', 'data', 'projects-media.json');
            let mediaData: any = {};
            try { mediaData = JSON.parse(await fs.readFile(mediaPath, 'utf8')); } catch (e) {}
            mediaData[newId] = { mainImage, galleryUrls, videoUrls };
            try {
                await fs.writeFile(mediaPath, JSON.stringify(mediaData, null, 2));
            } catch (fsError: any) {
                console.warn("Fallo al guardar archivo local de projects-media (Vercel):", fsError.message);
            }
        }

        return NextResponse.json({ success: true, data: response.data });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
    }
}
