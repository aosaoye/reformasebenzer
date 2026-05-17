import { getAllProjects, getHomePage } from "@/lib/services/projects";
import { getAllTestimonials } from "@/lib/services/testimonials";
import HomeClient from "@/components/HomeClient";
import { cookies } from "next/headers";
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const token = cookies().get("admin_token");
    const isAdmin = token?.value === "authenticated";

    let [allProjects, homepageData, testimonialsData] = await Promise.all([
        getAllProjects(),
        getHomePage(),
        getAllTestimonials()
    ]);

    try {
        const extraPath = path.join(process.cwd(), 'src', 'data', 'homepage-extra.json');
        const extraData = JSON.parse(await fs.readFile(extraPath, 'utf-8'));
        homepageData = { ...homepageData, ...extraData };
    } catch (e) {
        // Ignorar si no existe el archivo extra
    }
    
    let layoutConfig = null;
    try {
        const layoutPath = path.join(process.cwd(), 'src', 'data', 'layout.json');
        const fileData = await fs.readFile(layoutPath, 'utf-8');
        layoutConfig = JSON.parse(fileData);
    } catch (e) {
        layoutConfig = [
            { id: "hero", type: "Hero", visible: true },
            { id: "ticker", type: "BrandTicker", visible: true },
            { id: "projects", type: "ProjectCarousel", visible: true },
            { id: "visualizer", type: "AIVisualizer", visible: true },
            { id: "testimonials", type: "TestimonialsGrid", visible: true },
            { id: "commitment", type: "Commitment", visible: true }
        ];
    }

    const projects = allProjects.slice(0, 6);

    return <HomeClient projects={projects} homepage={homepageData} testimonials={testimonialsData} isAdmin={isAdmin} layoutConfig={layoutConfig} />;
}
