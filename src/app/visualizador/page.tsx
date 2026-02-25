"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const ImmersiveViewer = dynamic(() => import("@/components/ImmersiveViewer"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-stone-900 z-[500] flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest animate-pulse">Iniciando Motor 3D...</div>
});

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-stone-950 flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest animate-pulse">Cargando Catálogo 3D...</div>
});

type Step = "upload" | "processing" | "choice" | "viewer" | "studio" | "showroom";

export default function VisualizerPage() {
    const [step, setStep] = useState<Step>("upload");
    const [image, setImage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
            setStep("processing");
            setProgress(0);
        }
    };

    useEffect(() => {
        if (step === "processing") {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStep("choice");
                        return 100;
                    }
                    return prev + 5;
                });
            }, 80);
            return () => clearInterval(interval);
        }
    }, [step]);

    return (
        <main className="min-h-screen bg-stone-50 py-12 px-6 flex items-center justify-center overflow-hidden">
            <div className="w-full max-w-6xl">
                <AnimatePresence mode="wait">
                    {step === "upload" && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center max-w-4xl mx-auto"
                        >
                            <header className="mb-20">
                                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400 mb-6 block">Ebenzer Immersive Engine</span>
                                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-none">Visor 3D Reality</h1>
                                <p className="text-stone-500 text-lg md:text-xl font-light max-w-xl mx-auto">
                                    Sube una foto de tu estancia y entra en una experiencia interactiva sin precedentes.
                                </p>
                            </header>

                            <label className="block border-4 border-dashed border-stone-200 rounded-md p-16 md:p-24 hover:border-stone-900 hover:bg-white transition-all cursor-pointer group bg-transparent shadow-sm hover:shadow-2xl duration-700">
                                <div className="w-24 h-24 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold mb-4 tracking-tight">Capturar Proyecto</h3>
                                <p className="text-stone-400 text-sm mb-12 uppercase tracking-widest font-medium">Sube tu foto y entra en el espacio</p>
                                <span className="bg-stone-900 text-white px-14 py-6 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] inline-block shadow-xl group-hover:shadow-stone-200 transition-all">
                                    Comenzar Experiencia
                                </span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                            </label>
                        </motion.div>
                    )}

                    {step === "processing" && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center p-20"
                        >
                            <div className="relative w-56 h-56 mx-auto mb-12">
                                <div className="absolute inset-0 border-[10px] border-stone-100 rounded-full"></div>
                                <div
                                    className="absolute inset-0 border-[10px] border-stone-900 rounded-full border-t-transparent animate-spin"
                                    style={{ animationDuration: '0.6s' }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-4xl tracking-tighter italic">
                                    {progress}<span className="text-stone-300 text-xl ml-1">%</span>
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight mb-4">Analizando Estancia...</h3>
                            <p className="text-stone-400 text-[10px] uppercase tracking-[0.4em] font-bold text-center">Identificando superficies y volúmenes</p>
                        </motion.div>
                    )}

                    {step === "choice" && (
                        <motion.div
                            key="choice"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
                        >
                            <button
                                onClick={() => setStep("viewer")}
                                className="flex flex-col items-center p-10 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-stone-900 group"
                            >
                                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3 uppercase tracking-tighter">Visor 360°</h3>
                                <p className="text-stone-500 text-xs font-light leading-relaxed">Recorrido inmersivo por toda la vivienda estilo Idealista.</p>
                            </button>

                            <button
                                onClick={() => setStep("studio")}
                                className="flex flex-col items-center p-10 bg-stone-900 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all group"
                            >
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3 uppercase tracking-tighter">AR Studio</h3>
                                <p className="text-stone-400 text-xs font-light leading-relaxed">Mueve y manipula los objetos de tu propia foto en tiempo real.</p>
                            </button>

                            <button
                                onClick={() => setStep("showroom")}
                                className="flex flex-col items-center p-10 bg-amber-500 text-black rounded-3xl shadow-xl hover:shadow-2xl transition-all group"
                            >
                                <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3 uppercase tracking-tighter italic">Showroom 3D</h3>
                                <p className="text-stone-900/60 text-xs font-light leading-relaxed">Proyecta muebles reales de nuestro catálogo en tu casa (Google AR).</p>
                            </button>
                        </motion.div>
                    )}

                    {step === "viewer" && image && (
                        <motion.div key="viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[1000] bg-black">
                            <ImmersiveViewer imageUrl={image} onClose={() => setStep("upload")} />
                        </motion.div>
                    )}

                    {step === "studio" && image && (
                        <motion.div key="studio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[1000] bg-black">
                            <ARStudioComponent imageUrl={image} onClose={() => setStep("upload")} />
                        </motion.div>
                    )}

                    {step === "showroom" && (
                        <motion.div key="showroom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[1000] bg-black">
                            <ModelViewer onClose={() => setStep("upload")} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}

const ARStudioComponent = dynamic(() => import("@/components/ARStudio"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-stone-950 flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest animate-pulse">Cargando AR Studio...</div>
});
