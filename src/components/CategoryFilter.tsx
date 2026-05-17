"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = [
    { label: "TODOS LOS PROYECTOS", value: "Todos" },
    { label: "REFORMAS INTEGRALES", value: "Reformas Integrales" },
    { label: "COCINAS", value: "Cocinas" },
    { label: "BAÑOS", value: "Baños" },
    { label: "COMERCIAL", value: "Espacios Comerciales" },
    { label: "INTERIORISMO", value: "Interiorismo" }
];

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
        <div className="w-full mb-12 border-b border-stone-100 pb-6">
            <div className="flex flex-wrap gap-x-8 gap-y-4">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => handleCategoryClick(cat.value)}
                        className={`text-[11px] tracking-[0.2em] font-bold uppercase transition-all duration-300 relative py-1 ${
                            activeCategory === cat.value
                                ? "text-stone-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-stone-900"
                                : "text-stone-400 hover:text-stone-900"
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
