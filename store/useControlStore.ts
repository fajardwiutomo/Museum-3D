import { create } from 'zustand';

interface ControlState {
  move: { x: number; y: number }; // x=strafe, y=forward/back
  look: { x: number; y: number }; // x=yaw, y=pitch
  setMove: (x: number, y: number) => void;
  setLook: (x: number, y: number) => void;
}

export const useControlStore = create<ControlState>((set) => ({
  move: { x: 0, y: 0 },
  look: { x: 0, y: 0 },
  setMove: (x, y) => set({ move: { x, y } }),
  setLook: (x, y) => set({ look: { x, y } }),
}));
