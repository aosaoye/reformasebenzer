"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const brandTextRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (brandTextRef.current) {
            // cinematic sweep animation
            gsap.to(brandTextRef.current, {
                xPercent: -40,
                ease: "none",
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: 0.8,
                }
            });
        }
    }, []);

    return (
        <footer ref={footerRef} className="relative pt-48 pb-12 overflow-hidden bg-stone-50 border-t border-stone-100">
            {/* Cinematic Background Brand Text */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden">
                <span
                    ref={brandTextRef}
                    className="brand-bg-text text-[45vw] font-black text-stone-200/40 leading-none block whitespace-nowrap tracking-tighter uppercase translate-y-1/4"
                    style={{ opacity: 0.6 }}
                >
                    EBENZER EBENZER EBENZER
                </span>
            </div>

            <div className="relative z-10 px-6 mx-auto max-w-7xl">
                <div className="grid grid-cols-12 mb-40 gap-y-20 md:gap-x-24">
                    <div className="col-span-12 lg:col-span-6">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-[10px] uppercase tracking-[0.6em] font-black text-stone-400 mb-10 block"
                        >
                            Conecta con nosotros
                        </motion.span>
                        <h2 className="mb-16 text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter text-stone-900 uppercase">
                            Hablemos de <br />tu <span className="text-stone-300 italic font-light">futuro.</span>
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 text-left mb-20">
                            <div className="flex flex-col gap-6">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Email</h4>
                                <a href="mailto:info@reformasebenzer.com" className="text-xl font-medium text-stone-900 transition hover:opacity-50 break-words underline underline-offset-[12px] decoration-stone-200">
                                    info@reformasebenzer.com
                                </a>
                            </div>
                            <div className="flex flex-col gap-6">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Teléfono</h4>
                                <a href="tel:+34643640502" className="text-xl font-medium text-stone-900 transition hover:opacity-50 underline underline-offset-[12px] decoration-stone-200">
                                    +34 643 640 502
                                </a>
                            </div>
                        </div>

                        <form className="relative max-w-md group">
                            <input
                                type="email"
                                placeholder="Escribe tu email"
                                className="w-full py-6 text-[10px] font-bold tracking-[0.4em] uppercase transition-all bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 focus:pl-4"
                            />
                            <button
                                type="submit"
                                className="absolute right-0 transition-all bottom-6 text-stone-900 hover:translate-x-2 flex items-center gap-6 group"
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all">Enviar</span>
                                <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                            </button>
                        </form>
                    </div>

                    <div className="col-span-12 lg:col-span-6 flex flex-col justify-end">
                        <div className="grid grid-cols-2 gap-16 md:gap-32">
                            <div className="flex flex-col gap-10">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Menú</h4>
                                <ul className="flex flex-col gap-5 text-sm font-black tracking-widest uppercase text-stone-900">
                                    <li><Link href="/" className="hover:text-stone-400 transition">Inicio</Link></li>
                                    <li><Link href="/proyectos" className="hover:text-stone-400 transition">Proyectos</Link></li>
                                    <li><Link href="/visualizador" className="hover:text-stone-400 transition">Visor 3D</Link></li>
                                    <li><Link href="/servicios" className="hover:text-stone-400 transition">Servicios</Link></li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-10">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Atención</h4>
                                <ul className="flex flex-col gap-5 text-sm font-medium text-stone-500">
                                    <li className="leading-[2]">Av. de la Innovación 45,<br />28000 Madrid,<br />España</li>
                                    <li className="pt-6 font-black text-stone-900 text-[10px] tracking-[0.2em] uppercase">Horario: 09h - 18h</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center border-t border-stone-200/50 pt-16 text-[9px] text-stone-400 uppercase tracking-[0.4em] font-black">
                    <p>© 2026 Reformas Ebenzer. Architecture & Soul.</p>
                    <div className="flex gap-12 mt-8 md:mt-0">
                        <Link href="#" className="transition hover:text-stone-900">Privacy</Link>
                        <Link href="#" className="transition hover:text-stone-900">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
