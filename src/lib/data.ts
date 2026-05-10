export interface Project {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    details: string[];
}

export const projects: Project[] = [];

const categories = [
    "Reformas Integrales",
    "Cocinas",
    "Baños",
    "Espacios Comerciales",
    "Aire Acondicionado",
    "Interiorismo",
];

const categoryImages: Record<string, string[]> = {
    "Reformas Integrales": [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1000"
    ],
    "Cocinas": [
        "https://images.unsplash.com/photo-1556911223-e4520288df81?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1000"
    ],
    "Baños": [
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1620626011761-9963d7521576?auto=format&fit=crop&q=80&w=1000"
    ],
    "Espacios Comerciales": [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000"
    ],
    "Interiorismo": [
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1616489953149-80862024cc54?auto=format&fit=crop&q=80&w=1000"
    ],
    "Aire Acondicionado": [
        "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=1000"
    ]
};

const locations = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao", "Málaga"];
const styles = ["Minimalista", "Industrial", "Clásico", "Nórdico", "Rústico Moderno"];

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Handcrafted mock database retired. Now loading dynamic data from Strapi backend!
export const projects: Project[] = [];
