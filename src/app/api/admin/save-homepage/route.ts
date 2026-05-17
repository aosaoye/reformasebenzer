import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchStrapi } from "@/lib/strapi";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request) {
    try {
        // Verificamos que el usuario es un administrador autenticado
        const token = cookies().get("admin_token");
        if (!token || token.value !== "authenticated") {
            return NextResponse.json({ success: false, message: "No autorizado" }, { status: 401 });
        }

        const data = await request.json();

        // 1. Fetch current data to know if it exists and get documentId
        let documentExists = false;
        let documentId = null;
        try {
            const currentDataResponse = await fetchStrapi("homepage", { populate: "*" }, { cache: "no-store" });
            if (currentDataResponse?.data) {
                documentExists = true;
                documentId = currentDataResponse.data.documentId;
            }
        } catch (e) {
            console.log("No previous homepage data found, proceeding with empty defaults.");
        }

        // 2. Prepare payload (only fields we want to update to avoid relations validation errors)
        const strapiPayload: any = {
            heroTitle: data.heroTitle,
            heroSubtitle: data.heroSubtitle,
            heroCtaText: data.ctaText,
            heroCtaLink: data.ctaLink,
            statsYears: Number(data.statsYears),
            statsProjects: Number(data.statsProjects),
            aboutTitle: data.aboutTitle,
            aboutContent: data.aboutContent,
            publishedAt: new Date().toISOString(),
        };

        // Guardamos los campos extra que no existen en el esquema nativo de Strapi
        // localmente en un archivo JSON para evitar errores 400 "Invalid Key"
        const extraData = {
            aboutTitle: data.aboutTitle,
            aboutContent: data.aboutContent,
            aboutSubtitle: data.aboutSubtitle,
            aboutEst: data.aboutEst
        };
        try {
            const fs = require('fs/promises');
            const path = require('path');
            const dataPath = path.join(process.cwd(), 'src', 'data', 'homepage-extra.json');
            await fs.writeFile(dataPath, JSON.stringify(extraData, null, 2), 'utf-8');
        } catch (fsError: any) {
            console.warn("Fallo al guardar archivo local (probablemente en producción/Vercel):", fsError.message);
        }

        const method = documentExists ? "PUT" : "POST";
        const endpoint = documentExists && documentId ? `homepage/${documentId}` : "homepage";

        try {
            const response = await fetchStrapi(endpoint, undefined, {
                method: method,
                cache: "no-store",
                body: JSON.stringify({ data: strapiPayload })
            });

            revalidatePath("/");

            return NextResponse.json({ success: true, data: response.data });
        } catch (strapiError: any) {
            console.error("Detalle del error de Strapi:", strapiError.message);
            return NextResponse.json({ success: false, message: strapiError.message }, { status: 500 });
        }
    } catch (error: any) {
        console.error("Error guardando homepage:", error);
        return NextResponse.json({ success: false, message: error.message || "Error interno del servidor" }, { status: 500 });
    }
}
