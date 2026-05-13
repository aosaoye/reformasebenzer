import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { name, phone, email, projectType, message } = await req.json();

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Por favor, rellena los campos obligatorios (nombre, email y mensaje)." },
                { status: 400 }
            );
        }

        // Setup SMTP transporter using environment variables
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Destination email
        const toEmail = process.env.CONTACT_TO_EMAIL || "rfebenezer.sl@gmail.com";

        // Email payload
        const mailOptions = {
            from: `"${name} via Ebenzer Form" <${process.env.SMTP_USER}>`,
            to: toEmail,
            replyTo: email,
            subject: `Nuevo Mensaje de Contacto - ${projectType || "General"}`,
            text: `
                Nuevo contacto recibido desde la web:
                
                Nombre: ${name}
                Teléfono: ${phone || "No proporcionado"}
                Email: ${email}
                Tipo de Proyecto: ${projectType || "No especificado"}
                
                Mensaje:
                ${message}
            `,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #1c1917; border-bottom: 1px solid #eee; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Nuevo Mensaje de Contacto</h2>
                    <p><strong>Nombre:</strong> ${name}</p>
                    <p><strong>Teléfono:</strong> ${phone || "No proporcionado"}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Tipo de Proyecto:</strong> ${projectType || "No especificado"}</p>
                    
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-top: 20px;">
                        <strong style="display: block; margin-bottom: 10px;">Mensaje:</strong>
                        <p style="white-space: pre-wrap; line-height: 1.5; color: #4b5563;">${message}</p>
                    </div>
                    
                    <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
                    <p style="font-size: 10px; color: #9ca3af;">Este correo fue enviado automáticamente desde el formulario de contacto de Reformas Ebenzer.</p>
                </div>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Mensaje enviado correctamente" });
    } catch (error: any) {
        console.error("Error sending email through Nodemailer:", error);
        return NextResponse.json(
            { error: "Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde." },
            { status: 500 }
        );
    }
}
