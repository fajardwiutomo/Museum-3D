'use client';

import { useStore } from '@/store/useStore';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';

export function DetailModal() {
  const selectedPainting = useStore((state) => state.selectedPainting);
  const setSelectedPainting = useStore((state) => state.setSelectedPainting);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPainting(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedPainting]);

  if (!selectedPainting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative max-w-4xl w-full bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedPainting(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-2/3 bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center p-8 relative">
            <Image 
                src={selectedPainting.url} 
                alt={selectedPainting.title} 
                className="object-contain shadow-lg"
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
            />
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/3 p-8 flex flex-col justify-center border-l border-zinc-200 dark:border-zinc-800">
            <h2 className="text-3xl font-bold font-serif mb-2 text-zinc-900 dark:text-zinc-100">
                {selectedPainting.title}
            </h2>
            <div className="w-12 h-1 bg-indigo-500 mb-6"></div>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg">
                {selectedPainting.description}
            </p>
            
            <div className="mt-auto pt-8 text-sm text-zinc-400">
                <p>Dimensions: {selectedPainting.width}m x {selectedPainting.height}m</p>
            </div>
        </div>
      </div>
    </div>
  );
}
