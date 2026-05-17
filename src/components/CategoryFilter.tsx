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
        <div className="w-full mb-12">
            <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => handleCategoryClick(cat.value)}
                        className={`text-[10px] tracking-[0.15em] font-bold px-5 py-2.5 rounded-full transition-all duration-300 ${
                            activeCategory === cat.value
                                ? "bg-stone-900 text-white border border-stone-900"
                                : "bg-transparent border border-stone-200 text-stone-500 hover:text-stone-900 hover:border-stone-900"
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
