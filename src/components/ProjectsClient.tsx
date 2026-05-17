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
        <main className="px-8 py-16 mt-20 mx-auto max-w-[1400px] animate-in fade-in duration-700 relative bg-white">
            <header className="flex items-baseline justify-between gap-4 mb-8 pb-4 border-b border-stone-100">
                <div className={`max-w-xl ${isEditing ? 'ring-4 ring-indigo-500/50 p-4 rounded-3xl' : ''}`}>
                    {isEditing ? (
                        <textarea 
                            value={localData.title} 
                            onChange={(e) => handleUpdate("title", e.target.value)}
                            className="w-full text-4xl font-bold tracking-tight bg-transparent border-b border-indigo-500 focus:outline-none"
                            rows={1}
                        />
                    ) : (
                        <h2 
                            className="text-4xl font-bold tracking-tight text-stone-900"
                            dangerouslySetInnerHTML={{ __html: localData.title }}
                        />
                    )}
                </div>
                <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-stone-400">
                    {projects.length} RESULTADOS
                </span>
            </header>

            {/* Horizontal Filter Pill Bar */}
            <CategoryFilter />

            {/* Full Width Grid */}
            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {projects.map((project: any, index: number) => (
                        <div key={project.id} className={`relative group ${isEditing ? 'ring-2 ring-indigo-500/20 p-2 rounded-xl' : ''}`}>
                            <ProjectCard project={project} />
                            {isEditing && (
                                <div className="absolute top-4 left-4 z-[90] flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/90 backdrop-blur p-2 rounded-xl shadow-2xl">
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
                    <div className="py-20 text-center text-stone-500 text-sm">
                        No hay proyectos que coincidan con esta selección.
                    </div>
                )}
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
