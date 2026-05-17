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
            
            <div className="flex items-baseline justify-between text-xs md:text-sm font-semibold text-stone-900 mt-2">
                <h3 className="tracking-tight truncate max-w-[75%] transition-colors duration-300">
                    {project.name}
                </h3>
                <span className="shrink-0 font-bold ml-2">
                    {project.price && project.price > 0 ? `${project.price.toLocaleString()}€` : "Consultar"}
                </span>
            </div>
        </Link>
    );
}
