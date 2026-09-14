"use client";

import React, { Component, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Center } from "@react-three/drei";
import { useScroll, useMotionValueEvent } from "framer-motion";

// Reads how far `sectionRef` has scrolled through the viewport (0 -> 1)
// and stores it in a ref instead of state, so the 3D scene can read it
// every frame without triggering React re-renders on every scroll pixel.
function useScrollProgressRef(sectionRef) {
  const progressRef = useRef(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });
  return progressRef;
}

function GLTFModel({ url, progressRef }) {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useFrame(() => {
    const p = progressRef.current;
    if (!ref.current) return;
    ref.current.rotation.y = p * Math.PI * 2.2;
    ref.current.rotation.x = Math.sin(p * Math.PI) * 0.25;
    ref.current.position.y = -0.2 + Math.sin(p * Math.PI) * 0.2;
  });

  return (
    <Center>
      <primitive ref={ref} object={scene} scale={1.4} />
    </Center>
  );
}

// Shown until a real model is provided (or if one fails to load) so the
// scroll-driven rotation is visible immediately.
function PlaceholderShape({ progressRef }) {
  const ref = useRef();

  useFrame(() => {
    const p = progressRef.current;
    if (!ref.current) return;
    ref.current.rotation.y = p * Math.PI * 2.2;
    ref.current.rotation.x = Math.sin(p * Math.PI) * 0.4;
  });

  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[0.75, 0.24, 200, 32]} />
      <meshStandardMaterial color="#fb923c" metalness={0.55} roughness={0.25} />
    </mesh>
  );
}

// Catches a failed .glb fetch/parse (e.g. wrong path) and falls back to
// the placeholder instead of breaking the whole page.
class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function ScrollModel3D({ sectionRef, modelUrl, className = "" }) {
  const progressRef = useScrollProgressRef(sectionRef);

  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 4], fov: 40 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.1} />
        <Suspense fallback={null}>
          {modelUrl ? (
            <ModelErrorBoundary
              fallback={<PlaceholderShape progressRef={progressRef} />}
            >
              <GLTFModel url={modelUrl} progressRef={progressRef} />
            </ModelErrorBoundary>
          ) : (
            <PlaceholderShape progressRef={progressRef} />
          )}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
