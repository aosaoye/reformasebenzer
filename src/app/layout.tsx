import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { AdminProvider } from "@/context/AdminContext";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Script from "next/script";
import fs from 'fs/promises';
import path from 'path';

const geist = Inter({
    subsets: ["latin"],
    variable: "--font-geist",
});

export const metadata: Metadata = {
    title: "Reformas Ebenzer | Renovación Integral de Espacios",
    description: "Transformamos tu espacio, mejoramos tu vida. Reformas integrales con diseño, alma y precisión.",
};

import { cookies } from "next/headers";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let globalData: any = {};
    try {
        const dataPath = path.join(process.cwd(), 'src', 'data', 'global.json');
        const fileData = await fs.readFile(dataPath, 'utf-8');
        globalData = JSON.parse(fileData);
    } catch (e) {
        globalData = {
            navbar: { siteName: "Ebenzer", layout: "default" },
            footer: { tagline: "Construyendo el futuro de la arquitectura" },
            theme: { borderRadius: "xl" }
        };
    }

    const token = cookies().get("admin_token");
    const isAdmin = token?.value === "authenticated";

    return (
        <html lang="es" className="scroll-smooth">
            <head>
                <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js" async={false}></script>
                <script noModule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js" async={false}></script>
            </head>
            <body className={`${geist.variable} font-sans antialiased text-stone-900 bg-stone-50`}>
            <AdminProvider isAdmin={isAdmin}>
                <div className="bg-stone-900 text-stone-100 py-4 px-6 text-center text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-medium leading-relaxed">
                    {globalData.navbar?.topBanner || "Presupuestos sin compromiso | Calidad garantizada en toda España"}
                </div>
                <Header settings={globalData.navbar} isAdmin={isAdmin} />
                <main>{children}</main>
                <Footer settings={globalData.footer} isAdmin={isAdmin} />
                <WhatsAppButton phoneNumber={globalData.footer?.whatsappNumber} />
            </AdminProvider>
            </body>
        </html>
    );
}
