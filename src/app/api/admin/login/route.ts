import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        
        // Define a strong password in your .env as ADMIN_PASSWORD, fallback here for demo
        const correctPassword = process.env.ADMIN_PASSWORD || "ebenzer123";

        if (password === correctPassword) {
            // Set a secure HTTP-only cookie
            cookies().set({
                name: "admin_token",
                value: "authenticated",
                httpOnly: true,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, message: "Contraseña incorrecta" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error interno" }, { status: 500 });
    }
}
