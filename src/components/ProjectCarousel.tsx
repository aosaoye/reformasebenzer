"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProjectManagerModal from "./ProjectManagerModal";

export default function ProjectCarousel({ 
    projects, 
    isAdmin, 
    isEditing 
}: { 
    projects: any[], 
    isAdmin?: boolean, 
    isEditing?: boolean 
}) {
    const [isManagerOpen, setIsManagerOpen] = useState(false);

    // Estado local para los textos de la sección
    const [localData, setLocalData] = useState({
        subtitle: "Selección 2026",
        title1: "Nuestra",
        title2: "Galería"
    });

    const displayedProjects = projects.slice(0, 4);

    return (
        <section className={`py-16 bg-white`}>
            <div className="mx-auto max-w-[1400px] px-8">
                <header className="flex items-end justify-between mb-10 pb-4 border-b border-stone-100">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-stone-400 block mb-3">
                            {localData.subtitle}
                        </span>
                        {isEditing ? (
                            <div className="flex flex-col gap-2 max-w-md">
                                <input 
                                    value={localData.title1}
                                    onChange={(e) => setLocalData({...localData, title1: e.target.value})}
                                    className="text-4xl font-bold tracking-tight text-stone-900 bg-white/50 border-b border-indigo-500 focus:outline-none p-1"
                                />
                                <input 
                                    value={localData.title2}
                                    onChange={(e) => setLocalData({...localData, title2: e.target.value})}
                                    className="text-4xl font-light italic tracking-tight text-stone-400 bg-white/50 border-b border-indigo-500 focus:outline-none p-1"
                                />
                            </div>
                        ) : (
                            <h2 className="text-4xl font-bold tracking-tight text-stone-900">
                                {localData.title1} <span className="text-stone-400 italic font-light">{localData.title2}</span>
                            </h2>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        {isAdmin && (
                            <button
                                onClick={() => setIsManagerOpen(true)}
                                className="bg-stone-900 text-white px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
                            >
                                <span className="flex items-center gap-1">
                                    <ion-icon name="settings-outline"></ion-icon> Gestor
                                </span>
                            </button>
                        )}
                        <Link
                            href="/proyectos"
                            className="text-[11px] font-bold tracking-[0.2em] uppercase text-stone-900 hover:text-indigo-600 transition-colors border-b border-stone-950 pb-1 hover:border-indigo-600"
                        >
                            Explorar todo
                        </Link>
                    </div>
                </header>

                <ProjectManagerModal 
                    isOpen={isManagerOpen} 
                    onClose={() => setIsManagerOpen(false)} 
                    projects={projects} 
                />

                {/* Static 4-column responsive grid matching Modsy reference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayedProjects.map((project) => (
                        <CarouselCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function CarouselCard({ project }: { project: any }) {
    const defaultFallback = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop";
    const [imgSrc, setImgSrc] = useState(project.image || defaultFallback);

    useEffect(() => {
        setImgSrc(project.image || defaultFallback);
    }, [project.image]);

    return (
        <Link href={`/proyectos/${project.id}`} className="group block h-full">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-stone-50 shadow-sm mb-3">
                <Image
                    src={imgSrc}
                    className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    onError={() => {
                        setImgSrc(defaultFallback);
                    }}
                />
            </div>
            
            <div className="text-xs md:text-sm font-semibold text-stone-900 mt-2">
                <h3 className="tracking-tight truncate group-hover:text-stone-500 transition-colors duration-300">
                    {project.name}
                </h3>
            </div>
        </Link>
    );
}
