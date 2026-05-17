import { fetchStrapi, getStrapiMedia } from "@/lib/strapi";
import { projects as mockProjects, Project as MockProject } from "@/lib/data";

const fallbacks = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop", // Luxury Kitchen
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1000&auto=format&fit=crop", // Modern Interior
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1000&auto=format&fit=crop", // Minimalist Bedroom
    "https://images.unsplash.com/photo-1556911223-e4520288df81?q=80&w=1000&auto=format&fit=crop", // Premium Kitchen
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop", // Luxury Bath
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop"  // Elegant Lounge
];

function getFallbackImage(projId: string | number, index?: number) {
    if (typeof index === 'number') {
        return fallbacks[index % fallbacks.length];
    }
    const strId = String(projId);
    let hash = 0;
    for (let j = 0; j < strId.length; j++) {
        hash = strId.charCodeAt(j) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % fallbacks.length;
    return fallbacks[idx];
}

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
        const response = await fetchStrapi("projects", query, { cache: "no-store" });
        
        if (!response || !response.data) {
             return mockProjects;
        }

        let mediaData: any = {};
        try {
            const fs = require('fs');
            const path = require('path');
            const mediaPath = path.join(process.cwd(), 'src', 'data', 'projects-media.json');
            if (fs.existsSync(mediaPath)) {
                mediaData = JSON.parse(fs.readFileSync(mediaPath, 'utf8'));
            }
        } catch (e) {}

        // Map Strapi response to app project shape
        return response.data.map((item: any, i: number) => {
            const attributes = item.attributes || item; // Handle Strapi 5 different format variations
            const id = item.documentId || item.id;
            const customMedia = mediaData[id] || {};
            const fallback = getFallbackImage(id, i);
            
            return {
                id,
                name: attributes.title || attributes.name,
                price: attributes.budget || 0,
                category: attributes.category?.name || "Sin categoría",
                image: customMedia.mainImage || getStrapiMedia(attributes.mainImage?.url) || fallback,
                images: customMedia.galleryUrls && customMedia.galleryUrls.length > 0 ? [customMedia.mainImage, ...customMedia.galleryUrls].filter(Boolean) : undefined,
                videos: customMedia.videoUrls || undefined,
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
        const response = await fetchStrapi(`projects/${id}`, { populate: "*" }, { cache: "no-store" });
        
        if (!response || !response.data) {
             return mockProjects.find(p => p.id.toString() === id) || null;
        }

        const item = response.data;
        const attributes = item.attributes || item;

        let customMedia: any = {};
        try {
            const fs = require('fs');
            const path = require('path');
            const mediaPath = path.join(process.cwd(), 'src', 'data', 'projects-media.json');
            if (fs.existsSync(mediaPath)) {
                customMedia = JSON.parse(fs.readFileSync(mediaPath, 'utf8'))[id] || {};
            }
        } catch (e) {}

        // Limit to 5 gallery images + main image, and 2 videos
        const galleryRaw = attributes.gallery || [];
        const galleryImages = Array.isArray(galleryRaw) 
            ? galleryRaw.map((img: any) => getStrapiMedia(img.url)).filter(Boolean)
            : [];

        // Merge main image first
        const mainImage = customMedia.mainImage || getStrapiMedia(attributes.mainImage?.url);
        const allImages = customMedia.galleryUrls?.length > 0 ? [mainImage, ...customMedia.galleryUrls].filter(Boolean).slice(0, 5) : [mainImage, ...galleryImages].filter(Boolean).slice(0, 5);

        const videosRaw = attributes.videos || []; // Anticipating a videos relation/media field
        const videoUrls = customMedia.videoUrls?.length > 0 ? customMedia.videoUrls : Array.isArray(videosRaw)
            ? videosRaw.map((vid: any) => getStrapiMedia(vid.url)).filter(Boolean).slice(0, 2)
            : [];

        const fallback = getFallbackImage(id);
        return {
            id,
            name: attributes.title || attributes.name,
            price: attributes.budget || 0,
            category: attributes.category?.name || "Sin categoría",
            image: mainImage || fallback,
            images: allImages.length > 0 ? allImages : [mainImage || fallback],
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
        const response = await fetchStrapi("homepage", { populate: "*" }, { cache: "no-store" });
        
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

export async function getGlobalSettings() {
    try {
        const response = await fetchStrapi("global", { populate: "*" }, { cache: "no-store" });
        
        if (!response || !response.data) {
            return null;
        }

        const attrs = response.data.attributes || response.data;
        
        return {
            siteName: attrs.siteName || "Ebenzer",
            topBanner: attrs.topBanner || "Presupuestos sin compromiso | Calidad garantizada en toda España",
            whatsappNumber: attrs.whatsappNumber || "34600000000",
            contactEmail: attrs.contactEmail || "info@reformasebenzer.com",
            socialLinks: {
                facebook: attrs.facebookUrl,
                instagram: attrs.instagramUrl,
                linkedin: attrs.linkedinUrl
            },
            logo: getStrapiMedia(attrs.logo?.url)
        };
    } catch (error) {
        console.warn("Could not fetch global settings, using defaults");
        return null;
    }
}

