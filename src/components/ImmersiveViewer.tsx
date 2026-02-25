"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

function Scene({ textureUrl, originalUrl, mode }: { textureUrl: string, originalUrl?: string, mode: "after" | "before" }) {
    const afterTexture = useTexture(textureUrl);
    const beforeTexture = useTexture(originalUrl || textureUrl);

    return (
        <>
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                reverseOrbit={true}
                autoRotate={false}
                rotateSpeed={0.5}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
                minDistance={1}
                maxDistance={400}
            />
            <ambientLight intensity={1.5} />
            <Sphere args={[500, 60, 40]} scale={[-1, 1, 1]} position={[0, 0, 0]}>
                <meshBasicMaterial
                    map={mode === "after" ? afterTexture : beforeTexture}
                    side={THREE.DoubleSide}
                />
            </Sphere>
        </>
    );
}

export default function ImmersiveViewer({ imageUrl, originalUrl, onClose }: { imageUrl: string, originalUrl?: string, onClose: () => void }) {
    const [mode, setMode] = useState<"after" | "before">("after");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="fixed inset-0 z-[500] bg-stone-950 flex flex-col">
            {/* Header Controls */}
            <div className="absolute top-0 left-0 right-0 z-[510] p-6 flex flex-wrap items-center justify-between bg-gradient-to-b from-black/80 via-black/20 to-transparent gap-4">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-3 px-8 py-4 text-white transition-all border rounded-full group bg-white/10 hover:bg-white hover:text-stone-900 border-white/20 backdrop-blur-md active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cerrar Visor</span>
                    </button>

                    <div className="hidden lg:block">
                        <h2 className="text-xl font-black tracking-tighter text-white uppercase italic">Ebenzer AI Studio</h2>
                        <p className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-bold">Recorrido Inmersivo 360°</p>
                    </div>
                </div>

                {/* Mode Toggler */}
                {originalUrl && (
                    <div className="flex p-1.5 border rounded-full bg-stone-900/50 backdrop-blur-2xl border-white/10 shadow-2xl">
                        <button
                            onClick={() => setMode("before")}
                            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${mode === "before" ? "bg-white text-stone-900 shadow-2xl scale-105" : "text-white/40 hover:text-white"
                                }`}
                        >
                            Origen
                        </button>
                        <button
                            onClick={() => setMode("after")}
                            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${mode === "after" ? "bg-white text-stone-900 shadow-2xl scale-105" : "text-white/40 hover:text-white"
                                }`}
                        >
                            Resultado
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Ebenzer 360 Design',
                                    text: 'Echa un vistazo a este diseño 3D de Ebenzer',
                                    url: window.location.href,
                                }).catch(console.error);
                            } else {
                                alert("Copiado al portapapeles");
                                navigator.clipboard.writeText(window.location.href);
                            }
                        }}
                        className="flex items-center justify-center w-14 h-14 text-white transition-all border rounded-full bg-white/5 hover:bg-white/20 border-white/10 backdrop-blur-md active:scale-90"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                    <a
                        href="https://wa.me/34600000000?text=Hola,%20estoy%20viendo%20un%20diseño%203D%20en%20vuestro%20visor%20y%20me%20gustaría%20solicitar%20un%20presupuesto."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 px-10 py-4 text-white transition-all bg-[#25D366] rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.3)] hover:bg-[#20ba59] active:scale-95 group"
                    >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Presupuestar</span>
                    </a>
                </div>
            </div>

            {/* Viewer */}
            <div className="relative flex-1 cursor-grab active:cursor-grabbing">
                <AnimatePresence>
                    {!mounted && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-8 text-white bg-stone-950"
                        >
                            <div className="w-16 h-1 w-full max-w-[240px] bg-white/10 overflow-hidden rounded-full">
                                <motion.div
                                    className="h-full bg-white"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                            <span className="text-[11px] uppercase tracking-[0.6em] font-black animate-pulse text-stone-300">Generando Espacio Inmersivo</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Canvas camera={{ position: [0, 0, 0.1], fov: 65 }} dpr={[1, 2]}>
                    <Suspense fallback={null}>
                        <Scene textureUrl={imageUrl} originalUrl={originalUrl} mode={mode} />
                    </Suspense>
                </Canvas>

                {/* Instructions Overlay */}
                <div className="absolute -translate-x-1/2 pointer-events-none bottom-12 left-1/2">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="flex items-center gap-6 px-8 py-4 text-white border rounded-full bg-black/60 backdrop-blur-2xl border-white/10"
                    >
                        <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Arrastra para explorar</span>
                        <div className="w-[1px] h-4 bg-white/20"></div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Zoom con rueda</span>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Credits Cinematic */}
            <div className="absolute flex flex-wrap items-end justify-between pointer-events-none bottom-10 left-10 right-10 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="text-[10px] uppercase font-black text-white/30 tracking-[0.5em] block mb-2">Location ID</span>
                    <span className="text-2xl font-black italic text-white tracking-tighter uppercase">Loft EB-04 / Main Area</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-right"
                >
                    <span className="text-[10px] uppercase font-black text-white/30 tracking-[0.5em] block mb-2">Render Engine</span>
                    <span className="flex items-center justify-end gap-3 text-xl font-black text-white italic tracking-tighter uppercase">
                        Real-time 8K
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping shadow-[0_0_15px_#22c55e]"></span>
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
