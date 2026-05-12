import { getAllProjects } from "@/lib/services/projects";
import HomeClient from "@/components/HomeClient";

export const dynamic = 'force-dynamic';

export default async function Home() {
    const data = await getAllProjects();
    const projects = data.slice(0, 6);

    return <HomeClient projects={projects} />;
}

