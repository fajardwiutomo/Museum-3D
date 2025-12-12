import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Painting {
  id: string;
  url: string;
  title: string;
  description: string;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
}

interface MuseumState {
  paintings: Painting[];
  selectedPainting: Painting | null;
  addPainting: (painting: Painting) => void;
  removePainting: (id: string) => void;
  setSelectedPainting: (painting: Painting | null) => void;
}

// Initial default paintings
const DEFAULT_PAINTINGS: Painting[] = [
  // CENTER
  {
    id: 'default-1',
    url: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=1000&auto=format&fit=crop',
    title: 'The Golden Hour',
    description: 'A breathtaking view of the mountains bathed in golden sunlight.',
    position: [0, 2, -4.9],
    rotation: [0, 0, 0],
    width: 3,
    height: 2,
  },
  // RIGHT WALL
  {
    id: 'default-2',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
    title: 'Modern Abstract',
    description: 'Vibrant colors and shapes creating a dynamic composition.',
    position: [4.9, 2, 0],
    rotation: [0, -Math.PI / 2, 0],
    width: 3,
    height: 2,
  },
  {
    id: 'default-3',
    url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop',
    title: 'Tranquil Forest',
    description: 'Deep green hues of a misty forest morning.',
    position: [4.9, 2, 4],
    rotation: [0, -Math.PI / 2, 0],
    width: 2,
    height: 3,
  },
   {
    id: 'default-4',
    url: 'https://images.unsplash.com/photo-1515405295579-ba7b454989fd?q=80&w=1000&auto=format&fit=crop',
    title: 'Urban Geometry',
    description: 'Sharp lines and shadows in modern architecture.',
    position: [4.9, 2, -4],
    rotation: [0, -Math.PI / 2, 0],
    width: 2,
    height: 2,
  },
  // LEFT WALL
  {
    id: 'default-5',
    url: 'https://images.unsplash.com/photo-1501472312651-726afe118aaa?q=80&w=1000&auto=format&fit=crop',
    title: 'Ocean Deep',
    description: 'The powerful and mysterious depths of the sea.',
    position: [-4.9, 2, 0],
    rotation: [0, Math.PI / 2, 0],
    width: 3,
    height: 2,
  },
  {
    id: 'default-6',
    url: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=1000&auto=format&fit=crop',
    title: 'Desert Wind',
    description: 'Warm tones of the shifting dunes.',
    position: [-4.9, 2, 4],
    rotation: [0, Math.PI / 2, 0],
    width: 2,
    height: 3,
  },
   {
    id: 'default-7',
    url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=1000&auto=format&fit=crop',
    title: 'Minimalist Space',
    description: 'Clean lines and negative space.',
    position: [-4.9, 2, -4],
    rotation: [0, Math.PI / 2, 0],
    width: 2,
    height: 2,
  },
];

export const useStore = create<MuseumState>()(
  persist(
    (set) => ({
      paintings: DEFAULT_PAINTINGS,
      selectedPainting: null,
      addPainting: (painting) =>
        set((state) => ({ paintings: [...state.paintings, painting] })),
      removePainting: (id) =>
        set((state) => ({ paintings: state.paintings.filter((p) => p.id !== id) })),
      setSelectedPainting: (painting) => set({ selectedPainting: painting }),
    }),
    {
      name: 'museum-storage',
    }
  )
);
