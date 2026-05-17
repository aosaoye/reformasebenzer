import re

# --- 1. Footer.tsx Address & Hours ---
with open("src/components/Footer.tsx", "r") as f:
    footer_content = f.read()

# Replace localData state initialization in Footer
footer_state = """    const [localData, setLocalData] = useState({
        contactEmail: settings?.contactEmail || initialEmail,
        whatsappNumber: settings?.whatsappNumber || initialPhone,
        footerTitle: settings?.footerTitle || "Hablemos de<br />tu <span class=\\"text-stone-300 italic font-light\\">futuro.</span>",
        address: settings?.address || "Av. de la Innovación 45,<br />28000 Madrid,<br />España",
        hours: settings?.hours || "Horario: 09h - 18h",
    });"""

footer_content = re.sub(r'const \[localData, setLocalData\] = useState\(.*?\}\);', footer_state, footer_content, flags=re.DOTALL)

# Replace static address & hours with editable inputs in Footer
editable_address_hours = """                            <div className="flex flex-col gap-10">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Atención</h4>
                                <ul className="flex flex-col gap-5 text-sm font-medium text-stone-500">
                                    {isEditing ? (
                                        <div className="flex flex-col gap-2 relative z-50">
                                            <textarea 
                                                value={localData.address.replace(/<br \\/>/g, '\\n')}
                                                onChange={(e) => setLocalData({...localData, address: e.target.value.replace(/\\n/g, '<br />')})}
                                                className="bg-stone-200 text-stone-900 w-full p-2 text-xs rounded border border-indigo-500 focus:outline-none"
                                                rows={3}
                                                placeholder="Dirección"
                                            />
                                            <input 
                                                value={localData.hours}
                                                onChange={(e) => setLocalData({...localData, hours: e.target.value})}
                                                className="bg-stone-200 text-stone-900 w-full p-2 text-xs rounded border border-indigo-500 focus:outline-none font-bold"
                                                placeholder="Horario"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <li className="leading-[2]" dangerouslySetInnerHTML={{ __html: localData.address }} />
                                            <li className="pt-6 font-black text-stone-900 text-[10px] tracking-[0.2em] uppercase">{localData.hours}</li>
                                        </>
                                    )}
                                </ul>
                            </div>"""

footer_content = re.sub(r'<div className="flex flex-col gap-10">\s*<h4 className="text-\[10px\] font-bold uppercase tracking-\[0\.4em\] text-stone-400">Atención</h4>\s*<ul className="flex flex-col gap-5 text-sm font-medium text-stone-500">.*?</ul>\s*</div>', editable_address_hours, footer_content, flags=re.DOTALL)

with open("src/components/Footer.tsx", "w") as f:
    f.write(footer_content)


# --- 2. ContactClient.tsx Add Fields & Contact Cards ---
with open("src/components/ContactClient.tsx", "r") as f:
    contact_content = f.read()

# Add new states at the top of ContactClient
new_states = """    const [newField, setNewField] = useState({ label: "", type: "text", width: "full", placeholder: "", options: "" });
    const [newOffice, setNewOffice] = useState({ title: "", value: "", icon: "map" });

    const handleAddField = () => {
        if (!newField.label) return;
        const fieldId = `field_${Date.now()}`;
        const field: any = {
            id: fieldId,
            label: newField.label,
            type: newField.type,
            width: newField.width,
            placeholder: newField.placeholder || newField.label,
            required: false
        };
        if (newField.type === 'select') {
            field.options = newField.options.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
        setLocalData({
            ...localData,
            formFields: [...(localData.formFields || []), field]
        });
        setNewField({ label: "", type: "text", width: "full", placeholder: "", options: "" });
    };

    const handleAddOffice = () => {
        if (!newOffice.title || !newOffice.value) return;
        const officeId = `office_${Date.now()}`;
        setLocalData({
            ...localData,
            offices: [...localData.offices, { ...newOffice, id: officeId }]
        });
        setNewOffice({ title: "", value: "", icon: "map" });
    };"""

contact_content = contact_content.replace("    const router = useRouter();", "    const router = useRouter();\n" + new_states)

# Add UI for Add Field and Add Office
add_office_ui = """                        {isEditing && (
                            <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl mt-8">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">Añadir Nueva Tarjeta de Contacto</h4>
                                <div className="space-y-4">
                                    <input value={newOffice.title} onChange={(e) => setNewOffice({...newOffice, title: e.target.value})} placeholder="Título (ej: Oficina Central)" className="w-full bg-white p-3 rounded-xl border border-indigo-100 text-xs focus:outline-none" />
                                    <input value={newOffice.value} onChange={(e) => setNewOffice({...newOffice, value: e.target.value})} placeholder="Valor (ej: Dirección, Email o Teléfono)" className="w-full bg-white p-3 rounded-xl border border-indigo-100 text-xs focus:outline-none" />
                                    <select value={newOffice.icon} onChange={(e) => setNewOffice({...newOffice, icon: e.target.value})} className="w-full bg-white p-3 rounded-xl border border-indigo-100 text-xs focus:outline-none">
                                        <option value="map">Icono Mapa</option>
                                        <option value="mail">Icono Email</option>
                                        <option value="phone">Icono Teléfono</option>
                                    </select>
                                    <button onClick={handleAddOffice} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all shadow-md">Agregar Tarjeta</button>
                                </div>
                            </div>
                        )}"""

contact_content = contact_content.replace("                    </div>\n                </div>\n\n                <div className=\"p-10", add_office_ui + "\n                    </div>\n                </div>\n\n                <div className=\"p-10")

add_field_ui = """                    </form>
                    
                    {isEditing && (
                        <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl mt-8 relative z-50">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">Añadir Campo al Formulario</h4>
                            <div className="space-y-4">
                                <input value={newField.label} onChange={(e) => setNewField({...newField, label: e.target.value})} placeholder="Etiqueta del Campo (ej: Asunto *)" className="w-full bg-white p-3 rounded-xl border border-indigo-100 text-xs focus:outline-none" />
                                <input value={newField.placeholder} onChange={(e) => setNewField({...newField, placeholder: e.target.value})} placeholder="Placeholder / Ejemplo" className="w-full bg-white p-3 rounded-xl border border-indigo-100 text-xs focus:outline-none" />
                                <div className="grid grid-cols-2 gap-4">
                                    <select value={newField.type} onChange={(e) => setNewField({...newField, type: e.target.value})} className="bg-white p-3 rounded-xl border border-indigo-100 text-xs focus:outline-none">
                                        <option value="text">Texto Corto</option>
                                        <option value="email">Email</option>
                                        <option value="textarea">Texto Largo (Textarea)</option>
                                        <option value="select">Opciones (Dropdown)</option>
                                    </select>
                                    <select value={newField.width} onChange={(e) => setNewField({...newField, width: e.target.value})} className="bg-white p-3 rounded-xl border border-indigo-100 text-xs focus:outline-none">
                                        <option value="full">Ancho Completo</option>
                                        <option value="half">Medio Ancho</option>
                                    </select>
                                </div>
                                {newField.type === 'select' && (
                                    <input value={newField.options} onChange={(e) => setNewField({...newField, options: e.target.value})} placeholder="Opciones separadas por comas (ej: Opción 1, Opción 2)" className="w-full bg-white p-3 rounded-xl border border-indigo-100 text-xs focus:outline-none" />
                                )}
                                <button onClick={handleAddField} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all shadow-md">Agregar Campo</button>
                            </div>
                        </div>
                    )}"""

contact_content = contact_content.replace("                    </form>", add_field_ui)

with open("src/components/ContactClient.tsx", "w") as f:
    f.write(contact_content)


# --- 3. HomeClient.tsx Spacers ---
with open("src/components/HomeClient.tsx", "r") as f:
    home_content = f.read()

# Add handleUpdateSpacerHeight function
home_content = home_content.replace("const handleMoveBlock = (index: number, direction: number) => {", "const handleUpdateSpacerHeight = (index: number, height: number) => {\n        const newLayout = [...localLayout];\n        newLayout[index] = { ...newLayout[index], height };\n        setLocalLayout(newLayout);\n    };\n\n    const handleMoveBlock = (index: number, direction: number) => {")

# Add switch case for spacer
spacer_case = """                    case "spacer": blockContent = (
                        <div className={`w-full relative ${isEditing ? 'border-y border-dashed border-indigo-300 bg-indigo-50/20 py-4' : ''}`} style={{ height: `${block.height || 80}px` }}>
                            {isEditing && (
                                <div className="absolute inset-0 flex items-center justify-center gap-4 text-xs font-bold text-indigo-500 bg-indigo-500/5 select-none">
                                    <span>Espacio Invisible ({block.height || 80}px)</span>
                                    <input 
                                        type="range" min="20" max="300" step="10"
                                        value={block.height || 80} 
                                        onChange={(e) => handleUpdateSpacerHeight(index, parseInt(e.target.value))}
                                        className="w-32 accent-indigo-500" 
                                    />
                                </div>
                            )}
                        </div>
                    ); break;"""

home_content = home_content.replace('                    case "ticker": blockContent = <BrandTicker />; break;', '                    case "ticker": blockContent = <BrandTicker />; break;\n' + spacer_case)

# Add spacer button to add block UI
home_content = home_content.replace('<button onClick={() => handleAddBlock(\'commitment\')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Compromiso</button>', '<button onClick={() => handleAddBlock(\'commitment\')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Compromiso</button>\n                        <button onClick={() => handleAddBlock(\'spacer\')} className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold transition-colors">Espacio Invisible</button>')

with open("src/components/HomeClient.tsx", "w") as f:
    f.write(home_content)

