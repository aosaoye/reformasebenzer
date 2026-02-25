"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const services = [
    {
        title: "Reformas Integrales",
        description: "Transformamos viviendas completas coordinando todos los gremios. Desde la redistribución de tabiques hasta el último detalle decorativo, nos encargamos de todo para que no tengas que preocuparte por nada.",
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1000",
        features: ["Arquitectura técnica", "Gestión de licencias", "Interiorismo", "Llave en mano"]
    },
    {
        title: "Cocinas de Diseño",
        description: "El corazón de tu hogar merece lo mejor. Creamos cocinas funcionales y estéticas, utilizando materiales de alta gama y electrodomésticos de última generación que se adaptan a tu ritmo de vida.",
        image: "https://images.pexels.com/photos/6186826/pexels-photo-6186826.jpeg",
        features: ["Mobiliario a medida", "Encimeras premium", "Iluminación integrada", "Optimización de espacio"]
    },
    {
        title: "Baños y Spa",
        description: "Convertimos tu baño en un espacio de desconexión y bienestar. Especialistas en platos de ducha a ras de suelo, saneamientos suspendidos y revestimientos de gran formato.",
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000",
        features: ["Grifería termostática", "Mamparas a medida", "Impermeabilización total", "Acabados de lujo"]
    },
    {
        title: "Espacios Comerciales",
        description: "Ayudamos a que tu negocio destaque. Reformamos locales comerciales, oficinas y restaurantes enfocados en la experiencia del cliente y la eficiencia operativa de tu marca.",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000",
        features: ["Imagen corporativa", "Normativa técnica", "Mantenimiento", "Diseño funcional"]
    }
];

export default function ServicesPage() {
    return (
        <main className="px-6 py-24 mx-auto max-w-7xl overflow-hidden">
            <header className="mb-32 text-center max-w-4xl mx-auto">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-[10px] uppercase tracking-[0.5em] font-bold text-stone-400 mb-8 block"
                >
                    Nuestros Servicios
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-10 text-stone-900"
                >
                    Especialistas en <span className="text-stone-300 italic font-light">transformar</span> espacios
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-stone-500 text-xl font-light leading-relaxed max-w-2xl mx-auto"
                >
                    Ofrecemos soluciones constructivas de alta calidad adaptadas a cada necesidad, garantizando siempre la excelencia en los acabados.
                </motion.p>
            </header>

            <div className="space-y-48">
                {services.map((service, index) => (
                    <section key={service.title} className={`flex flex-col gap-20 items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 w-full"
                        >
                            <div className="aspect-[4/5] md:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative group">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="flex-1"
                        >
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-stone-300 mb-4 block">0{index + 1} / Servicios</span>
                            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 text-stone-900">{service.title}</h3>
                            <p className="text-stone-500 text-lg mb-12 leading-relaxed font-light">{service.description}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mb-16">
                                {service.features.map((feature, i) => (
                                    <motion.div
                                        key={feature}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-stone-400 group/item"
                                    >
                                        <div className="w-1.5 h-1.5 bg-stone-200 group-hover/item:bg-stone-900 transition-colors rounded-full"></div>
                                        {feature}
                                    </motion.div>
                                ))}
                            </div>

                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-4 text-[10px] font-bold tracking-[0.3em] uppercase group"
                            >
                                <span>Solicitar presupuesto</span>
                                <div className="w-12 h-[1px] bg-stone-900 origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-300"></div>
                            </Link>
                        </motion.div>
                    </section>
                ))}
            </div>

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-48 py-32 bg-stone-900 text-white rounded-[3rem] px-8 md:px-24 text-center relative overflow-hidden"
            >
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-7xl font-light tracking-tighter mb-12">¿Empezamos con <br /><span className="italic font-black">tu proyecto?</span></h2>
                    <p className="text-stone-400 text-xl mb-16 max-w-2xl mx-auto font-light leading-relaxed">Cuéntanos tu idea y nuestro equipo de arquitectos e interioristas te asesorará para hacerla realidad con la mayor garantía.</p>
                    <Link href="/contact" className="inline-block bg-white text-stone-900 px-12 py-6 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-stone-100 transition shadow-2xl hover:scale-105 transform">Pide tu Presupuesto</Link>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </motion.section>
        </main>
    );
}
