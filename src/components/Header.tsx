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

    useEffect(() => {
        setIsDrawerOpen(false);
    }, [pathname]);

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="sticky top-0 z-[100] bg-white border-b border-stone-100/50"
            >
                <div className="flex items-center justify-between h-20 px-8 mx-auto max-w-[1400px]">
                    {/* Mobile Menu Button */}
                    <button onClick={toggleDrawer} className="md:hidden">
                        <ion-icon name="menu-outline" style={{ fontSize: '28px', color: '#1c1917' }}></ion-icon>
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <ion-icon name="crop-outline" style={{ fontSize: '24px', color: '#1c1917' }}></ion-icon>
                        <Link href="/" className="text-2xl font-bold tracking-tight text-stone-900">
                            {localSettings.siteName}.
                        </Link>
                    </div>

                    {/* Desktop Center Navigation */}
                    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2">
                        <ul className="flex items-center gap-12 text-[11px] font-bold tracking-[0.15em] text-stone-600">
                            {navLinks.map((link) => (
                                <li key={link.href} className="relative flex flex-col items-center">
                                    <Link
                                        href={link.href}
                                        className={`transition-colors hover:text-stone-900 ${pathname === link.href ? "text-stone-900" : ""}`}
                                    >
                                        {link.name}
                                    </Link>
                                    {pathname === link.href && (
                                        <motion.div
                                            layoutId="navDot"
                                            className="absolute -bottom-3 w-1 h-1 bg-stone-900 rounded-full"
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Right Navigation */}
                    <div className="hidden md:flex items-center gap-6 text-[11px] font-bold tracking-[0.1em] text-stone-900">
                        <button className="hover:opacity-70 transition flex items-center justify-center">
                            <ion-icon name="search-outline" style={{ fontSize: '20px' }}></ion-icon>
                        </button>
                        <button className="hover:opacity-70 transition flex items-center justify-center">
                            <ion-icon name="cart-outline" style={{ fontSize: '20px' }}></ion-icon>
                        </button>
                        <div className="w-px h-4 bg-stone-200 mx-2"></div>
                        <Link href="/admin" className="hover:text-stone-500 transition">
                            {isAdmin ? "ADMIN" : "LOGIN"}
                        </Link>
                        {!isAdmin && (
                            <Link href="/contact" className="hover:text-stone-500 transition">
                                REGISTER
                            </Link>
                        )}
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
