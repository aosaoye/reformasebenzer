import Link from "next/link";
import { Project } from "@/lib/data";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/proyectos/${project.id}`} className="block h-full cursor-pointer group project-card">
            <div className="relative mb-6 overflow-hidden rounded-xl bg-stone-100 aspect-[4/3]">
                <img
                    src={project.image}
                    className="object-cover w-full h-full transition-all duration-700 ease-out group-hover:scale-105"
                    alt={project.name}
                    loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center transition duration-300 opacity-0 group-hover:opacity-100 bg-black/40">
                    <button className="bg-white rounded-xl text-stone-900 px-8 py-3 uppercase text-[10px] font-bold tracking-widest hover:bg-stone-900 hover:text-white transition transform translate-y-4 group-hover:translate-y-0 duration-300">
                        Ver Proyecto
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold tracking-tight truncate transition-all text-stone-900 group-hover:underline decoration-stone-400 underline-offset-4 decoration-1">
                    {project.name}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-stone-500">
                    {project.category}
                </p>
            </div>
        </Link>
    );
}
