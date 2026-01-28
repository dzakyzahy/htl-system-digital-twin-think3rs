
"use client";


import { useState } from "react";
import { useSimulationStore } from "@/lib/store";
import { FEEDSTOCK_TYPES } from "@/lib/simulation/constants";
import { Slider } from "@/components/ui/slider"; // We will create this or use simple input first
import { Play, RotateCcw, Download } from "lucide-react";
import { exportSimulationData, exportEconomicReport } from "@/lib/export";


export function ControlPanel() {
    const {
        feedstockType, temperature, pressure, retentionTime, isSimulating,
        setFeedstockType, setParams, runSimulation, simulationData
    } = useSimulationStore();


    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <div className="border-b bg-white p-4 lg:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700"
                >
                    <span>{isOpen ? 'Hide Parameters' : 'Tune Parameters'}</span>
                    <Play className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>
            </div>

            {/* Panel Content */}
            <div className={`${isOpen ? 'flex' : 'hidden'} h-full w-full flex-col gap-6 overflow-y-auto border-r bg-white p-6 shadow-sm lg:flex lg:w-80`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="mb-1 text-lg font-bold text-gray-900">Input Parameters</h2>
                        <p className="text-xs text-gray-500">Configure simulation variables</p>
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={() => setIsOpen(false)} className="rounded-md p-1 hover:bg-gray-100 lg:hidden">
                        <RotateCcw className="h-4 w-4 rotate-45" />
                    </button>
                </div>

                {/* Feedstock Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-800">1. Feedstock</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <select
                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                            value={feedstockType}
                            onChange={(e) => setFeedstockType(e.target.value as any)}
                        >
                            {Object.values(FEEDSTOCK_TYPES).map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Operating Conditions */}
                <div className="space-y-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-800">2. Operating Conditions</h3>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium">Temperature</label>
                            <span className="text-sm font-bold text-blue-600">{temperature}°C</span>
                        </div>
                        <input
                            type="range" min="250" max="380" step="5"
                            value={temperature}
                            onChange={(e) => setParams({ temperature: Number(e.target.value) })}
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium">Pressure</label>
                            <span className="text-sm font-bold text-blue-600">{pressure} MPa</span>
                        </div>
                        <input
                            type="range" min="10" max="25" step="1"
                            value={pressure}
                            onChange={(e) => setParams({ pressure: Number(e.target.value) })}
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-medium">Retention Time</label>
                            <span className="text-sm font-bold text-blue-600">{retentionTime} min</span>
                        </div>
                        <input
                            type="range" min="15" max="120" step="5"
                            value={retentionTime}
                            onChange={(e) => setParams({ retentionTime: Number(e.target.value) })}
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-3 pt-6">
                    <button
                        onClick={() => {
                            runSimulation();
                            setIsOpen(false); // Auto close on run for mobile
                        }}
                        disabled={isSimulating}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {isSimulating ? (
                            <>Running...</>
                        ) : (
                            <>
                                <Play className="h-4 w-4" /> Run Simulation
                            </>
                        )}
                    </button>

                    <div className="h-px w-full bg-gray-200 my-2"></div>

                    <button
                        onClick={() => simulationData.length > 0 && exportSimulationData(simulationData)}
                        disabled={simulationData.length === 0}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
                    >
                        <Download className="h-3 w-3" /> Export CSV
                    </button>

                    <button
                        onClick={() => { }}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <RotateCcw className="h-3 w-3" /> Reset Defaults
                    </button>
                </div>
            </div>
        </>
    );
}
