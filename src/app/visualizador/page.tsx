"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const Scene3DEditor = dynamic(() => import("@/components/Scene3DEditor"), {
    ssr: false,
    loading: () => (
        <div className="fixed inset-0 bg-stone-950 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
    ),
});

type Step = "intro" | "upload-video" | "processing-guide" | "upload-splat" | "viewer";

export default function VisualizadorPage() {
    const [step, setStep] = useState<Step>("intro");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
    const [splatUrl, setSplatUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState("");
    const videoInputRef = useRef<HTMLInputElement>(null);
    const splatInputRef = useRef<HTMLInputElement>(null);

    // Handle video file selection
    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setVideoFile(file);
        setVideoPreviewUrl(URL.createObjectURL(file));
    };

    // Upload video to backend
    const handleVideoUpload = async () => {
        if (!videoFile) return;
        setUploading(true);
        setUploadProgress("Subiendo vídeo al servidor...");

        try {
            const formData = new FormData();
            formData.append("video", videoFile);

            const res = await fetch("/api/upload-video", { method: "POST", body: formData });
            const data = await res.json();

            if (data.success) {
                setUploadProgress("¡Vídeo almacenado! Avanzando al siguiente paso...");
                setTimeout(() => {
                    setStep("processing-guide");
                    setUploading(false);
                }, 1200);
            } else {
                setUploadProgress(`Error: ${data.error}`);
                setUploading(false);
            }
        } catch {
            setUploadProgress("Error de conexión al subir el vídeo");
            setUploading(false);
        }
    };

    // Handle .splat file selection → go directly to viewer
    const handleSplatSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setSplatUrl(url);
        setStep("viewer");
    };

    return (
        <main className="min-h-screen bg-stone-950 text-white font-sans select-none overflow-hidden">
            {/* Background grid */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-950/95 to-stone-950" />
            </div>

            <AnimatePresence mode="wait">
                {/* ═══════════════════ STEP 1: INTRO ═══════════════════ */}
                {step === "intro" && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center"
                    >
                        <span className="text-amber-500 text-[8px] font-black uppercase tracking-[0.5em] mb-6 block">Tecnología Real De Reconstrucción 3D</span>
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.9] mb-6">
                            Tu Espacio Real<br />
                            <span className="text-stone-500">En 3D Interactivo</span>
                        </h1>
                        <p className="text-stone-400 text-xs md:text-sm max-w-lg leading-relaxed mb-12">
                            Graba un vídeo de tu habitación con el móvil. Nosotros lo convertimos en un modelo 3D fotorrealista navegable donde podrás visualizar cómo quedarán los nuevos materiales antes de empezar la reforma.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setStep("upload-video")}
                                className="px-10 py-5 bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-full shadow-2xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                📹 Subir Vídeo De Mi Habitación
                            </button>
                            <button
                                onClick={() => splatInputRef.current?.click()}
                                className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full transition-all"
                            >
                                📦 Ya Tengo Mi Archivo .splat
                            </button>
                            <input
                                ref={splatInputRef}
                                type="file"
                                accept=".splat,.ply"
                                className="hidden"
                                onChange={handleSplatSelect}
                            />
                        </div>

                        {/* How it works */}
                        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl w-full">
                            {[
                                { step: "1", title: "Graba tu habitación", desc: "Recorre el espacio con tu móvil grabando un vídeo lento de 30-60 segundos." },
                                { step: "2", title: "Procesamos en 3D", desc: "Usamos IA de reconstrucción (Gaussian Splatting) para crear tu gemelo digital." },
                                { step: "3", title: "Diseña tu reforma", desc: "Navega en 3D y visualiza materiales, colores y acabados antes de reformar." },
                            ].map((item) => (
                                <div key={item.step} className="text-left bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                                    <span className="text-amber-500 text-2xl font-black italic">{item.step}</span>
                                    <h3 className="text-sm font-black uppercase tracking-wide mt-2 mb-1">{item.title}</h3>
                                    <p className="text-[10px] text-stone-500 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ═══════════════════ STEP 2: UPLOAD VIDEO ═══════════════════ */}
                {step === "upload-video" && (
                    <motion.div
                        key="upload-video"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative z-10 min-h-screen flex items-center justify-center px-6"
                    >
                        <div className="bg-stone-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 md:p-10 max-w-xl w-full shadow-2xl">
                            <button onClick={() => setStep("intro")} className="text-stone-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all mb-6 block">
                                <ion-icon name="arrow-back-outline" style={{ fontSize: '16px' }}></ion-icon> Volver
                            </button>

                            <span className="text-amber-500 text-[8px] font-black uppercase tracking-[0.4em] block mb-2">Paso 1 de 3</span>
                            <h2 className="text-2xl font-black italic uppercase tracking-tight mb-1">Sube Tu Vídeo</h2>
                            <p className="text-stone-500 text-[10px] leading-relaxed mb-8">
                                Graba un vídeo de 30-60 segundos recorriendo tu habitación lentamente. Buena iluminación y movimientos suaves darán mejor resultado.
                            </p>

                            {/* Video selector */}
                            {!videoFile ? (
                                <label className="group cursor-pointer block">
                                    <div className="border-2 border-dashed border-stone-800 group-hover:border-amber-500/50 bg-black/30 hover:bg-black/50 p-16 rounded-2xl flex flex-col items-center gap-4 transition-all">
                                        <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-amber-500 group-hover:text-black text-stone-400 flex items-center justify-center transition-all text-2xl">
                                            📹
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white text-[10px] font-black uppercase tracking-widest">Selecciona o arrastra tu vídeo</p>
                                            <p className="text-stone-600 text-[8px] font-bold uppercase mt-1">.mp4 .mov .webm · Máx. 500MB</p>
                                        </div>
                                    </div>
                                    <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />
                                </label>
                            ) : (
                                <div className="space-y-4">
                                    {/* Video preview */}
                                    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black">
                                        <video
                                            src={videoPreviewUrl!}
                                            controls
                                            muted
                                            className="w-full aspect-video object-contain"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-xl p-4">
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-wider truncate max-w-[200px]">{videoFile.name}</p>
                                            <p className="text-[8px] text-stone-500 font-bold uppercase">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                        </div>
                                        <button
                                            onClick={() => { setVideoFile(null); setVideoPreviewUrl(null); }}
                                            className="text-stone-500 hover:text-red-400 text-[8px] font-black uppercase tracking-wider transition-all"
                                        >
                                            Cambiar
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleVideoUpload}
                                        disabled={uploading}
                                        className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 text-black disabled:text-stone-400 font-black text-[10px] uppercase tracking-[0.2em] rounded-full transition-all shadow-xl disabled:shadow-none"
                                    >
                                        {uploading ? uploadProgress : <span className="flex items-center gap-2">Subir Vídeo y Continuar <ion-icon name="arrow-forward-outline" style={{ fontSize: '16px' }}></ion-icon></span>}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ═══════════════════ STEP 3: PROCESSING GUIDE ═══════════════════ */}
                {step === "processing-guide" && (
                    <motion.div
                        key="processing-guide"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20"
                    >
                        <div className="max-w-2xl w-full">
                            <button onClick={() => setStep("upload-video")} className="text-stone-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all mb-6 block">
                                <ion-icon name="arrow-back-outline" style={{ fontSize: '16px' }}></ion-icon> Volver
                            </button>

                            <span className="text-amber-500 text-[8px] font-black uppercase tracking-[0.4em] block mb-2">Paso 2 de 3</span>
                            <h2 className="text-2xl font-black italic uppercase tracking-tight mb-2">Convierte Tu Vídeo En 3D</h2>
                            <p className="text-stone-400 text-xs leading-relaxed mb-10">
                                La conversión de vídeo a modelo 3D requiere procesamiento GPU pesado que se realiza en servicios especializados gratuitos. Sigue estas instrucciones:
                            </p>

                            {/* Option A: Luma AI */}
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg">L</div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-black uppercase tracking-wide mb-1">Opción A — Luma AI <span className="text-emerald-400 text-[7px] font-bold uppercase ml-2">Gratis</span></h3>
                                        <ol className="text-[10px] text-stone-400 space-y-2 mt-3 leading-relaxed list-decimal list-inside">
                                            <li>Ve a <a href="https://lumalabs.ai/genie" target="_blank" rel="noopener" className="text-amber-400 underline hover:text-amber-300">lumalabs.ai</a> y crea una cuenta gratuita.</li>
                                            <li>Sube tu vídeo en la sección <strong className="text-white">&quot;3D Capture&quot;</strong>.</li>
                                            <li>Espera a que procese (5-15 minutos dependiendo de la duración).</li>
                                            <li>Descarga el resultado en formato <strong className="text-amber-400">.ply</strong> o <strong className="text-amber-400">.splat</strong>.</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            {/* Option B: Polycam */}
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg">P</div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-black uppercase tracking-wide mb-1">Opción B — Polycam <span className="text-emerald-400 text-[7px] font-bold uppercase ml-2">Gratis</span></h3>
                                        <ol className="text-[10px] text-stone-400 space-y-2 mt-3 leading-relaxed list-decimal list-inside">
                                            <li>Descarga <a href="https://poly.cam" target="_blank" rel="noopener" className="text-amber-400 underline hover:text-amber-300">Polycam</a> en tu iPhone o Android.</li>
                                            <li>Graba directamente desde la app (tiene modo <strong className="text-white">LiDAR</strong> en iPhone Pro).</li>
                                            <li>Procesa automáticamente en la nube.</li>
                                            <li>Exporta como <strong className="text-amber-400">.splat</strong> o <strong className="text-amber-400">.glb</strong>.</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            {/* Option C: Nerfstudio (advanced) */}
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg">N</div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-black uppercase tracking-wide mb-1">Opción C — Nerfstudio <span className="text-stone-500 text-[7px] font-bold uppercase ml-2">Avanzado · GPU Local</span></h3>
                                        <ol className="text-[10px] text-stone-400 space-y-2 mt-3 leading-relaxed list-decimal list-inside">
                                            <li>Instala <a href="https://docs.nerf.studio" target="_blank" rel="noopener" className="text-amber-400 underline hover:text-amber-300">Nerfstudio</a> en un PC con GPU NVIDIA.</li>
                                            <li>Ejecuta: <code className="bg-black/50 text-amber-400 px-2 py-0.5 rounded text-[9px]">ns-process-data video --data tu_video.mp4</code></li>
                                            <li>Entrena: <code className="bg-black/50 text-amber-400 px-2 py-0.5 rounded text-[9px]">ns-train splatfacto --data outputs/</code></li>
                                            <li>Exporta el <strong className="text-amber-400">.splat</strong> final.</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            {/* Call to action */}
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 text-center">
                                <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-4">¿Ya tienes tu archivo .splat o .ply procesado?</p>
                                <button
                                    onClick={() => setStep("upload-splat")}
                                    className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-full shadow-xl transition-all hover:scale-[1.02]"
                                >
                                    <span className="flex items-center justify-center gap-2">Subir Modelo 3D Procesado <ion-icon name="arrow-forward-outline" style={{ fontSize: '16px' }}></ion-icon></span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ═══════════════════ STEP 4: UPLOAD SPLAT ═══════════════════ */}
                {step === "upload-splat" && (
                    <motion.div
                        key="upload-splat"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative z-10 min-h-screen flex items-center justify-center px-6"
                    >
                        <div className="bg-stone-900/60 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 md:p-10 max-w-lg w-full shadow-2xl text-center">
                            <button onClick={() => setStep("processing-guide")} className="text-stone-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all mb-6 block text-left w-full">
                                <ion-icon name="arrow-back-outline" style={{ fontSize: '16px' }}></ion-icon> Volver
                            </button>

                            <span className="text-amber-500 text-[8px] font-black uppercase tracking-[0.4em] block mb-2">Paso 3 de 3</span>
                            <h2 className="text-2xl font-black italic uppercase tracking-tight mb-2">Carga Tu Modelo 3D</h2>
                            <p className="text-stone-500 text-[10px] leading-relaxed mb-8">
                                Sube el archivo .splat o .ply que has exportado de Luma AI, Polycam o Nerfstudio.
                            </p>

                            <label className="group cursor-pointer block mb-6">
                                <div className="border-2 border-dashed border-stone-800 group-hover:border-amber-500/50 bg-black/30 hover:bg-black/50 p-14 rounded-2xl flex flex-col items-center gap-4 transition-all">
                                    <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-amber-500 group-hover:text-black text-stone-400 flex items-center justify-center transition-all text-2xl">
                                        🧊
                                    </div>
                                    <div>
                                        <p className="text-white text-[10px] font-black uppercase tracking-widest">Selecciona tu archivo 3D</p>
                                        <p className="text-stone-600 text-[8px] font-bold uppercase mt-1">.splat · .ply</p>
                                    </div>
                                </div>
                                <input type="file" accept=".splat,.ply" className="hidden" onChange={handleSplatSelect} />
                            </label>
                        </div>
                    </motion.div>
                )}

                {/* ═══════════════════ STEP 5: 3D VIEWER ═══════════════════ */}
                {step === "viewer" && splatUrl && (
                    <motion.div
                        key="viewer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[1000]"
                    >
                        <Scene3DEditor
                            splatUrl={splatUrl}
                            videoPreviewUrl={videoPreviewUrl}
                            onClose={() => {
                                setStep("intro");
                                setSplatUrl(null);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Brand footer */}
            {step !== "viewer" && (
                <div className="fixed bottom-6 left-0 right-0 text-center z-10">
                    <span className="text-stone-700 text-[7px] font-black uppercase tracking-[0.4em]">Ebenzer Reality Suite © 2026</span>
                </div>
            )}
        </main>
    );
}
