import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // Basic validation
        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { error: "Por favor, introduce un correo electrónico válido." },
                { status: 400 }
            );
        }

        // Setup SMTP transporter using environment variables
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Destination email for notification
        const toEmail = process.env.CONTACT_TO_EMAIL || "rfebenezer.sl@gmail.com";

        // Email to admin about the new subscription
        const mailOptions = {
            from: `"Ebenzer Newsletter" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: `Nueva Suscripción a Newsletter - ${email}`,
            text: `¡Nuevo suscriptor! El correo ${email} se ha suscrito a las novedades desde el footer de la web.`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; text-align: center;">
                    <h2 style="color: #1c1917; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #eee; padding-bottom: 15px;">Nueva Suscripción</h2>
                    <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">Un nuevo usuario ha solicitado suscribirse para recibir tus futuras publicaciones:</p>
                    <div style="background-color: #f3f4f6; display: inline-block; padding: 10px 20px; border-radius: 30px; font-weight: bold; font-size: 18px; color: #111827; margin: 20px 0;">
                        ${email}
                    </div>
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">Añade este correo a tu lista de contactos de difusión.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Suscripción realizada con éxito" });
    } catch (error: any) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json(
            { error: "No se pudo completar la suscripción. Revisa la configuración del servidor." },
            { status: 500 }
        );
    }
}
