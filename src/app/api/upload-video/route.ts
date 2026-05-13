import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

        // Store the uploaded video
        const uploadDir = path.join(process.cwd(), "uploads", "videos");
        await mkdir(uploadDir, { recursive: true });

        const timestamp = Date.now();
        const ext = file.name.split(".").pop() || "mp4";
        const filename = `scan_${timestamp}.${ext}`;
        const filepath = path.join(uploadDir, filename);

        const bytes = await file.arrayBuffer();
        await writeFile(filepath, Buffer.from(bytes));

        return NextResponse.json({
            success: true,
            filename,
            size: file.size,
            message: "Vídeo almacenado correctamente. Ahora procesa tu vídeo con Luma AI o Polycam para obtener el archivo .splat"
        });
    } catch (error) {
        console.error("Error uploading video:", error);
        return NextResponse.json({ error: "Error interno al procesar el vídeo" }, { status: 500 });
    }
}
