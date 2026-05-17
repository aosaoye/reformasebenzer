import re
import json

# --- 1. Fix Header.tsx ---
with open("src/components/Header.tsx", "r") as f:
    header_content = f.read()

# Fix the navigation overlapping by moving it to the left when layout is center
header_content = header_content.replace('className={`hidden md:block ${localSettings.layout === \'center\' ? \'absolute left-1/2 -translate-x-1/2\' : \'\'}`}>', 'className={`hidden md:block ${localSettings.layout === \'center\' ? \'order-first\' : \'\'}`}>')

# Make sure the absolute logo has higher z-index but pointer-events-none on wrapper so links are clickable
header_content = header_content.replace('w-full justify-center absolute inset-0 pointer-events-none', 'w-full justify-center absolute inset-0 pointer-events-none z-10')

with open("src/components/Header.tsx", "w") as f:
    f.write(header_content)


# --- 2. Fix Footer.tsx ---
with open("src/components/Footer.tsx", "r") as f:
    footer_content = f.read()

# Add a state for title inside localData
if "footerTitle" not in footer_content:
    footer_content = footer_content.replace('whatsappNumber: initialPhone,', 'whatsappNumber: initialPhone,\n        footerTitle: settings?.footerTitle || "Hablemos de<br />tu <span class=\\"text-stone-300 italic font-light\\">futuro.</span>",')

# Make the title editable
title_editable = """                        {isEditing ? (
                            <textarea 
                                value={localData.footerTitle.replace(/<br \\/>/g, '\\n').replace(/<span.*?>/g, '').replace(/<\\/span>/g, '')}
                                onChange={(e) => setLocalData({...localData, footerTitle: e.target.value.replace(/\\n/g, '<br />')})}
                                className="mb-16 w-full text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter text-stone-900 uppercase bg-stone-100 p-4 rounded-xl"
                                rows={3}
                            />
                        ) : (
                            <h2 
                                className="mb-16 text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter text-stone-900 uppercase"
                                dangerouslySetInnerHTML={{ __html: localData.footerTitle }}
                            />
                        )}"""

footer_content = re.sub(r'<h2 className="mb-16 text-5xl md:text-8xl font-black leading-\[0\.85\] tracking-tighter text-stone-900 uppercase">\s*Hablemos de <br />tu <span className="text-stone-300 italic font-light">futuro\.</span>\s*</h2>', title_editable, footer_content)

with open("src/components/Footer.tsx", "w") as f:
    f.write(footer_content)


# --- 3. Fix Contact.json to include formFields ---
with open("src/data/contact.json", "r") as f:
    contact_data = json.load(f)

if "formFields" not in contact_data:
    contact_data["formFields"] = [
        {"id": "name", "label": "Nombre *", "type": "text", "required": True, "placeholder": "Tu nombre", "width": "half"},
        {"id": "phone", "label": "Teléfono", "type": "text", "required": False, "placeholder": "Tu teléfono", "width": "half"},
        {"id": "email", "label": "Email *", "type": "email", "required": True, "placeholder": "Tu correo electrónico", "width": "full"},
        {"id": "projectType", "label": "Tipo de Proyecto", "type": "select", "options": ["Reforma Integral", "Reforma de Cocina", "Reforma de Baño", "Otros"], "width": "full"},
        {"id": "message", "label": "Mensaje *", "type": "textarea", "required": True, "placeholder": "Cuéntanos un poco más sobre tu idea...", "width": "full"}
    ]
    with open("src/data/contact.json", "w") as f:
        json.dump(contact_data, f, indent=4)


# --- 4. Fix ContactClient.tsx ---
with open("src/components/ContactClient.tsx", "r") as f:
    contact_client = f.read()

# Add handleRemoveOffice
contact_client = contact_client.replace('const updateOffice = (index: number, field: string, value: string) => {', 'const handleRemoveOffice = (index: number) => {\n        const newOffices = localData.offices.filter((_: any, i: number) => i !== index);\n        setLocalData({ ...localData, offices: newOffices });\n    };\n\n    const handleRemoveField = (index: number) => {\n        const newFields = localData.formFields.filter((_: any, i: number) => i !== index);\n        setLocalData({ ...localData, formFields: newFields });\n    };\n\n    const updateOffice = (index: number, field: string, value: string) => {')

# Render dynamic form fields
form_dynamic_render = """                    <form onSubmit={handleSubmit} className="space-y-8 relative">
                        {isEditing && <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-3xl border-4 border-dashed border-indigo-500"><span className="bg-indigo-500 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs">Formulario Estático (Configurar Campos Abajo)</span></div>}
                        
                        <div className="flex flex-wrap gap-8">
                            {localData.formFields?.map((field: any, index: number) => (
                                <div key={field.id} className={`${field.width === 'half' ? 'w-full md:w-[calc(50%-1rem)]' : 'w-full'} relative group`}>
                                    {isEditing && (
                                        <button type="button" onClick={() => handleRemoveField(index)} className="absolute -top-3 -right-3 z-50 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-xl hover:scale-110">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    )}
                                    <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400 mb-2">{field.label}</label>
                                    
                                    {field.type === 'textarea' ? (
                                        <textarea rows={4} placeholder={field.placeholder} className="w-full py-4 text-sm font-medium bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors resize-none" disabled={isEditing}></textarea>
                                    ) : field.type === 'select' ? (
                                        <select className="w-full py-4 text-sm font-medium bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors appearance-none" disabled={isEditing}>
                                            {field.options?.map((opt: string) => <option key={opt}>{opt}</option>)}
                                        </select>
                                    ) : (
                                        <input type={field.type} placeholder={field.placeholder} className="w-full py-4 text-sm font-medium bg-transparent border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors" disabled={isEditing} />
                                    )}
                                </div>
                            ))}
                        </div>"""

contact_client = re.sub(r'<form onSubmit=\{handleSubmit\} className="space-y-8">.*?</form>', form_dynamic_render + '\n                        <button type="button" className="w-full py-6 text-xs font-bold tracking-widest text-white uppercase transition rounded-full shadow-xl bg-stone-900 mt-8">Enviar Solicitud</button>\n                    </form>', contact_client, flags=re.DOTALL)

# Add delete button to offices
office_delete_btn = """                                <div className="w-full relative group">
                                    {isEditing && (
                                        <button onClick={() => handleRemoveOffice(index)} className="absolute -top-2 -right-2 z-50 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-xl">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    )}
                                    {isEditing ? ("""
contact_client = contact_client.replace('<div className="w-full">\n                                    {isEditing ? (', office_delete_btn)

with open("src/components/ContactClient.tsx", "w") as f:
    f.write(contact_client)

