import { fetchStrapi } from "../strapi";

export interface Testimonial {
    id: string | number;
    name: string;
    email: string;
    rating: number;
    comment: string;
    publishedAt: string;
}

export async function getAllTestimonials() {
    try {
        // Fetch published testimonials sorted by date descending
        const response = await fetchStrapi("testimonials", {
            sort: ["createdAt:desc"],
            filters: {
                // Ensure we only show approved/published items (Strapi handles this automatically generally)
            }
        }, { next: { revalidate: 60 } });

        if (!response || !response.data) return [];

        return response.data.map((item: any) => {
            const attrs = item.attributes || item;
            return {
                id: item.documentId || item.id,
                name: attrs.name || "Cliente Anónimo",
                rating: attrs.rating || 5,
                comment: attrs.comment || "",
                publishedAt: attrs.publishedAt
            };
        });
    } catch (error) {
        console.error("Failed to load testimonials:", error);
        return [];
    }
}

export async function submitTestimonial(data: { name: string, email: string, rating: number, comment: string }) {
    // This method connects to our internal route handler from the client, 
    // or directly to Strapi if run on server side.
    // For direct Strapi integration we'd do a POST:
    try {
        const response = await fetchStrapi("testimonials", {}, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: {
                    ...data,
                    publishedAt: null // Explicitly send as Draft so Admin can approve it before it shows up live!
                }
            })
        });
        return response;
    } catch (e) {
        throw e;
    }
}
