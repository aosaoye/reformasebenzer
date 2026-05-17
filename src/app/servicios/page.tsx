import ServicesClient from "@/components/ServicesClient";
import { cookies } from "next/headers";
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
    const token = cookies().get("admin_token");
    const isAdmin = token?.value === "authenticated";

    let servicesData = null;
    try {
        const dataPath = path.join(process.cwd(), 'src', 'data', 'services.json');
        const fileData = await fs.readFile(dataPath, 'utf-8');
        servicesData = JSON.parse(fileData);
    } catch (e) {
        servicesData = null;
    }

    if (!servicesData) {
        return <div>Cargando datos...</div>;
    }

    return <ServicesClient initialData={servicesData} isAdmin={isAdmin} />;
}
