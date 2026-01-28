
import React, { useRef, useState, useEffect } from "react";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html, useProgress, Line, PerspectiveCamera, Environment, Sky } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

// --- Components ---

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center zIndexRange={[100, 0]}>
            <div className="flex w-64 flex-col items-center justify-center rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
                <div className="mb-2 text-sm font-bold text-white">Loading Digital Twin...</div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />
                </div>
                <div className="mt-1 text-xs text-gray-300">{progress.toFixed(0)}%</div>
            </div>
        </Html>
    );
}

function TubeConnection({ start, end }: { start: number[], end: number[] }) {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    return (
        <Line points={points} color="#60a5fa" lineWidth={3} dashed={false} opacity={0.7} transparent />
    )
}

function PlantModel() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            //   groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05; // Slow rotation
        }
    });

    return (
        <group ref={groupRef} position={[0, -1, 0]}>
            {/* 1. Feedstock Hopper */}
            <group position={[-4, 1.5, 0]}>
                <mesh position={[0, 0, 0]}>
                    <coneGeometry args={[1, 1.5, 32]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.2} />
                </mesh>
                <mesh position={[0, 1, 0]}>
                    <cylinderGeometry args={[1, 1, 0.5, 32]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.2} />
                </mesh>
                <Text position={[0, 2, 0]} fontSize={0.25} color="black" anchorX="center" anchorY="middle">
                    Feedstock
                </Text>
            </group>

            {/* Connection: Hopper -> Pump */}
            <TubeConnection start={[-4, 0.75, 0]} end={[-4, 0, 0]} />
            <TubeConnection start={[-4, 0, 0]} end={[-2.5, 0, 0]} />

            {/* 2. High Pressure Pump */}
            <group position={[-2.5, 0, 0]}>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#3b82f6" />
                </mesh>
                <Text position={[0, 0.8, 0]} fontSize={0.25} color="black" anchorX="center" anchorY="middle">
                    HP Pump
                </Text>
            </group>

            {/* Connection: Pump -> Reactor */}
            <TubeConnection start={[-2, 0, 0]} end={[0, 0, 0]} />

            {/* 3. HTL Reactor */}
            <group position={[0, 1, 0]}>
                {/* Main Vessel */}
                <mesh>
                    <cylinderGeometry args={[0.8, 0.8, 3, 32]} />
                    {/* Emissive material to simulate heat */}
                    <meshStandardMaterial color="#ef4444" emissive="#7f1d1d" emissiveIntensity={0.5} metalness={0.8} />
                </mesh>
                {/* Insulation Jacket (Visual) */}
                <mesh position={[0, 0, 0]} scale={[1.1, 0.9, 1.1]}>
                    <cylinderGeometry args={[0.8, 0.8, 3, 32, 1, true]} />
                    <meshStandardMaterial color="#cbd5e1" opacity={0.3} transparent side={THREE.DoubleSide} />
                </mesh>

                <Text position={[0, 2, 0]} fontSize={0.3} color="black" fontWeight="bold">HTL Reactor</Text>
                <Text position={[0, 1.7, 0]} fontSize={0.2} color="#ef4444">320°C / 18 MPa</Text>
            </group>

            {/* Connection: Reactor -> Separator */}
            <TubeConnection start={[0.8, 0, 0]} end={[3, 0, 0]} />

            {/* 4. Product Separator */}
            <group position={[3, 0.5, 0]}>
                <mesh>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial color="#10b981" metalness={0.6} roughness={0.1} />
                </mesh>
                <Text position={[0, 1.5, 0]} fontSize={0.3} color="black">Separator</Text>

                {/* Outputs */}
                {/* Gas (Top) */}
                <TubeConnection start={[0, 1, 0]} end={[0, 2, 0]} />
                <Text position={[0, 2.3, 0]} fontSize={0.2} color="#f59e0b">Gas</Text>

                {/* Bio-oil (Middle) */}
                <TubeConnection start={[1, 0, 0]} end={[2, 0, 0]} />
                <Text position={[2.1, 0, 0]} fontSize={0.2} color="#be123c">Bio-Oil</Text>

                {/* Aqueous/Char (Bottom) */}
                <TubeConnection start={[0, -1, 0]} end={[0, -2, 0]} />
                <Text position={[0, -2.3, 0]} fontSize={0.2} color="#1e40af">Aq / Char</Text>
            </group>

            {/* Base Platform */}
            <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[15, 10]} />
                <meshStandardMaterial color="#e2e8f0" />
            </mesh>
            <gridHelper args={[20, 20, 0x94a3b8, 0xe2e8f0]} position={[0, -1.09, 0]} />

        </group>
    );
}

export function ReactorScene() {
    // Artificial loading state for demo purposes to show the Loading UI
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">

            {/* 3D Canvas */}
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 5, 10], fov: 45 }}>
                <PerspectiveCamera makeDefault position={[0, 2, 12]} />

                <ambientLight intensity={0.7} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Sky sunPosition={[100, 20, 100]} />
                <Environment preset="city" />

                <React.Suspense fallback={<Loader />}>
                    <PlantModel />
                </React.Suspense>

                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI / 2.1} // Prevent going under the floor
                />
            </Canvas>

            {/* Overlay Instructions */}
            <div className="absolute bottom-4 left-4 rounded-lg bg-white/80 p-3 text-xs text-gray-600 backdrop-blur-sm">
                <p className="font-bold">Interactive Controls:</p>
                <ul className="ml-4 list-disc">
                    <li>Left Click + Drag to Rotate</li>
                    <li>Right Click + Drag to Pan</li>
                    <li>Scroll to Zoom</li>
                </ul>
            </div>

        </div>
    );
}
