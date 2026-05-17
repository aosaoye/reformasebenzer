"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ settings, isAdmin }: { settings?: any, isAdmin?: boolean }) {
    const { isEditing, setIsEditing } = useAdmin();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [localSettings, setLocalSettings] = useState(settings || { siteName: "Ebenzer", layout: "default" });
    const pathname = usePathname();

    const navLinks = [
        { name: "HOME", href: "/" },
        { name: "PROJECTS", href: "/proyectos" },
        { name: "CONTACT", href: "/contact" },
    ];

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (pathname !== "/") {
            setIsScrolled(true);
            return;
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);

    const isDarkTheme = pathname === "/" && !isScrolled;
    const textClass = isDarkTheme ? "text-white" : "text-stone-900";
    const navLinkClass = (href: string) => {
        if (pathname === href) {
            return isDarkTheme ? "text-white font-bold" : "text-stone-900 font-bold";
        }
        return isDarkTheme ? "text-white/70 hover:text-white" : "text-stone-500 hover:text-stone-900";
    };
    const dotClass = isDarkTheme ? "bg-white" : "bg-stone-900";
    const logoColor = isDarkTheme ? "#ffffff" : "#1c1917";
    const buttonClass = isDarkTheme 
        ? "bg-white hover:bg-stone-100 text-stone-900" 
        : "bg-stone-900 hover:bg-stone-800 text-white";

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
                    isScrolled 
                        ? "bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm py-0" 
                        : "bg-transparent border-b border-transparent py-3"
                }`}
            >
                <div className="flex items-center justify-between h-20 px-8 mx-auto max-w-[1400px]">
                    {/* Mobile Menu Button */}
                    <button onClick={toggleDrawer} className="md:hidden">
                        <ion-icon name="menu-outline" style={{ fontSize: '28px', color: logoColor }}></ion-icon>
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <ion-icon name="crop-outline" style={{ fontSize: '24px', color: logoColor }}></ion-icon>
                        <Link href="/" className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${textClass}`}>
                            {localSettings.siteName}.
                        </Link>
                    </div>

                    {/* Desktop Center Navigation */}
                    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2">
                        <ul className="flex items-center gap-12 text-[11px] font-bold tracking-[0.15em]">
                            {navLinks.map((link) => (
                                <li key={link.href} className="relative flex flex-col items-center">
                                    <Link
                                        href={link.href}
                                        className={`transition-colors duration-300 ${navLinkClass(link.href)}`}
                                    >
                                        {link.name}
                                    </Link>
                                    {pathname === link.href && (
                                        <motion.div
                                            layoutId="navDot"
                                            className={`absolute -bottom-3 w-1 h-1 rounded-full ${dotClass}`}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Right Navigation - Clean CTA Button */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAdmin && (
                            <Link href="/admin" className={`text-[10px] font-bold tracking-[0.15em] transition mr-2 ${isDarkTheme ? "text-white/60 hover:text-white" : "text-stone-400 hover:text-stone-900"}`}>
                                ADMIN
                            </Link>
                        )}
                        <Link 
                            href="/contact" 
                            className={`text-[10px] font-bold tracking-[0.2em] uppercase px-5 py-3 transition-all duration-300 ${buttonClass}`}
                        >
                            PRESUPUESTO
                        </Link>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Drawer (Simplified for brevity) */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[101] bg-white flex flex-col items-center justify-center"
                    >
                        <button onClick={toggleDrawer} className="absolute top-8 right-8">
                            <ion-icon name="close-outline" style={{ fontSize: '32px', color: '#1c1917' }}></ion-icon>
                        </button>
                        <ul className="flex flex-col gap-8 text-center text-xl font-bold tracking-widest">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} onClick={toggleDrawer} className="text-stone-900">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="mt-8 flex gap-6 justify-center">
                                <Link href="/admin" onClick={toggleDrawer} className="text-sm">LOGIN</Link>
                                <Link href="/contact" onClick={toggleDrawer} className="text-sm">REGISTER</Link>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
