with open("src/components/ServicesClient.tsx", "r") as f:
    content = f.read()

# Add borderRadius input to Header Editor
input_replacement = """                {isEditing ? (
                    <div className="flex flex-col gap-2 mb-10">
                        <input value={localData.header.title1} onChange={(e) => handleUpdateHeader("title1", e.target.value)} className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-stone-900 bg-stone-100 w-full text-center p-2 rounded-lg" />
                        <input value={localData.header.titleHighlight} onChange={(e) => handleUpdateHeader("titleHighlight", e.target.value)} className="text-5xl md:text-8xl font-light italic tracking-tighter leading-none text-stone-300 bg-stone-100 w-full text-center p-2 rounded-lg" />
                        <input value={localData.header.title2} onChange={(e) => handleUpdateHeader("title2", e.target.value)} className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-stone-900 bg-stone-100 w-full text-center p-2 rounded-lg" />
                        
                        <div className="mt-8 bg-stone-100 p-4 rounded-xl">
                            <label className="text-xs uppercase font-bold tracking-widest text-stone-500 mb-2 block">Redondeo de Imágenes (px)</label>
                            <input 
                                type="range" min="0" max="100" 
                                value={localData.header.borderRadius || 32} 
                                onChange={(e) => handleUpdateHeader("borderRadius", e.target.value)} 
                                className="w-full" 
                            />
                        </div>
                    </div>
                ) : ("""

content = content.replace("""                {isEditing ? (
                    <div className="flex flex-col gap-2 mb-10">
                        <input value={localData.header.title1} onChange={(e) => handleUpdateHeader("title1", e.target.value)} className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-stone-900 bg-stone-100 w-full text-center p-2 rounded-lg" />
                        <input value={localData.header.titleHighlight} onChange={(e) => handleUpdateHeader("titleHighlight", e.target.value)} className="text-5xl md:text-8xl font-light italic tracking-tighter leading-none text-stone-300 bg-stone-100 w-full text-center p-2 rounded-lg" />
                        <input value={localData.header.title2} onChange={(e) => handleUpdateHeader("title2", e.target.value)} className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-stone-900 bg-stone-100 w-full text-center p-2 rounded-lg" />
                    </div>
                ) : (""", input_replacement)

# Apply border radius
content = content.replace('className="aspect-[4/5] md:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl relative group"', 'className="aspect-[4/5] md:aspect-[4/3] overflow-hidden shadow-2xl relative group" style={{ borderRadius: `${localData.header.borderRadius || 32}px` }}')

with open("src/components/ServicesClient.tsx", "w") as f:
    f.write(content)
