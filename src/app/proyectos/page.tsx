"use client";

import { projects } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ProjectsContent() {
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("categoria") || "Todos";

    const filteredProjects = activeCategory === "Todos"
        ? projects
        : projects.filter(p => p.category === activeCategory);

    return (
        <main className="px-6 py-12 mx-auto max-w-7xl animate-in fade-in duration-700">
            <header className="flex flex-col items-baseline justify-between gap-4 mb-20 md:flex-row">
                <div className="max-w-xl">
                    <span className="text-[10px] uppercase font-black text-stone-400 tracking-[0.4em] block mb-4">Nuestro Legado</span>
                    <h2 className="text-5xl font-light tracking-tighter md:text-8xl">Portafolio <br /><span className="italic font-black text-stone-300">Exclusivo</span></h2>
                </div>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-stone-400 mt-6">
                    {filteredProjects.length} Proyectos • Selección 2026
                </span>
            </header>

            <div className="flex flex-col gap-16 lg:flex-row">
                {/* Sidebar */}
                <aside className="lg:w-64 shrink-0">
                    <CategoryFilter />
                </aside>

                {/* Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function ProjectsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
            </div>
        }>
            <ProjectsContent />
        </Suspense>
    );
}
