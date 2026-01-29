
import { Header } from "@/components/layout/Header";
import Image from 'next/image';
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

                    {/* Section 2: Process Diagrams */}
                    <section className="space-y-8">
                        {/* Skema HTL */}
                        <div className="rounded-2xl border bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">Skema Proses Hydrothermal Liquefaction</h2>
                            <div className="relative h-[300px] w-full overflow-hidden rounded-lg lg:h-[500px]">
                                <Image
                                    src="/assets/skema_htl.png"
                                    alt="Skema Proses HTL"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <p className="mt-4 text-center text-sm text-gray-500">
                                Alur proses konversi biomassa menjadi bio-oil melalui tahapan pemanasan, reaksi, dan separasi.
                            </p>
                        </div>

                        {/* Arsitektur Topologi */}
                        <div className="rounded-2xl border bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">Arsitektur Topologi Digital Twin</h2>
                            <div className="relative h-[300px] w-full overflow-hidden rounded-lg lg:h-[500px]">
                                <Image
                                    src="/assets/arsitektur_topologi.png"
                                    alt="Arsitektur Topologi Digital Twin"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <p className="mt-4 text-center text-sm text-gray-500">
                                Diagram arsitektur sistem Digital Twin yang menghubungkan Layer Fisik (Sensor/Reaktor), Network (IoT), Virtual (Komputasi/Model), hingga Aplikasi (Dashboard).
                            </p>
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
