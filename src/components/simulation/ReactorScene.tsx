import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Html, useProgress, PerspectiveCamera, Environment, Sky } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useSimulationStore } from "@/lib/store";

// --- Helpers ---

const getTempColor = (t: number) => {
    if (t < 300) return "#4ade80"; // Green (Safe/Low)
    if (t <= 350) return "#facc15"; // Yellow (Optimal)
    return "#ef4444"; // Red (High/Warning)
};

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

function PipePath({ points, radius = 0.05, color = "#333" }: { points: number[][], radius?: number, color?: string }) {
    const curve = useMemo(() => {
        const vectors = points.map(p => new THREE.Vector3(...p));
        return new THREE.CatmullRomCurve3(vectors, false, 'catmullrom', 0.1);
    }, [points]);

    return (
        <mesh>
            <tubeGeometry args={[curve, 64, radius, 8, false]} />
            <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
        </mesh>
    );
}

function DataLabel({ position, title, data }: { position: [number, number, number], title: string, data?: string[] }) {
    return (
        <Html position={position} center distanceFactor={15} zIndexRange={[100, 0]}>
            <div className="pointer-events-none select-none flex flex-col items-start rounded-lg border border-white/20 bg-black/60 p-2 shadow-lg backdrop-blur-sm min-w-[120px]">
                <div className="mb-1 text-[10px] font-bold text-white/90 uppercase tracking-wider border-b border-white/10 w-full pb-1">{title}</div>
                {data && data.map((line, idx) => (
                    <div key={idx} className="font-mono text-[9px] text-blue-200 whitespace-nowrap mt-0.5">
                        {line}
                    </div>
                ))}
            </div>
        </Html>
    );
}

// 1. Feed System
// Position: [-5, 1.25, 0] (Center)
function FeedSystem() {
    const mass = useSimulationStore(state => state.feedstockMass);
    return (
        <group>
            {/* Tank Body (Cylinder) */}
            <mesh position={[-5, 1.25, 0]}>
                <cylinderGeometry args={[0.8, 0.8, 2.5, 32]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.3} />
            </mesh>
            {/* Cone Top - Y = 1.25 + 1.25 (half height) + 0.4 (half cone height) = 2.9 */}
            <mesh position={[-5, 2.9, 0]}>
                <coneGeometry args={[0.8, 0.8, 32]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.4} />
            </mesh>

            <DataLabel position={[-5, 3.8, 0]} title="Feed Stock" data={[`Mass: ${mass} ton/day`]} />
        </group>
    );
}

// 2. High Pressure Pump
// Position: [-2.5, 0.5, 0] (Center)
function HighPressurePump() {
    return (
        <group>
            {/* Box Mesh */}
            <mesh position={[-2.5, 0.5, 0]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#3b82f6" metalness={0.6} />
            </mesh>
            {/* Motor Cylinder on top */}
            <mesh position={[-2.5, 1.15, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.8, 16]} />
                <meshStandardMaterial color="#1e40af" metalness={0.8} />
            </mesh>
            <DataLabel position={[-2.5, 1.8, 0]} title="HP PUMP" data={["Flow Control", "High Pressure"]} />
        </group>
    );
}

// 3. HTL Reactor
// Position: [0.5, 2.0, 0] (Center)
function ReactorUnit() {
    const { temperature, pressure } = useSimulationStore();
    const reactorColor = getTempColor(temperature);

    return (
        <group>
            {/* Main Vessel */}
            <mesh position={[0.5, 2.0, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 4.0, 32]} />
                <meshStandardMaterial
                    color={reactorColor}
                    emissive={reactorColor}
                    emissiveIntensity={0.2}
                    metalness={0.5}
                    roughness={0.2}
                />
            </mesh>
            {/* Top Cap Y = 2.0 + 2.0 = 4.0 */}
            <mesh position={[0.5, 4.0, 0]}>
                <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
            {/* Bottom Cap Y = 2.0 - 2.0 = 0 */}
            <mesh position={[0.5, 0, 0]} rotation={[Math.PI, 0, 0]}>
                <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>

            <DataLabel
                position={[0.5, 4.8, 0]}
                title="PFR REACTOR"
                data={[
                    `Temp: ${temperature}°C`,
                    `Press: ${pressure} MPa`
                ]}
            />
        </group>
    );
}

// 4. Separator Stack
// X = 3.5
function SeparatorUnit() {
    return (
        <group>
            {/* Top Body (Cylinder) */}
            {/* Position Y = 1.0 (Cone Height) + 0.25 (Box Height) + 0.75 (Half Body Height) ?? */}
            {/* Request: Body Position [3.5, 2.0, 0], Height 1.5. */}
            <mesh position={[3.5, 2.0, 0]}>
                <cylinderGeometry args={[0.7, 0.7, 1.5, 32]} />
                <meshStandardMaterial color="#10b981" metalness={0.4} roughness={0.1} transparent opacity={0.9} />
            </mesh>

            {/* Bottom Cone */}
            {/* Request: Position [3.5, 0.75, 0], Height 1.0 */}
            <mesh position={[3.5, 0.75, 0]}>
                <cylinderGeometry args={[0.7, 0.2, 1.0, 32]} />
                <meshStandardMaterial color="#059669" metalness={0.4} />
            </mesh>

            {/* Char Container (Box) */}
            {/* Request: Position [3.5, 0.125, 0], Size [0.5, 0.25, 0.5] */}
            <mesh position={[3.5, 0.125, 0]}>
                <boxGeometry args={[0.5, 0.25, 0.5]} />
                <meshStandardMaterial color="#334155" />
            </mesh>

            <DataLabel position={[3.5, 3.2, 0]} title="SEPARATOR" />

            {/* Output Labels */}
            <Html position={[3.5, 2.8, 0]} distanceFactor={10} center>
                <div className="rounded bg-yellow-400/80 px-1 py-0.5 text-[8px] font-bold text-black border border-white/20">GAS</div>
            </Html>
            <Html position={[4.2, 2.0, 0]} distanceFactor={10} center>
                <div className="rounded bg-red-400/80 px-1 py-0.5 text-[8px] font-bold text-black border border-white/20">OIL</div>
            </Html>
            <Html position={[4.0, 0.125, 0]} distanceFactor={10} center>
                <div className="rounded bg-slate-600/80 px-1 py-0.5 text-[8px] font-bold text-white border border-white/20">CHAR</div>
            </Html>
        </group>
    );
}

function PlantModel() {
    const groupRef = useRef<THREE.Group>(null);

    return (
        <group ref={groupRef}>
            {/* Machines */}
            <FeedSystem />
            <HighPressurePump />
            <ReactorUnit />
            <SeparatorUnit />

            {/* PIPING SYSTEM (Precise Coordinates) */}

            {/* Pipe 1: Feed -> Pump */}
            {/* Start: [-4.2, 1.5, 0] -> End: [-3.0, 0.8, 0] */}
            <PipePath points={[
                [-4.2, 1.5, 0],
                [-3.0, 0.8, 0]
            ]} />

            {/* Pipe 2: Pump -> Reactor */}
            {/* Start: [-2.0, 0.8, 0] -> Mid -> End: [0.5, 3.5, 0] */}
            <PipePath points={[
                [-2.0, 0.8, 0],   // Out of Pump
                [-1.0, 0.8, 0],   // Elbow
                [-1.0, 3.5, 0],   // Up
                [0.5, 3.5, 0]     // In to Top of Reactor
            ]} />

            {/* Pipe 3: Reactor -> Separator */}
            {/* Start: [0.5, 0.5, 0] (Bottom) -> Mid -> End: [2.8, 2.5, 0] (Side of Sep) */}
            <PipePath points={[
                [0.5, 0.5, 0],
                [0.5, 0.2, 0],
                [2.0, 0.2, 0],
                [2.0, 2.5, 0],
                [2.8, 2.5, 0]
            ]} />


            {/* Floor */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[20, 10]} />
                <meshStandardMaterial color="#f1f5f9" />
            </mesh>
            <gridHelper args={[20, 20, 0xcbd5e1, 0xf1f5f9]} position={[0, 0.01, 0]} />
        </group>
    );
}

export function ReactorScene() {
    return (
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100">
            {/* 3D Canvas */}
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 5, 12], fov: 40 }}>
                <PerspectiveCamera makeDefault position={[0, 4, 14]} />

                <ambientLight intensity={0.6} />
                <directionalLight
                    position={[5, 10, 5]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />

                <Sky sunPosition={[100, 20, 100]} inclination={0.6} azimuth={0.1} />
                <Environment preset="city" />

                <React.Suspense fallback={<Loader />}>
                    <PlantModel />
                </React.Suspense>

                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.1} // Stop at floor
                    maxDistance={25}
                    minDistance={5}
                />
            </Canvas>

            {/* Legends */}
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 pointer-events-none">
                <div className="rounded-lg bg-white/90 p-3 text-xs shadow-sm backdrop-blur-sm pointer-events-auto border border-white/50">
                    <div className="mb-2 font-bold text-gray-700">System Legend</div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="block h-2 w-2 rounded-full bg-green-400"></span>
                        <span>Safe (&lt;300°C)</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="block h-2 w-2 rounded-full bg-yellow-400"></span>
                        <span>Optimal (300-350°C)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="block h-2 w-2 rounded-full bg-red-500"></span>
                        <span>Critical (&gt;350°C)</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 left-4 rounded-lg bg-white/80 p-2 text-[10px] text-gray-500 backdrop-blur-sm pointer-events-none">
                Left Click: Rotate • Right Click: Pan • Scroll: Zoom
            </div>

        </div>
    );
}
