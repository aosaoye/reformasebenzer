"use client";

import Image from "next/image";
import Link from "next/link";
import ProjectCarousel from "@/components/ProjectCarousel";
import BrandTicker from "@/components/BrandTicker";
import { motion } from "framer-motion";
import TestimonialsGrid from "@/components/TestimonialsGrid";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";

export default function HomeClient({ projects, homepage, testimonials = [], isAdmin = false, layoutConfig = [] }: { projects: any[], homepage: any, testimonials?: any[], isAdmin?: boolean, layoutConfig?: any[] }) {
    const { isEditing, setIsEditing } = useAdmin();
    const defaultData = {
        heroTitle: "Espacios que cuentan tu historia.",
        heroSubtitle: "arquitectura • interiorismo • reformas",
        heroImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=90&w=2000",
        ctaText: "Solicitar Presupuesto",
        ctaLink: "/contact",
        statsYears: 15,
        statsProjects: 500,
        aboutSubtitle: "Legacy of Excellence",
        aboutTitle: "Hogares que <br /> <span class=\"text-stone-300 italic font-light\">transcienden.</span>",
        aboutContent: "Cada proyecto de Ebenzer es una pieza única de arquitectura interior. No reformamos casas, creamos escenarios para tu vida más auténtica.",
        aboutEst: "Est. 2011"
    };

    const initialData = { ...defaultData, ...homepage };

    const [localData, setLocalData] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleUpdate = (field: string, value: string | number) => {
        setLocalData((prev: any) => ({ ...prev, [field]: value }));
    };


    const [localLayout, setLocalLayout] = useState(layoutConfig);

    const handleUpdateSpacerHeight = (index: number, height: number) => {
        const newLayout = [...localLayout];
        newLayout[index] = { ...newLayout[index], height };
        setLocalLayout(newLayout);
    };

    const handleMoveBlock = (index: number, direction: number) => {
        const newLayout = [...localLayout];
        const temp = newLayout[index];
        newLayout[index] = newLayout[index + direction];
        newLayout[index + direction] = temp;
        setLocalLayout(newLayout);
    };

    const handleToggleVisibility = (index: number) => {
        const newLayout = [...localLayout];
        newLayout[index].visible = !newLayout[index].visible;
        setLocalLayout(newLayout);
    };


    const handleAddBlock = (type: string) => {
        const newBlock = { id: `${type.toLowerCase()}_${Date.now()}`, type: type, visible: true };
        setLocalLayout([...localLayout, newBlock]);
    };

    const handleRemoveBlock = (index: number) => {
        const newLayout = localLayout.filter((_: any, i: number) => i !== index);
        setLocalLayout(newLayout);
    };

    const handleSave = async () => {

        setIsSaving(true);
        try {
            await fetch("/api/admin/save-layout", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ layout: localLayout })
            });
            // Proceed to save homepage fields

            const res = await fetch("/api/admin/save-homepage", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(localData)
            });
            const result = await res.json();
            if (result.success) {

                alert("Cambios guardados con éxito.");
                router.refresh();
            } else {
                alert("Error al guardar: " + result.message);
            }
        } catch (error) {
            alert("Error de conexión");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.refresh();
    };

    return (
        <main className="antialiased text-stone-900">
            

            {/* Admin spacer if logged in */}
            


            {localLayout.map((block: any, index: number) => {
                if (!block.visible && !isEditing) return null;

                let blockContent = null;
                switch (block.type || block.id) {
                    case "hero": blockContent = (
            <section className="relative w-full h-[85vh] group">
                <Image
                    src={localData.heroImage}
                    className="object-cover w-full h-full"
                    alt="Hero Principal"
                    fill
                    priority
                />
                <div className="absolute inset-0 bg-black/20"></div>

                {isEditing && (
                    <div className="absolute top-4 right-4 z-50 bg-white p-2 rounded shadow-xl">
                        <label className="cursor-pointer text-xs font-bold px-4 py-2 hover:bg-stone-100 flex items-center gap-2">
                            Cambiar Imagen
                            <input 
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        const objectUrl = URL.createObjectURL(file);
                                        handleUpdate("heroImage", objectUrl);
                                    }
                                }}
                            />
                        </label>
                    </div>
                )}

                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 max-w-[1400px] mx-auto">
                    <div className="max-w-xl">
                        {isEditing ? (
                            <textarea
                                value={localData.heroTitle}
                                onChange={(e) => handleUpdate("heroTitle", e.target.value)}
                                className="w-full bg-transparent text-5xl md:text-7xl text-white font-medium leading-[1.1] tracking-tight mb-6 focus:outline-none focus:ring-1 focus:ring-white/50"
                                rows={3}
                            />
                        ) : (
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-7xl text-white font-medium leading-[1.1] tracking-tight mb-6 whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: localData.heroTitle }}
                            />
                        )}

                        {isEditing ? (
                            <textarea
                                value={localData.heroSubtitle}
                                onChange={(e) => handleUpdate("heroSubtitle", e.target.value)}
                                className="w-full bg-transparent text-sm md:text-base text-white/90 leading-relaxed mb-10 focus:outline-none"
                                rows={3}
                            />
                        ) : (
                            <p className="text-sm md:text-base text-white/90 leading-relaxed mb-10 max-w-lg">
                                {localData.heroSubtitle}
                            </p>
                        )}

                        <div className="flex">
                            {isEditing ? (
                                <input
                                    value={localData.ctaText}
                                    onChange={(e) => handleUpdate("ctaText", e.target.value)}
                                    className="bg-transparent text-white font-bold uppercase text-[11px] tracking-[0.15em] border-b-2 border-white pb-2 focus:outline-none"
                                />
                            ) : (
                                <Link
                                    href={localData.ctaLink || "/proyectos"}
                                    className="text-white font-bold uppercase text-[11px] tracking-[0.15em] border-b-2 border-white pb-2 hover:text-stone-200 hover:border-stone-200 transition-colors"
                                >
                                    {localData.ctaText}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </section>
                    ); break;
                    case "ticker": blockContent = (
                        <BrandTicker 
                            aboutSubtitle={localData.aboutSubtitle || "Legacy of Excellence"}
                            aboutTitle={localData.aboutTitle || "Hogares que <br /> <span class=\"text-stone-300 italic font-light\">transcienden.</span>"}
                            aboutContent={localData.aboutContent || "Cada proyecto de Ebenzer es una pieza única de arquitectura interior. No reformamos casas, creamos escenarios para tu vida más auténtica."}
                            aboutEst={localData.aboutEst || "Est. 2011"}
                            isEditing={isEditing}
                            onUpdate={handleUpdate}
                        />
                    ); break;
                    case "spacer": blockContent = (
                        <div className={`w-full relative ${isEditing ? 'border-y border-dashed border-indigo-300 bg-indigo-50/20 py-4' : ''}`} style={{ height: `${block.height || 80}px` }}>
                            {isEditing && (
                                <div className="absolute inset-0 flex items-center justify-center gap-4 text-xs font-bold text-indigo-500 bg-indigo-500/5 select-none">
                                    <span>Espacio Invisible ({block.height || 80}px)</span>
                                    <input 
                                        type="range" min="20" max="300" step="10"
                                        value={block.height || 80} 
                                        onChange={(e) => handleUpdateSpacerHeight(index, parseInt(e.target.value))}
                                        className="w-32 accent-indigo-500" 
                                    />
                                </div>
                            )}
                        </div>
                    ); break;
                    case "projects": blockContent = (
                        <section className="px-4 md:px-8">
                {projects.length > 0 && <ProjectCarousel projects={projects} isAdmin={isAdmin} isEditing={isEditing} />}
            </section>
                    ); break;

                    case "testimonials": blockContent = <TestimonialsGrid initialTestimonials={testimonials} />; break;
                    case "commitment": blockContent = (
            <section className="mx-auto max-w-7xl px-4 md:px-8 mb-48 relative group">
                <div className={`relative py-32 bg-stone-900 text-stone-100 rounded-[3rem] md:rounded-[4rem] px-8 md:px-20 overflow-hidden shadow-2xl group ${isEditing ? 'ring-4 ring-indigo-500' : ''}`}>
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=2000"
                            className="object-cover w-full h-full opacity-40 transition-transform duration-[10s] group-hover:scale-110"
                            alt="Interiorismo de Lujo"
                            fill
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 max-w-3xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-[10px] uppercase tracking-[0.6em] font-black text-stone-500 mb-8 block"
                        >
                            Pasión por lo excepcional
                        </motion.span>
                        <h2 className="mb-12 text-4xl md:text-7xl font-light leading-[0.9] tracking-tighter uppercase">
                            Excelencia en <br />
                            cada acabado, <br />
                            <span className="text-stone-300 italic font-black">pasión en cada detalle.</span>
                        </h2>
                        <p className="mb-16 text-lg md:text-xl leading-relaxed text-stone-400 font-light max-w-xl">
                            En Reformas Ebenzer no seguimos tendencias, las creamos. Entendemos que tu hogar es la extensión de tu alma.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20">
                            <div className="flex flex-col gap-2">
                                {isEditing ? (
                                    <input 
                                        type="number" 
                                        value={localData.statsYears} 
                                        onChange={(e) => handleUpdate("statsYears", parseInt(e.target.value))}
                                        className="w-24 bg-white/20 text-4xl md:text-5xl font-black text-white italic tracking-tighter border-b-2 border-indigo-500 focus:outline-none"
                                    />
                                ) : (
                                    <span className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">{localData.statsYears}+</span>
                                )}
                                <span className="text-[9px] uppercase tracking-[0.3em] text-stone-500 font-black">Años de maestría</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {isEditing ? (
                                    <input 
                                        type="number" 
                                        value={localData.statsProjects} 
                                        onChange={(e) => handleUpdate("statsProjects", parseInt(e.target.value))}
                                        className="w-32 bg-white/20 text-4xl md:text-5xl font-black text-white italic tracking-tighter border-b-2 border-indigo-500 focus:outline-none"
                                    />
                                ) : (
                                    <span className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">{localData.statsProjects}+</span>
                                )}
                                <span className="text-[9px] uppercase tracking-[0.3em] text-stone-500 font-black">Historias creadas</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">100%</span>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-stone-500 font-black">Satisfacción total</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
                    ); break;
                }

                return (
                    <div key={block.id} className={`relative group ${!block.visible ? 'opacity-30 grayscale' : ''}`}>
                        {blockContent}
                        {isEditing && (
                            <div className="absolute top-4 right-4 z-[90] flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/90 backdrop-blur p-2 rounded-xl border border-white/10 shadow-2xl">
                                <button onClick={() => handleMoveBlock(index, -1)} disabled={index === 0} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-700 text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><ion-icon name="arrow-up-outline"></ion-icon></button>
                                <button onClick={() => handleMoveBlock(index, 1)} disabled={index === localLayout.length - 1} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-700 text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><ion-icon name="arrow-down-outline"></ion-icon></button>
                                <button onClick={() => handleToggleVisibility(index)} className={`px-4 h-8 rounded-lg flex items-center justify-center text-[10px] uppercase font-bold tracking-widest ml-2 border-l border-stone-700 pl-4 transition-colors ${block.visible ? 'text-white hover:text-red-400' : 'text-stone-400 hover:text-emerald-400'}`}>
                                    {block.visible ? <span className="flex items-center gap-2"><ion-icon name="eye-off-outline"></ion-icon> Ocultar</span> : <span className="flex items-center gap-2"><ion-icon name="eye-outline"></ion-icon> Mostrar</span>}
                                </button>
                                <button onClick={() => handleRemoveBlock(index)} className="px-3 h-8 rounded-lg flex items-center justify-center hover:bg-red-500 text-white text-[10px] uppercase font-bold tracking-widest ml-2 border-l border-stone-700 pl-4 transition-colors">
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}


            {isEditing && (
                <div className="mx-auto max-w-xl text-center mt-24 mb-32 p-8 border-2 border-dashed border-stone-300 rounded-3xl">
                    <p className="text-[10px] uppercase font-black tracking-widest text-stone-400 mb-6">Añadir Nueva Sección</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => handleAddBlock('hero')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Hero Principal</button>
                        <button onClick={() => handleAddBlock('ticker')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Marcas</button>
                        <button onClick={() => handleAddBlock('projects')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Carrusel Proyectos</button>

                        <button onClick={() => handleAddBlock('testimonials')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Testimonios</button>
                        <button onClick={() => handleAddBlock('commitment')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Compromiso</button>
                        <button onClick={() => handleAddBlock('spacer')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Espacio Invisible</button>
                    </div>
                </div>
            )}
        {isEditing && (
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="fixed bottom-6 right-6 z-[200] bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-black shadow-2xl transition-all"
                >
                    {isSaving ? "Guardando Home..." : "Guardar Home Page"}
                </button>
            )}
        </main>

    );
}
