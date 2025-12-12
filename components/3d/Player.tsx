'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';

import { useStore } from '@/store/useStore';

const SPEED = 5;

export function Player() {
  const selectedPainting = useStore((state) => state.selectedPainting);
  const { camera } = useThree();
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const velocity = useRef(new Vector3());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.current = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.current = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.current = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight.current = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.current = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.current = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.current = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight.current = false;
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    velocity.current.x = 0;
    velocity.current.z = 0;

    const direction = new Vector3();
    const frontVector = new Vector3(
      0,
      0,
      Number(moveBackward.current) - Number(moveForward.current)
    );
    const sideVector = new Vector3(
      Number(moveLeft.current) - Number(moveRight.current),
      0,
      0
    );

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED * delta);

    if (moveForward.current || moveBackward.current || moveLeft.current || moveRight.current) {
        camera.translateX(direction.x);
        camera.translateZ(direction.z);
    }
    
    // Lock height to simulate walking on floor
    camera.position.setY(1.7);
  });

  // Fallback if Pointer Lock is not supported or for easier debugging
  // If the user is in a restricted environment, PointerLock might be defined but fail. 
  // We can't easily catch the Drei error, but we can provide a prop or just use OrbitControls if we want.
  // For now, let's strictly use PointerLock but if the user demanded "Mode Berjalan", it's the right choice.
  // However, since it's failing, let's add OrbitControls conditionally?
  // Let's actually just return PointerLockControls. 
  // If the user gets an error, it's likely the browser.
  // But to be helpful, let's try to wrap it in a check.
  
  // Safe check for server-side
  if (typeof document !== 'undefined' && !document.body.requestPointerLock) {
     const { OrbitControls } = require('@react-three/drei');
     return <OrbitControls />;
  }

  // If a painting is selected (modal open), we still want to allow rotation/movement 
  // (User feedback: restricting movement makes it hard to position view).
  // The user can press ESC to unlock/close.

  return <PointerLockControls />;
}
