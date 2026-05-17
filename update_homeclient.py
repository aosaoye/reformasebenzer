import re

with open("src/components/HomeClient.tsx", "r") as f:
    content = f.read()

# Add layoutConfig to props
content = content.replace(
    "export default function HomeClient({ projects, homepage, testimonials = [], isAdmin = false }: { projects: any[], homepage: any, testimonials?: any[], isAdmin?: boolean }) {",
    "export default function HomeClient({ projects, homepage, testimonials = [], isAdmin = false, layoutConfig = [] }: { projects: any[], homepage: any, testimonials?: any[], isAdmin?: boolean, layoutConfig?: any[] }) {"
)

# Add local layout state
state_code = """
    const [localLayout, setLocalLayout] = useState(layoutConfig);

    const handleMoveBlock = (index: number, direction: number) => {
        const newLayout = [...localLayout];
        const temp = newLayout[index];
        newLayout[index] = newLayout[index + direction];
        newLayout[index + direction] = temp;
        setLocalLayout(newLayout);
    };

    const handleToggleVisibility = (index: number) => {
        const newLayout = [...localLayout];
        newLayout[index].visible = !newLayout[index].visible;
        setLocalLayout(newLayout);
    };

    const handleSaveLayout = async () => {
        setIsSaving(true);
        try {
            await fetch("/api/admin/save-layout", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ layout: localLayout })
            });
            // Proceed to save homepage fields
"""
content = content.replace("    const handleSave = async () => {\n        setIsSaving(true);\n        try {", state_code)

# Extract main content
main_start = content.find("            {/* Hero Section */}")
main_end = content.find("        </main>")

main_body = content[main_start:main_end]

# Extract each section
sections = {
    "hero": main_body[main_body.find("{/* Hero Section */}"):main_body.find("<BrandTicker />")].strip(),
    "ticker": "<BrandTicker />",
    "projects": main_body[main_body.find('<section className="px-4 md:px-8">'):main_body.find("{/* AI Visualizer Section */}")].strip(),
    "visualizer": main_body[main_body.find("{/* AI Visualizer Section */}"):main_body.find("<TestimonialsGrid")].strip(),
    "testimonials": "<TestimonialsGrid initialTestimonials={testimonials} />",
    "commitment": main_body[main_body.find("{/* Commitment Section */}"):].strip()
}

dynamic_render = """
            {localLayout.map((block: any, index: number) => {
                if (!block.visible && !isEditing) return null;

                let blockContent = null;
                switch (block.id) {
                    case "hero": blockContent = (
                        """ + sections["hero"] + """
                    ); break;
                    case "ticker": blockContent = """ + sections["ticker"] + """; break;
                    case "projects": blockContent = (
                        """ + sections["projects"] + """
                    ); break;
                    case "visualizer": blockContent = (
                        """ + sections["visualizer"] + """
                    ); break;
                    case "testimonials": blockContent = """ + sections["testimonials"] + """; break;
                    case "commitment": blockContent = (
                        """ + sections["commitment"] + """
                    ); break;
                }

                return (
                    <div key={block.id} className={`relative group ${!block.visible ? 'opacity-30 grayscale' : ''}`}>
                        {blockContent}
                        {isEditing && (
                            <div className="absolute top-4 right-4 z-[90] flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/90 backdrop-blur p-2 rounded-xl border border-white/10 shadow-2xl">
                                <button onClick={() => handleMoveBlock(index, -1)} disabled={index === 0} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-700 text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors">⬆️</button>
                                <button onClick={() => handleMoveBlock(index, 1)} disabled={index === localLayout.length - 1} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-700 text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors">⬇️</button>
                                <button onClick={() => handleToggleVisibility(index)} className={`px-4 h-8 rounded-lg flex items-center justify-center text-[10px] uppercase font-bold tracking-widest ml-2 border-l border-stone-700 pl-4 transition-colors ${block.visible ? 'text-white hover:text-red-400' : 'text-stone-400 hover:text-emerald-400'}`}>
                                    {block.visible ? '👁️ Ocultar' : '🚫 Mostrar'}
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
"""

new_content = content[:main_start] + dynamic_render + "\n" + content[main_end:]

with open("src/components/HomeClient.tsx", "w") as f:
    f.write(new_content)
