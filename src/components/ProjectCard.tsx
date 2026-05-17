import Link from "next/link";
import { Project } from "@/lib/data";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/proyectos/${project.id}`} className="block h-full cursor-pointer group project-card">
            <div className="relative mb-4 overflow-hidden bg-stone-50 aspect-[4/3] w-full">
                <img
                    src={project.image}
                    className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-102"
                    alt={project.name}
                    loading="lazy"
                />
                
                {/* Elegant Heart Overlay */}
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-stone-900 shadow-sm hover:bg-white transition-colors"
                >
                    <ion-icon name="heart-outline" style={{ fontSize: '18px' }}></ion-icon>
                </button>
            </div>
            
            <div className="flex items-baseline justify-between text-xs md:text-sm font-medium text-stone-900">
                <h3 className="tracking-tight truncate max-w-[70%] group-hover:underline decoration-stone-400 underline-offset-4 decoration-1">
                    {project.name}
                </h3>
                <span className="font-semibold shrink-0">
                    {project.price && project.price > 0 ? `${project.price.toLocaleString()}€` : "Consultar"}
                </span>
            </div>
        </Link>
    );
}
