import { fetchStrapi, getStrapiMedia } from "../strapi";

export interface Product3D {
    id: string | number;
    name: string;
    description: string;
    glbUrl: string;
    poster: string;
}

export async function getCatalog3D(): Promise<Product3D[]> {
    try {
        // This expects a 'products' or 'catalogo3ds' collection type with a 'glb' media field and 'name' field.
        const response = await fetchStrapi("models", { populate: "*" });
        
        if (!response || !response.data) return [];

        return response.data.map((item: any) => {
            const attrs = item.attributes || item;
            return {
                id: item.documentId || item.id,
                name: attrs.name || "Objeto 3D",
                description: attrs.description || "",
                glbUrl: getStrapiMedia(attrs.glb?.url) || "",
                poster: getStrapiMedia(attrs.poster?.url) || ""
            };
        }).filter((p: Product3D) => !!p.glbUrl);
    } catch (error) {
        console.error("Error fetching 3D catalog:", error);
        return [];
    }
}
