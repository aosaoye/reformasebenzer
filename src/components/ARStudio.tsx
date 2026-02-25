"use client";

import { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, TransformControls, useTexture, Plane, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

interface MovableObject {
    id: string;
    textureUrl: string;
    position: [number, number, number];
    scale: [number, number, number];
    originalBounds: { x: number, y: number, w: number, h: number };
}

function DraggableSprite({ obj, onUpdate }: { obj: MovableObject, onUpdate: (id: string, pos: any) => void }) {
    const texture = useTexture(obj.textureUrl);
    const spriteRef = useRef<THREE.Group>(null);

    return (
        <group position={obj.position} ref={spriteRef}>
            <Plane args={[obj.scale[0], obj.scale[1]]}>
                <meshBasicMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
            </Plane>
            <TransformControls
                object={spriteRef.current || undefined}
                mode="translate"
                onMouseUp={() => {
                    if (spriteRef.current) {
                        onUpdate(obj.id, spriteRef.current.position.toArray());
                    }
                }}
            />
        </group>
    );
}

export default function ARStudio({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) {
    const [objects, setObjects] = useState<MovableObject[]>([]);
    const [isExtracting, setIsExtracting] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selection, setSelection] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

    // Extraction Logic: Captures part of the background and turns it into a 3D Sprite
    const extractObject = () => {
        if (!selection || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = selection.w;
        tempCanvas.height = selection.h;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCtx.drawImage(
            canvas,
            selection.x, selection.y, selection.w, selection.h,
            0, 0, selection.w, selection.h
        );

        const dataUrl = tempCanvas.toDataURL();

        const newObj: MovableObject = {
            id: Math.random().toString(),
            textureUrl: dataUrl,
            position: [0, 0, 0],
            scale: [selection.w / 100, selection.h / 100, 1],
            originalBounds: selection
        };

        setObjects([...objects, newObj]);
        setSelection(null);
        setIsExtracting(false);
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-stone-950 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-[1100] p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-6">
                    <button onClick={onClose} className="bg-white/10 hover:bg-white hover:text-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                        ← Salir
                    </button>
                    <div>
                        <h2 className="text-white text-xl font-bold tracking-tighter uppercase italic">Ebenzer AR Studio</h2>
                        <p className="text-stone-400 text-[9px] uppercase tracking-[0.4em]">Manipulación Espacial en Tiempo Real</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsExtracting(!isExtracting)}
                        className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${isExtracting ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                            }`}
                    >
                        {isExtracting ? 'Seleccionando...' : 'Recortar Objeto'}
                    </button>
                    <button className="bg-[#25D366] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                        Cotizar Diseño
                    </button>
                </div>
            </div>

            {/* Main Stage */}
            <div className="relative flex-1">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <Suspense fallback={null}>
                        {/* Background Plane */}
                        <Plane args={[10, 7]} position={[0, 0, -1]}>
                            <meshBasicMaterial map={useTexture(imageUrl)} />
                        </Plane>

                        <ambientLight intensity={1} />

                        {objects.map(obj => (
                            <DraggableSprite
                                key={obj.id}
                                obj={obj}
                                onUpdate={(id, pos) => {
                                    setObjects(prev => prev.map(o => o.id === id ? { ...o, position: pos } : o));
                                }}
                            />
                        ))}

                        <OrbitControls makeDefault enableRotate={!isExtracting} />
                    </Suspense>
                </Canvas>

                {/* Selection Overlay (Canvas based UI for cutting) */}
                {isExtracting && (
                    <div className="absolute inset-0 z-[1050] cursor-crosshair flex items-center justify-center p-20 bg-black/40">
                        <div className="relative border-2 border-dashed border-white/50 w-full h-full max-w-4xl max-h-[70vh]">
                            <img
                                src={imageUrl}
                                className="w-full h-full object-contain pointer-events-none opacity-50"
                                alt="Source"
                            />
                            {/* Simplified Drag Selection Mock */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="bg-white text-black px-4 py-2 rounded-md font-bold text-[10px] uppercase tracking-widest mb-4">Haz clic para capturar centro</span>
                                <button
                                    onClick={() => {
                                        setSelection({ x: 200, y: 200, w: 200, h: 200 });
                                        extractObject();
                                    }}
                                    className="bg-white text-black px-8 py-4 rounded-full font-black uppercase text-xs"
                                >
                                    Extraer Elemento
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Help */}
            <div className="absolute bottom-10 left-10 text-white z-[1100]">
                <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-300">
                        Interactividad 3D Activa: Selecciona los objetos para moverlos
                    </span>
                </div>
            </div>
        </div>
    );
}
