import { NextResponse } from "next/server";
import { submitTestimonial } from "@/lib/services/testimonials";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Basic validation
        if (!body.name || !body.email || !body.rating || !body.comment) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Limit rating
        const safeRating = Math.min(5, Math.max(1, Number(body.rating)));

        await submitTestimonial({
            name: body.name,
            email: body.email,
            comment: body.comment,
            rating: safeRating
        });

        return NextResponse.json({ success: true, message: "Testimonial sent successfully (Pending review)" });
    } catch (error: any) {
        console.error("Route Error submitting testimonial:", error);
        return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
    }
}
