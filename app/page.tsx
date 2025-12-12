'use client';

import dynamic from 'next/dynamic';
import { DetailModal } from '@/components/ui/DetailModal';
import { MousePointer2, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { WebGLErrorBoundary } from '@/components/ui/WebGLErrorBoundary';

const Scene = dynamic(() => import('@/components/3d/Scene').then(mod => mod.Scene), { ssr: false });
import { useStore } from '@/store/useStore';

export default function Home() {
  const selectedPainting = useStore((state) => state.selectedPainting);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      <WebGLErrorBoundary>
        {/* 3D Scene */}
        <Scene />
      </WebGLErrorBoundary>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-8">
        {/* Header */}
        <div className="flex justify-between items-start pointer-events-auto">
            <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg text-white">
                <h1 className="text-2xl font-bold">Virtual Museum</h1>
                <p className="text-sm opacity-70">Experience art in a new dimension</p>
            </div>
            
             <Link 
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors border border-white/10"
             >
                <LayoutDashboard className="w-4 h-4" />
                <span>Manage Gallery</span>
            </Link>
        </div>

        {/* Instructions / Crosshair */}
        {!selectedPainting && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-2 h-2 bg-white/80 rounded-full shadow-lg shadow-black/50" />
            </div>
        )}

        {/* Footer Controls */}
        <div className="pointer-events-auto self-start">
             <div className="bg-black/40 backdrop-blur-md p-4 rounded-lg text-white text-sm space-y-2">
                <div className="flex items-center gap-3">
                    <span className="kb-key">W</span><span className="kb-key">A</span><span className="kb-key">S</span><span className="kb-key">D</span>
                    <span className="opacity-70">to Move</span>
                </div>
                <div className="flex items-center gap-3">
                     <MousePointer2 className="w-4 h-4" />
                     <span className="opacity-70">Click to Lock View / Interact</span>
                </div>
                <div className="flex items-center gap-3">
                     <span className="kb-key">ESC</span>
                     <span className="opacity-70">to Unlock Cursor</span>
                </div>
            </div>
        </div>
      </div>

      {/* Modals */}
      <DetailModal />
      
      <style jsx global>{`
        .kb-key {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
            height: 24px;
            padding: 0 6px;
            border-radius: 4px;
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            font-size: 12px;
            font-weight: 600;
        }
      `}</style>
    </main>
  );
}
