import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchStrapi } from "@/lib/strapi";

// Update an existing project
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const token = cookies().get("admin_token");
        if (!token || token.value !== "authenticated") {
            return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });
        }

        const { mainImage, galleryUrls, videoUrls, ...strapiData } = await request.json();
        strapiData.publishedAt = new Date().toISOString();
        const { id } = params;

        // Save media locally
        const fs = require('fs/promises');
        const path = require('path');
        const mediaPath = path.join(process.cwd(), 'src', 'data', 'projects-media.json');
        let mediaData: any = {};
        try { mediaData = JSON.parse(await fs.readFile(mediaPath, 'utf8')); } catch (e) {}
        mediaData[id] = { mainImage, galleryUrls, videoUrls };
        try {
            await fs.writeFile(mediaPath, JSON.stringify(mediaData, null, 2));
        } catch (fsError: any) {
            console.warn("Fallo al guardar archivo local de projects-media (Vercel):", fsError.message);
        }

        // Update in Strapi 5
        const response = await fetchStrapi(`projects/${id}`, { status: "published" }, {
            method: "PUT",
            body: JSON.stringify({ data: strapiData })
        });

        if (response.error) {
            return NextResponse.json({ success: false, message: "Error al actualizar proyecto", details: response.error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: response.data });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
    }
}

// Delete an existing project
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const token = cookies().get("admin_token");
        if (!token || token.value !== "authenticated") {
            return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });
        }

        const { id } = params;

        // Delete in Strapi 5
        const response = await fetchStrapi(`projects/${id}`, undefined, {
            method: "DELETE"
        });

        if (response && response.error) {
            return NextResponse.json({ success: false, message: "Error al eliminar proyecto", details: response.error }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
    }
}
