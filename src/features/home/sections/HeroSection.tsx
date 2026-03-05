import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

function FloatingShape({
  position,
  scale,
  speed,
  geometry,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  geometry: "icosahedron" | "octahedron" | "dodecahedron";
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.2;
      meshRef.current.rotation.z = state.clock.elapsedTime * speed * 0.15;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
        {geometry === "octahedron" && <octahedronGeometry args={[1, 0]} />}
        {geometry === "dodecahedron" && <dodecahedronGeometry args={[1, 0]} />}
        <meshStandardMaterial
          color="#C0C0C0"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.4} color="#ffffff" />
      <pointLight position={[-5, -5, 5]} intensity={0.2} color="#C0C0C0" />
      <FloatingShape position={[-4, 1.5, -3]} scale={1.8} speed={1} geometry="icosahedron" />
      <FloatingShape position={[3.5, -1, -4]} scale={1.2} speed={0.7} geometry="octahedron" />
      <FloatingShape position={[0, 2.5, -5]} scale={2.2} speed={0.4} geometry="dodecahedron" />
      <FloatingShape position={[-2.5, -2, -2]} scale={0.9} speed={1.3} geometry="icosahedron" />
      <FloatingShape position={[5, 1, -6]} scale={1.5} speed={0.6} geometry="octahedron" />
      <FloatingShape position={[-1, -3, -3]} scale={0.7} speed={1.6} geometry="dodecahedron" />
    </>
  );
}

const headlineWords = ["Trade", "Skills.", "Build", "Together."];

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <span className="inline-block rounded-full border border-border bg-surface-2 px-4 py-1.5 font-mono text-xs text-silver">
            The skill exchange platform for students
          </span>
        </motion.div>

        <h1 className="mb-6 font-heading text-5xl font-black leading-[1.1] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.6 + i * 0.15,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="mr-3 inline-block sm:mr-5"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mx-auto mb-10 max-w-xl text-lg text-silver sm:text-xl"
        >
          Exchange your design skills for development, writing for marketing — no money needed. Just skill points.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="pointer-events-auto flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.a
            href="/signup"
            className="rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background shadow-[0_0_30px_hsl(var(--silver)/0.15)] transition-shadow hover:shadow-[0_0_40px_hsl(var(--silver)/0.3)]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Swapping
          </motion.a>
          <motion.button
            className="rounded-full border border-border px-8 py-3.5 text-sm font-medium text-silver-accent transition-colors hover:border-silver hover:text-foreground"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Watch How It Works
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="mt-16 flex items-center justify-center gap-8 text-silver"
        >
          <div className="text-center">
            <span className="font-heading text-2xl font-bold text-foreground">10K+</span>
            <p className="text-xs text-silver">Skill Swaps</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <span className="font-heading text-2xl font-bold text-foreground">50+</span>
            <p className="text-xs text-silver">Universities</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <span className="font-heading text-2xl font-bold text-foreground">2M+</span>
            <p className="text-xs text-silver">Points Exchanged</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
