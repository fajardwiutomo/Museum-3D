'use client';

import { useStore } from '@/store/useStore';
import { useControlStore } from '@/store/useControlStore';
import { PointerLockControls } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import * as THREE from 'three';

const SPEED = 5;

export function Player() {
  const selectedPainting = useStore((state) => state.selectedPainting);
  const moveState = useControlStore((state) => state.move);
  const lookState = useControlStore((state) => state.look);
  const setLook = useControlStore((state) => state.setLook);

  const { camera } = useThree();
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  const velocity = useRef(new Vector3());

  // ... (Keep existing keyboard listeners) ...
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
    // 1. Handle Rotation (Mobile Look)
    if (lookState.x !== 0 || lookState.y !== 0) {
        camera.rotation.order = 'YXZ'; // Important for FPS look
        camera.rotation.y -= lookState.x;
        camera.rotation.x -= lookState.y;
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
        
        // Reset look delta (consume the event)
        setLook(0, 0); 
    }

    // 2. Handle Movement
    velocity.current.x = 0;
    velocity.current.z = 0;

    const direction = new Vector3();
    
    // Keyboard Input
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

    // Mobile Input (Joystick)
    // moveState.y usually 1 (forward) to -1 (back). 
    // R3F forward is -Z. So +y on joystick should be -z.
    if (Math.abs(moveState.y) > 0.1) frontVector.setZ(-moveState.y);
    if (Math.abs(moveState.x) > 0.1) sideVector.setX(moveState.x);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED * delta);

    // velocity check
    // If joystick is active, direction length is 1 * speed.
    // If we want analog speed control, we shouldn't normalize blindly if using joystick. 
    // But for simplicity, normalize is fine.

    if (direction.length() > 0) {
         // Apply camera rotation to movement (except pitch/X)
         const euler = new THREE.Euler(0, camera.rotation.y, 0, 'YXZ');
         direction.applyEuler(euler);
         
         camera.translateX(direction.x); // Wait, applyEuler rotates it in world space.
         camera.position.add(direction); // Add world space vector
    }
    
    // Lock height to simulate walking on floor
    camera.position.setY(1.7);
  });

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
