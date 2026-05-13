"use client";

import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        projectType: "Reforma Integral",
        message: ""
    });
    const [status, setStatus] = useState<{
        loading: boolean;
        success?: boolean;
        message?: string;
    }>({ loading: false });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ loading: true });

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Algo salió mal al enviar el formulario.");
            }

            setStatus({
                loading: false,
                success: true,
                message: "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto."
            });

            // Clear form
            setFormData({
                name: "",
                phone: "",
                email: "",
                projectType: "Reforma Integral",
                message: ""
            });
        } catch (error: any) {
            setStatus({
                loading: false,
                success: false,
                message: error.message || "Error de conexión. Inténtalo de nuevo."
            });
        }
    };

    return (
        <main className="px-6 py-12 mx-auto max-w-7xl animate-in fade-in duration-500">
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
                <div>
                    <h2 className="mb-6 text-5xl md:text-7xl font-bold tracking-tighter">Contáctanos</h2>
                    <p className="mb-12 text-stone-500 leading-relaxed text-lg font-light">
                        ¿Tienes un proyecto en mente? Estamos aquí para asesorarte. Cuéntanos qué necesitas y nuestro equipo se pondrá en contacto contigo para una visita técnica sin compromiso.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="flex items-center justify-center p-4 rounded-full bg-stone-100 w-14 h-14 shrink-0">
                                <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-1">Oficina Central</h3>
                                <p className="text-sm text-stone-500 font-light">
                                    Av. de la Innovación 45, 28001 Madrid
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="flex items-center justify-center p-4 rounded-full bg-stone-100 w-14 h-14 shrink-0">
                                <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-1">Email</h3>
                                <p className="text-sm text-stone-500 font-light">rfebenezer.sl@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="flex items-center justify-center p-4 rounded-full bg-stone-100 w-14 h-14 shrink-0">
                                <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.581 10.581 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-1">Teléfono</h3>
                                <p className="text-sm text-stone-500 font-light">+34 643 640 502</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-white border rounded-3xl border-stone-100 shadow-2xl shadow-stone-200/40 relative overflow-hidden">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-2">Nombre *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Tu nombre"
                                    className="w-full py-4 text-sm font-medium bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-2">Teléfono</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Tu teléfono"
                                    className="w-full py-4 text-sm font-medium bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-2">Email *</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Tu correo electrónico"
                                className="w-full py-4 text-sm font-medium bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-2">Tipo de Proyecto</label>
                            <div className="relative">
                                <select 
                                    name="projectType"
                                    value={formData.projectType}
                                    onChange={handleChange}
                                    className="w-full py-4 text-sm font-medium bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="Reforma Integral">Reforma Integral</option>
                                    <option value="Reforma de Cocina">Reforma de Cocina</option>
                                    <option value="Reforma de Baño">Reforma de Baño</option>
                                    <option value="Otros">Otros</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-2">Mensaje *</label>
                            <textarea
                                rows={4}
                                name="message"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full py-4 text-sm font-medium bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors resize-none"
                                placeholder="Cuéntanos un poco más sobre tu idea..."
                            ></textarea>
                        </div>

                        {status.message && (
                            <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all ${
                                status.success 
                                    ? "bg-stone-900 text-white" 
                                    : "bg-red-50 text-red-800 border border-red-100"
                            }`}>
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status.loading}
                            className={`w-full py-6 text-xs font-bold tracking-widest text-white uppercase transition rounded-full shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 ${
                                status.loading 
                                    ? "bg-stone-500 cursor-not-allowed" 
                                    : "bg-stone-900 hover:bg-stone-800"
                            }`}
                        >
                            {status.loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enviando...
                                </>
                            ) : (
                                "Enviar Solicitud"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
