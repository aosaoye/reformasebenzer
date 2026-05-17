"use client";

import { useSearchParams } from "next/navigation";

interface AdminEditButtonProps {
    documentId?: string;
    collectionType: string;
    label?: string;
}

export default function AdminEditButton({ documentId, collectionType, label = "Editar" }: AdminEditButtonProps) {
    const searchParams = useSearchParams();
    const isEditMode = searchParams.get("edit") === "true";

    if (!isEditMode) return null;

    // Obtener la URL de Strapi desde las variables de entorno (solo funciona en cliente si tiene NEXT_PUBLIC_)
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL?.replace("/api", "") || "https://superb-ants-9c3577cf0d.strapiapp.com";
    
    // Construir la URL de edición para Strapi 5
    // El formato suele ser: /admin/content-manager/collection-types/api::nombre.nombre/id
    const editUrl = `${strapiUrl}/admin/content-manager/collection-types/api::${collectionType}.${collectionType}/${documentId || ''}`;

    return (
        <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 z-[50] flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-stone-800 transition-all border border-white/20 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
        >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {label}
        </a>
    );
}
