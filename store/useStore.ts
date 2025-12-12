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
// ... (omitted for brevity, keep existing)
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
