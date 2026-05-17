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
            <section className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-12 relative group">
                <div className={`relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-stone-200 aspect-[5/6] md:aspect-[21/9] shadow-2xl ${isEditing ? 'ring-4 ring-indigo-500' : ''}`}>
                    <Image
                        src={localData.heroImage}
                        className="object-cover w-full h-full"
                        alt="Hero Principal"
                        fill
                        priority
                    />
                    {isEditing && (
                        <div className="absolute top-4 left-4 z-50 bg-stone-900/80 p-3 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-3">
                            <label className="cursor-pointer bg-white text-stone-900 hover:bg-stone-200 transition-colors px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <ion-icon name="image-outline" style={{ fontSize: '16px', color: '#1c1917' }}></ion-icon>
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
                                            // TODO: Conectar esto al endpoint POST /api/upload de Strapi
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
                        <div className="max-w-2xl">
                            {isEditing ? (
                                <textarea
                                    value={localData.heroTitle}
                                    onChange={(e) => handleUpdate("heroTitle", e.target.value)}
                                    className="w-full bg-black/30 border border-indigo-500 text-4xl md:text-7xl text-white font-light leading-[0.9] mb-6 tracking-tighter rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    rows={3}
                                />
                            ) : (
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl md:text-7xl text-white font-light leading-[0.9] mb-6 tracking-tighter whitespace-pre-line"
                                    dangerouslySetInnerHTML={{ __html: localData.heroTitle.replace("historia.", '<span class="font-black italic">historia.</span>') }}
                                />
                            )}

                            {isEditing ? (
                                <input
                                    value={localData.heroSubtitle}
                                    onChange={(e) => handleUpdate("heroSubtitle", e.target.value)}
                                    className="w-full bg-black/30 border border-indigo-500 text-[10px] md:text-xs uppercase tracking-[0.4em] text-white font-bold mb-8 md:mb-12 rounded-lg p-2 focus:outline-none"
                                />
                            ) : (
                                <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/70 font-bold mb-8 md:mb-12">
                                    {localData.heroSubtitle}
                                </p>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4">
                                {isEditing ? (
                                    <input
                                        value={localData.ctaText}
                                        onChange={(e) => handleUpdate("ctaText", e.target.value)}
                                        className="bg-white text-stone-900 px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] border-2 border-indigo-500 focus:outline-none text-center"
                                    />
                                ) : (
                                    <Link
                                        href={localData.ctaLink || "/contact"}
                                        className="bg-white text-stone-900 px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-stone-900 hover:text-white transition-all shadow-2xl active:scale-95 text-center"
                                    >
                                        {localData.ctaText}
                                    </Link>
                                )}
                            </div>
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
                    case "visualizer": blockContent = (
            <section className="mx-auto max-w-7xl px-4 md:px-8 mb-24 relative group">
                <div className="relative overflow-hidden bg-stone-50 rounded-[3rem] md:rounded-[4rem] px-8 py-16 md:px-24 md:py-24 border border-stone-100 shadow-inner">
                    <div className="flex flex-col md:flex-row items-center gap-20 relative z-10">
                        <div className="flex-1 text-center md:text-left">
                            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-stone-400 mb-8 block">Ebenzer Engine</span>
                            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-10 leading-[0.95]">
                                Del vídeo, <br />
                                <span className="text-stone-300 italic font-light">a la escena 3D.</span>
                            </h2>
                            <p className="text-stone-500 text-base md:text-lg font-light leading-relaxed mb-12 max-w-lg mx-auto md:mx-0">
                                Sube un vídeo de tu casa y nuestra IA creará un modelo 3D interactivo y acotado. Mide distancias, segmenta paredes y simula nuevos colores y materiales al instante.
                            </p>
                            <Link
                                href="/visualizador"
                                className="inline-flex items-center gap-4 bg-stone-900 text-stone-100 px-10 py-5 rounded-full font-bold uppercase text-[10px] tracking-widest shadow-2xl hover:bg-stone-800 transition transform hover:-translate-y-1"
                            >
                                <ion-icon name="videocam-outline" style={{ fontSize: '20px', color: '#f5f5f4' }}></ion-icon>
                                Escenificar Vídeo 3D
                            </Link>
                        </div>
                        <Link href="/visualizador" className="flex-1 relative aspect-square w-full max-w-[500px] overflow-hidden rounded-[3rem] shadow-2xl group cursor-pointer block">
                            <Image
                                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
                                alt="Visor 3D"
                                fill
                                className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/20 transition-colors"></div>
                            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 transform transition-transform group-hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center">
                                        <ion-icon name="play" style={{ fontSize: '12px', color: '#ffffff' }}></ion-icon>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-900 underline underline-offset-4">Ver Demo Inmersiva</span>
                                </div>
                                <p className="text-[9px] text-stone-500 leading-tight">Transforma una grabación de vídeo en una escena 3D inteligente y acotada.</p>
                            </div>
                        </Link>
                    </div>
                    <div className="absolute w-64 h-64 bg-stone-200 blur-[100px] rounded-full -top-20 -right-20 opacity-50"></div>
                    <div className="absolute w-48 h-48 bg-stone-200 blur-[80px] rounded-full bottom-0 left-0 opacity-30"></div>
                </div>
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
                        <button onClick={() => handleAddBlock('visualizer')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Visor 3D</button>
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
