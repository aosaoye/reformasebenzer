"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";

export default function ServicesClient({ initialData, isAdmin = false }: { initialData: any, isAdmin?: boolean }) {
    const { isEditing, setIsEditing } = useAdmin();
        const [localData, setLocalData] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleUpdateHeader = (field: string, value: string) => {
        setLocalData((prev: any) => ({ ...prev, header: { ...prev.header, [field]: value } }));
    };

    const handleUpdateService = (index: number, field: string, value: any) => {
        const newServices = [...localData.services];
        newServices[index][field] = value;
        setLocalData((prev: any) => ({ ...prev, services: newServices }));
    };

    const handleMoveService = (index: number, direction: number) => {
        const newServices = [...localData.services];
        const temp = newServices[index];
        newServices[index] = newServices[index + direction];
        newServices[index + direction] = temp;
        setLocalData((prev: any) => ({ ...prev, services: newServices }));
    };

    const handleAddService = () => {
        const newServices = [...localData.services, {
            id: `s${Date.now()}`,
            title: "Nuevo Servicio",
            description: "Descripción del nuevo servicio...",
            image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1000",
            features: ["Característica 1", "Característica 2", "Característica 3", "Característica 4"]
        }];
        setLocalData((prev: any) => ({ ...prev, services: newServices }));
    };

    const handleRemoveService = (index: number) => {
        const newServices = localData.services.filter((_: any, i: number) => i !== index);
        setLocalData((prev: any) => ({ ...prev, services: newServices }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/save-services", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(localData)
            });
            const result = await res.json();
            if (result.success) {

                alert("Servicios guardados con éxito.");
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

    return (
        <main className="px-6 py-24 mt-20 mx-auto max-w-7xl overflow-hidden relative">
            

            

            <header className={`mb-32 text-center max-w-4xl mx-auto rounded-3xl p-8 ${isEditing ? 'ring-4 ring-indigo-500' : ''}`}>
                {isEditing ? (
                    <input
                        value={localData.header.tag}
                        onChange={(e) => handleUpdateHeader("tag", e.target.value)}
                        className="text-[10px] uppercase tracking-[0.5em] font-bold text-stone-400 mb-8 block w-full text-center bg-stone-100 p-2 rounded-lg"
                    />
                ) : (
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[10px] uppercase tracking-[0.5em] font-bold text-stone-400 mb-8 block"
                    >
                        {localData.header.tag}
                    </motion.span>
                )}

                {isEditing ? (
                    <div className="flex flex-col gap-2 mb-10">
                        <input value={localData.header.title1} onChange={(e) => handleUpdateHeader("title1", e.target.value)} className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-stone-900 bg-stone-100 w-full text-center p-2 rounded-lg" />
                        <input value={localData.header.titleHighlight} onChange={(e) => handleUpdateHeader("titleHighlight", e.target.value)} className="text-5xl md:text-8xl font-light italic tracking-tighter leading-[0.9] text-stone-300 bg-stone-100 w-full text-center p-2 rounded-lg" />
                        <input value={localData.header.title2} onChange={(e) => handleUpdateHeader("title2", e.target.value)} className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-stone-900 bg-stone-100 w-full text-center p-2 rounded-lg" />
                        
                        <div className="mt-8 bg-stone-100 p-4 rounded-xl">
                            <label className="text-xs uppercase font-bold tracking-widest text-stone-500 mb-2 block">Redondeo de Imágenes (px)</label>
                            <input 
                                type="range" min="0" max="100" 
                                value={localData.header.borderRadius || 32} 
                                onChange={(e) => handleUpdateHeader("borderRadius", e.target.value)} 
                                className="w-full" 
                            />
                        </div>
                    </div>
                ) : (
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-10 text-stone-900"
                    >
                        {localData.header.title1} <span className="text-stone-300 italic font-light">{localData.header.titleHighlight}</span>{localData.header.title2}
                    </motion.h2>
                )}

                {isEditing ? (
                    <textarea
                        value={localData.header.description}
                        onChange={(e) => handleUpdateHeader("description", e.target.value)}
                        className="text-stone-500 text-xl font-light leading-relaxed max-w-2xl mx-auto w-full bg-stone-100 p-4 rounded-xl"
                        rows={3}
                    />
                ) : (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-stone-500 text-xl font-light leading-relaxed max-w-2xl mx-auto"
                    >
                        {localData.header.description}
                    </motion.p>
                )}
            </header>

            <div className="space-y-48">
                {localData.services.map((service: any, index: number) => (
                    <section key={service.id} className={`flex flex-col gap-20 items-center relative group/section ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} ${isEditing ? 'ring-4 ring-indigo-500/50 rounded-3xl p-8' : ''}`}>
                        {isEditing && (
                            <div className="absolute -top-12 right-0 z-50 flex items-center gap-2 bg-stone-900 p-2 rounded-xl shadow-2xl">
                                <button onClick={() => handleMoveService(index, -1)} disabled={index === 0} className="w-8 h-8 flex items-center justify-center text-white hover:bg-stone-700 rounded-lg disabled:opacity-30"><ion-icon name="arrow-up-outline"></ion-icon></button>
                                <button onClick={() => handleMoveService(index, 1)} disabled={index === localData.services.length - 1} className="w-8 h-8 flex items-center justify-center text-white hover:bg-stone-700 rounded-lg disabled:opacity-30"><ion-icon name="arrow-down-outline"></ion-icon></button>
                                <button onClick={() => handleRemoveService(index)} className="px-3 h-8 flex items-center justify-center text-white hover:bg-red-500 rounded-lg text-[10px] font-bold uppercase tracking-widest border-l border-stone-700 ml-2 pl-4">Eliminar</button>
                            </div>
                        )}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 w-full"
                        >
                            <div className="aspect-[4/5] md:aspect-[4/3] overflow-hidden shadow-2xl relative group" style={{ borderRadius: `${localData.header.borderRadius || 32}px` }}>
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                />
                                {isEditing && (
                                    <div className="absolute top-4 left-4 z-50">
                                        <input 
                                            value={service.image}
                                            onChange={(e) => handleUpdateService(index, "image", e.target.value)}
                                            className="bg-stone-900/80 backdrop-blur-xl text-white text-[10px] px-4 py-2 rounded-xl w-64 focus:outline-none"
                                            placeholder="URL de la imagen"
                                        />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 w-full"
                        >
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-stone-300 mb-4 block">0{index + 1} / Servicios</span>
                            {isEditing ? (
                                <input
                                    value={service.title}
                                    onChange={(e) => handleUpdateService(index, "title", e.target.value)}
                                    className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-stone-900 bg-stone-100 p-2 w-full rounded-lg"
                                />
                            ) : (
                                <h3 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-stone-900">{service.title}</h3>
                            )}

                            {isEditing ? (
                                <textarea
                                    value={service.description}
                                    onChange={(e) => handleUpdateService(index, "description", e.target.value)}
                                    className="text-stone-500 text-lg mb-12 leading-relaxed font-light bg-stone-100 p-4 w-full rounded-xl"
                                    rows={4}
                                />
                            ) : (
                                <p className="text-stone-500 text-lg mb-12 leading-relaxed font-light">{service.description}</p>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-16">
                                {service.features.map((feature: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-stone-400 group/item"
                                    >
                                        <div className="w-1.5 h-1.5 bg-stone-200 group-hover/item:bg-stone-900 transition-colors rounded-full"></div>
                                        {isEditing ? (
                                            <input 
                                                value={feature}
                                                onChange={(e) => {
                                                    const newFeatures = [...service.features];
                                                    newFeatures[i] = e.target.value;
                                                    handleUpdateService(index, "features", newFeatures);
                                                }}
                                                className="bg-stone-100 px-2 py-1 rounded w-full text-stone-900"
                                            />
                                        ) : (
                                            feature
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-4 text-[10px] font-bold tracking-[0.3em] uppercase group"
                            >
                                <span>Solicitar presupuesto</span>
                                <div className="w-12 h-[1px] bg-stone-900 origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-300"></div>
                            </Link>
                        </motion.div>
                    </section>
                ))}
            </div>

            {isEditing && (
                <div className="mt-24 text-center">
                    <button 
                        onClick={handleAddService}
                        className="bg-indigo-500 text-white px-8 py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-indigo-400 transition transform hover:-translate-y-1"
                    >
                        + Añadir Nuevo Servicio
                    </button>
                </div>
            )}

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`mt-48 py-32 bg-stone-900 text-white rounded-[3rem] px-8 md:px-24 text-center relative overflow-hidden ${isEditing ? 'ring-4 ring-indigo-500' : ''}`}
            >
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-7xl font-light tracking-tighter mb-12">
                        {localData.cta.title1} <br /><span className="italic font-black">{localData.cta.titleHighlight}</span>
                    </h2>
                    <p className="text-stone-400 text-xl mb-16 max-w-2xl mx-auto font-light leading-relaxed">{localData.cta.description}</p>
                    <Link href={localData.cta.link} className="inline-block bg-white text-stone-900 px-12 py-6 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-stone-100 transition shadow-2xl hover:scale-105 transform">{localData.cta.button}</Link>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </motion.section>
        {isEditing && (
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="fixed bottom-6 right-6 z-[200] bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-black shadow-2xl transition-all"
                >
                    {isSaving ? "Guardando Servicios..." : "Guardar Servicios"}
                </button>
            )}
        </main>
    );
}
