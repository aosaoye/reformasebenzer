import { getProjectById, getAllProjects } from "@/lib/services/projects";
import { notFound } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import MediaShowcase from "@/components/MediaShowcase";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
    const project = await getProjectById(params.id);

    if (!project) {
        notFound();
    }

    const allProjects = await getAllProjects();
    const similarProjects = allProjects
        .filter((p: any) => p.category === project.category && p.id !== project.id)
        .slice(0, 3);

    return (
        <main className="px-6 py-12 mx-auto max-w-7xl">
            {/* Breadcrumb */}
            <nav className="mb-12 text-[10px] uppercase tracking-widest text-stone-400">
                <Link href="/" className="hover:text-stone-900 transition">Inicio</Link>
                <span className="mx-3">/</span>
                <Link href="/proyectos" className="hover:text-stone-900 transition">Proyectos</Link>
                <span className="mx-3">/</span>
                <span className="text-stone-900 font-bold">{project.name}</span>
            </nav>

            <div className="flex flex-col gap-12 mb-24">
                <MediaShowcase 
                   images={project.images || [project.image]} 
                   videos={project.videos || []} 
                   title={project.name} 
                />
            </div>

            <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24 mb-32 border-t border-stone-100 pt-16">


                {/* Info */}
                <div className="lg:col-span-8">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-6 block">
                        Proyecto Destacado
                    </span>
                    <h1 className="mb-8 text-5xl md:text-7xl font-bold tracking-tighter leading-none text-stone-900">
                        {project.name}
                    </h1>

                    <div className="space-y-6 text-lg leading-relaxed text-stone-600 font-light">
                        <p>{project.description}</p>
                    </div>
                </div>

                <div className="lg:col-span-4 lg:border-l lg:border-stone-100 lg:pl-12">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-900 mb-8 border-b border-stone-100 pb-2">
                        Especificaciones
                    </h3>
                    <div className="grid grid-cols-2 gap-y-10">
                        <div>
                            <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Categoría</span>
                            <p className="font-bold text-stone-900">{project.category}</p>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Localización</span>
                            <p className="font-bold text-stone-900">{project.details[0]?.includes(': ') ? project.details[0].split(': ')[1] : project.details[0]}</p>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Plazo</span>
                            <p className="font-bold text-stone-900">{project.details[1]?.includes(': ') ? project.details[1].split(': ')[1] : project.details[1]}</p>
                        </div>
                        <div>
                            <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Garantía</span>
                            <p className="font-bold text-stone-900">{project.details[2]?.includes(': ') ? project.details[2].split(': ')[1] : '5 Años'}</p>
                        </div>
                    </div>

                    <div className="mt-16">
                        <Link href="/contact" className="inline-block w-full bg-stone-900 text-white text-center py-5 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-stone-800 transition shadow-xl">
                            Solicitar Información
                        </Link>
                    </div>
                </div>
            </div>

            {/* Similar Projects */}
            {similarProjects.length > 0 && (
                <section className="pt-24 border-t border-stone-100">
                    <div className="flex flex-col items-baseline justify-between gap-4 mb-16 md:flex-row">
                        <h2 className="text-4xl font-light tracking-tighter md:text-5xl">Proyectos Similares</h2>
                        <Link href="/proyectos" className="text-xs font-bold tracking-widest uppercase border-b border-stone-900">Ver todos</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {similarProjects.map((p: any) => (
                            <ProjectCard key={p.id} project={p} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}

// SSG
export async function generateStaticParams() {
    const allProjects = await getAllProjects();
    return allProjects.map((project: any) => ({
        id: project.id.toString(),
    }));
}
