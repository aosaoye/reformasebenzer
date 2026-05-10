import { fetchStrapi, getStrapiMedia } from "@/lib/strapi";
import { projects as mockProjects, Project as MockProject } from "@/lib/data";

export async function getAllProjects(categorySlug?: string) {
    try {
        const query: any = {
            populate: "*",
        };

        if (categorySlug && categorySlug !== "Todos") {
            query.filters = {
                category: {
                    name: {
                        $eq: categorySlug,
                    }
                }
            };
        }

        // Fetch from Strapi 5
        const response = await fetchStrapi("projects", query, { next: { revalidate: 60 } });
        
        if (!response || !response.data) {
             return mockProjects;
        }

        // Map Strapi response to app project shape
        return response.data.map((item: any) => {
            const attributes = item.attributes || item; // Handle Strapi 5 different format variations
            return {
                id: item.documentId || item.id,
                name: attributes.title || attributes.name,
                price: attributes.budget || 0,
                category: attributes.category?.name || "Sin categoría",
                image: getStrapiMedia(attributes.mainImage?.url) || "/placeholder-image.jpg",
                description: attributes.description || "",
                details: [
                    `Ubicación: ${attributes.location || 'N/A'}`,
                    `Plazo: ${attributes.timeline || 'N/A'}`,
                    `Garantía: ${attributes.warranty || 'N/A'}`
                ]
            };
        });
    } catch (error) {
        console.warn("Could not fetch projects from Strapi, falling back to mock data", error);
        // Graceful degradation to mock data during transition
        return categorySlug && categorySlug !== "Todos" 
            ? mockProjects.filter(p => p.category === categorySlug) 
            : mockProjects;
    }
}

export async function getProjectById(id: string) {
    try {
        const response = await fetchStrapi(`projects/${id}`, { populate: "*" }, { next: { revalidate: 60 } });
        
        if (!response || !response.data) {
             return mockProjects.find(p => p.id.toString() === id) || null;
        }

        const item = response.data;
        const attributes = item.attributes || item;

        return {
            id: item.documentId || item.id,
            name: attributes.title || attributes.name,
            price: attributes.budget || 0,
            category: attributes.category?.name || "Sin categoría",
            image: getStrapiMedia(attributes.mainImage?.url) || "/placeholder-image.jpg",
            description: attributes.description || "",
            details: [
                `Ubicación: ${attributes.location || 'N/A'}`,
                `Plazo: ${attributes.timeline || 'N/A'}`,
                `Garantía: ${attributes.warranty || 'N/A'}`
            ]
        };
    } catch (error) {
        return mockProjects.find(p => p.id.toString() === id) || null;
    }
}
