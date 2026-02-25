import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Script from "next/script";

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
    title: "Reformas Ebenzer | Renovación Integral de Espacios",
    description: "Transformamos tu espacio, mejoramos tu vida. Reformas integrales con diseño, alma y precisión.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className="scroll-smooth">
            <body className={`${plusJakarta.variable} font-sans antialiased text-stone-900 bg-stone-50`}>
                <div className="bg-stone-900 text-stone-100 py-4 px-6 text-center text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-medium leading-relaxed">
                    Presupuestos sin compromiso | Calidad garantizada en toda España
                </div>
                <Header />
                <main>{children}</main>
                <Footer />
                <WhatsAppButton />

                {/* Scripts for Ionicons */}
                <Script
                    src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
                    type="module"
                />
                <Script
                    src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
                    noModule
                />
            </body>
        </html>
    );
}
