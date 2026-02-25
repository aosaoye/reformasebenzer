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

interface Product3D {
    id: string;
    name: string;
    description: string;
    glbUrl: string;
    poster: string;
}

const SAMPLE_PRODUCTS: Product3D[] = [
    {
        id: "chair",
        name: "Silla Nórdica Ebenzer",
        description: "Diseño minimalista en madera de fresno.",
        glbUrl: "https://modelviewer.dev/shared-assets/models/Chair.glb",
        poster: "https://modelviewer.dev/shared-assets/models/Chair.png"
    },
    {
        id: "mixer",
        name: "Grifería Premium",
        description: "Acabado en negro mate para baños modernos.",
        glbUrl: "https://modelviewer.dev/shared-assets/models/Mixer.glb",
        poster: "https://modelviewer.dev/shared-assets/models/Mixer.png"
    },
    {
        id: "lamp",
        name: "Lámpara Industrial",
        description: "Iluminación focal para salones.",
        glbUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb", // Using astronaut as a fun placeholder if lamp not found
        poster: "https://modelviewer.dev/shared-assets/models/Astronaut.png"
    }
];

export default function GoogleModelViewer({ onClose }: { onClose: () => void }) {
    const [selectedProduct, setSelectedProduct] = useState<Product3D>(SAMPLE_PRODUCTS[0]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Import the web component on the client side
        import("@google/model-viewer").catch(console.error);
        setIsLoaded(true);
    }, []);

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
                        <h2 className="text-white text-xl font-black uppercase italic tracking-tighter">Ebenzer 3D Showroom</h2>
                        <p className="text-stone-500 text-[9px] uppercase tracking-[0.4em] font-bold">Tecnología WebAR de Google</p>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">

                {/* Product List */}
                <div className="order-2 lg:order-1 flex flex-col gap-4">
                    <span className="text-white/30 text-[10px] uppercase font-black tracking-widest mb-4">Catálogo de Objetos</span>
                    {SAMPLE_PRODUCTS.map(product => (
                        <button
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className={`p-6 rounded-2xl text-left transition-all border ${selectedProduct.id === product.id
                                    ? "bg-white border-white text-black shadow-[0_0_40px_rgba(255,255,255,0.15)] scale-105"
                                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                }`}
                        >
                            <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                            <p className={`text-xs ${selectedProduct.id === product.id ? "text-stone-500" : "text-stone-400"}`}>
                                {product.description}
                            </p>
                        </button>
                    ))}

                    <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Tip de Realidad Aumentada</span>
                        </div>
                        <p className="text-amber-200/70 text-xs leading-relaxed">
                            Si estás en un móvil, pulsa el botón <b>"Ver en tu espacio"</b> para proyectar este mueble en tu propia habitación usando la cámara.
                        </p>
                    </div>
                </div>

                {/* Main Viewer */}
                <div className="order-1 lg:order-2 lg:col-span-2 relative aspect-square lg:aspect-auto lg:h-[70vh] rounded-[3rem] overflow-hidden bg-stone-900 border border-white/5 shadow-2xl">
                    <model-viewer
                        src={selectedProduct.glbUrl}
                        poster={selectedProduct.poster}
                        alt={selectedProduct.name}
                        shadow-intensity="1"
                        camera-controls
                        auto-rotate
                        ar
                        ar-modes="webxr scene-viewer quick-look"
                        camera-orbit="45deg 55deg 2.5m"
                        style={{ width: '100%', height: '100%', backgroundColor: '#1c1917' }}
                    >
                        <button slot="ar-button" className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                            Ver en tu espacio (AR)
                        </button>

                        <div className="absolute top-10 right-10 flex flex-col gap-3">
                            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-white text-[8px] font-black uppercase tracking-widest">
                                4K GLB Mesh
                            </div>
                            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-white text-[8px] font-black uppercase tracking-widest">
                                PBR Materials
                            </div>
                        </div>
                    </model-viewer>
                </div>
            </div>
        </div>
    );
}
