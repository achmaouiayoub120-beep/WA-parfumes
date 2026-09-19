'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface OlfactorySceneProps {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  accentColor: string;
}

function PyramidLayer({ 
  position, 
  scale, 
  color, 
  notes, 
  label, 
  delay = 0 
}: { 
  position: [number, number, number], 
  scale: [number, number, number], 
  color: string,
  notes: string[],
  label: string,
  delay?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Smoothly interpolate color and scale on hover
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation animation
      meshRef.current.rotation.y += delta * 0.2;
      
      // Hover effect scale
      const targetScale = hovered ? 1.05 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale[0] * targetScale, scale[1] * targetScale, scale[2] * targetScale), 0.1);
    }
  });

  // Calculate top radius vs bottom radius for trapezoid shape (pyramid slice)
  const isTop = label === 'Tête';
  const isHeart = label === 'Cœur';
  
  const radiusTop = isTop ? 0.05 : isHeart ? 0.8 : 1.4;
  const radiusBottom = isTop ? 0.8 : isHeart ? 1.4 : 2.0;

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
        <mesh 
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
        >
          <cylinderGeometry args={[radiusTop, radiusBottom, 0.6, 4, 1, false, Math.PI / 4]} />
          <meshPhysicalMaterial 
            color={hovered ? '#ffffff' : color}
            roughness={0.2}
            metalness={0.8}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transparent
            opacity={0.8}
            envMapIntensity={2}
          />
        </mesh>

        <Html position={[0, 0, 0]} center zIndexRange={[100, 0]} className="pointer-events-none">
          <div className={`transition-all duration-500 flex flex-col items-center ${hovered ? 'opacity-100 scale-110' : 'opacity-70 scale-100'}`}>
            <span className="text-[0.55rem] uppercase tracking-[0.4em] mb-1 font-medium text-white mix-blend-difference drop-shadow-md">
              {label}
            </span>
            {hovered && (
              <div className="absolute top-full mt-2 w-max text-center bg-black/80 backdrop-blur-md px-4 py-2 border border-white/20">
                <p className="text-xs text-white uppercase tracking-widest">
                  {notes.join(' • ')}
                </p>
              </div>
            )}
          </div>
        </Html>
      </Float>
    </group>
  );
}

export default function OlfactoryScene({ topNotes, heartNotes, baseNotes, accentColor }: OlfactorySceneProps) {
  return (
    <div className="w-full h-[400px] relative bg-transparent cursor-crosshair">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color={accentColor} />
        
        <group position={[0, -0.5, 0]}>
          {/* Base Notes (Bottom Layer) */}
          <PyramidLayer 
            position={[0, -1.2, 0]} 
            scale={[1, 1, 1]} 
            color="#1a1a1a" 
            notes={baseNotes} 
            label="Fond" 
          />
          
          {/* Heart Notes (Middle Layer) */}
          <PyramidLayer 
            position={[0, 0, 0]} 
            scale={[1, 1, 1]} 
            color={accentColor} 
            notes={heartNotes} 
            label="Cœur" 
            delay={0.2}
          />
          
          {/* Top Notes (Top Layer) */}
          <PyramidLayer 
            position={[0, 1.2, 0]} 
            scale={[1, 1, 1]} 
            color="#ffffff" 
            notes={topNotes} 
            label="Tête" 
            delay={0.4}
          />
        </group>

        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} color={accentColor} />
      </Canvas>
      <div className="absolute bottom-2 right-2 text-[0.5rem] uppercase tracking-widest text-[var(--color-text-subtle)] pointer-events-none">
        Pointez pour révéler
      </div>
    </div>
  );
}
