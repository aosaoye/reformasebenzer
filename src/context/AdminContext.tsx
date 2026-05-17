"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext({
    isEditing: false,
    setIsEditing: (v: boolean) => {}
});

export function AdminProvider({ children, isAdmin }: { children: React.ReactNode, isAdmin: boolean }) {
    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        if (isAdmin) {
            const params = new URLSearchParams(window.location.search);
            if (params.get("edit") === "true") {
                handleSetIsEditing(true);
                // Limpiar parámetro de la URL de forma limpia
                const url = new URL(window.location.href);
                url.searchParams.delete("edit");
                window.history.replaceState({}, "", url.toString());
            } else {
                const saved = localStorage.getItem("eb_is_editing");
                if (saved === "true") setIsEditing(true);
            }
        }
    }, [isAdmin]);

    const handleSetIsEditing = (val: boolean) => {
        setIsEditing(val);
        localStorage.setItem("eb_is_editing", String(val));
    };

    const handleLogout = async () => {
        if (isEditing) {
            const confirmLogout = window.confirm(
                "¡Atención! Tienes el Modo Edición activo. Si cierras sesión ahora, se perderán todos los cambios que no hayas guardado con el botón 'Guardar'.\n\n¿Estás seguro de que quieres salir sin guardar?"
            );
            if (!confirmLogout) return;
        }
        try {
            await fetch("/api/admin/logout", { method: "POST" });
            localStorage.removeItem("eb_is_editing");
            window.location.reload();
        } catch (error) {
            alert("Error al cerrar sesión");
        }
    };

    return (
        <AdminContext.Provider value={{ isEditing: isAdmin && isEditing, setIsEditing: handleSetIsEditing }}>
            {isAdmin && <div className="h-14"></div>}
            {children}
            {isAdmin && (
                <div 
                    className="fixed top-0 left-0 right-0 p-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest shadow-2xl border-b border-stone-850"
                    style={{ backgroundColor: '#1c1917', color: '#ffffff', zIndex: 99999, transform: 'translate3d(0,0,0)' }}
                >
                    <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full flex items-center justify-center font-black" style={{ backgroundColor: '#ffffff', color: '#1c1917' }}>E</span>
                        <span style={{ color: '#ffffff' }}>Modo Administrador</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => handleSetIsEditing(!isEditing)}
                            className="px-6 py-2 rounded-full transition-all shadow-xl font-bold"
                            style={{ 
                                backgroundColor: isEditing ? '#6366f1' : '#10b981', 
                                color: '#ffffff' 
                            }}
                        >
                            {isEditing ? "Vista Previa" : "Activar Edición Visual"}
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="px-6 py-2 border rounded-full transition-all text-[9px] font-black uppercase tracking-wider flex items-center gap-2"
                            style={{ 
                                backgroundColor: '#2e2a24', 
                                color: '#ffffff', 
                                borderColor: 'rgba(255,255,255,0.15)' 
                            }}
                        >
                            Cerrar Sesión
                            <ion-icon name="log-out-outline" style={{ fontSize: '12px' }}></ion-icon>
                        </button>
                    </div>
                </div>
            )}
        </AdminContext.Provider>
    );
}

export const useAdmin = () => useContext(AdminContext);
