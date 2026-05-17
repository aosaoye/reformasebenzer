"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import ProjectManagerModal from "./ProjectManagerModal";

export default function ProjectCarousel({ projects, isAdmin, isEditing }: { projects: any[], isAdmin?: boolean, isEditing?: boolean }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isManagerOpen, setIsManagerOpen] = useState(false);

    // Estado local para los textos de la sección
    const [localData, setLocalData] = useState({
        subtitle: "Selección 2026",
        title1: "Nuestra",
        title2: "Galería"
    });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const xBackground = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollAmount = container.clientWidth * 0.8;
            const scrollTo = direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: scrollTo,
                behavior: "smooth"
            });
        }
    };

    return (
        <section ref={containerRef} className={`py-12 overflow-hidden relative ${isEditing ? 'bg-stone-50 ring-4 ring-indigo-500 rounded-3xl my-4' : 'bg-white'}`}>
            {/* Cinematic Background Title */}
            <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none select-none -translate-y-1/2 md:-translate-y-1/3">
                <motion.span
                    style={{ x: xBackground }}
                    className="brand-bg-text text-[30vw] font-black text-stone-100 leading-none block whitespace-nowrap tracking-tighter uppercase opacity-30"
                >
                    PROYECTOS EBENZER EXCLUSIVE
                </motion.span>
            </div>

            <div className="relative z-10 mx-auto max-w-[1400px] px-8">
                <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-12">
                    <div className="max-w-2xl w-full">
                        {isEditing ? (
                            <>
                                <label className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest block mb-1">Subtítulo</label>
                                <input 
                                    value={localData.subtitle}
                                    onChange={(e) => setLocalData({...localData, subtitle: e.target.value})}
                                    className="text-[10px] uppercase tracking-[0.6em] font-bold text-stone-400 mb-6 block w-full bg-white/50 border-b border-indigo-500 focus:outline-none"
                                />
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest block">Título Principal</label>
                                    <input 
                                        value={localData.title1}
                                        onChange={(e) => setLocalData({...localData, title1: e.target.value})}
                                        className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-stone-900 uppercase w-full bg-white/50 border-b border-indigo-500 focus:outline-none p-2"
                                    />
                                    <label className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest block">Palabra Destacada (Cursiva)</label>
                                    <input 
                                        value={localData.title2}
                                        onChange={(e) => setLocalData({...localData, title2: e.target.value})}
                                        className="text-5xl md:text-8xl font-light italic tracking-tighter leading-[0.9] text-stone-300 uppercase w-full bg-white/50 border-b border-indigo-500 focus:outline-none p-2"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="text-[10px] uppercase tracking-[0.6em] font-bold text-stone-400 mb-6 block"
                                >
                                    {localData.subtitle}
                                </motion.span>
                                <motion.h2
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-stone-900 uppercase"
                                >
                                    {localData.title1} <br />
                                    <span className="text-stone-300 italic font-light">{localData.title2}</span>
                                </motion.h2>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-8">
                        {isAdmin && (
                            <button
                                onClick={() => setIsManagerOpen(true)}
                                className="bg-stone-900 text-white px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-black shadow-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
                            >
                                <span className="flex items-center gap-2"><ion-icon name="settings-outline"></ion-icon> Gestor de Proyectos</span>
                            </button>
                        )}
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => scroll("left")}
                                className="group flex items-center justify-center w-16 h-16 border border-stone-200 rounded-full hover:bg-stone-900 hover:text-white transition-all duration-500 active:scale-90"
                            >
                                <ion-icon name="chevron-back-outline" style={{ fontSize: '24px' }} class="transition-transform group-hover:-translate-x-1"></ion-icon>
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                className="group flex items-center justify-center w-16 h-16 border border-stone-200 rounded-full hover:bg-stone-900 hover:text-white transition-all duration-500 active:scale-90"
                            >
                                <ion-icon name="chevron-forward-outline" style={{ fontSize: '24px' }} class="transition-transform group-hover:translate-x-1"></ion-icon>
                            </button>
                        </div>
                        <Link
                            href="/proyectos"
                            className="text-[10px] font-black tracking-[0.4em] uppercase group flex items-center gap-4 text-stone-900"
                        >
                            <span>Explorar todo</span>
                            <div className="w-12 h-[1px] bg-stone-900 origin-left scale-x-50 group-hover:scale-x-100 transition-transform"></div>
                        </Link>
                    </div>
                </header>

                <ProjectManagerModal 
                    isOpen={isManagerOpen} 
                    onClose={() => setIsManagerOpen(false)} 
                    projects={projects} 
                />
            </div>

            {/* Full-bleed scrollable slider container */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth w-full px-8 gap-6 pb-4"
            >
                {projects.map((project, i) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="min-w-[85vw] sm:min-w-[45vw] lg:min-w-[30vw] snap-start"
                    >
                        <CarouselCard project={project} />
                    </motion.div>
                ))}
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
        <Link href={`/proyectos/${project.id}`} className="block">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-stone-100 group shadow-sm">
                <Image
                    src={imgSrc}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-102"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={() => {
                        setImgSrc(defaultFallback);
                    }}
                />
            </div>
        </Link>
    );
}
