import re

with open("src/components/Header.tsx", "r") as f:
    content = f.read()

# Replace the state initialization
new_state = """    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [localSettings, setLocalSettings] = useState(settings || { siteName: "Ebenzer", layout: "default" });
    const [isSaving, setIsSaving] = useState(false);"""

content = re.sub(r'    const \[isDrawerOpen.*?const \[isSaving, setIsSaving\] = useState\(false\);', new_state, content, flags=re.DOTALL)

# Replace handleSaveGlobal payload
content = content.replace("body: JSON.stringify({ siteName: localSiteName })", "body: JSON.stringify({ navbar: localSettings })")

# Replace siteName with localSettings.siteName
content = content.replace("localSiteName", "localSettings.siteName")
content = content.replace("siteName", "localSettings.siteName")

# Add layout switcher UI in the admin panel
admin_panel_replacement = """                    <div className="flex items-center gap-4">
                        {isEditing ? (
                            <div className="flex flex-col gap-2">
                                <input 
                                    value={localSettings.siteName}
                                    onChange={(e) => setLocalSettings({...localSettings, siteName: e.target.value})}
                                    className="text-xl md:text-2xl italic font-black tracking-tighter text-stone-900 uppercase bg-stone-100 border-b border-indigo-500 focus:outline-none px-2 w-32 md:w-48"
                                    placeholder="Nombre del sitio"
                                />
                                <select 
                                    value={localSettings.layout} 
                                    onChange={(e) => setLocalSettings({...localSettings, layout: e.target.value})}
                                    className="text-[10px] uppercase font-bold p-1 bg-stone-200 rounded"
                                >
                                    <option value="default">Logo Izquierda, Links Derecha</option>
                                    <option value="center">Logo Centro</option>
                                    <option value="minimal">Minimalista (Sin links)</option>
                                </select>
                            </div>
                        ) : ("""

content = content.replace("""                    <div className="flex items-center gap-4">
                        {isEditing ? (
                            <input 
                                value={localSettings.siteName}
                                onChange={(e) => setLocalSettings(e.target.value)}
                                className="text-xl md:text-2xl italic font-black tracking-tighter text-stone-900 uppercase bg-stone-100 border-b border-indigo-500 focus:outline-none px-2 w-32 md:w-48"
                            />
                        ) : (""", admin_panel_replacement)

# Apply layout styling logic
layout_logic = """                    {/* Desktop Navigation */}
                    {localSettings.layout !== 'minimal' && (
                    <nav className={`hidden md:block ${localSettings.layout === 'center' ? 'absolute left-1/2 -translate-x-1/2' : ''}`}>"""

content = content.replace("""                    {/* Desktop Navigation */}
                    <nav className="hidden md:block">""", layout_logic)

content = content.replace("                    </nav>", "                    </nav>\n                    )}")

# Apply center layout to logo
content = content.replace("""                        {isAdmin && (""", """                        </div>
                        {isAdmin && (""")
content = content.replace("""                    {/* Logo and Admin Toggle */}
                    <div className="flex items-center gap-4">""", """                    {/* Logo and Admin Toggle */}
                    <div className={`flex items-center gap-4 ${localSettings.layout === 'center' ? 'w-full justify-center absolute inset-0 pointer-events-none' : ''}`}>
                        <div className="pointer-events-auto flex items-center gap-4">""")

with open("src/components/Header.tsx", "w") as f:
    f.write(content)


# --- Update Footer ---
with open("src/components/Footer.tsx", "r") as f:
    f_content = f.read()

new_f_state = """    const [isEditing, setIsEditing] = useState(false);
    const [localSettings, setLocalSettings] = useState(settings || { tagline: "Construyendo el futuro", email: "", phone: "", address: "" });
    const [isSaving, setIsSaving] = useState(false);"""

f_content = re.sub(r'    const \[isEditing.*?const \[isSaving, setIsSaving\] = useState\(false\);', new_f_state, f_content, flags=re.DOTALL)

f_content = f_content.replace("""            const res = await fetch("/api/admin/save-global", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contactEmail: localEmail, whatsappNumber: localPhone })
            });""", """            const res = await fetch("/api/admin/save-global", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ footer: localSettings })
            });""")

f_content = f_content.replace("localEmail", "localSettings.email")
f_content = f_content.replace("setLocalEmail(e.target.value)", "setLocalSettings({...localSettings, email: e.target.value})")

f_content = f_content.replace("localPhone", "localSettings.phone")
f_content = f_content.replace("setLocalPhone(e.target.value)", "setLocalSettings({...localSettings, phone: e.target.value})")

# Add Tagline edit
f_content = f_content.replace("""                        <p className="text-stone-400 text-sm mt-4 md:mt-0 font-light max-w-sm">
                            Creamos espacios que inspiran. Cada proyecto es una oportunidad para redefinir el arte de habitar.
                        </p>""", """                        {isEditing ? (
                            <textarea 
                                value={localSettings.tagline} 
                                onChange={(e) => setLocalSettings({...localSettings, tagline: e.target.value})}
                                className="bg-stone-800 text-white w-full max-w-sm mt-4 md:mt-0 text-sm p-2 rounded"
                            />
                        ) : (
                            <p className="text-stone-400 text-sm mt-4 md:mt-0 font-light max-w-sm">
                                {localSettings.tagline}
                            </p>
                        )}""")


with open("src/components/Footer.tsx", "w") as f:
    f.write(f_content)

