import Link from "next/link";
import { Project } from "@/lib/data";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/proyectos/${project.id}`} className="block h-full cursor-pointer group project-card">
            <div className="relative mb-3 overflow-hidden bg-stone-50 aspect-[4/3] w-full">
                <img
                    src={project.image}
                    className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    alt={project.name}
                    loading="lazy"
                />
            </div>
            
            <div className="text-xs md:text-sm font-semibold text-stone-900 mt-2">
                <h3 className="tracking-tight truncate transition-colors duration-300">
                    {project.name}
                </h3>
            </div>
        </Link>
    );
}
