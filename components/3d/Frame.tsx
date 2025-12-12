'use client';

import { useCursor, useTexture, Text } from '@react-three/drei';
import { useStore, Painting } from '@/store/useStore';
import { useRef, useState, Suspense } from 'react';
import { Group, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FrameProps {
  painting: Painting;
}

function FrameContent({ painting }: FrameProps) {
   const [hovered, setHover] = useState(false);
  const setSelectedPainting = useStore((state) => state.setSelectedPainting);
  const group = useRef<Group>(null);
  const imageFrame = useRef<Mesh>(null);
  
  const texture = useTexture(painting.url);
  texture.colorSpace = THREE.SRGBColorSpace;

  useCursor(hovered);

  // Animate scale on hover
  useFrame((state, delta) => {
    if (group.current) {
        const targetScale = hovered ? 1.05 : 1;
        group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
    }
  });

  return (
    <group
      ref={group}
      position={[painting.position[0], painting.position[1], painting.position[2]]}
      rotation={[painting.rotation[0], painting.rotation[1], painting.rotation[2]]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedPainting(painting);
      }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* Frame border */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[painting.width + 0.2, painting.height + 0.2, 0.1]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.8} />
      </mesh>
      
      {/* Inner matte (white border) */}
       <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[painting.width + 0.05, painting.height + 0.05, 0.08]} />
         <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* The Art */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[painting.width, painting.height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

        {/* Label below the painting */}
      <group position={[0, -painting.height / 2 - 0.4, 0]}>
         <mesh position={[0,0,0]}>
            <planeGeometry args={[2, 0.5]} />
             <meshStandardMaterial color="black" transparent opacity={0.7} />
         </mesh>
        <Text
            position={[0, 0.05, 0.01]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.8}
        >
            {painting.title}
        </Text>
      </group>

    </group>
  );
}

export function Frame(props: FrameProps) {
    return (
        <Suspense fallback={
            // Fallback placeholder frame while image loads
            <group position={props.painting.position as any} rotation={props.painting.rotation as any}>
                 <mesh>
                    <boxGeometry args={[props.painting.width, props.painting.height, 0.1]} />
                    <meshStandardMaterial color="#222" />
                 </mesh>
            </group>
        }>
            <FrameContent {...props} />
        </Suspense>
    )
}
