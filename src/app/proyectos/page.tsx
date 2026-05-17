import { getAllProjects } from "@/lib/services/projects";
import ProjectsClient from "@/components/ProjectsClient";
import fs from "fs/promises";
import path from "path";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage({ 
    searchParams 
}: { 
    searchParams: { [key: string]: string | string[] | undefined } 
}) {
    const activeCategory = (searchParams?.categoria as string) || "Todos";
    const filteredProjects = await getAllProjects(activeCategory);

    let pageData = null;
    try {
        const dataPath = path.join(process.cwd(), 'src', 'data', 'projects-page.json');
        pageData = JSON.parse(await fs.readFile(dataPath, 'utf-8'));
    } catch (e) {
        // Ignorar si no existe
    }

    return <ProjectsClient initialProjects={filteredProjects} pageData={pageData} />;
}
