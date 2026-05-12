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
        <div className="fixed inset-0 z-[2000] bg-stone-950 flex flex-col overflow-y-auto overflow-x-hidden safe-top pb-12">
            {/* Sticky Top Header */}
            <div className="sticky top-0 left-0 right-0 z-[2100] p-6 md:p-8 flex items-center justify-between bg-stone-950/95 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-4 md:gap-6">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white hover:text-stone-950 rounded-full flex items-center justify-center transition-all backdrop-blur-3xl border border-white/10"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div>
                        <h2 className="text-white text-lg md:text-xl font-black uppercase italic tracking-tighter leading-none">Ebenzer 3D Pro</h2>
                        <p className="text-stone-500 text-[8px] md:text-[9px] uppercase tracking-[0.3em] font-bold mt-1">Showroom Engine V2.1</p>
                    </div>
                </div>
                <button 
                   onClick={() => setActiveHotspots(!activeHotspots)}
                   className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border transition-all ${activeHotspots ? 'bg-white text-stone-900 border-white' : 'bg-transparent text-white border-white/20'}`}>
                     {activeHotspots ? "Ocultar Info" : "Ver Info"}
                 </button>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">

                {/* 1. Smart Catalog Menu: Horizontal on mobile, Vertical on desktop */}
                <div className="lg:col-span-3 w-full flex flex-col gap-4 overflow-hidden">
                    <span className="text-white/30 text-[9px] uppercase font-black tracking-widest block">Catálogo Interactivo</span>
                    <div className="w-full flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 max-h-none lg:max-h-[70vh] snap-x">
                        {products.length === 0 ? (
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 w-full">
                                <p className="text-stone-400 text-[10px] italic">Cargando colección...</p>
                            </div>
                        ) : (
                            products.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => setSelectedProduct(product)}
                                    className={`flex-shrink-0 snap-start w-64 lg:w-full p-4 lg:p-5 rounded-2xl text-left transition-all border group ${selectedProduct?.id === product.id
                                            ? "bg-white border-white text-black shadow-xl scale-95 lg:scale-100"
                                            : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    <h3 className="font-bold text-xs md:text-sm mb-1 flex items-center gap-2 line-clamp-1">
                                        {product.name}
                                        {selectedProduct?.id === product.id && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>}
                                    </h3>
                                    <p className={`text-[9px] uppercase tracking-wider ${selectedProduct?.id === product.id ? "text-stone-500" : "text-stone-400"}`}>
                                        {selectedProduct?.id === product.id ? "Activo en Escena" : "Toca para Cargar"}
                                    </p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* 2. Main Engine: Adapts aspect ratio on mobile */}
                <div className="lg:col-span-6 relative aspect-square md:aspect-video lg:aspect-square lg:h-[75vh] rounded-3xl md:rounded-[3rem] overflow-hidden bg-gradient-to-b from-stone-900 to-stone-950 border border-white/10 shadow-2xl flex items-center justify-center order-first lg:order-none">
                    {selectedProduct ? (
                        <model-viewer
                            src={selectedProduct.glbUrl}
                            poster={selectedProduct.poster}
                            alt={selectedProduct.name}
                            shadow-intensity="2"
                            environment-image="neutral"
                            exposure="1.1"
                            shadow-softness="0.8"
                            camera-controls
                            auto-rotate
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            camera-orbit="45deg 75deg 105%"
                            style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                        >
                            {activeHotspots && (
                                <>
                                    <button slot="hotspot-dim" data-position="0 0.4 0" data-normal="0 1 0" className="bg-white/95 backdrop-blur-md text-black font-bold px-2 py-1 rounded-md text-[7px] uppercase tracking-widest border border-white shadow-lg">DIMENSIÓN PRO</button>
                                    <button slot="hotspot-mat" data-position="0.15 0.1 0.15" data-normal="1 0 0" className="bg-green-500/90 text-white font-bold px-2 py-1 rounded-md text-[7px] uppercase tracking-widest border border-green-400 shadow-lg">ACABADO TOP</button>
                                </>
                            )}

                            <button slot="ar-button" className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-black uppercase text-[8px] md:text-[10px] tracking-widest shadow-2xl flex items-center gap-2 active:scale-95 transition-transform">
                                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                Proyectar en mi Casa
                            </button>
                        </model-viewer>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8">
                            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4"/></svg>
                            </div>
                            <h3 className="text-white text-base font-black tracking-tighter mb-1">Listo para Cargar</h3>
                            <p className="text-stone-500 text-[9px] uppercase tracking-widest font-bold">Toca un objeto del menú inferior</p>
                        </div>
                    )}
                </div>

                {/* 3. Side Info & Configurator */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10 backdrop-blur-xl">
                        <h3 className="text-white text-sm font-black mb-1">{selectedProduct?.name || "Ebenzer Studio"}</h3>
                        <p className="text-stone-400 text-[11px] font-light mb-5">{selectedProduct?.description || "Personaliza los acabados."}</p>
                        
                        <div className="space-y-5 pt-4 border-t border-white/5">
                            <div>
                                <label className="block text-stone-500 text-[8px] uppercase font-black tracking-widest mb-3">Personalizar Acabado</label>
                                <div className="flex gap-3 flex-wrap">
                                    {[
                                        { name: 'Standard', hex: '#ffffff' },
                                        { name: 'Ébano', hex: '#1c1917' },
                                        { name: 'Cuero', hex: '#8b4513' },
                                        { name: 'Verde', hex: '#2f4f4f' }
                                    ].map((mat) => (
                                        <button
                                            key={mat.hex}
                                            onClick={() => changeColor(mat.hex)}
                                            style={{ backgroundColor: mat.hex }}
                                            className={`w-8 h-8 rounded-full border transition-all scale-90 active:scale-110 ${currentColor === mat.hex ? 'border-white ring-2 ring-white/30 scale-100' : 'border-white/10'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 grid grid-cols-2 gap-4 text-[9px] font-bold uppercase tracking-widest text-stone-500">
                                <div>MOTOR<br/><span className="text-white">WebXR 2.0</span></div>
                                <div>ESTADO<br/><span className="text-green-400">Online</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                         <p className="text-amber-200/80 text-[10px] leading-relaxed italic text-center lg:text-left">
                             Tip: Arrastra el modelo con el dedo para rotarlo 360°.
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


