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
                image: getStrapiMedia(attributes.mainImage?.url) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
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

        // Limit to 5 gallery images + main image, and 2 videos
        const galleryRaw = attributes.gallery || [];
        const galleryImages = Array.isArray(galleryRaw) 
            ? galleryRaw.map((img: any) => getStrapiMedia(img.url)).filter(Boolean)
            : [];

        // Merge main image first
        const mainImage = getStrapiMedia(attributes.mainImage?.url);
        const allImages = [mainImage, ...galleryImages].filter(Boolean).slice(0, 5);

        const videosRaw = attributes.videos || []; // Anticipating a videos relation/media field
        const videoUrls = Array.isArray(videosRaw)
            ? videosRaw.map((vid: any) => getStrapiMedia(vid.url)).filter(Boolean).slice(0, 2)
            : [];

        return {
            id: item.documentId || item.id,
            name: attributes.title || attributes.name,
            price: attributes.budget || 0,
            category: attributes.category?.name || "Sin categoría",
            image: mainImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
            images: allImages.length > 0 ? allImages : [mainImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop"],
            videos: videoUrls,
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


export async function getHomePage() {
    try {
        const response = await fetchStrapi("homepage", { populate: "*" }, { next: { revalidate: 60 } });
        
        if (!response || !response.data) {
             return null;
        }

        const item = response.data;
        const attributes = item.attributes || item;

        return {
            heroTitle: attributes.heroTitle || "Espacios que cuentan tu historia",
            heroSubtitle: attributes.heroSubtitle || "arquitectura • interiorismo • reformas",
            heroImage: getStrapiMedia(attributes.heroImage?.url) || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=90&w=2000",
            ctaText: attributes.heroCtaText || "Solicitar Presupuesto",
            ctaLink: attributes.heroCtaLink || "/contact",
            aboutTitle: attributes.aboutTitle,
            aboutContent: attributes.aboutContent,
            statsYears: attributes.statsYears || 15,
            statsProjects: attributes.statsProjects || 500
        };
    } catch (error) {
        console.error("Error fetching homepage data:", error);
        return null;
    }
}

export async function getTestimonials() {
    try {
        const response = await fetchStrapi("testimonials", { populate: "*", pagination: { pageSize: 100 } });

        if (!response || !response.data) return [];

        return response.data.map((item: any) => {
            const attrs = item.attributes || item;
            return {
                id: item.id,
                name: attrs.name,
                role: attrs.role || "",
                avatar: getStrapiMedia(attrs.avatar?.url),
                rating: attrs.rating || 5,
                comment: attrs.comment
            };
        });
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return [];
    }
}
