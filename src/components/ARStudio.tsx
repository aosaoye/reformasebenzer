"use client";

import { useRef, useState, Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls, useTexture, Plane } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

interface MovableObject {
    id: string;
    textureUrl: string;
    position: [number, number, number];
    scale: [number, number, number];
    maskBounds: { x: number, y: number, w: number, h: number };
}

function DraggableSprite({ obj, onUpdate, onDragChange }: {
    obj: MovableObject,
    onUpdate: (id: string, pos: any) => void,
    onDragChange: (dragging: boolean) => void
}) {
    const texture = useTexture(obj.textureUrl);
    const spriteRef = useRef<THREE.Group>(null);
    const [gizmoActive, setGizmoActive] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setGizmoActive(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <group position={obj.position}>
            <group ref={spriteRef}>
                <Plane args={[obj.scale[0], obj.scale[1]]}>
                    <meshBasicMaterial
                        map={texture}
                        transparent={true}
                        side={THREE.DoubleSide}
                        toneMapped={false}
                        depthTest={true}
                    />
                </Plane>
            </group>
            {gizmoActive && spriteRef.current && (
                <TransformControls
                    object={spriteRef.current}
                    mode="translate"
                    onMouseDown={() => onDragChange(true)}
                    onMouseUp={() => {
                        onDragChange(false);
                        if (spriteRef.current) {
                            onUpdate(obj.id, spriteRef.current.position.toArray());
                        }
                    }}
                />
            )}
        </group>
    );
}

// Background that can "hide" areas
function DynamicBackground({ url, masks }: { url: string, masks: MovableObject[] }) {
    const texture = useTexture(url);

    return (
        <group>
            {/* Main Background */}
            <Plane args={[12, 8]} position={[0, 0, -2]}>
                <meshBasicMaterial map={texture} toneMapped={false} />
            </Plane>

            {/* Inpainting Patches: These cover the original objects on the background plane */}
            {masks.map(mask => (
                <Plane
                    key={`mask-${mask.id}`}
                    args={[mask.scale[0], mask.scale[1]]}
                    position={[
                        // Calculate background relative position (this is a simplified projection)
                        (mask.maskBounds.x / 100) - 6, // Mock transform
                        4 - (mask.maskBounds.y / 100),
                        -1.99 // Just in front of background
                    ]}
                >
                    <meshBasicMaterial
                        color="#f5f5f4" // Matches the room's base neutral stone/marble
                        opacity={0.9}
                        transparent={true}
                    />
                </Plane>
            ))}
        </group>
    );
}

export default function ARStudio({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) {
    const [objects, setObjects] = useState<MovableObject[]>([]);
    const [isSelecting, setIsSelecting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [wallColor, setWallColor] = useState<string | null>(null);
    const [status, setStatus] = useState("Toca una pared para cambiar de color o selecciona objetos.");

    const containerRef = useRef<HTMLDivElement>(null);

    const quickSelect = async (e: React.MouseEvent) => {
        if (!isSelecting || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Auto-bounding box (Smart Pick-up simulation)
        const size = 150;
        const x = clickX - size / 2;
        const y = clickY - size / 2;
        const w = size;
        const h = size;

        setStatus("Extrayendo objeto...");

        // Perform crop
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        await new Promise(r => (img.onload = r));

        const canvas = document.createElement('canvas');
        canvas.width = w * (img.width / rect.width);
        canvas.height = h * (img.height / rect.height);
        const ctx = canvas.getContext('2d');

        if (ctx) {
            ctx.drawImage(
                img,
                x * (img.width / rect.width), y * (img.height / rect.height),
                w * (img.width / rect.width), h * (img.height / rect.height),
                0, 0, canvas.width, canvas.height
            );

            // Simple "Cut" simulation: Fill original area with a patch
            const dataUrl = canvas.toDataURL();

            const newObj: MovableObject = {
                id: Math.random().toString(),
                textureUrl: dataUrl,
                position: [0, 0, 0.5],
                scale: [2, 2, 1],
                maskBounds: { x: clickX, y: clickY, w, h }
            };

            setObjects([...objects, newObj]);
            setStatus("¡Objeto listo! Usa las flechas para moverlo.");
            setIsSelecting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-stone-950 flex flex-col overflow-hidden select-none">
            {/* Toolbar */}
            <div className="absolute top-0 left-0 right-0 z-[1100] p-6 flex items-center justify-between bg-gradient-to-b from-black/95 to-transparent">
                <div className="flex items-center gap-6">
                    <button onClick={onClose} className="bg-white/10 hover:bg-white hover:text-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md border border-white/10">
                        ← Salir
                    </button>
                    <div>
                        <h2 className="text-white text-xl font-bold tracking-tighter uppercase italic leading-none">Ebenzer AR Studio</h2>
                        <p className="text-stone-400 text-[9px] uppercase tracking-[0.4em] mt-1">Pick & Move Engine v2.0</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setIsSelecting(!isSelecting);
                            setStatus(isSelecting ? "Listo" : "Haz clic directamente sobre la silla o mueble");
                        }}
                        className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${isSelecting
                                ? 'bg-amber-400 border-amber-400 text-black shadow-[0_0_40px_rgba(251,191,36,0.3)]'
                                : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                            }`}
                    >
                        {isSelecting ? 'CANCELAR SELECCIÓN' : 'MAGIA: CLIC PARA SOLTAR OBJETO'}
                    </button>
                    <a
                        href={`https://wa.me/34643640502?text=Hola, estoy probando el AR Studio de Ebenzer y me gustaría información.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform"
                    >
                        Presupuestar Diseño
                    </a>
                </div>
            </div>

            {/* Stage */}
            <div
                ref={containerRef}
                className={`relative flex-1 ${isSelecting ? 'cursor-crosshair' : 'cursor-default'}`}
                onClick={quickSelect}
            >
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                    <Suspense fallback={null}>
                        <DynamicBackground url={imageUrl} masks={objects} />
                        <ambientLight intensity={1.5} />

                        {objects.map(obj => (
                            <DraggableSprite
                                key={obj.id}
                                obj={obj}
                                onDragChange={setIsDragging}
                                onUpdate={(id, pos) => {
                                    setObjects(prev => prev.map(o => o.id === id ? { ...o, position: pos } : o));
                                }}
                            />
                        ))}
                        <OrbitControls makeDefault enabled={!isDragging && !isSelecting} />
                    </Suspense>
                </Canvas>

                {/* REAL-TIME WALL TINT LAYER (The Magic Paint Algorithm) */}
                {wallColor && (
                    <div 
                       className="absolute inset-0 pointer-events-none transition-all duration-1000"
                       style={{ 
                           backgroundColor: wallColor, 
                           mixBlendMode: 'multiply', 
                           opacity: 0.6,
                       }} 
                    />
                )}

                {/* Color Palette Floating Bar */}
                <div className="absolute top-24 left-6 z-[1100] bg-black/60 backdrop-blur-xl p-5 rounded-3xl border border-white/10 flex flex-col gap-4 items-center">
                     <span className="text-[7px] text-white/60 font-black uppercase tracking-widest">Tintar Pared</span>
                     {[
                         { name: 'Reset', hex: null },
                         { name: 'Beige Cálido', hex: '#f5e6d3' },
                         { name: 'Gris Industrial', hex: '#8a9a9c' },
                         { name: 'Azul Cielo', hex: '#cce0e5' },
                         { name: 'Verde Oliva', hex: '#ccd5ae' },
                         { name: 'Salmón', hex: '#fae1dd' }
                     ].map((color) => (
                         <button 
                           key={color.name}
                           onClick={() => {
                               setWallColor(color.hex);
                               setStatus(color.hex ? `Aplicando color ${color.name} a la estancia` : "Color original restaurado");
                           }}
                           className={`w-8 h-8 rounded-full border transition-all hover:scale-125 ${wallColor === color.hex ? 'border-white ring-4 ring-white/20' : 'border-white/10'}`}
                           style={{ backgroundColor: color.hex || 'transparent', backgroundImage: color.hex ? 'none' : 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)' }}
                         />
                     ))}
                </div>

                {/* Selection Hint Overlay */}
                <AnimatePresence>
                    {isSelecting && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-[1040] bg-black/30 backdrop-blur-[1px] flex items-center justify-center pointer-events-none"
                        >
                            <div className="text-center">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-20 h-20 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                                >
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                                    </svg>
                                </motion.div>
                                <h3 className="text-white text-3xl font-black tracking-tighter mb-2 uppercase">Modo Magia Activo</h3>
                                <p className="text-white/80 text-xs uppercase tracking-[0.3em] font-medium">Haz Clic en un mueble para "soltarlo" del suelo</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>


            {/* Footer Status */}
            <div className="absolute bottom-10 left-10 z-[1100] flex flex-col gap-3">
                <div className="flex items-center gap-4 bg-black/60 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl">
                    <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isSelecting ? 'bg-amber-400' : 'bg-green-500'}`}></div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                        {status}
                    </span>
                </div>
            </div>
        </div>
    );
}
