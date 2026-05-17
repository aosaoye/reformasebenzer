"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import ProjectCard from "@/components/ProjectCard";
import CategoryFilter from "@/components/CategoryFilter";
import { useRouter } from "next/navigation";

export default function ProjectsClient({ 
    initialProjects, 
    pageData 
}: { 
    initialProjects: any[], 
    pageData: any 
}) {
    const { isEditing } = useAdmin();
    const router = useRouter();

    const [localData, setLocalData] = useState({
        subtitle: pageData?.subtitle || "Nuestro Legado",
        title: pageData?.title || "Portafolio <br /><span class=\"italic font-black text-stone-300\">Exclusivo</span>"
    });
    
    // Sort projects according to saved order if available
    const [projects, setProjects] = useState(() => {
        let sorted = [...initialProjects];
        if (pageData?.order && pageData.order.length > 0) {
            sorted.sort((a, b) => {
                const indexA = pageData.order.indexOf(a.id);
                const indexB = pageData.order.indexOf(b.id);
                if (indexA === -1 && indexB === -1) return 0;
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            });
        }
        return sorted;
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleUpdate = (field: string, value: string) => {
        setLocalData(prev => ({ ...prev, [field]: value }));
    };

    const handleMoveProject = (index: number, direction: number) => {
        const newProjects = [...projects];
        const temp = newProjects[index];
        newProjects[index] = newProjects[index + direction];
        newProjects[index + direction] = temp;
        setProjects(newProjects);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/save-projects-page", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subtitle: localData.subtitle,
                    title: localData.title,
                    order: projects.map(p => p.id)
                })
            });
            if (res.ok) {
                alert("Página guardada con éxito.");
                router.refresh();
            }
        } catch (error) {
            alert("Error al guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="px-6 py-12 mx-auto max-w-7xl animate-in fade-in duration-700 relative">
            <header className="flex flex-col items-baseline justify-between gap-4 mb-20 md:flex-row relative group">
                <div className={`max-w-xl ${isEditing ? 'ring-4 ring-indigo-500/50 p-4 rounded-3xl' : ''}`}>
                    {isEditing ? (
                        <>
                            <input 
                                value={localData.subtitle} 
                                onChange={(e) => handleUpdate("subtitle", e.target.value)}
                                className="w-full text-[10px] uppercase font-black text-stone-400 tracking-[0.4em] block mb-4 bg-transparent border-b border-indigo-500 focus:outline-none"
                            />
                            <textarea 
                                value={localData.title} 
                                onChange={(e) => handleUpdate("title", e.target.value)}
                                className="w-full text-5xl font-light tracking-tighter md:text-8xl bg-transparent border-b border-indigo-500 focus:outline-none"
                                rows={2}
                            />
                        </>
                    ) : (
                        <>
                            <span className="text-[10px] uppercase font-black text-stone-400 tracking-[0.4em] block mb-4">
                                {localData.subtitle}
                            </span>
                            <h2 
                                className="text-5xl font-light tracking-tighter md:text-8xl"
                                dangerouslySetInnerHTML={{ __html: localData.title }}
                            />
                        </>
                    )}
                </div>
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-stone-400 mt-6">
                    {projects.length} Proyectos • Selección 2026
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
                        {projects.map((project: any, index: number) => (
                            <div key={project.id} className={`relative group ${isEditing ? 'ring-2 ring-indigo-500/20 p-2 rounded-3xl' : ''}`}>
                                <ProjectCard project={project} />
                                {isEditing && (
                                    <div className="absolute top-4 right-4 z-[90] flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/90 backdrop-blur p-2 rounded-xl shadow-2xl">
                                        <button onClick={() => handleMoveProject(index, -1)} disabled={index === 0} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-700 text-white disabled:opacity-30">
                                            <ion-icon name="arrow-back-outline"></ion-icon>
                                        </button>
                                        <button onClick={() => handleMoveProject(index, 1)} disabled={index === projects.length - 1} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-700 text-white disabled:opacity-30">
                                            <ion-icon name="arrow-forward-outline"></ion-icon>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {projects.length === 0 && (
                        <div className="py-20 text-center text-stone-500">
                            No hay proyectos que coincidan con esta selección.
                        </div>
                    )}
                </div>
            </div>

            {isEditing && (
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="fixed bottom-6 right-6 z-[200] bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-black shadow-2xl transition-all"
                >
                    {isSaving ? "Guardando..." : "Guardar Página Proyectos"}
                </button>
            )}
        </main>
    );
}
