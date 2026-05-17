"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Footer({ settings, isAdmin }: { settings?: any, isAdmin?: boolean }) {
    const { isEditing, setIsEditing } = useAdmin();
    const siteName = settings?.siteName || "EBENZER";
    const initialEmail = settings?.contactEmail || "rfebenezer.sl@gmail.com";
    const initialPhone = settings?.whatsappNumber || "+34 643 640 502";

    const footerRef = useRef<HTMLElement>(null);
    const brandTextRef = useRef<HTMLSpanElement>(null);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<{
        loading: boolean;
        success?: boolean;
        message?: string;
    }>({ loading: false });

    const [localData, setLocalData] = useState({
        contactEmail: settings?.contactEmail || initialEmail,
        whatsappNumber: settings?.whatsappNumber || initialPhone,
        footerTitle: settings?.footerTitle || "Hablemos de<br />tu <span class=\"text-stone-300 italic font-light\">futuro.</span>",
        address: settings?.address || "Av. de la Innovación 45,<br />28000 Madrid,<br />España",
        hours: settings?.hours || "Horario: 09h - 18h",
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveGlobal = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/save-global", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(localData)
            });
            if (res.ok) {
                alert("Ajustes globales (Footer) guardados.");
            } else {
                alert("Error al guardar en CMS");
            }
        } catch(e) {
            alert("Error de conexión");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubscribe = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!email) return;
        setStatus({ loading: true });

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error en la suscripción.");
            }

            setStatus({
                loading: false,
                success: true,
                message: "¡Suscripción completada!"
            });
            setEmail("");
        } catch (error: any) {
            setStatus({
                loading: false,
                success: false,
                message: error.message || "Inténtalo de nuevo."
            });
        }
    };

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
                    {siteName} {siteName} {siteName}
                </span>
            </div>

            <div className="relative z-10 px-6 mx-auto max-w-7xl">
                <div className="grid grid-cols-12 mb-40 gap-y-20 md:gap-x-24">
                    <div className="col-span-12 lg:col-span-6">
                        <div className="flex items-center gap-4 mb-10">
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-[10px] uppercase tracking-[0.6em] font-black text-stone-400 block"
                            >
                                Conecta con nosotros
                            </motion.span>
                            {isEditing && (
                                <button onClick={handleSaveGlobal} disabled={isSaving} className="text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-full bg-emerald-500 text-white hover:bg-emerald-400 ml-4 absolute left-full top-0 w-max">
                                    {isSaving ? "Guardando..." : "Guardar Footer"}
                                </button>
                            )}
                            
                        </div>
                        {isEditing ? (
                            <textarea 
                                value={localData.footerTitle.replace(/<br \/>/g, '\n').replace(/<span.*?>/g, '').replace(/<\/span>/g, '')}
                                onChange={(e) => setLocalData({...localData, footerTitle: e.target.value.replace(/\n/g, '<br />')})}
                                className="mb-16 w-full text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter text-stone-900 uppercase bg-stone-100 p-4 rounded-xl"
                                rows={3}
                            />
                        ) : (
                            <h2 
                                className="mb-16 text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter text-stone-900 uppercase"
                                dangerouslySetInnerHTML={{ __html: localData.footerTitle }}
                            />
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 text-left mb-20 relative z-20">
                            <div className="flex flex-col gap-6">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Email</h4>
                                {isEditing ? (
                                    <input 
                                        value={localData.contactEmail}
                                        onChange={(e) => setLocalData({...localData, contactEmail: e.target.value})}
                                        className="text-xl font-medium text-stone-900 bg-stone-100 border-b border-indigo-500 focus:outline-none px-2 w-full"
                                    />
                                ) : (
                                    <a href={`mailto:${localData.contactEmail}`} className="text-xl font-medium text-stone-900 transition hover:opacity-50 break-words underline underline-offset-[12px] decoration-stone-200">
                                        {localData.contactEmail}
                                    </a>
                                )}
                            </div>
                            <div className="flex flex-col gap-6">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Teléfono</h4>
                                {isEditing ? (
                                    <input 
                                        value={localData.whatsappNumber}
                                        onChange={(e) => setLocalData({...localData, whatsappNumber: e.target.value})}
                                        className="text-xl font-medium text-stone-900 bg-stone-100 border-b border-indigo-500 focus:outline-none px-2 w-full"
                                    />
                                ) : (
                                    <a href={`tel:${localData.whatsappNumber.replace(/\s/g, '')}`} className="text-xl font-medium text-stone-900 transition hover:opacity-50 underline underline-offset-[12px] decoration-stone-200">
                                        {localData.whatsappNumber}
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="relative max-w-md group flex flex-col">
                            <div className="relative flex items-center w-full">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSubscribe();
                                        }
                                    }}
                                    disabled={status.loading}
                                    placeholder={status.loading ? "Procesando..." : "Escribe tu email"}
                                    className="w-full py-6 text-[10px] font-bold tracking-[0.4em] uppercase transition-all bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 focus:pl-4"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleSubscribe()}
                                    disabled={status.loading}
                                    className="absolute right-0 transition-all bottom-6 text-stone-900 hover:translate-x-2 flex items-center gap-6 group disabled:opacity-50 disabled:hover:translate-x-0"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all">
                                        {status.loading ? "..." : "Enviar"}
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center hover:scale-110 transition-transform">
                                        {status.loading ? (
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        )}
                                    </div>
                                </button>
                            </div>
                            {status.message && (
                                <motion.span 
                                    initial={{ opacity: 0, y: 5 }} 
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`text-[9px] uppercase tracking-[0.2em] font-bold mt-4 block ${status.success ? 'text-stone-900' : 'text-red-500'}`}
                                >
                                    {status.message}
                                </motion.span>
                            )}
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-6 flex flex-col justify-end">
                        <div className="grid grid-cols-2 gap-16 md:gap-32">
                            <div className="flex flex-col gap-10">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Menú</h4>
                                <ul className="flex flex-col gap-5 text-sm font-black tracking-widest uppercase text-stone-900">
                                    <li><Link href="/" className="hover:text-stone-400 transition">Inicio</Link></li>
                                    <li><Link href="/proyectos" className="hover:text-stone-400 transition">Proyectos</Link></li>

                                    <li><Link href="/servicios" className="hover:text-stone-400 transition">Servicios</Link></li>
                                </ul>
                            </div>
                            <div className="flex flex-col gap-10">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Atención</h4>
                                <ul className="flex flex-col gap-5 text-sm font-medium text-stone-500">
                                    {isEditing ? (
                                        <div className="flex flex-col gap-2 relative z-50">
                                            <textarea 
                                                value={localData.address.replace(/<br \/>/g, '\n')}
                                                onChange={(e) => setLocalData({...localData, address: e.target.value.replace(/\n/g, '<br />')})}
                                                className="bg-stone-200 text-stone-900 w-full p-2 text-xs rounded border border-indigo-500 focus:outline-none"
                                                rows={3}
                                                placeholder="Dirección"
                                            />
                                            <input 
                                                value={localData.hours}
                                                onChange={(e) => setLocalData({...localData, hours: e.target.value})}
                                                className="bg-stone-200 text-stone-900 w-full p-2 text-xs rounded border border-indigo-500 focus:outline-none font-bold"
                                                placeholder="Horario"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <li className="leading-[2]" dangerouslySetInnerHTML={{ __html: localData.address }} />
                                            <li className="pt-6 font-black text-stone-900 text-[10px] tracking-[0.2em] uppercase">{localData.hours}</li>
                                        </>
                                    )}
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
