"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface ComparisonSliderProps {
    beforeImage: string;
    afterImage: string;
}

export default function ComparisonSlider({ beforeImage, afterImage }: ComparisonSliderProps) {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = (e as any).clientX || (e as any).touches?.[0]?.clientX;
        const position = ((x - rect.left) / rect.width) * 100;

        setSliderPos(Math.max(0, Math.min(100, position)));
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden cursor-ew-resize select-none border-4 border-white shadow-2xl"
            onMouseMove={handleMove}
            onTouchMove={handleMove}
        >
            {/* After Image (The "New" Room) */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${afterImage})` }}
            />

            {/* Before Image (The "Original" Room) - Clipped */}
            <div
                className="absolute inset-0 bg-cover bg-center grayscale brightness-75 transition-all"
                style={{
                    backgroundImage: `url(${beforeImage})`,
                    clipPath: `inset(0 ${100 - sliderPos}% 0 0)`
                }}
            />

            {/* Slider Line & Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-10"
                style={{ left: `${sliderPos}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-stone-900">
                    <div className="flex gap-1">
                        <div className="w-1 h-3 bg-stone-900 rounded-full" />
                        <div className="w-1 h-3 bg-stone-900 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Labels */}
            <div className="absolute top-6 left-6 z-20 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[8px] font-bold text-white uppercase tracking-widest border border-white/20">
                Estado Original
            </div>
            <div className="absolute top-6 right-6 z-20 px-3 py-1 bg-stone-900/40 backdrop-blur-md rounded-full text-[8px] font-bold text-white uppercase tracking-widest border border-white/20">
                Propuesta Ebenzer AI
            </div>
        </div>
    );
}
