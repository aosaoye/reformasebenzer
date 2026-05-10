"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ProjectCarousel({ projects }: { projects: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const xBackground = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollAmount = container.clientWidth * 0.8;
            const scrollTo = direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: scrollTo,
                behavior: "smooth"
            });
        }
    };

    return (
        <section ref={containerRef} className="py-32 overflow-hidden bg-white relative">
            {/* Cinematic Background Title */}
            <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none select-none -translate-y-1/2 md:-translate-y-1/3">
                <motion.span
                    style={{ x: xBackground }}
                    className="brand-bg-text text-[30vw] font-black text-stone-100 leading-none block whitespace-nowrap tracking-tighter uppercase opacity-30"
                >
                    PROYECTOS EBENZER EXCLUSIVE
                </motion.span>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <header className="flex flex-col md:flex-row justify-between items-end mb-20 gap-12">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-[10px] uppercase tracking-[0.6em] font-bold text-stone-400 mb-6 block"
                        >
                            Selección 2026
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-stone-900 uppercase"
                        >
                            Nuestra <br />
                            <span className="text-stone-300 italic font-light">Galería</span>
                        </motion.h2>
                    </div>

                    <div className="flex flex-col items-end gap-8">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => scroll("left")}
                                className="group flex items-center justify-center w-16 h-16 border border-stone-200 rounded-full hover:bg-stone-900 hover:text-white transition-all duration-500 active:scale-90"
                            >
                                <svg className="w-6 h-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                className="group flex items-center justify-center w-16 h-16 border border-stone-200 rounded-full hover:bg-stone-900 hover:text-white transition-all duration-500 active:scale-90"
                            >
                                <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <Link
                            href="/proyectos"
                            className="text-[10px] font-black tracking-[0.4em] uppercase group flex items-center gap-4 text-stone-900"
                        >
                            <span>Explorar todo</span>
                            <div className="w-12 h-[1px] bg-stone-900 origin-left scale-x-50 group-hover:scale-x-100 transition-transform"></div>
                        </Link>
                    </div>
                </header>

                <div
                    ref={scrollRef}
                    className="flex pb-16 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
                >
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="min-w-full sm:min-w-[50%] lg:min-w-[33.333333%] snap-start"
                        >
                            <Link href={`/proyectos/${project.id}`} className="block px-3">
                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-stone-100 group shadow-sm">
                                    <Image
                                        src={project.image}
                                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                        alt=""
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />

                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/95 px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-widest shadow-md text-stone-900">
                                            {project.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="px-1">
                                    <h3 className="text-[15px] font-bold tracking-tight text-stone-900 mb-1 line-clamp-1">
                                        {project.name}
                                    </h3>
                                    <p className="text-[9px] font-black tracking-[0.2em] uppercase text-stone-400">
                                        {project.category}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
