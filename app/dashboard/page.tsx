'use client';

import { useStore, Painting } from '@/store/useStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Image as ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function Dashboard() {
  const paintings = useStore((state) => state.paintings);
  const addPainting = useStore((state) => state.addPainting);
  const removePainting = useStore((state) => state.removePainting);

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;

    // Simple auto-positioning logic: place it alternatively on left/right walls based on index
    // This is a naive implementation for the demo.
    const count = paintings.length;
    // Simple placement logic
    
    // Position logic:
    // Left wall: x = -4.9, rotation = [0, PI/2, 0]
    // Right wall: x = 4.9, rotation = [0, -PI/2, 0]
    
    // We already have 3 defaults. Let's just stack them.
    // Let's place new ones on the back wall or continuing side walls.
    // For simplicity, let's just place them randomly or simply spaced on side walls.
    
    // Let's try to fit them in empty spots.
    // Defaults are at z=0 (sides) and z=-4.9 (back). 
    // Let's add new ones starting from z=4 (front) moving backwards? 
    // Or just simple hardcoded slots or random.
    
    // Smart placement:
    const isLeft = count % 2 !== 0; // Alternating
    const x = isLeft ? -9.9 : 9.9; // On the long walls
    // z range from -10 to 10.
    // Lets space them every 4 meters.
    // We need to find a free spot. This is getting complex for a simple demo.
    // Let's just place them at random Z on side walls for "fun" or just a fixed sequence.
    
    const randomZ = (Math.random() * 16) - 8; // Random Z between -8 and 8
    
    const newPainting: Painting = {
      id: Math.random().toString(36).substring(7),
      title: formData.title,
      description: formData.description,
      url: formData.url,
      position: [x, 2, randomZ],
      rotation: [0, isLeft ? Math.PI / 2 : -Math.PI / 2, 0],
      width: 3,
      height: 2,
    };

    addPainting(newPainting);
    setFormData({ title: '', description: '', url: '' });
    alert('Painting added to the gallery!');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12">
            <Link 
                href="/" 
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Museum
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Gallery Curator
            </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl sticky top-8">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-indigo-400" />
                        Add New Artwork
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Starry Night"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Image URL</label>
                            <input
                                type="url"
                                required
                                value={formData.url}
                                onChange={e => setFormData({...formData, url: e.target.value})}
                                className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32 resize-none"
                                placeholder="A masterpiece by..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add to Gallery
                        </button>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-indigo-400" />
                    Current Collection ({paintings.length})
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paintings.map((painting) => (
                        <div key={painting.id} className="group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all hover:shadow-lg hover:-translate-y-1">
                            <div className="aspect-video w-full overflow-hidden bg-zinc-800 relative">
                                <Image 
                                    src={painting.url} 
                                    alt={painting.title}
                                    className="object-cover"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                     <p className="text-sm text-zinc-300 line-clamp-2">{painting.description}</p>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg text-white mb-1">{painting.title}</h3>
                                <div className="flex items-center justify-between text-xs text-zinc-500">
                                    <span>Pos: [{painting.position.map(n => n.toFixed(1)).join(', ')}]</span>
                                    <button
                                        onClick={() => {
                                            if(confirm('Delete this painting?')) removePainting(painting.id);
                                        }}
                                        className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/20 rounded transition-colors"
                                        title="Delete Painting"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
