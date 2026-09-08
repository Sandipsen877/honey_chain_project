import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Image, Billboard } from '@react-three/drei';
import { useRef } from 'react';

import queenBee from '../assets/bee_queen.png';
import workerBee from '../assets/bee_image.png';

function RealisticBee({ 
  image,
  scale = 0.5, 
  speed = 1, 
  radius = 1.8,        // smaller default radius
  isQueen = false,
}) {
  const group = useRef();
  const angle = useRef(Math.random() * Math.PI * 2);
  const heightOff = useRef((Math.random() - 0.5) * 0.35);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;

    if (isQueen) {
      group.current.position.x = Math.sin(t * 0.25) * 0.25;
      group.current.position.y = 0.4 + Math.sin(t * 0.5) * 0.18;
      group.current.position.z = 0;
    } else {
      angle.current += 0.01 * speed;
      group.current.position.x = Math.cos(angle.current) * radius;
      group.current.position.z = Math.sin(angle.current) * radius * 0.7;
      group.current.position.y = 0.25 + heightOff.current + Math.sin(t * 1.8) * 0.22;
    }
  });

  return (
    <group ref={group}>
      <Billboard follow={true}>
        <Image
          url={image}
          transparent
          opacity={1}
          scale={scale}
          toneMapped={false}
        />
      </Billboard>
    </group>
  );
}

export default function HoneyScene() {
  return (
    <div className="w-full h-[450px] md:h-[520px]">
      <Canvas
        camera={{ position: [0, 1.1, 7.5], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.1} />
        <pointLight position={[-2, 3, 2]} intensity={0.35} color="#FBBF24" />

        {/* Queen Bee */}
        <RealisticBee 
          image={queenBee}
          isQueen={true} 
          scale={1.5} 
          speed={0.7} 
        />

        {/* Small bees - reduced radius so they stay visible */}
        <RealisticBee image={workerBee} speed={1.1}  radius={1.9} scale={0.38} />
        <RealisticBee image={workerBee} speed={0.95} radius={1.7} scale={0.36} />
        <RealisticBee image={workerBee} speed={1.2}  radius={2.0} scale={0.35} />
        <RealisticBee image={workerBee} speed={1.05} radius={1.8} scale={0.37} />

        <ContactShadows 
          position={[0, -1.5, 0]} 
          opacity={0.22} 
          scale={10} 
          blur={2.5} 
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}