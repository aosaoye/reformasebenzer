"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = ["Todos", "Reformas Integrales", "Cocinas", "Baños", "Espacios Comerciales", "Interiorismo"];

export default function CategoryFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("categoria") || "Todos";

    const handleCategoryClick = (cat: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (cat === "Todos") {
            params.delete("categoria");
        } else {
            params.set("categoria", cat);
        }
        router.push(`/proyectos?${params.toString()}`, { scroll: false });
    };

    return (
        <aside className="w-full lg:w-64">
            <div className="sticky top-32">
                <h3 className="mb-8 text-[10px] font-bold tracking-[0.3em] uppercase text-stone-900 border-b border-stone-100 pb-2">
                    Categorías
                </h3>
                <ul className="space-y-4">
                    {categories.map((cat) => (
                        <li key={cat}>
                            <button
                                onClick={() => handleCategoryClick(cat)}
                                className={`text-xs uppercase tracking-widest transition-all hover:translate-x-1 ${activeCategory === cat
                                    ? "text-stone-900 font-bold"
                                    : "text-stone-400 hover:text-stone-900"
                                    }`}
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
