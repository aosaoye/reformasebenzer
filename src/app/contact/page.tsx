export default function ContactPage() {
    return (
        <main className="px-6 py-12 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
                <div>
                    <h2 className="mb-6 text-5xl md:text-7xl font-bold tracking-tighter">Contáctanos</h2>
                    <p className="mb-12 text-stone-500 leading-relaxed text-lg font-light">
                        ¿Tienes un proyecto en mente? Estamos aquí para asesorarte. Cuéntanos qué necesitas y nuestro equipo se pondrá en contacto contigo para una visita técnica sin compromiso.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="flex items-center justify-center p-4 rounded-full bg-stone-100">
                                {/* @ts-ignore */}
                                <ion-icon name="location-outline" class="text-2xl"></ion-icon>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-1">Oficina Central</h3>
                                <p className="text-sm text-stone-500 font-light">
                                    Av. de la Innovación 45, 28001 Madrid
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="flex items-center justify-center p-4 rounded-full bg-stone-100">
                                {/* @ts-ignore */}
                                <ion-icon name="mail-outline" class="text-2xl"></ion-icon>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-1">Email</h3>
                                <p className="text-sm text-stone-500 font-light">info@reformasebenzer.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="flex items-center justify-center p-4 rounded-full bg-stone-100">
                                {/* @ts-ignore */}
                                <ion-icon name="call-outline" class="text-2xl"></ion-icon>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold tracking-widest uppercase mb-1">Teléfono</h3>
                                <p className="text-sm text-stone-500 font-light">+34 600 000 000</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-white border rounded-md border-stone-100 shadow-2xl shadow-stone-200/50">
                    <form className="space-y-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-2">Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Tu nombre"
                                    className="w-full py-4 text-sm font-medium bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-2">Teléfono</label>
                                <input
                                    type="text"
                                    placeholder="Tu teléfono"
                                    className="w-full py-4 text-sm font-medium bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                className="w-full py-4 text-sm font-medium bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-2">Tipo de Proyecto</label>
                            <select className="w-full py-4 text-sm font-medium bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors appearance-none cursor-pointer">
                                <option>Reforma Integral</option>
                                <option>Reforma de Cocina</option>
                                <option>Reforma de Baño</option>
                                <option>Otros</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-2">Mensaje</label>
                            <textarea
                                rows={4}
                                className="w-full py-4 text-sm font-medium bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors resize-none"
                                placeholder="Cuéntanos un poco más sobre tu idea..."
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-6 text-xs font-bold tracking-widest text-white uppercase transition rounded-full bg-stone-900 hover:bg-stone-800 shadow-xl hover:-translate-y-1"
                        >
                            Enviar Solicitud
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
