"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";

export default function ContactClient({ initialData }: { initialData: any }) {
    const { isEditing, setIsEditing } = useAdmin();
    const [localData, setLocalData] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();
    const [newField, setNewField] = useState({ label: "", type: "text", width: "full", placeholder: "", options: "" });
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
    };

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        projectType: "Reforma Integral",
        message: ""
    });
    const [status, setStatus] = useState<{
        loading: boolean;
        success?: boolean;
        message?: string;
    }>({ loading: false });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ loading: true });

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Algo salió mal al enviar el formulario.");
            }

            setStatus({
                loading: false,
                success: true,
                message: "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto."
            });

            setFormData({
                name: "",
                phone: "",
                email: "",
                projectType: "Reforma Integral",
                message: ""
            });
        } catch (error: any) {
            setStatus({
                loading: false,
                success: false,
                message: error.message || "Error de conexión. Inténtalo de nuevo."
            });
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/save-contact", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(localData)
            });
            const result = await res.json();
            if (result.success) {
                alert("Contacto guardado con éxito.");
                router.refresh();
            } else {
                alert("Error al guardar: " + result.message);
            }
        } catch (error) {
            alert("Error de conexión");
        } finally {
            setIsSaving(false);
        }
    };

    const updateHeader = (field: string, value: string) => {
        setLocalData({ ...localData, header: { ...localData.header, [field]: value } });
    };

    const handleRemoveOffice = (index: number) => {
        const newOffices = localData.offices.filter((_: any, i: number) => i !== index);
        setLocalData({ ...localData, offices: newOffices });
    };

    const handleRemoveField = (index: number) => {
        const newFields = localData.formFields.filter((_: any, i: number) => i !== index);
        setLocalData({ ...localData, formFields: newFields });
    };

    const updateOffice = (index: number, field: string, value: string) => {
        const newOffices = [...localData.offices];
        newOffices[index][field] = value;
        setLocalData({ ...localData, offices: newOffices });
    };

    return (
        <main className={`px-6 py-12 mt-20 mx-auto max-w-7xl animate-in fade-in duration-500 ${isEditing ? 'ring-4 ring-indigo-500/50 rounded-3xl p-8 my-8 relative' : ''}`}>
            {isEditing && (
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="absolute -top-6 right-6 z-[200] bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest font-black shadow-2xl transition-all"
                >
                    {isSaving ? "Guardando Contacto..." : "Guardar Contacto"}
                </button>
            )}
            
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
                <div>
                    {isEditing ? (
                        <input
                            value={localData.header.title}
                            onChange={(e) => updateHeader('title', e.target.value)}
                            className="mb-6 text-4xl font-bold tracking-tight w-full bg-stone-100 p-2 rounded-lg"
                        />
                    ) : (
                        <h2 
                            className="mb-6 text-4xl font-bold tracking-tight text-stone-900"
                            dangerouslySetInnerHTML={{ __html: localData.header.title }}
                        />
                    )}
                    
                    {isEditing ? (
                        <textarea
                            value={localData.header.description}
                            onChange={(e) => updateHeader('description', e.target.value)}
                            className="mb-12 text-stone-500 leading-relaxed text-lg font-light w-full bg-stone-100 p-4 rounded-xl"
                            rows={4}
                        />
                    ) : (
                        <p className="mb-12 text-stone-500 leading-relaxed text-lg font-light">
                            {localData.header.description}
                        </p>
                    )}

                    <div className="space-y-8">
                        {localData.offices.map((office: any, index: number) => (
                            <div key={office.id} className="flex items-start gap-6">
                                <div className="flex items-center justify-center p-4 rounded-full bg-stone-100 w-14 h-14 shrink-0">
                                    {office.icon === 'map' && <ion-icon name="pin-outline" style={{ fontSize: '24px', color: '#57534e' }}></ion-icon>}
                                    {office.icon === 'mail' && <ion-icon name="mail-outline" style={{ fontSize: '24px', color: '#57534e' }}></ion-icon>}
                                    {office.icon === 'phone' && <ion-icon name="call-outline" style={{ fontSize: '24px', color: '#57534e' }}></ion-icon>}
                                </div>
                                                                <div className="w-full relative group">
                                    {isEditing && (
                                        <button onClick={() => handleRemoveOffice(index)} className="absolute -top-2 -right-2 z-50 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-xl">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    )}
                                    {isEditing ? (
                                        <>
                                            <input value={office.title} onChange={(e) => updateOffice(index, 'title', e.target.value)} className="text-sm font-bold tracking-widest uppercase mb-1 block w-full bg-stone-100 p-1" />
                                            <input value={office.value} onChange={(e) => updateOffice(index, 'value', e.target.value)} className="text-sm text-stone-500 font-light block w-full bg-stone-100 p-1" />
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-sm font-bold tracking-widest uppercase mb-1">{office.title}</h3>
                                            <p className="text-sm text-stone-500 font-light">{office.value}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isEditing && (
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
                        )}
                    </div>
                </div>

                <div className="p-10 bg-white border rounded-3xl border-stone-100 shadow-2xl shadow-stone-200/40 relative overflow-hidden">
                                        <form onSubmit={handleSubmit} className="space-y-8 relative">
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
                        </div>
                        <button type="button" className="w-full py-6 text-xs font-bold tracking-widest text-white uppercase transition rounded-full shadow-xl bg-stone-900 mt-8">Enviar Solicitud</button>
                    </form>
                    
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
                    )}
                </div>
            </div>
        </main>
    );
}
