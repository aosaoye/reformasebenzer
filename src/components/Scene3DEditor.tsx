"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Splat, Grid, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

// --- Error Boundary for WebGL crashes ---
class SceneErrorBoundary extends React.Component<
    { children: React.ReactNode; onError: () => void },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode; onError: () => void }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: Error) {
        console.error("3D Engine Error:", error);
        this.props.onError();
    }
    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}

// Tiny helper: fires callback once Suspense resolves and this component mounts
function LoadNotifier({ onReady }: { onReady: () => void }) {
    useEffect(() => {
        // Small delay to let the first frame render
        const t = setTimeout(onReady, 600);
        return () => clearTimeout(t);
    }, [onReady]);
    return null;
}

interface Scene3DEditorProps {
    splatUrl: string | null;
    videoPreviewUrl?: string | null;
    onClose: () => void;
}

export default function Scene3DEditor({ splatUrl, videoPreviewUrl, onClose }: Scene3DEditorProps) {
    const [rotationY, setRotationY] = useState(0);
    const [heightOffset, setHeightOffset] = useState(0);
    const [splatScale, setSplatScale] = useState(1.0);
    const [showGrid, setShowGrid] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    if (!splatUrl) return null;

    return (
        <div className="fixed inset-0 z-[1000] bg-[#08090a] flex overflow-hidden select-none font-sans text-white">

            {/* TOP BAR */}
            <div className="absolute top-0 left-0 right-0 z-[1100] p-5 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none">
                <div className="flex items-center gap-5 pointer-events-auto">
                    <button
                        onClick={onClose}
                        className="w-11 h-11 bg-white/5 hover:bg-white hover:text-black rounded-full flex items-center justify-center border border-white/10 transition-all group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-lg font-black tracking-tight uppercase italic">Visor 3D Fotorrealista</h2>
                        <p className="text-stone-500 text-[8px] uppercase tracking-[0.25em] font-bold mt-0.5">Gaussian Splatting · Renderizado Volumétrico en Tiempo Real</p>
                    </div>
                </div>

                <div className="pointer-events-auto flex gap-2 bg-black/60 backdrop-blur-xl p-1 rounded-full border border-white/5">
                    <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${showGrid ? "bg-white text-black" : "text-stone-400 hover:text-white"}`}
                    >
                        Cuadrícula
                    </button>
                </div>
            </div>

            {/* LEFT SIDEBAR */}
            <div className="w-72 z-[1100] shrink-0 bg-[#0d0e10]/95 border-r border-white/5 backdrop-blur-xl flex flex-col pt-24 px-5 pb-6 overflow-y-auto">

                {/* Video Reference */}
                {videoPreviewUrl && (
                    <div className="mb-6">
                        <span className="text-[7px] font-black text-stone-500 uppercase tracking-widest block mb-2">📹 Vídeo Original</span>
                        <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                            <video src={videoPreviewUrl} autoPlay muted loop playsInline className="w-full aspect-video object-cover opacity-80" />
                        </div>
                    </div>
                )}

                {/* Spatial Controls */}
                <div className="space-y-5">
                    <span className="text-amber-500 text-[8px] font-black uppercase tracking-widest block">🎛️ Ajustes Espaciales</span>

                    {/* Rotation */}
                    <div>
                        <div className="flex justify-between text-[8px] uppercase font-black text-stone-400 mb-1.5">
                            <span>Rotación</span>
                            <span className="text-amber-400 font-mono">{Math.round((rotationY * 180) / Math.PI)}°</span>
                        </div>
                        <input type="range" min={-Math.PI} max={Math.PI} step={0.05} value={rotationY}
                            onChange={(e) => setRotationY(parseFloat(e.target.value))}
                            className="w-full accent-amber-500 h-1 rounded-full cursor-pointer appearance-none bg-stone-800"
                        />
                    </div>

                    {/* Height */}
                    <div>
                        <div className="flex justify-between text-[8px] uppercase font-black text-stone-400 mb-1.5">
                            <span>Altura</span>
                            <span className="text-amber-400 font-mono">{heightOffset.toFixed(2)}m</span>
                        </div>
                        <input type="range" min={-3} max={3} step={0.05} value={heightOffset}
                            onChange={(e) => setHeightOffset(parseFloat(e.target.value))}
                            className="w-full accent-amber-500 h-1 rounded-full cursor-pointer appearance-none bg-stone-800"
                        />
                    </div>

                    {/* Scale */}
                    <div>
                        <div className="flex justify-between text-[8px] uppercase font-black text-stone-400 mb-1.5">
                            <span>Escala</span>
                            <span className="text-amber-400 font-mono">{splatScale.toFixed(2)}x</span>
                        </div>
                        <input type="range" min={0.2} max={3} step={0.05} value={splatScale}
                            onChange={(e) => setSplatScale(parseFloat(e.target.value))}
                            className="w-full accent-amber-500 h-1 rounded-full cursor-pointer appearance-none bg-stone-800"
                        />
                    </div>

                    <button
                        onClick={() => { setRotationY(0); setHeightOffset(0); setSplatScale(1); }}
                        className="w-full py-2.5 bg-white/5 hover:bg-white hover:text-black text-[8px] font-black uppercase tracking-widest border border-white/5 hover:border-white rounded-lg transition-all"
                    >
                        Resetear
                    </button>
                </div>

                {/* Controls hint */}
                <div className="mt-auto pt-6 border-t border-white/5">
                    <span className="text-[7px] font-black text-stone-600 uppercase tracking-widest block mb-2">Controles</span>
                    <div className="text-[8px] text-stone-500 space-y-1">
                        <p><strong className="text-stone-300">Clic + arrastrar</strong> — Orbitar</p>
                        <p><strong className="text-stone-300">Rueda</strong> — Zoom</p>
                        <p><strong className="text-stone-300">Clic derecho</strong> — Desplazar</p>
                    </div>
                </div>
            </div>

            {/* CANVAS VIEWPORT */}
            <div className="flex-1 relative bg-[#050506] cursor-grab active:cursor-grabbing">

                {/* Error state */}
                {loadError && (
                    <div className="absolute inset-0 z-[1200] bg-[#0a0b0c] flex items-center justify-center">
                        <div className="text-center max-w-sm px-6">
                            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-5 text-xl">⚠️</div>
                            <h3 className="text-white text-sm font-black uppercase tracking-wide mb-2">Error al cargar el modelo</h3>
                            <p className="text-stone-500 text-[10px] leading-relaxed mb-6">
                                El archivo .splat no se ha podido leer. Asegúrate de que se ha exportado correctamente desde Luma AI, Polycam o Nerfstudio.
                            </p>
                            <button onClick={onClose} className="px-8 py-3 bg-white text-black font-black text-[9px] uppercase tracking-widest rounded-full hover:scale-105 transition-transform">
                                <ion-icon name="arrow-back-outline" style={{ fontSize: '16px' }}></ion-icon> Intentar de nuevo
                            </button>
                        </div>
                    </div>
                )}

                <SceneErrorBoundary onError={() => setLoadError(true)}>
                    <Canvas dpr={[1, 1.5]} className="z-[800]">
                        <Suspense fallback={
                            <Html center>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
                                    <span className="text-white text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">Cargando modelo volumétrico...</span>
                                </div>
                            </Html>
                        }>
                            <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={50} />
                            <OrbitControls makeDefault enableDamping dampingFactor={0.05} maxDistance={30} minDistance={0.3} />

                            <ambientLight intensity={0.6} />
                            <directionalLight position={[5, 8, 3]} intensity={1.2} />

                            {/* THE REAL GAUSSIAN SPLATTING RENDER */}
                            <group
                                rotation={[0, rotationY, 0]}
                                position={[0, heightOffset, 0]}
                                scale={[splatScale, splatScale, splatScale]}
                            >
                                <Splat
                                    src={splatUrl}
                                    position={[0, 0, 0]}
                                />
                            </group>

                            {/* Once Suspense resolves and this renders, loading is done */}
                            <LoadNotifier onReady={() => setIsLoading(false)} />

                            {showGrid && (
                                <Grid
                                    position={[0, -1, 0]}
                                    args={[40, 40]}
                                    cellSize={0.5}
                                    cellColor="#1a1a1a"
                                    sectionSize={2}
                                    sectionColor="#333"
                                    fadeDistance={25}
                                />
                            )}
                        </Suspense>
                    </Canvas>
                </SceneErrorBoundary>

                {/* Loading overlay */}
                <AnimatePresence>
                    {isLoading && !loadError && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 bg-[#08090a]/95 backdrop-blur-md z-[1080] flex items-center justify-center"
                        >
                            <div className="text-center">
                                <div className="relative w-20 h-20 mx-auto mb-6">
                                    <div className="absolute inset-0 border border-amber-500/10 rounded-full" />
                                    <div className="absolute inset-0 border-t border-amber-500 rounded-full animate-spin" />
                                </div>
                                <h3 className="text-white text-sm font-black uppercase tracking-widest animate-pulse">Renderizando Escena 3D</h3>
                                <p className="text-stone-500 text-[7px] uppercase tracking-[0.3em] mt-2">Procesando millones de puntos gaussianos...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom hint */}
                <div className="absolute bottom-5 left-5 z-[1050] bg-black/70 backdrop-blur-md py-2.5 px-4 rounded-xl border border-white/5 text-[8px] font-black text-stone-400 uppercase tracking-widest">
                    🌍 Arrastra para orbitar dentro de tu habitación real en 3D
                </div>
            </div>
        </div>
    );
}
