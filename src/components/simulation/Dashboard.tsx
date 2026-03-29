"use client";

import { useState } from "react";
import { useSimulationStore } from "@/lib/store";
import { ENVIRONMENTAL } from "@/lib/simulation/constants";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AreaChart, Area, BarChart, Bar } from 'recharts';
import { ReactorScene } from "./ReactorScene";


export function Dashboard() {
    const [activeTab, setActiveTab] = useState<'visual' | 'results' | 'economy' | 'environmental'>('results');
    const [econView, setEconView] = useState<'isbl' | 'tci'>('isbl');
    const { simulationData, yieldMeasures, economicResults, feedstockMass, useRealFeedstockPrice, toggleRealFeedstockPrice } = useSimulationStore();

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const yieldData = [
        { name: 'Bio-oil', value: yieldMeasures.bioOilYield },
        { name: 'Gas', value: yieldMeasures.gasYield },
        { name: 'Char', value: yieldMeasures.charYield },
        { name: 'Aqueous', value: yieldMeasures.aqueousYield },
    ];

    // --- Environmental Calculations ---
    const capacityTonPerYear = feedstockMass * 300;
    const bioOilMassKg = capacityTonPerYear * (yieldMeasures.bioOilYield / 100) * 1000;
    const totalEnergyGJ = (bioOilMassKg * ENVIRONMENTAL.BIO_OIL_HHV) / 1000; // MJ -> GJ
    const coalEmissionKg = totalEnergyGJ * ENVIRONMENTAL.COAL_EMISSION_FACTOR;
    const bioOilEmissionKg = coalEmissionKg * ENVIRONMENTAL.HTL_REDUCTION_FACTOR;
    const co2SavedKg = coalEmissionKg - bioOilEmissionKg;

    const emissionChartData = [
        { name: 'Batu Bara', emission: +(coalEmissionKg / 1000).toFixed(2), fill: '#64748b' },
        { name: 'Bio-oil HTL', emission: +(bioOilEmissionKg / 1000).toFixed(2), fill: '#10b981' },
    ];

    const references = [
        {
            id: 'ipcc',
            title: 'IPCC (2006)',
            source: 'Guidelines for National Greenhouse Gas Inventories',
            desc: 'Faktor emisi CO₂ batu bara sekitar 94,6 kg CO₂/GJ, menjadikannya salah satu bahan bakar paling intensif karbon.',
            color: 'border-red-200 bg-red-50',
        },
        {
            id: 'zhang',
            title: 'Zhang, Y., et al. (2023)',
            source: 'Renewable Energy Journal',
            desc: 'HTL kotoran ayam menghasilkan bio-oil (HHV 30-35 MJ/kg) dengan emisi CO₂ 60-80% lebih rendah dibanding batu bara dalam Life-Cycle Assessment (LCA).',
            color: 'border-green-200 bg-green-50',
        },
        {
            id: 'chen',
            title: 'Chen, W., et al. (2020)',
            source: 'Energy (Elsevier)',
            desc: 'HTL biomassa basah lebih efisien dibanding pirolisis karena menghilangkan proses pengeringan yang boros energi, menghasilkan jejak karbon lebih rendah.',
            color: 'border-blue-200 bg-blue-50',
        },
        {
            id: 'moser',
            title: 'Moser, L., et al. (2023)',
            source: 'Sustainable Energy & Fuels',
            desc: 'Analisis Life-Cycle Assessment (LCA) membuktikan proses HTL kotoran ternak mampu memangkas emisi karbon (GWP) hingga 70-98% dibanding bahan bakar fosil.',
            color: 'border-amber-200 bg-amber-50',
        },
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
                <button
                    onClick={() => setActiveTab('environmental')}
                    className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors lg:px-6 lg:py-4 ${activeTab === 'environmental' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    🌱 Environmental Impact
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
                        {/* Control Toggle: ISBL vs TCI */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-white p-4 shadow-sm">
                            <div>
                                <h3 className="font-semibold text-gray-900">Mode Analisis Biaya</h3>
                                <p className="text-sm text-gray-500">
                                    {econView === 'isbl'
                                        ? "ISBL: Equipment Only (Alat Utama) - Optimistic"
                                        : "TCI: Turnkey Project (Proyek Lengkap) - Realistic"}
                                </p>
                            </div>
                            <div className="flex rounded-lg bg-gray-100 p-1">
                                <button
                                    onClick={() => setEconView('isbl')}
                                    className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${econView === 'isbl' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Equipment (ISBL)
                                </button>
                                <button
                                    onClick={() => setEconView('tci')}
                                    className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${econView === 'tci' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Turnkey (TCI)
                                </button>
                            </div>
                        </div>

                        {/* Feedstock Pricing Toggle */}
                        <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
                            <div>
                                <h3 className="font-semibold text-gray-900">Harga Bahan Baku Riil</h3>
                                <p className="text-sm text-gray-500">
                                    {useRealFeedstockPrice
                                        ? `Aktif — Biaya feedstock: Rp ${(economicResults.feedstockCost / 1e9).toFixed(2)} Miliar/tahun`
                                        : "Nonaktif — Bahan baku diasumsikan gratis (limbah)."}
                                </p>
                            </div>
                            <button
                                onClick={toggleRealFeedstockPrice}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${useRealFeedstockPrice ? 'bg-blue-600' : 'bg-gray-300'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${useRealFeedstockPrice ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>

                        {/* Disclaimer / Context */}
                        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                            <p>
                                <strong>Catatan Teknis (Ref: PNNL-25464):</strong><br />
                                • <strong>ISBL</strong>: Biaya pembelian alat utama saja (Reaktor, Heater, Pompa).<br />
                                • <strong>TCI</strong>: Biaya total proyek termasuk Instalasi (+20%), Sipil (+15%), Kontrol (+10%), dan Engineering (+15%).
                            </p>
                        </div>

                        {/* Economic KPIs */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">CAPEX ({econView.toUpperCase()})</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    Rp {(economicResults[econView].capex / 1e9).toFixed(1)} M
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">NPV (10 Years)</p>
                                <p className={`text-2xl font-bold ${economicResults[econView].npv > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    Rp {(economicResults[econView].npv / 1e9).toFixed(1)} M
                                </p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">ROI</p>
                                <p className="text-2xl font-bold text-blue-600">{economicResults[econView].roi.toFixed(1)}%</p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Payback Period</p>
                                <p className="text-2xl font-bold text-amber-600">{economicResults[econView].paybackPeriod.toFixed(1)} Years</p>
                            </div>
                        </div>

                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold">Cumulative Cash Flow ({econView.toUpperCase()})</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={economicResults[econView].cumulativeCashFlows.map((val, idx) => ({ year: idx, value: val / 1e9 }))}
                                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="year" />
                                        <YAxis label={{ value: 'Bio. IDR', angle: -90, position: 'insideLeft' }} />
                                        <Tooltip formatter={(value) => `Rp ${value} M`} />
                                        <Area type="monotone" dataKey="value" stroke={econView === 'isbl' ? "#3b82f6" : "#10b981"} fill={econView === 'isbl' ? "#3b82f6" : "#10b981"} fillOpacity={0.2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* ====== NEW: Environmental Impact Tab ====== */}
                {activeTab === 'environmental' && (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="rounded-xl border bg-gradient-to-r from-emerald-50 to-green-50 p-5 shadow-sm">
                            <h2 className="text-lg font-bold text-emerald-800">🌱 Analisis Jejak Karbon (Carbon Footprint)</h2>
                            <p className="mt-1 text-sm text-emerald-700">
                                Perbandingan emisi CO₂ energi Bio-oil HTL vs Batu Bara berdasarkan produksi tahunan simulasi.
                            </p>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Total Energi / Tahun</p>
                                <p className="text-2xl font-bold text-blue-600 font-mono">{totalEnergyGJ.toFixed(1)} <span className="text-sm font-sans">GJ</span></p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Emisi Batu Bara</p>
                                <p className="text-2xl font-bold text-gray-700 font-mono">{(coalEmissionKg / 1000).toFixed(1)} <span className="text-sm font-sans">Ton CO₂</span></p>
                            </div>
                            <div className="rounded-xl border bg-white p-4 shadow-sm">
                                <p className="text-sm text-gray-500">Emisi Bio-oil HTL</p>
                                <p className="text-2xl font-bold text-emerald-600 font-mono">{(bioOilEmissionKg / 1000).toFixed(1)} <span className="text-sm font-sans">Ton CO₂</span></p>
                            </div>
                            <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                                <p className="text-sm text-emerald-700 font-medium">CO₂ Tersimpan ✅</p>
                                <p className="text-2xl font-bold text-emerald-600 font-mono">{(co2SavedKg / 1000).toFixed(1)} <span className="text-sm font-sans">Ton/Tahun</span></p>
                            </div>
                        </div>

                        {/* Bar Chart Comparison */}
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-semibold text-gray-900">Perbandingan Emisi CO₂ Tahunan (Ton)</h3>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={emissionChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis label={{ value: 'Ton CO₂/Tahun', angle: -90, position: 'insideLeft' }} />
                                        <Tooltip formatter={(value) => `${value} Ton CO₂`} />
                                        <Bar dataKey="emission" name="Emisi CO₂" radius={[8, 8, 0, 0]}>
                                            {emissionChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="mt-3 text-center text-sm text-gray-500">
                                Penggunaan Bio-oil HTL mengurangi emisi sebesar <strong className="text-emerald-600">70%</strong> dibandingkan Batu Bara.
                            </p>
                        </div>

                        {/* Literature & References */}
                        <div>
                            <h3 className="mb-4 text-lg font-bold text-gray-800">📚 Literatur & Referensi</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {references.map(ref => (
                                    <div key={ref.id} className={`rounded-xl border p-4 shadow-sm ${ref.color}`}>
                                        <h4 className="text-sm font-bold text-gray-900">{ref.title}</h4>
                                        <p className="text-xs italic text-gray-600">{ref.source}</p>
                                        <p className="mt-2 text-sm text-gray-700">{ref.desc}</p>
                                    </div>
                                ))}
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
