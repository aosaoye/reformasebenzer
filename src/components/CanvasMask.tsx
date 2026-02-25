"use client";

import { useRef, useEffect, useState } from "react";

interface CanvasMaskProps {
    imageUrl: string;
    onConfirm: (maskBase64: string) => void;
    onCancel: () => void;
}

export default function CanvasMask({ imageUrl, onConfirm, onCancel }: CanvasMaskProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(40);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        img.onload = () => {
            // Scale canvas to fit image aspect ratio while keeping width manageable
            const maxWidth = 800;
            const scale = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * scale;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Initialize mask layer (invisible but we'll track strokes)
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; // White semi-transparent
            ctx.lineWidth = brushSize;
        };
    }, [imageUrl]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) ctx.beginPath();
        }
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.globalCompositeOperation = "source-over";
        ctx.lineWidth = brushSize;
        ctx.lineTo(x, y);
        ctx.stroke();
        // Highlight effect
        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(45, 211, 255, 0.3)";
        ctx.fill();
        ctx.moveTo(x, y);
    };

    const handleConfirm = () => {
        onConfirm(canvasRef.current?.toDataURL() || "");
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative border-4 border-stone-100 rounded-2xl overflow-hidden bg-stone-50 cursor-crosshair shadow-2xl">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="max-w-full h-auto"
                />
                <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] uppercase font-bold tracking-widest">
                    Selecciona las áreas a reformar
                </div>
            </div>

            <div className="flex items-center gap-8 bg-white p-6 rounded-2xl border border-stone-100 shadow-xl">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase text-stone-400">Pincel</span>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-32 accent-stone-900 h-1"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 rounded-xl border border-stone-100 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-50 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-8 py-3 rounded-xl bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 transition shadow-lg shadow-stone-200"
                    >
                        Confirmar Selección
                    </button>
                </div>
            </div>
        </div>
    );
}
