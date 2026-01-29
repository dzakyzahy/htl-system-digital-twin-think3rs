
"use client";

import { useState } from "react";
import { useSimulationStore } from "@/lib/store";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AreaChart, Area } from 'recharts';
import { ReactorScene } from "./ReactorScene";


export function Dashboard() {
    const [activeTab, setActiveTab] = useState<'visual' | 'results' | 'economy'>('results');
    const { simulationData, yieldMeasures, economicResults } = useSimulationStore();

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const yieldData = [
        { name: 'Bio-oil', value: yieldMeasures.bioOilYield },
        { name: 'Gas', value: yieldMeasures.gasYield },
        { name: 'Char', value: yieldMeasures.charYield },
        { name: 'Aqueous', value: yieldMeasures.aqueousYield },
    ];

    return (
        <div className="flex h-full flex-1 flex-col overflow-hidden bg-gray-50">
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto border-b bg-white px-2 lg:px-6 no-scrollbar">
                <button
                    onClick={() => setActiveTab('visual')}
                    className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors lg:px-6 lg:py-4 ${activeTab === 'visual' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Process Visualization
                </button>
                <button
                    onClick={() => setActiveTab('results')}
                    className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors lg:px-6 lg:py-4 ${activeTab === 'results' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Product Analysis
                </button>
                <button
                    onClick={() => setActiveTab('economy')}
                    className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors lg:px-6 lg:py-4 ${activeTab === 'economy' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Economic Dashboard
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'results' && (
                    <div className="space-y-6">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Bio-oil Yield</p>
                                <p className="text-2xl font-bold text-blue-600">{yieldMeasures.bioOilYield.toFixed(2)}%</p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Gas Yield</p>
                                <p className="text-2xl font-bold text-green-600">{yieldMeasures.gasYield.toFixed(2)}%</p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">HHV Bio-oil</p>
                                <p className="text-2xl font-bold text-amber-600 font-mono">{yieldMeasures.hhv ? yieldMeasures.hhv.toFixed(1) : '-'} <span className="text-sm font-sans">MJ/kg</span></p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">ERR</p>
                                <p className="text-2xl font-bold text-purple-600 font-mono">{yieldMeasures.err ? yieldMeasures.err.toFixed(1) : '-'}%</p>
                            </div>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Kinetic Profile */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <h3 className="mb-4 font-semibold">Reaction Kinetics Profile</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={simulationData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -5 }} />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="biomass" stroke="#8884d8" name="Biomass" />
                                            <Line type="monotone" dataKey="bioOil" stroke="#82ca9d" name="Bio-oil" strokeWidth={2} />
                                            <Line type="monotone" dataKey="gas" stroke="#ffc658" name="Gas" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Yield Distribution */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm">
                                <h3 className="mb-4 font-semibold">Product Yield Distribution</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={yieldData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {yieldData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Optimization Analysis (New) */}
                            <div className="col-span-1 rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
                                <h3 className="mb-4 font-semibold text-blue-900">Temperature Optimization Analysis (Chicken vs Cow)</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={useSimulationStore.getState().optimizationData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="temp" label={{ value: 'Temperature (°C)', position: 'insideBottom', offset: -5 }} />
                                            <YAxis label={{ value: 'Bio-oil Yield (%)', angle: -90, position: 'insideLeft' }} />
                                            <Tooltip />
                                            <Legend verticalAlign="top" />
                                            <Line type="monotone" dataKey="Chicken" stroke="#ea580c" name="Ayam (Kotoran)" strokeWidth={3} />
                                            <Line type="monotone" dataKey="Cow" stroke="#059669" name="Sapi (Kotoran)" strokeWidth={3} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'economy' && economicResults && (
                    <div className="space-y-6">
                        {/* Economic KPIs */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">NPV (10 Years)</p>
                                <p className={`text-2xl font-bold ${economicResults.npv > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    Rp {(economicResults.npv / 1e9).toFixed(1)} M
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">ROI</p>
                                <p className="text-2xl font-bold text-blue-600">{economicResults.roi.toFixed(1)}%</p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Payback Period</p>
                                <p className="text-2xl font-bold text-amber-600">{economicResults.paybackPeriod.toFixed(1)} Years</p>
                            </div>
                        </div>

                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold">Cumulative Cash Flow</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={economicResults.cumulativeCashFlows.map((val, idx) => ({ year: idx, value: val / 1e9 }))}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="year" />
                                        <YAxis label={{ value: 'Bio. IDR', angle: -90, position: 'insideLeft' }} />
                                        <Tooltip formatter={(value) => `Rp ${value} M`} />
                                        <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'visual' && (
                    <div className="h-full w-full rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <ReactorScene />
                    </div>
                )}
            </div>
        </div>
    );
}
