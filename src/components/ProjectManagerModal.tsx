"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface ProjectManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    projects: any[];
}

export default function ProjectManagerModal({ isOpen, onClose, projects }: ProjectManagerModalProps) {
    const [mode, setMode] = useState<"list" | "form">("list");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        budget: 0,
        location: "",
        timeline: "",
        warranty: "",
        mainImage: "",
        galleryUrls: "",
        videoUrls: ""
    });
    const router = useRouter();

    if (!isOpen) return null;

    const resetForm = () => {
        setFormData({ id: "", title: "", description: "", budget: 0, location: "", timeline: "", warranty: "", mainImage: "", galleryUrls: "", videoUrls: "" });
        setMode("list");
    };

    const handleEdit = (proj: any) => {
        setFormData({
            id: proj.id,
            title: proj.name || "",
            description: proj.description || "",
            budget: proj.price || 0,
            location: proj.details?.[0]?.replace("Ubicación: ", "") || "",
            timeline: proj.details?.[1]?.replace("Plazo: ", "") || "",
            warranty: proj.details?.[2]?.replace("Garantía: ", "") || "",
            mainImage: proj.image || "",
            galleryUrls: proj.images ? proj.images.join(", ") : "",
            videoUrls: proj.videos ? proj.videos.join(", ") : ""
        });
        setMode("form");
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este proyecto definitivamente?")) return;
        
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                router.refresh();
                onClose();
            } else {
                alert("Error al eliminar: " + data.message);
            }
        } catch (error) {
            alert("Error de red");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            title: formData.title,
            description: formData.description,
            budget: Number(formData.budget),
            location: formData.location,
            timeline: formData.timeline,
            warranty: formData.warranty,
            mainImage: formData.mainImage,
            galleryUrls: formData.galleryUrls.split(",").map(s => s.trim()).filter(Boolean),
            videoUrls: formData.videoUrls.split(",").map(s => s.trim()).filter(Boolean)
        };

        try {
            const url = formData.id ? `/api/admin/projects/${formData.id}` : `/api/admin/projects`;
            const method = formData.id ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                router.refresh();
                resetForm();
                onClose();
            } else {
                alert("Error al guardar: " + data.message);
            }
        } catch (error) {
            alert("Error de red");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm"
                    onClick={onClose}
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                >
                    <header className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                        <div>
                            <h2 className="text-xl font-black text-stone-900 tracking-tight uppercase">
                                {mode === "list" ? "Gestor de Proyectos" : (formData.id ? "Editar Proyecto" : "Nuevo Proyecto")}
                            </h2>
                            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mt-1">
                                Ebenzer Visual Builder CMS
                            </p>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 transition-colors text-stone-500">
                            ✕
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 bg-white">
                        {mode === "list" ? (
                            <div>
                                <div className="flex justify-end mb-6">
                                    <button 
                                        onClick={() => setMode("form")}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-black shadow-lg transition-all flex items-center gap-2"
                                    >
                                        <span>+ Añadir Proyecto</span>
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {projects.map(p => (
                                        <div key={p.id} className="border border-stone-100 rounded-2xl p-4 flex gap-4 items-center group hover:border-indigo-100 hover:shadow-md transition-all">
                                            <div className="w-16 h-16 rounded-xl bg-stone-200 overflow-hidden relative flex-shrink-0">
                                                <img src={p.image} className="object-cover w-full h-full" alt="" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm text-stone-900 truncate">{p.name}</h4>
                                                <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1 truncate">{p.category}</p>
                                            </div>
                                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(p)} className="text-[10px] text-indigo-600 font-bold uppercase hover:underline">Editar</button>
                                                <button onClick={() => handleDelete(p.id)} className="text-[10px] text-red-500 font-bold uppercase hover:underline">Borrar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-2xl mx-auto">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 block mb-2">Título del Proyecto</label>
                                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="Ej. Villa Mediterránea" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 block mb-2">Descripción</label>
                                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" rows={4} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 block mb-2">Presupuesto (€)</label>
                                        <input type="number" value={formData.budget} onChange={e => setFormData({...formData, budget: Number(e.target.value)})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 block mb-2">Ubicación</label>
                                        <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 block mb-2">Plazo de obra</label>
                                        <input value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="Ej. 6 meses" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 block mb-2">Garantía</label>
                                        <input value={formData.warranty} onChange={e => setFormData({...formData, warranty: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="Ej. 5 años" />
                                    </div>
                                </div>
                                
                                <div className="border-t border-stone-100 pt-6 mt-2">
                                    <h3 className="text-sm font-black tracking-tight mb-4 uppercase">Multimedia</h3>
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 block mb-2">URL Imagen Principal</label>
                                            <input value={formData.mainImage} onChange={e => setFormData({...formData, mainImage: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="https://..." />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 block mb-2">URLs Galería (separadas por coma)</label>
                                            <textarea value={formData.galleryUrls} onChange={e => setFormData({...formData, galleryUrls: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="https://img1.jpg, https://img2.jpg" rows={2} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest font-bold text-stone-500 block mb-2">URLs Vídeos (separadas por coma)</label>
                                            <textarea value={formData.videoUrls} onChange={e => setFormData({...formData, videoUrls: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="https://video.mp4" rows={2} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-end mt-4 pt-6 border-t border-stone-100">
                                    <button type="button" onClick={resetForm} className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-stone-500 hover:text-stone-800">Cancelar</button>
                                    <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-black shadow-lg transition-all disabled:opacity-50">
                                        {loading ? "Guardando..." : "Guardar Proyecto"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
