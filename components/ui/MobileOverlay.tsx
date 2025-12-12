'use client';

import { useEffect, useRef, useState } from 'react';
import { useControlStore } from '@/store/useControlStore';

export function MobileOverlay() {
  const setMove = useControlStore((state) => state.setMove);
  const setLook = useControlStore((state) => state.setLook);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Joystick Logic
  const joystickRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

  const handleStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
  };

  const handleMove = (e: React.TouchEvent) => {
    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current);
    if (!touch || !joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const maxDist = rect.width / 2;
    
    let deltaX = touch.clientX - centerX;
    let deltaY = touch.clientY - centerY;
    
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (dist > maxDist) {
        deltaX = (deltaX / dist) * maxDist;
        deltaY = (deltaY / dist) * maxDist;
    }

    setKnobPos({ x: deltaX, y: deltaY });
    // Normalize -1 to 1. Invert Y because screen Y is down, but 3D forward is usually negative Z or positive? 
    // Usually joystick up (negative screen Y) means forward.
    setMove(deltaX / maxDist, -deltaY / maxDist);
  };

  const handleEnd = (e: React.TouchEvent) => {
    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current);
    if (touch) {
        touchIdRef.current = null;
        setKnobPos({ x: 0, y: 0 });
        setMove(0, 0);
    }
  };

  // Look Logic (Right side of screen)
  const lastLookRef = useRef({ x: 0, y: 0 });
  
  const handleLookMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastLookRef.current.x;
    const deltaY = touch.clientY - lastLookRef.current.y;
    
    // update store with DELTAS
    setLook(deltaX * 0.005, deltaY * 0.005);
    
    lastLookRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleLookStart = (e: React.TouchEvent) => {
     const touch = e.touches[0];
     lastLookRef.current = { x: touch.clientX, y: touch.clientY };
  }
  
  const handleLookEnd = () => {
      setLook(0, 0); // Stop looking
  }

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex">
        {/* Left Half: Joystick Zone */}
        <div className="w-1/2 h-full relative pointer-events-auto select-none"
             onTouchStart={handleStart}
             onTouchMove={handleMove}
             onTouchEnd={handleEnd}
        >
             <div 
                ref={joystickRef}
                className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-white/10 border-2 border-white/30 backdrop-blur-sm flex items-center justify-center"
             >
                <div 
                    className="w-12 h-12 rounded-full bg-white/50 shadow-lg"
                    style={{ transform: `translate(${knobPos.x}px, ${knobPos.y}px)` }}
                />
             </div>
        </div>

        {/* Right Half: Look Zone */}
        <div className="w-1/2 h-full pointer-events-auto touch-none"
            onTouchStart={handleLookStart}
            onTouchMove={handleLookMove}
            onTouchEnd={handleLookEnd}
        />
        
        {/* Helper Hint */}
        <div className="absolute bottom-8 left-0 right-0 text-center text-white/50 text-xs pointer-events-none">
            Move (Left) • Look (Right)
        </div>
    </div>
  );
}
