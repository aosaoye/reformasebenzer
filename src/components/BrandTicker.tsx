"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function BrandTicker() {
    const tickerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (textRef.current) {
            // Cinematic parallax effect
            gsap.to(textRef.current, {
                x: "-30%", // Move significantly for cinematic feel
                ease: "none",
                scrollTrigger: {
                    trigger: tickerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.5, // Faster scrub for more responsive feel
                }
            });
        }
    }, []);

    return (
        <section ref={tickerRef} className="py-48 md:py-64 overflow-hidden bg-stone-50 select-none relative">
            {/* Massive Cinematic Background Text */}
            <div
                ref={textRef}
                className="absolute inset-0 flex items-center whitespace-nowrap pointer-events-none"
                style={{ willChange: "transform" }}
            >
                <span className="brand-bg-text text-[40vw] font-black leading-none tracking-[-0.05em] uppercase opacity-40">
                    EBENZER EBENZER EBENZER EBENZER
                </span>
            </div>

            {/* Foreground Content with "Movie Scene" contrast */}
            <div className="relative z-10 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
                    <div className="md:col-span-8">
                        <span className="text-[10px] uppercase tracking-[0.6em] font-black text-stone-900 mb-8 block">Legacy of Excellence</span>
                        <h2 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.85] text-stone-900">
                            Hogares que <br />
                            <span className="text-stone-300 italic font-light">transcienden.</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-20 items-start">
                    <div className="md:col-start-7 md:col-span-5">
                        <p className="text-stone-500 text-xl font-light leading-relaxed border-l border-stone-200 pl-8">
                            Cada proyecto de <span className="text-stone-900 font-bold">Ebenzer</span> es una pieza única de arquitectura interior. No reformamos casas, creamos escenarios para tu vida más auténtica.
                        </p>
                        <div className="mt-10 flex gap-4">
                            <div className="w-12 h-[1px] bg-stone-900 self-center"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Est. 2011</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
