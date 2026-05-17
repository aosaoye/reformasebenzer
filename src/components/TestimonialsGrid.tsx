"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface TestimonialItem {
    id: string | number;
    name: string;
    comment: string;
    rating: number;
}

export default function TestimonialsGrid({ initialTestimonials = [] }: { initialTestimonials: TestimonialItem[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [formData, setFormData] = useState({ name: "", email: "", comment: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        try {
            const response = await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, rating }),
            });
            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", comment: "" });
                setTimeout(() => {
                   setIsOpen(false);
                   setStatus("idle");
                }, 3000);
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    const Star = ({ filled, onClick }: { filled: boolean, onClick?: () => void }) => (
        <svg 
           onClick={onClick}
           className={`w-5 h-5 ${onClick ? 'cursor-pointer transition-transform hover:scale-125' : ''} ${filled ? "text-stone-900 fill-current" : "text-stone-300 fill-stone-200"}`} 
           viewBox="0 0 24 24"
        >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                <div>
                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-stone-400 block mb-4">Opiniones Reales</span>
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-stone-900 uppercase">
                        Voces de <br/>
                        <span className="text-stone-300 italic font-light">satisfacción.</span>
                    </h2>
                </div>
                <button 
                    onClick={() => setIsOpen(true)}
                    className="mt-8 md:mt-0 bg-stone-900 text-white px-8 py-4 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-stone-800 transition shadow-lg"
                >
                    Dejar Reseña
                </button>
            </div>

            {initialTestimonials.length === 0 ? (
                <div className="bg-stone-50 p-12 rounded-[2rem] text-center border border-stone-100">
                    <p className="text-stone-400 italic font-light">Sé el primero en compartir tu experiencia con nosotros.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {initialTestimonials.map((item) => (
                        <div key={item.id} className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm flex flex-col justify-between hover:shadow-xl transition-shadow group">
                            <div>
                                <div className="flex gap-1 mb-6">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} filled={star <= item.rating} />)}
                                </div>
                                <p className="text-stone-600 leading-relaxed text-base font-light mb-8">"{item.comment}"</p>
                            </div>
                            <div>
                                <p className="font-bold text-stone-900 uppercase tracking-widest text-[11px]">{item.name}</p>
                                <p className="text-[9px] text-stone-400 uppercase tracking-widest">Cliente Verificado</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative"
                    >
                        <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-stone-400 hover:text-stone-900">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                        
                        {status === "success" ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-2">¡Gracias por tu reseña!</h3>
                                <p className="text-sm text-stone-500 font-light">La publicaremos tras ser revisada por nuestro equipo.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-black tracking-tighter text-stone-900 mb-6">Valorar experiencia</h3>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="flex justify-center gap-2 bg-stone-50 py-4 rounded-2xl mb-4">
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <Star key={num} filled={num <= rating} onClick={() => setRating(num)} />
                                        ))}
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold tracking-widest text-stone-400 mb-2">Nombre</label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-stone-50 border-transparent focus:border-stone-300 rounded-xl p-3 text-sm outline-none transition" placeholder="Tu nombre" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold tracking-widest text-stone-400 mb-2">Email</label>
                                        <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-stone-50 border-transparent focus:border-stone-300 rounded-xl p-3 text-sm outline-none transition" placeholder="tu@correo.com" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold tracking-widest text-stone-400 mb-2">Comentario</label>
                                        <textarea required rows={4} value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} className="w-full bg-stone-50 border-transparent focus:border-stone-300 rounded-xl p-3 text-sm outline-none transition resize-none" placeholder="Cuéntanos tu experiencia..."></textarea>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={status === "loading"}
                                        className="w-full bg-stone-900 text-white py-4 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-black transition disabled:opacity-50"
                                    >
                                        {status === "loading" ? "Enviando..." : "Enviar Valoración"}
                                    </button>
                                    {status === "error" && <p className="text-red-500 text-[10px] text-center mt-2">Hubo un error. Inténtalo de nuevo.</p>}
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </section>
    );
}
