"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const ImmersiveViewer = dynamic(() => import("@/components/ImmersiveViewer"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-stone-900 z-[500] flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest animate-pulse">Iniciando Motor 3D...</div>
});

type Step = "upload" | "processing" | "viewer";

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
                        setStep("viewer");
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
            <div className="w-full max-w-4xl">
                <AnimatePresence mode="wait">
                    {step === "upload" && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center"
                        >
                            <header className="mb-20">
                                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400 mb-6 block">Ebenzer Immersive Engine</span>
                                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-none">Visor 3D Reality</h1>
                                <p className="text-stone-500 text-lg md:text-xl font-light max-w-xl mx-auto">
                                    Sube una foto de tu estancia y nosotros la proyectaremos de inmediato en nuestra experiencia inmersiva.
                                </p>
                            </header>

                            <label className="block border-4 border-dashed border-stone-200 rounded-md p-16 md:p-24 hover:border-stone-900 hover:bg-white transition-all cursor-pointer group bg-transparent shadow-sm hover:shadow-2xl duration-700">
                                <div className="w-24 h-24 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500">
                                    {/* @ts-ignore */}
                                    <ion-icon name="camera-outline" style={{ fontSize: '48px' }} suppressHydrationWarning></ion-icon>
                                </div>
                                <h3 className="text-3xl font-bold mb-4 tracking-tight">Capturar Proyecto</h3>
                                <p className="text-stone-400 text-sm mb-12 uppercase tracking-widest font-medium">Sube tu foto y entra en el espacio</p>
                                <span className="bg-stone-900 text-white px-14 py-6 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] inline-block shadow-xl group-hover:shadow-stone-200 transition-all">
                                    Comenzar Visor 3D
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
                            <h3 className="text-3xl font-bold tracking-tight mb-4">Proyectando Espacio...</h3>
                            <p className="text-stone-400 text-[10px] uppercase tracking-[0.4em] font-bold">Iniciando motor Ebenzer Reality</p>
                        </motion.div>
                    )}

                    {step === "viewer" && image && (
                        <motion.div
                            key="viewer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="fixed inset-0 z-[1000] bg-black"
                        >
                            <ImmersiveViewer
                                imageUrl={image}
                                onClose={() => {
                                    setStep("upload");
                                    setImage(null);
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
