"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Proyectos", href: "/proyectos" },
        { name: "Visor 3D", href: "/visualizador" },
        { name: "Servicios", href: "/servicios" },
        { name: "Contacto", href: "/contact" },
    ];

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    // Close drawer on path change
    useEffect(() => {
        setIsDrawerOpen(false);
    }, [pathname]);

    // Internal SVG Icons to avoid issues
    const Icons = {
        Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
        Projects: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
        Visor: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
        Services: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>,
        Contact: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    }

    const getIcon = (name: string) => {
        switch (name) {
            case "Inicio": return <Icons.Home />;
            case "Proyectos": return <Icons.Projects />;
            case "Visor 3D": return <Icons.Visor />;
            case "Servicios": return <Icons.Services />;
            case "Contacto": return <Icons.Contact />;
            default: return null;
        }
    }

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="sticky top-0 z-[100] border-b bg-white/70 backdrop-blur-xl border-stone-100"
            >
                <div className="flex items-center justify-between h-20 px-6 mx-auto max-w-7xl">
                    {/* Animated Hamburger Button */}
                    <button
                        onClick={toggleDrawer}
                        className="relative z-[110] p-4 -ml-4 md:hidden flex flex-col gap-1.5 focus:outline-none group"
                        aria-label="Menu"
                    >
                        <motion.span
                            animate={isDrawerOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                            className="w-6 h-0.5 bg-stone-900 block transition-colors group-hover:bg-stone-600"
                        />
                        <motion.span
                            animate={isDrawerOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                            className="w-4 h-0.5 bg-stone-900 block"
                        />
                        <motion.span
                            animate={isDrawerOpen ? { rotate: -45, y: -8, width: 24 } : { rotate: 0, y: 0, width: 16 }}
                            className="h-0.5 bg-stone-900 block"
                        />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="text-xl md:text-2xl italic font-black tracking-tighter text-stone-900 uppercase">
                        Ebenzer
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">
                        <ul className="flex gap-10 text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`transition-all hover:text-stone-900 relative py-2 ${pathname === link.href ? "text-stone-900" : ""}`}
                                    >
                                        {link.name}
                                        {pathname === link.href && (
                                            <motion.div
                                                layoutId="navUnderline"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full"
                                            />
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Spacer/CTA */}
                    <div className="hidden md:block">
                        <Link href="/contact" className="text-[10px] font-bold uppercase tracking-widest bg-stone-900 text-white px-6 py-3 rounded-full hover:bg-stone-800 transition shadow-lg">
                            Contacto
                        </Link>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleDrawer}
                            className="fixed inset-0 z-[101] bg-stone-900/40 backdrop-blur-sm"
                        />

                        {/* Drawer Content */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-[102] w-full max-w-sm bg-stone-50 shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-8 pb-4 flex items-center justify-between border-b border-stone-200/50 bg-white">
                                <span className="text-xl font-black italic tracking-tighter">EBENZER</span>
                                <button onClick={toggleDrawer} className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <nav className="flex-1 overflow-y-auto p-6 bg-white">
                                <ul className="flex flex-col gap-4">
                                    {navLinks.map((link, i) => (
                                        <motion.li
                                            key={link.href}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <Link
                                                href={link.href}
                                                className={`flex items-center gap-6 p-4 rounded-2xl transition-all ${pathname === link.href ? "bg-stone-900 text-white shadow-xl shadow-stone-900/20" : "hover:bg-stone-50 text-stone-500 hover:text-stone-900"}`}
                                            >
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${pathname === link.href ? "bg-white/10" : "bg-stone-100"}`}>
                                                    {getIcon(link.name)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold tracking-widest uppercase">{link.name}</span>
                                                    <span className="text-[10px] opacity-50 lowercase tracking-normal font-medium">explorar sección</span>
                                                </div>
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            </nav>

                            <div className="p-8 bg-stone-100/50 border-t border-stone-200/50">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4">Redes Sociales</p>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
