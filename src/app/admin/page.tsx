"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminLogin() {
    const [email, setEmail] = useState("admin@ebenzer.com");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (data.success) {
                router.push("/?edit=true");
                router.refresh();
            } else {
                setError(data.message || "Contraseña incorrecta");
            }
        } catch (err) {
            setError("Error de red");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
            {/* Left Side: Elegant visual block */}
            <div className="hidden md:flex md:w-1/2 relative bg-stone-900 overflow-hidden select-none">
                <img
                    src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200"
                    alt="Ebenzer Design"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                
                {/* Brand Overlay */}
                <div className="absolute top-12 left-12 flex items-center gap-2 text-white">
                    <ion-icon name="crop-outline" style={{ fontSize: '24px' }}></ion-icon>
                    <span className="text-2xl font-bold tracking-tight">Ebenzer.</span>
                </div>

                {/* Aesthetic Quote */}
                <div className="absolute bottom-16 left-16 max-w-md text-white">
                    <h2 className="text-4xl font-bold tracking-tight leading-tight mb-4">
                        Define tu propio espacio.
                    </h2>
                    <p className="text-stone-300 text-sm leading-relaxed">
                        Accede al panel de administración del CMS visual de Ebenzer para editar, reordenar y dar de alta proyectos a tu gusto.
                    </p>
                </div>
            </div>

            {/* Right Side: Elegant form */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-white">
                <div className="w-full max-w-[400px] flex flex-col">
                    
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold tracking-tight text-stone-950 mb-2">
                            Iniciar sesión
                        </h1>
                        <p className="text-stone-500 text-sm">
                            Introduce la contraseña maestra para acceder al modo editor.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="flex flex-col gap-6">
                        {/* Password Field */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-baseline">
                                <label className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
                                    CONTRASEÑA
                                </label>
                                <span className="text-[10px] font-semibold text-stone-400 hover:text-stone-900 cursor-pointer">
                                    ¿Olvidaste tu contraseña?
                                </span>
                            </div>
                            <input
                                type="password"
                                placeholder="Contraseña Maestra"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors text-sm"
                                autoFocus
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-xs font-semibold tracking-wide">{error}</p>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-stone-950 text-white py-3.5 rounded-full font-bold uppercase text-[11px] tracking-widest hover:bg-stone-850 active:scale-[0.99] transition-all text-center mt-2 disabled:opacity-50"
                        >
                            {loading ? "VERIFICANDO..." : "CONTINUAR"}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-xs text-stone-500">
                        ¿Quieres volver al sitio?{" "}
                        <Link href="/" className="font-semibold text-stone-900 hover:underline">
                            Regresar al Inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
