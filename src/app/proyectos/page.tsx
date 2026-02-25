import { projects } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Suspense } from "react";

export default function ProjectsPage({
    searchParams,
}: {
    searchParams: { categoria?: string };
}) {
    const activeCategory = searchParams.categoria || "Todos";

    const filteredProjects = activeCategory === "Todos"
        ? projects
        : projects.filter(p => p.category === activeCategory);

    return (
        <main className="px-6 py-12 mx-auto max-w-7xl animate-in fade-in duration-700">
            <header className="flex flex-col items-baseline justify-between gap-4 mb-20 md:flex-row">
                <h2 className="text-5xl font-light tracking-tighter md:text-7xl">Portafolio</h2>
                <span className="text-xs font-bold tracking-widest uppercase text-stone-400">
                    Mostrando {filteredProjects.length} Proyectos
                </span>
            </header>

            <div className="flex flex-col gap-16 lg:flex-row">
                {/* Sidebar - Client Component handled by Suspense */}
                <Suspense fallback={<div className="w-64 h-96 bg-stone-50 animate-pulse rounded-2xl" />}>
                    <CategoryFilter />
                </Suspense>

                {/* Grid - Server-side filtered */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 gap-y-20">
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
