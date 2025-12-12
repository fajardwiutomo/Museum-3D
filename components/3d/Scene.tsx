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
        shadows={false} // Disable shadows for now to save perf
        camera={{ position: [0, 1.7, 5], fov: 75 }}
        gl={{ 
            antialias: false, 
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false
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
