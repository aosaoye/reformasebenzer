import os
import re

# 1. Create AdminContext
admin_context_code = """"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext({
    isEditing: false,
    setIsEditing: (v: boolean) => {}
});

export function AdminProvider({ children, isAdmin }: { children: React.ReactNode, isAdmin: boolean }) {
    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        if (isAdmin) {
            const saved = localStorage.getItem("eb_is_editing");
            if (saved === "true") setIsEditing(true);
        }
    }, [isAdmin]);

    const handleSetIsEditing = (val: boolean) => {
        setIsEditing(val);
        localStorage.setItem("eb_is_editing", String(val));
    };

    return (
        <AdminContext.Provider value={{ isEditing: isAdmin && isEditing, setIsEditing: handleSetIsEditing }}>
            {isAdmin && (
                <div className="fixed top-0 left-0 right-0 z-[500] bg-stone-900/95 backdrop-blur-xl text-white p-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest shadow-2xl border-b border-stone-700">
                    <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-white text-stone-900 flex items-center justify-center font-black">E</span>
                        <span>Modo Administrador</span>
                    </div>
                    <button 
                        onClick={() => handleSetIsEditing(!isEditing)}
                        className={`px-6 py-2 rounded-full transition-all shadow-xl ${isEditing ? 'bg-red-500 hover:bg-red-400' : 'bg-emerald-500 hover:bg-emerald-400'}`}
                    >
                        {isEditing ? "Desactivar Edición Global" : "Activar Edición Visual"}
                    </button>
                </div>
            )}
            {isAdmin && <div className="h-14"></div>}
            {children}
        </AdminContext.Provider>
    );
}

export const useAdmin = () => useContext(AdminContext);
"""

os.makedirs("src/context", exist_ok=True)
with open("src/context/AdminContext.tsx", "w") as f:
    f.write(admin_context_code)

# 2. Update layout.tsx
with open("src/app/layout.tsx", "r") as f:
    layout_content = f.read()

layout_content = layout_content.replace('import Header from "@/components/Header";', 'import Header from "@/components/Header";\nimport { AdminProvider } from "@/context/AdminContext";')
layout_content = layout_content.replace('<body className={`${plusJakarta.variable} font-sans antialiased text-stone-900 bg-stone-50`}>', '<body className={`${plusJakarta.variable} font-sans antialiased text-stone-900 bg-stone-50`}>\n            <AdminProvider isAdmin={isAdmin}>')
layout_content = layout_content.replace('</body>', '</AdminProvider>\n            </body>')

with open("src/app/layout.tsx", "w") as f:
    f.write(layout_content)

# 3. Update HomeClient.tsx
with open("src/components/HomeClient.tsx", "r") as f:
    home_content = f.read()

home_content = home_content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useAdmin } from "@/context/AdminContext";')
home_content = re.sub(r'const \[isEditing, setIsEditing\] = useState\(false\);\n', '', home_content)
home_content = home_content.replace('export default function HomeClient({ initialData, isAdmin = false }: { initialData: any, isAdmin?: boolean }) {', 'export default function HomeClient({ initialData, isAdmin = false }: { initialData: any, isAdmin?: boolean }) {\n    const { isEditing } = useAdmin();')
# Remove local admin bar
home_content = re.sub(r'\{isAdmin && \(\n\s*<div className="fixed top-0 left-0 right-0 z-\[100\].*?</div>\n\s*\)\}', '', home_content, flags=re.DOTALL)
home_content = re.sub(r'\{isAdmin && <div className="h-16"></div>\}', '', home_content)
# Add floating save button instead of it being in the top bar
save_btn = """{isEditing && (
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="fixed bottom-6 right-6 z-[200] bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-black shadow-2xl transition-all"
                >
                    {isSaving ? "Guardando Home..." : "Guardar Home Page"}
                </button>
            )}"""
home_content = home_content.replace('</main>', f'{save_btn}\n        </main>')

with open("src/components/HomeClient.tsx", "w") as f:
    f.write(home_content)

# 4. Update ServicesClient.tsx
with open("src/components/ServicesClient.tsx", "r") as f:
    services_content = f.read()

services_content = services_content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useAdmin } from "@/context/AdminContext";')
services_content = re.sub(r'const \[isEditing, setIsEditing\] = useState\(false\);\n', '', services_content)
services_content = services_content.replace('export default function ServicesClient({ initialData, isAdmin = false }: { initialData: any, isAdmin?: boolean }) {', 'export default function ServicesClient({ initialData, isAdmin = false }: { initialData: any, isAdmin?: boolean }) {\n    const { isEditing } = useAdmin();')
# Remove local admin bar
services_content = re.sub(r'\{isAdmin && \(\n\s*<div className="fixed top-0 left-0 right-0 z-\[100\].*?</div>\n\s*\)\}', '', services_content, flags=re.DOTALL)
services_content = re.sub(r'\{isAdmin && <div className="h-16"></div>\}', '', services_content)
save_btn_services = """{isEditing && (
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="fixed bottom-6 right-6 z-[200] bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-full text-xs uppercase tracking-widest font-black shadow-2xl transition-all"
                >
                    {isSaving ? "Guardando Servicios..." : "Guardar Servicios"}
                </button>
            )}"""
services_content = services_content.replace('</main>', f'{save_btn_services}\n        </main>')

with open("src/components/ServicesClient.tsx", "w") as f:
    f.write(services_content)

# 5. Update Header.tsx
with open("src/components/Header.tsx", "r") as f:
    header_content = f.read()

header_content = header_content.replace('import { useState, useEffect } from "react";', 'import { useState, useEffect } from "react";\nimport { useAdmin } from "@/context/AdminContext";')
header_content = re.sub(r'const \[isEditing, setIsEditing\] = useState\(false\);\n', '', header_content)
header_content = header_content.replace('export default function Header({ settings, isAdmin }: { settings?: any, isAdmin?: boolean }) {', 'export default function Header({ settings, isAdmin }: { settings?: any, isAdmin?: boolean }) {\n    const { isEditing } = useAdmin();')
# Remove Header 'Editar' button entirely, because global edit is managed globally.
header_content = re.sub(r'\{isAdmin && \(\n\s*<button\s*onClick=\{\(\) => isEditing \? handleSaveGlobal\(\) : setIsEditing\(true\)\}.*?</button>\n\s*\)\}', '', header_content, flags=re.DOTALL)
# Add auto-save when editing finishes? No, add a save button for header next to the inputs
header_save_btn = """{isEditing && (
                            <button onClick={handleSaveGlobal} disabled={isSaving} className="text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-full bg-emerald-500 text-white hover:bg-emerald-400 ml-2">
                                {isSaving ? "..." : "Guardar"}
                            </button>
                        )}"""
header_content = header_content.replace('</div>\n                        ) : (', f'{header_save_btn}\n                        </div>\n                        ) : (')

with open("src/components/Header.tsx", "w") as f:
    f.write(header_content)

# 6. Update Footer.tsx
with open("src/components/Footer.tsx", "r") as f:
    footer_content = f.read()

footer_content = footer_content.replace('import { useEffect, useRef, useState } from "react";', 'import { useEffect, useRef, useState } from "react";\nimport { useAdmin } from "@/context/AdminContext";')
footer_content = re.sub(r'const \[isEditing, setIsEditing\] = useState\(false\);\n', '', footer_content)
footer_content = footer_content.replace('export default function Footer({ settings, isAdmin }: { settings?: any, isAdmin?: boolean }) {', 'export default function Footer({ settings, isAdmin }: { settings?: any, isAdmin?: boolean }) {\n    const { isEditing } = useAdmin();')
footer_content = re.sub(r'\{isAdmin && \(\n\s*<button\s*onClick=\{\(\) => isEditing \? handleSaveGlobal\(\) : setIsEditing\(true\)\}.*?</button>\n\s*\)\}', '', footer_content, flags=re.DOTALL)
footer_save_btn = """{isEditing && (
                                <button onClick={handleSaveGlobal} disabled={isSaving} className="text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-full bg-emerald-500 text-white hover:bg-emerald-400 ml-4 absolute left-full top-0 w-max">
                                    {isSaving ? "Guardando..." : "Guardar Footer"}
                                </button>
                            )}"""
footer_content = footer_content.replace('Conecta con nosotros\n                            </motion.span>', f'Conecta con nosotros\n                            </motion.span>\n                            {footer_save_btn}')

with open("src/components/Footer.tsx", "w") as f:
    f.write(footer_content)

