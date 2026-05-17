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

        const data = await request.json();

        // Create in Strapi 5
        const response = await fetchStrapi("projects", undefined, {
            method: "POST",
            body: JSON.stringify({ data })
        });

        if (response.error) {
            return NextResponse.json({ success: false, message: "Error al crear proyecto", details: response.error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: response.data });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
    }
}
