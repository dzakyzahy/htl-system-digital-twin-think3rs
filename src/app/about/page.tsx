
import { Header } from "@/components/layout/Header";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function About() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto max-w-5xl px-4 py-12">
                <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>

                <div className="space-y-12">
                    {/* Section 1: Introduction */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 text-3xl font-bold text-gray-900">Research Methodology</h2>
                        <p className="mb-6 text-lg text-gray-600">
                            Penelitian ini menggunakan pendekatan Digital Twin untuk memodelkan proses Hydrothermal Liquefaction (HTL)
                            secara komprehensif, mulai dari karakterisasi bahan baku hingga analisis ekonomi.
                        </p>

                        <div className="rounded-xl bg-blue-50 p-6">
                            <h3 className="mb-4 text-xl font-semibold text-blue-900">Hydrothermal Liquefaction (HTL)</h3>
                            <p className="text-blue-800">
                                HTL adalah proses termokimia yang mengonversi biomassa basah (seperti kotoran ayam) menjadi bio-crude oil
                                pada suhu tinggi (250-375°C) dan tekanan tinggi (10-25 MPa) di dalam medium air. Keunggulan utamanya adalah
                                kemampuan memproses limbah tanpa perlu pengeringan awal yang memakan energi.
                            </p>
                        </div>
                    </section>

                    {/* Section 2: Flowchart */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-8 text-2xl font-bold text-gray-900">Process Diagram</h2>

                        {/* SVG Flowchart */}
                        <div className="overflow-x-auto">
                            <svg width="800" height="400" viewBox="0 0 800 400" className="mx-auto">
                                <defs>
                                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                                        <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
                                    </marker>
                                </defs>

                                {/* Nodes */}
                                <rect x="50" y="150" width="120" height="60" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                                <text x="110" y="185" textAnchor="middle" className="text-sm font-semibold" fill="#1e40af">Feedstock</text>

                                <rect x="250" y="150" width="120" height="60" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                                <text x="310" y="185" textAnchor="middle" className="text-sm font-semibold" fill="#92400e">HTL Reactor</text>
                                <text x="310" y="230" textAnchor="middle" className="text-xs" fill="#92400e">300°C, 18 MPa</text>

                                <rect x="450" y="150" width="120" height="60" rx="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
                                <text x="510" y="185" textAnchor="middle" className="text-sm font-semibold" fill="#065f46">Separation</text>

                                <rect x="650" y="50" width="100" height="50" rx="8" fill="#fff1f2" stroke="#e11d48" strokeWidth="2" />
                                <text x="700" y="80" textAnchor="middle" className="text-sm" fill="#9f1239">Bio-Oil</text>

                                <rect x="650" y="120" width="100" height="50" rx="8" fill="#f3f4f6" stroke="#4b5563" strokeWidth="2" />
                                <text x="700" y="150" textAnchor="middle" className="text-sm" fill="#1f2937">Gas</text>

                                <rect x="650" y="190" width="100" height="50" rx="8" fill="#fffbeb" stroke="#d97706" strokeWidth="2" />
                                <text x="700" y="220" textAnchor="middle" className="text-sm" fill="#92400e">Char</text>

                                <rect x="650" y="260" width="100" height="50" rx="8" fill="#eff6ff" stroke="#2563eb" strokeWidth="2" />
                                <text x="700" y="290" textAnchor="middle" className="text-sm" fill="#1e40af">Aqueous</text>

                                {/* Arrows */}
                                <line x1="170" y1="180" x2="240" y2="180" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
                                <line x1="370" y1="180" x2="440" y2="180" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />

                                <line x1="570" y1="180" x2="600" y2="180" stroke="#64748b" strokeWidth="2" />
                                <line x1="600" y1="180" x2="600" y2="75" stroke="#64748b" strokeWidth="2" />
                                <line x1="600" y1="75" x2="640" y2="75" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />

                                <line x1="600" y1="180" x2="600" y2="145" stroke="#64748b" strokeWidth="2" />
                                <line x1="600" y1="145" x2="640" y2="145" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />

                                <line x1="600" y1="180" x2="600" y2="215" stroke="#64748b" strokeWidth="2" />
                                <line x1="600" y1="215" x2="640" y2="215" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />

                                <line x1="600" y1="180" x2="600" y2="285" stroke="#64748b" strokeWidth="2" />
                                <line x1="600" y1="285" x2="640" y2="285" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />

                            </svg>
                        </div>
                    </section>

                    {/* Section 3: Kinetics */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">Kinetic Model</h2>
                        <div className="grid gap-8 md:grid-cols-2">
                            <div>
                                <p className="mb-4 text-gray-600">
                                    Model kinetika yang digunakan adalah <strong>Lumped Component Model</strong> dimana biomassa diasumsikan
                                    terdekomposisi menjadi tiga produk utama melalui reaksi orde satu paralel.
                                </p>
                                <ul className="ml-5 list-disc space-y-2 text-gray-600">
                                    <li>k₁: Biomass → Bio-oil</li>
                                    <li>k₂: Biomass → Gas</li>
                                    <li>k₃: Biomass → Char</li>
                                </ul>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-900 p-6 font-mono text-gray-100">
                                <p className="mb-2">Rate Constant (Arrhenius):</p>
                                <p className="text-xl text-yellow-400">k = A · exp(-Ea / RT)</p>
                                <div className="my-4 h-px w-full bg-gray-700"></div>
                                <p className="mb-2">Reaction Rate:</p>
                                <p className="text-xl text-green-400">dC/dt = -k · C_biomass</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
