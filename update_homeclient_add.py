import re

with open("src/components/HomeClient.tsx", "r") as f:
    content = f.read()

# Add handleAddBlock function
add_block_code = """
    const handleAddBlock = (type: string) => {
        const newBlock = { id: `${type.toLowerCase()}_${Date.now()}`, type: type, visible: true };
        setLocalLayout([...localLayout, newBlock]);
    };

    const handleRemoveBlock = (index: number) => {
        const newLayout = localLayout.filter((_: any, i: number) => i !== index);
        setLocalLayout(newLayout);
    };

    const handleSave = async () => {
"""

content = content.replace("    const handleSave = async () => {", add_block_code)

# Add remove button to block overlay
remove_button_code = """<button onClick={() => handleToggleVisibility(index)} className={`px-4 h-8 rounded-lg flex items-center justify-center text-[10px] uppercase font-bold tracking-widest ml-2 border-l border-stone-700 pl-4 transition-colors ${block.visible ? 'text-white hover:text-red-400' : 'text-stone-400 hover:text-emerald-400'}`}>
                                    {block.visible ? '👁️ Ocultar' : '🚫 Mostrar'}
                                </button>
                                <button onClick={() => handleRemoveBlock(index)} className="px-3 h-8 rounded-lg flex items-center justify-center hover:bg-red-500 text-white text-[10px] uppercase font-bold tracking-widest ml-2 border-l border-stone-700 pl-4 transition-colors">
                                    Eliminar
                                </button>"""

content = content.replace("""<button onClick={() => handleToggleVisibility(index)} className={`px-4 h-8 rounded-lg flex items-center justify-center text-[10px] uppercase font-bold tracking-widest ml-2 border-l border-stone-700 pl-4 transition-colors ${block.visible ? 'text-white hover:text-red-400' : 'text-stone-400 hover:text-emerald-400'}`}>
                                    {block.visible ? '👁️ Ocultar' : '🚫 Mostrar'}
                                </button>""", remove_button_code)


# Add block adder UI at the end of the map
add_ui_code = """
            {isEditing && (
                <div className="mx-auto max-w-xl text-center mt-24 mb-32 p-8 border-2 border-dashed border-stone-300 rounded-3xl">
                    <p className="text-[10px] uppercase font-black tracking-widest text-stone-400 mb-6">Añadir Nueva Sección</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => handleAddBlock('hero')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Hero Principal</button>
                        <button onClick={() => handleAddBlock('ticker')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Marcas</button>
                        <button onClick={() => handleAddBlock('projects')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Carrusel Proyectos</button>
                        <button onClick={() => handleAddBlock('visualizer')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Visor 3D</button>
                        <button onClick={() => handleAddBlock('testimonials')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Testimonios</button>
                        <button onClick={() => handleAddBlock('commitment')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Compromiso</button>
                    </div>
                </div>
            )}
        </main>
"""

content = content.replace("        </main>", add_ui_code)

# Ensure the block rendering maps block.type, not block.id!
content = content.replace("switch (block.id) {", "switch (block.type || block.id) {")

with open("src/components/HomeClient.tsx", "w") as f:
    f.write(content)

