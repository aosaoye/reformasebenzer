"use client";

import { useState } from 'react';
import Image from 'next/image';

interface MediaShowcaseProps {
  images: string[];
  videos: string[];
  title: string;
}

export default function MediaShowcase({ images, videos, title }: MediaShowcaseProps) {
  const [activeVideo, setActiveVideo] = useState(0);

  return (
    <div className="space-y-12">
      {/* Videos Section - Carousel style if 2 videos */}
      {videos && videos.length > 0 && (
        <div className="w-full">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-6">Recorrido Virtual</h3>
          <div className="relative rounded-[2rem] overflow-hidden aspect-video shadow-2xl bg-black">
            <video 
              key={videos[activeVideo]} 
              controls 
              autoPlay 
              muted 
              loop 
              className="w-full h-full object-cover"
            >
              <source src={videos[activeVideo]} type="video/mp4" />
              Tu navegador no soporta el tag de video.
            </video>
            
            {/* Minimal Navigation dots if 2 videos exist */}
            {videos.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                {videos.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveVideo(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${activeVideo === idx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                    aria-label={`Ver video ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Beautiful Collage Section for up to 5 images */}
      <div>
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400 mb-6">Galería Fotográfica</h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Wide Image */}
          {images[0] && (
            <div className="md:col-span-12 aspect-[4/3] md:aspect-[21/9] relative overflow-hidden rounded-[2rem] group">
              <Image 
                src={images[0]} 
                alt={`${title} - Principal`} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          )}

          {/* Sub Images Grid based on count */}
          {images.length > 1 && (
            <>
              {images[1] && (
                <div className={`${images.length === 2 ? 'md:col-span-12' : images.length === 3 ? 'md:col-span-6' : 'md:col-span-8'} aspect-video md:aspect-auto md:h-[400px] relative overflow-hidden rounded-[2rem] group`}>
                  <Image 
                    src={images[1]} 
                    alt={`${title} - 2`} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              {images[2] && (
                <div className={`${images.length === 3 ? 'md:col-span-6' : 'md:col-span-4'} aspect-square md:aspect-auto md:h-[400px] relative overflow-hidden rounded-[2rem] group`}>
                  <Image 
                    src={images[2]} 
                    alt={`${title} - 3`} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
            </>
          )}

          {images.length > 3 && (
            <>
              {images[3] && (
                <div className="md:col-span-6 aspect-video relative overflow-hidden rounded-[2rem] group">
                   <Image 
                    src={images[3]} 
                    alt={`${title} - 4`} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              {images[4] && (
                <div className="md:col-span-6 aspect-video relative overflow-hidden rounded-[2rem] group">
                   <Image 
                    src={images[4]} 
                    alt={`${title} - 5`} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
