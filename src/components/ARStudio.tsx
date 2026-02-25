"use client";

import { useRef, useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls, useTexture, Plane } from "@react-three/drei";
import * as THREE from "three";

interface MovableObject {
    id: string;
    textureUrl: string;
    position: [number, number, number];
    scale: [number, number, number];
}

function DraggableSprite({ obj, onUpdate }: { obj: MovableObject, onUpdate: (id: string, pos: any) => void }) {
    const texture = useTexture(obj.textureUrl);
    const spriteRef = useRef<THREE.Group>(null);
    const [, setTick] = useState(0);

    // Force re-render once to attach ref to TransformControls
    useEffect(() => {
        setTick(t => t + 1);
    }, []);

    return (
        <group position={obj.position}>
            <group ref={spriteRef}>
                <Plane args={[obj.scale[0], obj.scale[1]]}>
                    <meshBasicMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
                </Plane>
            </group>
            {spriteRef.current && (
                <TransformControls
                    object={spriteRef.current}
                    mode="translate"
                    onMouseUp={() => {
                        if (spriteRef.current) {
                            onUpdate(obj.id, spriteRef.current.position.toArray());
                        }
                    }}
                />
            )}
        </group>
    );
}

function SceneBackground({ url }: { url: string }) {
    const texture = useTexture(url);
    return (
        <Plane args={[10, 7]} position={[0, 0, -1]}>
            <meshBasicMaterial map={texture} />
        </Plane>
    );
}

export default function ARStudio({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) {
    const [objects, setObjects] = useState<MovableObject[]>([]);

    const extractObject = async () => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;

        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        const targetW = 400;
        const targetH = 400;
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Extract center square
        ctx.drawImage(img, img.width / 2 - 200, img.height / 2 - 200, 400, 400, 0, 0, targetW, targetH);

        const dataUrl = canvas.toDataURL();

        const newObj: MovableObject = {
            id: Math.random().toString(),
            textureUrl: dataUrl,
            position: [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 1.5, 0],
            scale: [1.5, 1.5, 1]
        };

        setObjects([...objects, newObj]);
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-stone-950 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-[1100] p-6 flex items-center justify-between bg-gradient-to-b from-black/85 to-transparent">
                <div className="flex items-center gap-6">
                    <button onClick={onClose} className="bg-white/10 hover:bg-white hover:text-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                        ← Salir
                    </button>
                    <div>
                        <h2 className="text-white text-xl font-bold tracking-tighter uppercase italic leading-none">Ebenzer AR Studio</h2>
                        <p className="text-stone-400 text-[9px] uppercase tracking-[0.4em] mt-1">Interiorismo Inteligente</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={extractObject}
                        className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border bg-white/5 border-white/20 text-white hover:bg-white/10"
                    >
                        Extraer Elemento
                    </button>
                    <a
                        href={`https://wa.me/34643640502?text=Hola, estoy usando el AR Studio y me gustaría un presupuesto para este diseño.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl"
                    >
                        Cotizar Diseño
                    </a>
                </div>
            </div>

            {/* Main Stage */}
            <div className="relative flex-1">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <Suspense fallback={null}>
                        <SceneBackground url={imageUrl} />
                        <ambientLight intensity={1.5} />
                        {objects.map(obj => (
                            <DraggableSprite
                                key={obj.id}
                                obj={obj}
                                onUpdate={(id, pos) => {
                                    setObjects(prev => prev.map(o => o.id === id ? { ...o, position: pos } : o));
                                }}
                            />
                        ))}
                        <OrbitControls makeDefault enableRotate={true} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Footer Help */}
            <div className="absolute bottom-10 left-10 text-white z-[1100]">
                <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-300">
                        Modo Edición: Arrastra los objetos para redecorar
                    </span>
                </div>
            </div>
        </div>
    );
}
