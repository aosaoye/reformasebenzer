"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLogin() {
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
                router.refresh(); // Force refresh to re-evaluate the server cookie
            } else {
                setError(data.message || "Error al autenticar");
            }
        } catch (err) {
            setError("Error de red");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background blur effects */}
            <div className="absolute w-[500px] h-[500px] bg-stone-800 blur-[120px] rounded-full -top-40 -left-40 opacity-50"></div>
            <div className="absolute w-[400px] h-[400px] bg-stone-700 blur-[100px] rounded-full bottom-0 right-0 opacity-30"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-stone-800/40 backdrop-blur-2xl border border-stone-700/50 p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <span className="text-[10px] uppercase tracking-[0.5em] font-black text-stone-400 mb-4 block">Ebenzer Admin</span>
                    <h1 className="text-3xl font-light text-white tracking-tighter">Acceso Restringido</h1>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña Maestra"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-stone-900/50 text-white px-6 py-4 rounded-full border border-stone-700 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all text-sm tracking-widest placeholder:text-stone-600 text-center"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs text-center font-medium tracking-widest uppercase">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-white text-stone-900 px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-stone-200 transition-all shadow-2xl active:scale-95 text-center mt-2 disabled:opacity-50"
                    >
                        {loading ? "Verificando..." : "Entrar al Editor"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
