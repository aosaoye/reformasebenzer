"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Custom type for model-viewer to avoid TS errors
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': any;
        }
    }
}

import { Product3D } from "@/lib/services/viewer3d";


export default function GoogleModelViewer({ onClose, products = [] }: { onClose: () => void, products?: Product3D[] }) {
    const [selectedProduct, setSelectedProduct] = useState<Product3D | null>(products[0] || null);
    const [activeHotspots, setActiveHotspots] = useState(true);
    const [currentColor, setCurrentColor] = useState("#ffffff");
    const [isLoaded, setIsLoaded] = useState(false);

    // Ensure item updates if products load late
    useEffect(() => {
        if (!selectedProduct && products.length > 0) {
            setSelectedProduct(products[0]);
        }
    }, [products]);

    useEffect(() => {
        // Import the web component on the client side
        import("@google/model-viewer").catch(console.error);
        setIsLoaded(true);
    }, []);

    // Real-time material changer utilizing Google Model-viewer core engine
    const changeColor = (colorHex: string) => {
        setCurrentColor(colorHex);
        const modelViewer = document.querySelector("model-viewer") as any;
        if (modelViewer && modelViewer.model) {
            const material = modelViewer.model.materials[0];
            if (material) {
                 // Map Hex to standard RGB float normalized
                 const r = parseInt(colorHex.slice(1, 3), 16) / 255;
                 const g = parseInt(colorHex.slice(3, 5), 16) / 255;
                 const b = parseInt(colorHex.slice(5, 7), 16) / 255;
                 material.pbrMetallicRoughness.setBaseColorFactor([r, g, b, 1.0]);
            }
        }
    };

    if (!isLoaded) return null;

    return (
        <div className="fixed inset-0 z-[2000] bg-stone-950 flex flex-col items-center justify-center p-6">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-8 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-[2100]">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onClose}
                        className="w-12 h-12 bg-white/10 hover:bg-white hover:text-stone-950 rounded-full flex items-center justify-center transition-all backdrop-blur-3xl border border-white/10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-white text-xl font-black uppercase italic tracking-tighter">Ebenzer 3D Pro Studio</h2>
                        <p className="text-stone-500 text-[9px] uppercase tracking-[0.4em] font-bold">Realidad Aumentada V2.0</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <button 
                       onClick={() => setActiveHotspots(!activeHotspots)}
                       className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${activeHotspots ? 'bg-white text-stone-900 border-white' : 'bg-transparent text-white border-white/20'}`}>
                         {activeHotspots ? "Ocultar Info" : "Mostrar Info"}
                     </button>
                </div>
            </div>

            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12">

                {/* 1. Smart Catalog Menu */}
                <div className="lg:col-span-3 flex flex-col gap-3 overflow-y-auto max-h-[70vh] pr-2">
                    <span className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-4 block">Colección Interactiva</span>
                    {products.length === 0 ? (
                        <p className="text-stone-500 text-[10px] italic">Esperando modelos reales del catálogo...</p>
                    ) : (
                        products.map(product => (
                            <button
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                className={`p-5 rounded-2xl text-left transition-all border group ${selectedProduct?.id === product.id
                                        ? "bg-white border-white text-black shadow-2xl"
                                        : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
                                    {product.name}
                                    {selectedProduct?.id === product.id && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>}
                                </h3>
                                <p className={`text-[10px] uppercase tracking-wider ${selectedProduct?.id === product.id ? "text-stone-500" : "text-stone-400"}`}>
                                    Ver en 360°
                                </p>
                            </button>
                        ))
                    )}
                </div>


                {/* 2. High End Model Viewer Engine */}
                <div className="lg:col-span-6 relative aspect-square lg:h-[70vh] rounded-[4rem] overflow-hidden bg-gradient-to-b from-stone-900 to-stone-950 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex items-center justify-center">
                    {selectedProduct ? (
                        <model-viewer
                            src={selectedProduct.glbUrl}
                            poster={selectedProduct.poster}
                            alt={selectedProduct.name}
                            shadow-intensity="2"
                            environment-image="neutral"
                            exposure="1.2"
                            shadow-softness="1"
                            camera-controls
                            auto-rotate
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            camera-orbit="45deg 75deg auto"
                            min-camera-orbit="auto auto auto"
                            max-camera-orbit="auto auto auto"
                            style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                        >
                            {/* Dynamic Hotspots */}
                            {activeHotspots && (
                                <>
                                    <button slot="hotspot-dimensions" data-position="0 0.5 0" data-normal="0 1 0" className="bg-white/90 backdrop-blur-md text-stone-950 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg border border-white transform transition hover:scale-110 cursor-help">
                                    Dimensiones OK
                                    </button>
                                    <button slot="hotspot-material" data-position="0.2 0.1 0.2" data-normal="1 0 0" className="bg-green-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg border border-green-400 transform transition hover:scale-110 cursor-help">
                                    Material Premium
                                    </button>
                                </>
                            )}

                            <button slot="ar-button" className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                Ver en mi espacio (AR)
                            </button>
                        </model-viewer>
                    ) : (
                        <div className="text-center p-12">
                            <div className="w-16 h-16 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4"/></svg>
                            </div>
                            <h3 className="text-white font-bold tracking-tighter mb-2">Selecciona un Objeto</h3>
                            <p className="text-stone-500 text-xs">Escoge un ítem del menú izquierdo para cargar el motor 3D.</p>
                        </div>
                    )}
                </div>

                {/* 3. Advanced Controls / Material Configurator */}
                <div className="lg:col-span-3 flex flex-col gap-8">
                    <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/10 backdrop-blur-xl">
                        <h3 className="text-white text-sm font-bold mb-2">{selectedProduct?.name || "Cargando..."}</h3>
                        <p className="text-stone-400 text-xs font-light mb-6">{selectedProduct?.description || "Personaliza tu producto en tiempo real."}</p>

                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-stone-500 text-[9px] uppercase font-black tracking-widest mb-4">Configurador de Acabados</label>
                                <div className="flex gap-4">
                                    {[
                                        { name: 'Original', hex: '#ffffff' },
                                        { name: 'Ébano', hex: '#1c1917' },
                                        { name: 'Marrón Cuero', hex: '#8b4513' },
                                        { name: 'Verde Nórdico', hex: '#2f4f4f' }
                                    ].map((mat) => (
                                        <button
                                            key={mat.hex}
                                            onClick={() => changeColor(mat.hex)}
                                            style={{ backgroundColor: mat.hex }}
                                            title={mat.name}
                                            className={`w-10 h-10 rounded-full border-2 transition-all scale-90 hover:scale-110 ${currentColor === mat.hex ? 'border-white ring-4 ring-white/20 scale-100' : 'border-white/10'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <div className="flex justify-between items-center text-[10px] text-white/60 font-bold uppercase tracking-wider mb-2">
                                    <span>Render Engine</span>
                                    <span className="text-white">PBR Next-Gen</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-white/60 font-bold uppercase tracking-wider">
                                    <span>Compatibilidad</span>
                                    <span className="text-green-400">WebXR ready</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
                         <p className="text-amber-200/80 text-[11px] leading-relaxed font-light italic">
                             ✨ Tip: Si pulsas "Ver en mi espacio", el objeto se proyectará respetando el color que hayas configurado arriba.
                         </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

