import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // Runs on edge for faster response

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("video") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No se ha enviado ningún archivo" }, { status: 400 });
        }

        // Validate file type
        const validTypes = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ 
                error: "Formato no válido. Sube un archivo .mp4, .mov, .webm o .avi" 
            }, { status: 400 });
        }

        // Max 500MB
        const maxSize = 500 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ error: "El archivo supera el límite de 500MB" }, { status: 400 });
        }

        // In production (Vercel), filesystem is read-only.
        // The video stays in the browser as a blob URL for local preview.
        // The user will process it externally (Luma AI / Polycam / Nerfstudio).
        return NextResponse.json({
            success: true,
            filename: file.name,
            size: file.size,
            message: "Vídeo validado correctamente. Procesa tu vídeo con Luma AI o Polycam para obtener el archivo .splat"
        });
    } catch (error) {
        console.error("Error processing video upload:", error);
        return NextResponse.json({ error: "Error interno al procesar el vídeo" }, { status: 500 });
    }
}
