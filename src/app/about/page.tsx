import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="px-6 py-12 mx-auto max-w-7xl">
            <section className="mb-32">
                <div className="flex flex-col items-center gap-16 md:flex-row">
                    <div className="relative flex-1">
                        <img
                            src="https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=1260"
                            alt="Sobre Reformas Ebenzer"
                            className="rounded-[2rem] shadow-2xl relative z-10"
                        />
                        <div className="absolute z-20 flex items-center justify-center hidden w-48 h-48 text-white rounded-full -bottom-6 -right-6 bg-stone-900 md:flex">
                            <div className="text-center">
                                <span className="block text-4xl font-bold">15+</span>
                                <span className="text-[8px] uppercase tracking-widest font-bold">Años de éxito</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-6 block">Nuestra Historia</span>
                        <h2 className="mb-8 text-4xl font-light leading-none tracking-tighter md:text-6xl">
                            Dando vida a tus ideas desde el primer plano.
                        </h2>
                        <p className="mb-6 text-lg font-light leading-relaxed text-stone-600">
                            Reformas Ebenzer nace de la unión de profesionales apasionados por la arquitectura técnica y el diseño de interiores. Con más de 15 años de experiencia en el sector, hemos consolidado un equipo capaz de afrontar cualquier reto constructivo.
                        </p>
                        <p className="mb-12 font-light leading-relaxed text-stone-500">
                            Nuestra filosofía se basa en la transparencia, la precisión y la personalización absoluta. No solo reformamos casas; creamos hogares que reflejan la personalidad de quienes los habitan.
                        </p>
                        <div className="flex gap-12">
                            <div>
                                <span className="block text-4xl font-bold text-stone-900">500+</span>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400">Obras Realizadas</span>
                            </div>
                            <div>
                                <span className="block text-4xl font-bold text-stone-900">100%</span>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400">Viviendas de Autor</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 border-t border-stone-100">
                <h2 className="mb-20 text-4xl font-light tracking-tighter text-center md:text-5xl">Nuestros Pilares</h2>
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    <div className="p-10 transition duration-500 bg-white border border-stone-100 rounded-3xl hover:shadow-2xl hover:shadow-stone-200/50 group">
                        <div className="flex items-center justify-center w-12 h-12 mb-8 text-white transition bg-stone-900 rounded-xl group-hover:scale-110">
                            {/* @ts-ignore */}
                            <ion-icon name="diamond-outline" class="text-2xl"></ion-icon>
                        </div>
                        <h3 className="mb-4 text-xl font-bold">Calidad Sin Excusas</h3>
                        <p className="text-sm font-light leading-relaxed text-stone-500">
                            Trabajamos con los mejores proveedores y artesanos para asegurar que cada detalle cumpla con los estándares más exigentes.
                        </p>
                    </div>
                    <div className="p-10 transition duration-500 bg-white border border-stone-100 rounded-3xl hover:shadow-2xl hover:shadow-stone-200/50 group">
                        <div className="flex items-center justify-center w-12 h-12 mb-8 text-white transition bg-stone-900 rounded-xl group-hover:scale-110">
                            {/* @ts-ignore */}
                            <ion-icon name="calendar-outline" class="text-2xl"></ion-icon>
                        </div>
                        <h3 className="mb-4 text-xl font-bold">Compromiso en Plazos</h3>
                        <p className="text-sm font-light leading-relaxed text-stone-500">
                            Entendemos lo importante que es tu tiempo. Cumplimos rigurosamente con los plazos de entrega acordados por contrato.
                        </p>
                    </div>
                    <div className="p-10 transition duration-500 bg-white border border-stone-100 rounded-3xl hover:shadow-2xl hover:shadow-stone-200/50 group">
                        <div className="flex items-center justify-center w-12 h-12 mb-8 text-white transition bg-stone-900 rounded-xl group-hover:scale-110">
                            {/* @ts-ignore */}
                            <ion-icon name="people-outline" class="text-2xl"></ion-icon>
                        </div>
                        <h3 className="mb-4 text-xl font-bold">Trato Personalizado</h3>
                        <p className="text-sm font-light leading-relaxed text-stone-500">
                            Tendrás un jefe de obra asignado que te acompañará y asesorará durante todo el proceso de transformación.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
