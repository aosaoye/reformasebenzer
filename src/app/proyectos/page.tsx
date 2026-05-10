import { getAllProjects } from "@/lib/services/projects";
import ProjectCard from "@/components/ProjectCard";
import CategoryFilter from "@/components/CategoryFilter";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage({ 
    searchParams 
}: { 
    searchParams: { [key: string]: string | string[] | undefined } 
}) {
    const activeCategory = (searchParams?.categoria as string) || "Todos";
    const filteredProjects = await getAllProjects(activeCategory);

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
                        {filteredProjects.map((project: any) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                    {filteredProjects.length === 0 && (
                        <div className="py-20 text-center text-stone-500">
                            No hay proyectos que coincidan con esta selección.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
