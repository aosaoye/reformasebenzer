import ContactClient from "@/components/ContactClient";
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
    let contactData = null;
    try {
        const dataPath = path.join(process.cwd(), 'src', 'data', 'contact.json');
        const fileData = await fs.readFile(dataPath, 'utf-8');
        contactData = JSON.parse(fileData);
    } catch (e) {
        contactData = {
            header: {
                title: "Contáctanos",
                description: "¿Tienes un proyecto en mente? Estamos aquí para asesorarte. Cuéntanos qué necesitas y nuestro equipo se pondrá en contacto contigo para una visita técnica sin compromiso."
            },
            offices: [
                { id: "office_1", title: "Oficina Central", value: "Av. de la Innovación 45, 28001 Madrid", icon: "map" },
                { id: "email_1", title: "Email", value: "rfebenezer.sl@gmail.com", icon: "mail" },
                { id: "phone_1", title: "Teléfono", value: "+34 643 640 502", icon: "phone" }
            ]
        };
    }

    return <ContactClient initialData={contactData} />;
}
