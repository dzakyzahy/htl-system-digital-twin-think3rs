
import { Header } from "@/components/layout/Header";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function Documentation() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto max-w-5xl px-4 py-12">
                <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Dashboard
                </Link>

                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">Dokumentasi & Logika Simulasi</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Penjelasan lengkap mengenai algoritma, rumus fisika-kimia, dan model ekonomi yang berjalan di balik layar sistem Digital Twin ini.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* 1. Alur Simulasi */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm  text-blue-600">1</span>
                            Alur Kerja Simulasi
                        </h2>
                        <div className="prose max-w-none text-gray-600">
                            <p>
                                Saat pengguna menekan tombol <strong>Run Simulation</strong>, sistem melakukan komputasi
                                sekuensial berikut secara real-time:
                            </p>
                            <ol className="mt-4 list-decimal space-y-2 pl-5">
                                <li>
                                    <strong>Input Parsing</strong>: Membaca parameter pengguna (Jenis Bahan Baku, Suhu, Tekanan, Waktu Retensi, Kapasitas).
                                </li>
                                <li>
                                    <strong>Kinetic Calculation</strong>: Menggunakan metode numerik <em>Runge-Kutta 4th Order (RK4)</em> untuk menyelesaikan persamaan diferensial laju reaksi.
                                </li>
                                <li>
                                    <strong>Mass Balance</strong>: Menghitung yield produk akhir (Bio-oil, Gas, Char, Aqueous Phase) berdasarkan hasil kinetika.
                                </li>
                                <li>
                                    <strong>Economic Evaluation</strong>: Menghitung CAPEX, OPEX, dan Profitabilitas (NPV/ROI) menggunakan model biaya teknik kimia.
                                </li>
                            </ol>
                        </div>
                    </section>

                    {/* 2. Model Kinetika */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm  text-blue-600">2</span>
                            Model Kinetika & Termokimia
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Persamaan Arrhenius</h3>
                                <p className="text-gray-600 mb-2">Konstanta laju reaksi (k) dihitung berdasarkan suhu (T):</p>
                                <div className="rounded-lg bg-gray-900 p-4 font-mono text-yellow-400">
                                    k = A · exp(-Ea / R·T)
                                </div>
                                <ul className="mt-2 text-sm text-gray-500">
                                    <li>A: Pre-exponential factor (1.5 × 10⁸ min⁻¹)</li>
                                    <li>Ea: Energi Aktivitas (120 kJ/mol)</li>
                                    <li>R: Konstanta Gas Ideal (8.314 J/mol·K)</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Laju Reaksi (Lumped Model)</h3>
                                <p className="text-gray-600 mb-2">Dekomposisi biomassa diasumsikan mengikuti reaksi orde satu paralel:</p>
                                <div className="rounded-lg bg-gray-900 p-4 font-mono text-green-400">
                                    d(Biomass)/dt = -(k₁ + k₂ + k₃) · Biomass
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    Sistem menyelesaikan persamaan ini setiap 0.5 menit (time step) selama durasi retensi.
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Faktor Koreksi Tekanan (Pressure Correction)</h3>
                                <p className="text-gray-600 mb-2">Inovasi model kami memperhitungkan efek densitas pelarut air:</p>
                                <div className="rounded-lg bg-gray-100 p-4 font-mono text-gray-800 border-l-4 border-blue-500">
                                    Yield_Effective = Yield_Theoretical × Factor_P
                                </div>
                                <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
                                    <li>P &lt; 10 MPa (Sub-critical low): Factor = 0.6 (Gasifikasi mendominasi)</li>
                                    <li>P &gt; 22 MPa: Factor = 1.05 (Solvasi lipid optimal)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 3. Model Ekonomi */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm  text-blue-600">3</span>
                            Analisis Tekno-Ekonomi (TEA)
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Model Biaya Reaktor (Exponential Cost)</h3>
                                <p className="text-gray-600 mb-2">
                                    Sesuai prinsip metalurgi, biaya material reaktor meningkat secara eksponensial pada suhu tinggi
                                    (kebutuhan <em>superalloys</em> seperti Inconel/Hastelloy):
                                </p>
                                <div className="rounded-lg bg-gray-900 p-4 font-mono text-red-400">
                                    CAPEX_Factor = 1 + 0.1 · e^((T - 350) / 100)
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    Rumus ini menyimulasikan lonjakan harga material saat suhu melebihi batas amand baja standar (350°C).
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="rounded-lg border p-4">
                                    <h4 className="font-semibold text-gray-900">Net Present Value (NPV)</h4>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Total nilai investasi saat ini berdasarkan arus kas masa depan yang didiskon (WACC 10%).
                                    </p>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <h4 className="font-semibold text-gray-900">Return on Investment (ROI)</h4>
                                    <p className="mt-1 text-sm text-gray-600">
                                        (Total Profit Bersih / Total Investasi Awal) × 100%. Pemasukan dihitung dari yield bio-oil dikalikan harga pasar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
