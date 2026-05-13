"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically load editor to avoid window object SSR crashes
const Scene3DEditor = dynamic(() => import("@/components/Scene3DEditor"), { 
    ssr: false,
    loading: () => (
        <div className="fixed inset-0 bg-[#0c0d0e] flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h2 className="text-stone-400 text-[10px] uppercase font-black tracking-[0.3em]">Cargando Renderizador Splatting</h2>
            </div>
        </div>
    )
});

type Step = "intro" | "upload" | "processing" | "editor";

export default function VisualizerPage() {
    const [step, setStep] = useState<Step>("intro");
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");
    const [splatUrl, setSplatUrl] = useState<string | null>(null);
    const router = useRouter();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setSplatUrl(url);
            setFileName(file.name);
            setStep("processing");
            setProgress(0);
        }
    };

    const handleLoadDemo = () => {
        // Pointing to a stable open-source sample Gaussian Splat asset via verified HuggingFace dataset
        setSplatUrl("https://huggingface.co/datasets/cakewalk/splat-data/resolve/main/plush.splat");
        setFileName("Oso_De_Peluche_Fotorrealista.splat");
        setStep("processing");
        setProgress(0);
    };

    // Simulate AI pipeline parsing/loading phase
    useEffect(() => {
        if (step === "processing") {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setStep("editor"), 800);
                        return 100;
                    }
                    return prev + 4;
                });
            }, 100);
            return () => clearInterval(interval);
        }
    }, [step]);

    return (
        <main className="min-h-screen bg-stone-950 font-sans flex items-center justify-center overflow-hidden select-none">
            
            {/* Static Abstract Cybernetic BG Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-stone-950/90 to-amber-900/20" />
            </div>

            <AnimatePresence mode="wait">
                
                {/* STEP 1: TECHNOLOGY SELECTION INTRO */}
                {step === "intro" && (
                    <motion.div 
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative z-10 text-center px-6 max-w-2xl"
                    >
                        <span className="text-amber-500 text-[8px] font-black uppercase tracking-[0.4em] block mb-4">💻 Next-Gen 3D Technology</span>
                        <h1 className="text-white text-4xl md:text-6xl italic font-black tracking-tighter uppercase leading-none mb-6">
                            Gaussian <br /><span className="text-stone-400">Splatting</span>
                        </h1>
                        <p className="text-stone-400 text-[11px] tracking-wider uppercase font-bold leading-relaxed max-w-md mx-auto mb-10">
                            Reconstrucción volumétrica fotorrealista en tiempo real. Transforma tu espacio físico en una copia digital interactiva perfecta.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={() => setStep("upload")}
                                className="px-10 py-5 bg-amber-500 hover:bg-amber-400 text-black font-black text-[9px] uppercase tracking-widest rounded-full shadow-2xl shadow-amber-500/10 transition-all scale-100 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Iniciar Mi Proyecto 3D
                            </button>
                            <button 
                                onClick={handleLoadDemo}
                                className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[9px] uppercase tracking-widest rounded-full transition-all"
                            >
                                Ver Demo En Tiempo Real
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: REAL SPLAT FILE UPLOADER */}
                {step === "upload" && (
                    <motion.div 
                        key="upload"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative z-10 w-full max-w-lg px-6"
                    >
                        <div className="bg-stone-900/80 backdrop-blur-3xl border border-white/5 p-8 rounded-3xl shadow-3xl text-center">
                            <div className="mb-8">
                                <span className="text-stone-500 text-[7px] font-black uppercase tracking-[0.3em] block mb-2">Carga de Modelos Volumétricos</span>
                                <h2 className="text-white text-xl font-black italic uppercase tracking-tight">Importar Malla Real (.splat)</h2>
                            </div>

                            {/* Big drag & drop file selector */}
                            <label className="block group cursor-pointer mb-8">
                                <div className="border-2 border-dashed border-stone-800 group-hover:border-amber-500/40 bg-black/30 p-12 rounded-2xl transition-all flex flex-col items-center justify-center gap-4 hover:bg-black/50">
                                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black text-stone-400 transition-all">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-white text-[10px] font-black uppercase tracking-widest">Arrastra tu archivo `.splat`</p>
                                        <p className="text-stone-500 text-[8px] font-bold mt-1 uppercase">O pulsa para explorar tus carpetas</p>
                                    </div>
                                </div>
                                <input 
                                    type="file" 
                                    accept=".splat" 
                                    className="hidden" 
                                    onChange={handleFileUpload}
                                />
                            </label>

                            {/* Educational Guide Grid */}
                            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-xl text-left">
                                <span className="text-amber-500 text-[7px] font-black uppercase tracking-widest block mb-3 flex items-center gap-2">
                                    <span className="animate-pulse">ℹ️</span> ¿Cómo obtener tu archivo .splat?
                                </span>
                                <div className="grid grid-cols-3 gap-4 text-[7px] font-bold uppercase tracking-wider text-stone-500">
                                    <div>
                                        <span className="text-white block mb-1 font-black">1. Graba Vídeo</span>
                                        Camina por tu habitación grabando despacio y con buena luz.
                                    </div>
                                    <div>
                                        <span className="text-white block mb-1 font-black">2. Procesa</span>
                                        Súbelo gratis a webs como <span className="text-stone-300 underline font-black">Luma AI</span> o <span className="text-stone-300 underline font-black">Polycam</span>.
                                    </div>
                                    <div>
                                        <span className="text-white block mb-1 font-black">3. Descarga</span>
                                        Exporta el modelo en formato <span className="text-amber-400 font-black">Gaussian Splat (.splat)</span> y cárgalo aquí.
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => setStep("intro")}
                                className="mt-6 text-stone-500 hover:text-white text-[8px] font-black uppercase tracking-[0.3em] transition-all"
                            >
                                ← Volver al inicio
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: SCANNING & COMPILING PROGRESS PIPELINE */}
                {step === "processing" && (
                    <motion.div 
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 text-center px-6"
                    >
                        <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
                            <div className="absolute inset-0 border-[1px] border-stone-800 rounded-full" />
                            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle 
                                    cx="50" cy="50" r="45" 
                                    fill="none" stroke="#f59e0b" strokeWidth="2" 
                                    strokeDasharray={283} 
                                    strokeDashoffset={283 - (283 * progress) / 100}
                                    className="transition-all duration-200 ease-out"
                                />
                            </svg>
                            <span className="text-white font-black tracking-tight text-base italic">{progress}%</span>
                        </div>
                        <h3 className="text-white text-[11px] font-black tracking-[0.3em] uppercase mb-2 animate-pulse">Descifrando Nube de Puntos</h3>
                        <p className="text-stone-500 text-[8px] uppercase font-black tracking-widest mb-1">{fileName}</p>
                        <p className="text-stone-600 text-[7px] uppercase font-bold tracking-wide">Inicializando motor Splatting WebGL en tiempo real...</p>
                    </motion.div>
                )}

                {/* STEP 4: THE 3D GAUSSIAN SPLATTING RENDERER */}
                {step === "editor" && (
                    <motion.div 
                        key="editor" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="fixed inset-0 z-[1000] bg-[#0c0d0e]"
                    >
                        <Scene3DEditor 
                            splatUrl={splatUrl}
                            onClose={() => {
                                setStep("intro");
                                setProgress(0);
                                setSplatUrl(null);
                            }} 
                        />
                    </motion.div>
                )}

            </AnimatePresence>

            {/* Bottom Brand Badge */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone-600 text-[7px] uppercase font-black tracking-[0.4em] tracking-widest opacity-50">
                Ebenzer Reality Suite © 2026
            </div>
        </main>
    );
}
