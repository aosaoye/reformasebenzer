import { fetchStrapi, getStrapiMedia } from "../strapi";

export interface Product3D {
    id: string | number;
    name: string;
    description: string;
    glbUrl: string;
    poster: string;
}

const FALLBACK_CATALOG: Product3D[] = [
    {
        id: "chair-sample",
        name: "Silla Nórdica Sample",
        description: "Diseño minimalista (Modo Pruebas)",
        glbUrl: "https://modelviewer.dev/shared-assets/models/Chair.glb",
        poster: "https://modelviewer.dev/shared-assets/models/Chair.png"
    },
    {
        id: "mixer-sample",
        name: "Grifería Premium Sample",
        description: "Acabado metálico (Modo Pruebas)",
        glbUrl: "https://modelviewer.dev/shared-assets/models/Mixer.glb",
        poster: "https://modelviewer.dev/shared-assets/models/Mixer.png"
    }
];

export async function getCatalog3D(): Promise<Product3D[]> {
    try {
        // Attempt direct fetch from Strapi first
        const response = await fetchStrapi("models", { populate: "*" });
        
        if (!response || !response.data || response.data.length === 0) {
            // Smart Fallback: Don't break the app, show high quality samples if DB is empty
            return FALLBACK_CATALOG;
        }

        const items = response.data.map((item: any) => {
            const attrs = item.attributes || item;
            return {
                id: item.documentId || item.id,
                name: attrs.name || "Objeto 3D",
                description: attrs.description || "",
                glbUrl: getStrapiMedia(attrs.glb?.url) || "",
                poster: getStrapiMedia(attrs.poster?.url) || ""
            };
        }).filter((p: Product3D) => !!p.glbUrl);

        return items.length > 0 ? items : FALLBACK_CATALOG;
    } catch (error) {
        console.warn("Strapi models endpoint not ready yet. Using local demo assets for continuity.");
        // Critical restoration: Always ensure visualizer has content to play with!
        return FALLBACK_CATALOG;
    }
}

