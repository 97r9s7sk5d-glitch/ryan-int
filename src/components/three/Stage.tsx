'use client';

import {ContactShadows, Environment, Lightformer, MeshReflectorMaterial} from '@react-three/drei';
import {Bloom, EffectComposer, Vignette} from '@react-three/postprocessing';

/** Lighting, floor and post FX shared by the hero and the configurator. */
export function Stage({quality}: {quality: 'high' | 'low'}) {
  const high = quality === 'high';
  return (
    <>
      <color attach="background" args={['#0a0b0c']} />
      <fog attach="fog" args={['#0a0b0c', 9, 19]} />

      <ambientLight intensity={0.45} />
      {/* key */}
      <spotLight
        position={[2.5, 5.2, 3.6]}
        angle={0.6}
        penumbra={1}
        intensity={high ? 190 : 150}
        color="#ffe6c8"
        castShadow={high}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        target-position={[0, 0.8, -1]}
      />
      {/* cool fill from the left, warm kicker from the right */}
      <directionalLight position={[-4, 3, 3]} intensity={1.1} color="#c3d4ff" />
      <directionalLight position={[4, 2, 2]} intensity={0.7} color="#ffd9b0" />
      {/* wash the back wall so the room has depth */}
      <spotLight position={[0, 3.6, -0.5]} angle={0.9} penumbra={1} intensity={high ? 45 : 38} color="#ffdcae" target-position={[0, 1.4, -3.4]} />

      {/* procedural studio environment, no network fetch */}
      <Environment resolution={256} frames={1} environmentIntensity={1.0}>
        <Lightformer form="rect" intensity={1.4} position={[0, 6, 0]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} color="#fff4e6" />
        <Lightformer form="rect" intensity={2} position={[-6, 2, 2]} scale={[6, 4, 1]} rotation-y={Math.PI / 2} color="#dfe8ff" />
        <Lightformer form="rect" intensity={1.5} position={[6, 2, 1]} scale={[6, 4, 1]} rotation-y={-Math.PI / 2} color="#ffe2c0" />
        <Lightformer form="ring" intensity={2} position={[0, 2.2, 6]} scale={4} color="#ffffff" />
      </Environment>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -1.5]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        {high ? (
          <MeshReflectorMaterial
            blur={[300, 80]}
            resolution={512}
            mixBlur={1}
            mixStrength={6}
            roughness={0.85}
            depthScale={0.8}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.3}
            color="#2a2b2f"
            metalness={0.3}
            mirror={0}
          />
        ) : (
          <meshStandardMaterial color="#303236" roughness={0.45} metalness={0.15} />
        )}
      </mesh>
      <ContactShadows position={[0, 0.002, -0.5]} opacity={0.55} scale={7} blur={2.4} far={2.2} resolution={512} />

      <EffectComposer multisampling={high ? 4 : 0}>
        <Bloom intensity={0.5} luminanceThreshold={1.15} luminanceSmoothing={0.2} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.75} />
      </EffectComposer>
    </>
  );
}
