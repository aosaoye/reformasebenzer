"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function BrandTicker({
    aboutSubtitle = "Legacy of Excellence",
    aboutTitle = "Hogares que <br /> <span class=\"text-stone-300 italic font-light\">transcienden.</span>",
    aboutContent = "Cada proyecto de Ebenzer es una pieza única de arquitectura interior. No reformamos casas, creamos escenarios para tu vida más auténtica.",
    aboutEst = "Est. 2011",
    isEditing = false,
    onUpdate = (field: string, val: any) => {}
}: {
    aboutSubtitle?: string;
    aboutTitle?: string;
    aboutContent?: string;
    aboutEst?: string;
    isEditing?: boolean;
    onUpdate?: (field: string, val: any) => void;
}) {
    const tickerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (textRef.current) {
            // Cinematic parallax effect
            gsap.to(textRef.current, {
                x: "-30%",
                ease: "none",
                scrollTrigger: {
                    trigger: tickerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.5,
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

            {/* Foreground Content */}
            <div className="relative z-10 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
                    <div className="md:col-span-8">
                        {isEditing ? (
                            <input 
                                value={aboutSubtitle} 
                                onChange={(e) => onUpdate("aboutSubtitle", e.target.value)}
                                className="text-[10px] uppercase tracking-[0.6em] font-black text-stone-900 mb-8 block bg-stone-100 p-2 w-full max-w-md border border-indigo-500 rounded"
                            />
                        ) : (
                            <span className="text-[10px] uppercase tracking-[0.6em] font-black text-stone-900 mb-8 block">{aboutSubtitle}</span>
                        )}

                        {isEditing ? (
                            <textarea 
                                value={aboutTitle.replace(/<br \/>/g, '\n').replace(/<span.*?>/g, '').replace(/<\/span>/g, '')} 
                                onChange={(e) => onUpdate("aboutTitle", e.target.value.replace(/\n/g, '<br />'))}
                                className="text-3xl md:text-7xl font-black tracking-tighter leading-[0.85] text-stone-900 w-full bg-stone-100 p-4 border border-indigo-500 rounded"
                                rows={3}
                            />
                        ) : (
                            <h2 
                                className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.85] text-stone-900"
                                dangerouslySetInnerHTML={{ __html: aboutTitle }}
                            />
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-20 items-start">
                    <div className="md:col-start-7 md:col-span-5">
                        {isEditing ? (
                            <textarea 
                                value={aboutContent} 
                                onChange={(e) => onUpdate("aboutContent", e.target.value)}
                                className="text-stone-500 text-base font-light leading-relaxed border-l border-indigo-500 pl-8 bg-stone-100 p-4 w-full"
                                rows={4}
                            />
                        ) : (
                            <p className="text-stone-500 text-xl font-light leading-relaxed border-l border-stone-200 pl-8">
                                {aboutContent}
                            </p>
                        )}
                        <div className="mt-10 flex gap-4">
                            <div className="w-12 h-[1px] bg-stone-900 self-center"></div>
                            {isEditing ? (
                                <input 
                                    value={aboutEst} 
                                    onChange={(e) => onUpdate("aboutEst", e.target.value)}
                                    className="text-[10px] font-bold uppercase tracking-[0.4em] bg-stone-100 p-1 border border-indigo-500 rounded"
                                />
                            ) : (
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">{aboutEst}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
