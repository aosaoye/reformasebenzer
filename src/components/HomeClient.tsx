"use client";

import Image from "next/image";
import Link from "next/link";
import ProjectCarousel from "@/components/ProjectCarousel";
import BrandTicker from "@/components/BrandTicker";
import { motion } from "framer-motion";

import TestimonialsGrid from "@/components/TestimonialsGrid";

export default function HomeClient({ projects, homepage, testimonials = [] }: { projects: any[], homepage: any, testimonials?: any[] }) {
    const heroData = homepage || {
        heroTitle: "Espacios que cuentan tu historia.",
        heroSubtitle: "arquitectura • interiorismo • reformas",
        heroImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=90&w=2000",
        ctaText: "Solicitar Presupuesto",
        ctaLink: "/contact"
    };

    return (
        <main className="antialiased text-stone-900">
            {/* Hero Section */}
            <section className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-12">
                <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-stone-200 aspect-[5/6] md:aspect-[21/9] shadow-2xl">
                    <Image
                        src={heroData.heroImage}
                        className="object-cover w-full h-full"
                        alt="Hero Principal"
                        fill
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
                        <div className="max-w-2xl">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-7xl text-white font-light leading-[0.9] mb-6 tracking-tighter whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: heroData.heroTitle.replace("historia.", '<span class="font-black italic">historia.</span>') }}
                            />
                            <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/70 font-bold mb-8 md:mb-12">
                                {heroData.heroSubtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={heroData.ctaLink || "/contact"}
                                    className="bg-white text-stone-900 px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-stone-900 hover:text-white transition-all shadow-2xl active:scale-95 text-center"
                                >
                                    {heroData.ctaText}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <BrandTicker />

            <section className="px-4 md:px-8">
                {projects.length > 0 && <ProjectCarousel projects={projects} />}
            </section>

            {/* AI Visualizer Section */}
            <section className="mx-auto max-w-7xl px-4 md:px-8 mb-24">
                <div className="relative overflow-hidden bg-stone-50 rounded-[3rem] md:rounded-[4rem] px-8 py-16 md:px-24 md:py-24 border border-stone-100 shadow-inner">
                    <div className="flex flex-col md:flex-row items-center gap-20 relative z-10">
                        <div className="flex-1 text-center md:text-left">
                            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-stone-400 mb-8 block">Ebenzer Engine</span>
                            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-10 leading-[0.95]">
                                Del vídeo, <br />
                                <span className="text-stone-300 italic font-light">a la escena 3D.</span>
                            </h2>
                            <p className="text-stone-500 text-base md:text-lg font-light leading-relaxed mb-12 max-w-lg mx-auto md:mx-0">
                                Sube un vídeo de tu casa y nuestra IA creará un modelo 3D interactivo y acotado. Mide distancias, segmenta paredes y simula nuevos colores y materiales al instante.
                            </p>
                            <Link
                                href="/visualizador"
                                className="inline-flex items-center gap-4 bg-stone-900 text-stone-100 px-10 py-5 rounded-full font-bold uppercase text-[10px] tracking-widest shadow-2xl hover:bg-stone-800 transition transform hover:-translate-y-1"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Escenificar Vídeo 3D
                            </Link>
                        </div>
                        <Link href="/visualizador" className="flex-1 relative aspect-square w-full max-w-[500px] overflow-hidden rounded-[3rem] shadow-2xl group cursor-pointer block">
                            <Image
                                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
                                alt="Visor 3D"
                                fill
                                className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/20 transition-colors"></div>
                            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 transform transition-transform group-hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center pl-0.5">
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-900 underline underline-offset-4">Ver Demo Inmersiva</span>
                                </div>
                                <p className="text-[9px] text-stone-500 leading-tight">Transforma una grabación de vídeo en una escena 3D inteligente y acotada.</p>
                            </div>
                        </Link>
                    </div>
                    <div className="absolute w-64 h-64 bg-stone-200 blur-[100px] rounded-full -top-20 -right-20 opacity-50"></div>
                    <div className="absolute w-48 h-48 bg-stone-200 blur-[80px] rounded-full bottom-0 left-0 opacity-30"></div>
                </div>
            </section>

            <TestimonialsGrid initialTestimonials={testimonials} />

            {/* Commitment Section */}
            <section className="mx-auto max-w-7xl px-4 md:px-8 mb-48">
                <div className="relative py-32 bg-stone-900 text-stone-100 rounded-[3rem] md:rounded-[4rem] px-8 md:px-20 overflow-hidden shadow-2xl group">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=2000"
                            className="object-cover w-full h-full opacity-40 transition-transform duration-[10s] group-hover:scale-110"
                            alt="Interiorismo de Lujo"
                            fill
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 max-w-3xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-[10px] uppercase tracking-[0.6em] font-black text-stone-500 mb-8 block"
                        >
                            Pasión por lo excepcional
                        </motion.span>
                        <h2 className="mb-12 text-4xl md:text-7xl font-light leading-[0.9] tracking-tighter uppercase">
                            Excelencia en <br />
                            cada acabado, <br />
                            <span className="text-stone-300 italic font-black">pasión en cada detalle.</span>
                        </h2>
                        <p className="mb-16 text-lg md:text-xl leading-relaxed text-stone-400 font-light max-w-xl">
                            En Reformas Ebenzer no seguimos tendencias, las creamos. Entendemos que tu hogar es la extensión de tu alma.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20">
                            <div className="flex flex-col gap-2">
                                <span className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">{heroData.statsYears}+</span>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-stone-500 font-black">Años de maestría</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">{heroData.statsProjects}+</span>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-stone-500 font-black">Historias creadas</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">100%</span>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-stone-500 font-black">Satisfacción total</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
