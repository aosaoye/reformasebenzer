"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture, Html, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface Hotspot {
    id: string;
    targetNodeId: string;
    position: [number, number, number];
    label: string;
}

interface TourNode {
    id: string;
    name: string;
    textureAfter: string;
    textureBefore?: string;
    hotspots: Hotspot[];
}

// --- Components ---

function HotspotMarker({ hotspot, onNavigate }: { hotspot: Hotspot, onNavigate: (id: string) => void }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Html position={hotspot.position}>
            <div
                className="flex flex-col items-center group cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(hotspot.targetNodeId);
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Modern Pulse Ring */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-14 h-14 bg-white/20 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute w-10 h-10 bg-white/40 rounded-full animate-pulse"></div>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.8)] border-4 border-black/5 transition-transform group-hover:scale-125 duration-500">
                        <svg className="w-4 h-4 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>

                {/* Floating Label (Idealista Style) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 px-4 py-2 bg-stone-900/90 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl"
                >
                    <span className="text-[9px] uppercase font-black tracking-[0.2em] text-white whitespace-nowrap">
                        {hotspot.label}
                    </span>
                </motion.div>
            </div>
        </Html>
    );
}

function InterconnectedScene({
    currentNode,
    viewMode,
    onNavigate,
    transitioning
}: {
    currentNode: TourNode,
    viewMode: "before" | "after",
    onNavigate: (id: string) => void,
    transitioning: boolean
}) {
    const textureAfter = useTexture(currentNode.textureAfter);
    const textureBefore = useTexture(currentNode.textureBefore || currentNode.textureAfter);
    const { camera } = useThree();

    // Idealista-style Cinematic Transition
    useFrame((state) => {
        const cam = state.camera as THREE.PerspectiveCamera;
        if (!cam.isPerspectiveCamera) return;

        const targetFov = transitioning ? 30 : 60;
        cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, 0.08);
        cam.updateProjectionMatrix();

        // Subtle camera float
        if (!transitioning) {
            cam.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        }
    });

    return (
        <>
            <OrbitControls
                enableZoom={true}
                enablePan={false}
                reverseOrbit={true}
                rotateSpeed={-0.4}
                dampingFactor={0.05}
                enableDamping={true}
                minDistance={0.1}
                maxDistance={1}
            />

            <ambientLight intensity={1.5} />

            <group>
                <Sphere args={[500, 64, 32]} scale={[-1, 1, 1]}>
                    <meshBasicMaterial
                        map={viewMode === "after" ? textureAfter : textureBefore}
                        side={THREE.DoubleSide}
                        transparent={true}
                    />
                </Sphere>

                {/* Hotspots only visible when not transitioning */}
                {!transitioning && currentNode.hotspots.map(h => (
                    <HotspotMarker key={h.id} hotspot={h} onNavigate={onNavigate} />
                ))}
            </group>
        </>
    );
}

export default function ImmersiveViewer({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) {
    const [viewMode, setViewMode] = useState<"before" | "after">("after");
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Nodes Data Structure (The "House" Graph)
    const nodes: TourNode[] = [
        {
            id: "living",
            name: "Salón Principal",
            textureAfter: imageUrl,
            textureBefore: imageUrl, // In real case, we'd have the original photo here
            hotspots: [
                { id: "h1", targetNodeId: "kitchen", position: [400, -80, -200], label: "Ir a Cocina" },
                { id: "h2", targetNodeId: "terrace", position: [-350, -50, 400], label: "Ver Terraza" }
            ]
        },
        {
            id: "kitchen",
            name: "Cocina de Diseño",
            textureAfter: "https://images.unsplash.com/photo-1556911223-e4520288df81?auto=format&fit=crop&q=80&w=2000",
            hotspots: [
                { id: "h3", targetNodeId: "living", position: [-400, -80, 100], label: "Volver al Salón" }
            ]
        },
        {
            id: "terrace",
            name: "Terraza Superior",
            textureAfter: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2000",
            hotspots: [
                { id: "h4", targetNodeId: "living", position: [450, -50, -50], label: "Entrar a Casa" }
            ]
        }
    ];

    const [currentNode, setCurrentNode] = useState<TourNode>(nodes[0]);

    const navigateTo = (nodeId: string) => {
        setIsTransitioning(true);
        setTimeout(() => {
            const nextNode = nodes.find(n => n.id === nodeId);
            if (nextNode) setCurrentNode(nextNode);
            setIsTransitioning(false);
        }, 600);
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-stone-950 flex flex-col font-sans overflow-hidden">
            {/* Cinematic Overlay for Transitions */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[1200] bg-black/40 backdrop-blur-md flex items-center justify-center pointer-events-none"
                    >
                        <div className="w-32 h-[1px] bg-white/20 relative overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className="absolute inset-0 bg-white"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header: Idealista Style Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-[1100] p-8 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-6 pointer-events-auto">
                    <button
                        onClick={onClose}
                        className="w-14 h-14 bg-white/10 hover:bg-white hover:text-stone-950 rounded-full flex items-center justify-center transition-all backdrop-blur-xl border border-white/10 shadow-2xl"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-white text-2xl font-black italic tracking-tighter uppercase leading-none">Visita Virtual</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                            <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">{currentNode.name}</span>
                        </div>
                    </div>
                </div>

                {/* Before/After Toggle in Tour */}
                <div className="flex p-1.5 bg-black/40 backdrop-blur-3xl rounded-full border border-white/10 pointer-events-auto shadow-2xl">
                    <button
                        onClick={() => setViewMode("before")}
                        className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === "before" ? "bg-white text-stone-900" : "text-white/40 hover:text-white"}`}
                    >
                        Original
                    </button>
                    <button
                        onClick={() => setViewMode("after")}
                        className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === "after" ? "bg-white text-stone-900" : "text-white/40 hover:text-white"}`}
                    >
                        Reformado
                    </button>
                </div>
            </div>

            {/* 3D Stage */}
            <div className="relative flex-1 cursor-grab active:cursor-grabbing">
                <Canvas dpr={[1, 2]}>
                    <Suspense fallback={null}>
                        <PerspectiveCamera makeDefault position={[0, 0, 0.1]} fov={60} />
                        <InterconnectedScene
                            currentNode={currentNode}
                            viewMode={viewMode}
                            onNavigate={navigateTo}
                            transitioning={isTransitioning}
                        />
                    </Suspense>
                </Canvas>

                {/* Navigation Guide */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 px-10 py-5 bg-black/60 backdrop-blur-3xl rounded-full border border-white/10 text-white/80 pointer-events-none">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">👉</span>
                        <span className="text-[9px] uppercase font-black tracking-widest">Arrastra para girar</span>
                    </div>
                    <div className="w-[1px] h-4 bg-white/20"></div>
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🎯</span>
                        <span className="text-[9px] uppercase font-black tracking-widest">Clica en los círculos para moverte</span>
                    </div>
                </div>
            </div>

            {/* Cinematic Floor Selector */}
            <div className="absolute bottom-12 right-12 z-[1100] flex gap-4 pointer-events-auto">
                {nodes.map(node => (
                    <button
                        key={node.id}
                        onClick={() => navigateTo(node.id)}
                        className={`group relative h-24 transition-all duration-700 rounded-2xl overflow-hidden border-2 ${currentNode.id === node.id ? "w-48 border-white shadow-[0_0_40px_rgba(255,255,255,0.2)]" : "w-16 border-white/10 opacity-50 hover:opacity-100"}`}
                    >
                        <img src={node.textureAfter} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                            <span className={`text-[8px] font-black uppercase tracking-widest text-white transition-opacity ${currentNode.id === node.id ? "opacity-100" : "opacity-0"}`}>
                                {node.name}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
