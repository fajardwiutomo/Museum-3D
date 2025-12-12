'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Environment, Loader } from '@react-three/drei';
import { Museum } from './Museum';
import { Player } from './Player';
import { Frame } from './Frame';
import { useStore } from '@/store/useStore';

export function Scene() {
  const paintings = useStore((state) => state.paintings);
  
  return (
    <div className="h-screen w-full bg-black">
      <Canvas
        shadows={false}
        dpr={[1, 1.5]} // Limit pixel ratio for mobile performance
        camera={{ position: [0, 1.7, 5], fov: 75 }}
        gl={{ 
            antialias: false, 
            powerPreference: 'high-performance', // Try requesting better GPU if available
            failIfMajorPerformanceCaveat: false,
            preserveDrawingBuffer: true // Sometimes helps with screenshot/context loss
        }}
        frameloop="always"
      >
        <Suspense fallback={null}>
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <spotLight
                position={[0, 10, 0]}
                angle={0.5}
                penumbra={1}
                intensity={1}
                castShadow
            />
            
            <Suspense fallback={null}>
                <Museum />
                <Player />
            </Suspense>
            
            <Suspense fallback={null}>
                {paintings.map((painting) => (
                    <Frame key={painting.id} painting={painting} />
                ))}
            </Suspense>
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
