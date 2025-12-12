'use client';

export function Museum() {
  // Use simple colors or standard materials if textures fail to load, 
  // but let's try to assume we might want textures later. 
  // For now, we use standard materials with colors that look like a gallery.
  
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#303030" roughness={0.1} metalness={0.1} />
      </mesh>
      
      {/* Ceiling */}
       <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#efefef" />
      </mesh>

      {/* Walls */}
      {/* Back Wall */}
      <mesh position={[0, 2.5, -10]} receiveShadow>
        <planeGeometry args={[20, 5]} />
         <meshStandardMaterial color="#f5f5f5" />
      </mesh>
       {/* Front Wall */}
      <mesh position={[0, 2.5, 10]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[20, 5]} />
         <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-10, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 5]} />
         <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      {/* Right Wall */}
      <mesh position={[10, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 5]} />
         <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Some ambient lights details or skirting boards could go here */}
      <mesh position={[0, 0.1, -9.95]}>
          <boxGeometry args={[20, 0.2, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" />
      </mesh>
       <mesh position={[-9.95, 0.1, 0]} rotation={[0, Math.PI/2, 0]}>
          <boxGeometry args={[20, 0.2, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" />
      </mesh>
       <mesh position={[9.95, 0.1, 0]} rotation={[0, Math.PI/2, 0]}>
          <boxGeometry args={[20, 0.2, 0.1]} />
          <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}
