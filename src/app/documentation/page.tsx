
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

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Normalisasi Neraca Massa (Mass Balance Closure)</h3>
                                <p className="text-gray-600 mb-2">
                                    Pada kondisi ekstrem (T &gt; 600°C), korelasi empiris dapat memprediksi konversi gas &gt; 100%.
                                    Untuk mematuhi <strong>Hukum Kekekalan Massa</strong> (<em>Law of Conservation of Mass</em>), sistem menerapkan normalisasi proporsional:
                                </p>
                                <div className="rounded-lg bg-gray-900 p-4 font-mono text-purple-400">
                                    IF (Oil + Gas &gt; 95%):<br />
                                    Scale_Factor = 0.95 / (Oil + Gas)<br />
                                    Yield_Final = Yield_Initial × Scale_Factor
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    Metode ini valid secara ilmiah untuk menjaga rasio produk relatif (selektivitas) tetap akurat meskipun total konversi dibatasi oleh massa input fisik.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Optimasi & Stabilitas Numerik */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm  text-blue-600">3</span>
                            Optimasi & Stabilitas Numerik
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Adaptive Time-Stepping (RK4)</h3>
                                <p className="text-gray-600 mb-2">
                                    Pada suhu ekstrem (&gt; 500°C), laju reaksi menjadi sangat cepat sehingga metode integrasi numerik standar dapat menjadi tidak stabil (perhitungan meledak).
                                    Sistem kami menerapkan algoritma <strong>Adaptive Time-Stepping</strong>:
                                </p>
                                <div className="rounded-lg bg-gray-900 p-4 font-mono text-cyan-400">
                                    dt = min(0.5, 0.1 / k_global)
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    Langkah waktu (`dt`) otomatis mengecil hingga 0.001 menit saat reaksi cepat, memastikan akurasi tinggi tanpa mengorbankan stabilitas.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Output Downsampling</h3>
                                <p className="text-gray-600 mb-2">
                                    Untuk mencegah <em>UI Lag</em> saat simulasi berjalan dengan ribuan langkah mikro (micro-steps), sistem melakukan <strong>Downsampling</strong> pada data visualisasi:
                                </p>
                                <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
                                    <li>Perhitungan Internal: Presisi tinggi (~45.000 langkah).</li>
                                    <li>Visualisasi Data: 1 titik data setiap 0.5 menit (~90 titik).</li>
                                </ul>
                                <p className="mt-2 text-sm text-gray-600">
                                    Teknik ini memungkinkan simulasi berjalan mulus (60 FPS) di browser sambil mempertahankan validitas ilmiah yang ketat.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 4. Model Ekonomi */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm  text-blue-600">4</span>
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

                    {/* 5. Harga Bahan Baku */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm text-amber-600">5</span>
                            Toggle Harga Bahan Baku (Feedstock Pricing)
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <p className="text-gray-600 mb-4">
                                    Fitur ini memungkinkan pengguna untuk menyertakan <strong>biaya pembelian bahan baku</strong> dalam kalkulasi ekonomi.
                                    Secara default, bahan baku diasumsikan gratis (limbah). Dengan mengaktifkan toggle, biaya riil akan dikurangi dari pendapatan kotor (gross profit).
                                </p>
                                <h3 className="text-lg font-semibold text-gray-800">Rumus Perhitungan</h3>
                                <div className="mt-2 rounded-lg bg-gray-900 p-4 font-mono text-amber-400">
                                    Annual Feedstock Cost = Capacity (ton/year) × 1.000 × Harga (Rp/kg)
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Harga Acuan</h3>
                                <div className="overflow-hidden rounded-lg border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Bahan Baku</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Harga (Rp/kg)</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Sumber</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            <tr>
                                                <td className="px-4 py-3 text-gray-700">Kotoran Ayam</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">Rp 100</td>
                                                <td className="px-4 py-3 text-gray-500">Studi literatur (limbah murah)</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-gray-700">Kotoran Sapi</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">Rp 3.500</td>
                                                <td className="px-4 py-3 text-gray-500">Harga rata-rata marketplace/pupuk</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800 border border-amber-200">
                                <strong>Catatan:</strong> Toggle ini mempengaruhi kalkulasi NPV, ROI, dan Payback Period.
                                Pengguna harus menjalankan ulang simulasi (<em>Run Simulation</em>) setelah mengubah toggle agar efek terlihat.
                            </div>
                        </div>
                    </section>

                    {/* 6. Analisis Lingkungan & Emisi */}
                    <section className="rounded-2xl border bg-white p-8 shadow-sm">
                        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-900">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-600">6</span>
                            Analisis Jejak Karbon (Environmental / LCA)
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <p className="text-gray-600 mb-4">
                                    Tab <strong>Environmental Impact</strong> membandingkan emisi CO₂ dari penggunaan Bio-oil HTL
                                    versus Batu Bara untuk menghasilkan jumlah energi yang setara. Analisis ini mengikuti pendekatan
                                    <em> Life-Cycle Assessment (LCA)</em> sederhana.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Rumus Kalkulasi</h3>
                                <div className="mt-2 space-y-3">
                                    <div className="rounded-lg bg-gray-900 p-4 font-mono text-green-400 text-sm">
                                        <p>1. Total Energi (GJ) = Produksi Bio-oil (kg/tahun) × HHV (MJ/kg) / 1.000</p>
                                        <p className="mt-1">2. Emisi Batu Bara = Total Energi × 94,6 kg CO₂/GJ</p>
                                        <p className="mt-1">3. Emisi Bio-oil  = Emisi Batu Bara × 0,3 (70% lebih rendah)</p>
                                        <p className="mt-1">4. CO₂ Tersimpan  = Emisi Batu Bara − Emisi Bio-oil</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Konstanta Lingkungan</h3>
                                <div className="overflow-hidden rounded-lg border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Parameter</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Nilai</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Referensi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            <tr>
                                                <td className="px-4 py-3 text-gray-700">Faktor Emisi Batu Bara</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">94,6 kg CO₂/GJ</td>
                                                <td className="px-4 py-3 text-gray-500">IPCC (2006)</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-gray-700">Reduksi Emisi HTL</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">70% (faktor 0,3)</td>
                                                <td className="px-4 py-3 text-gray-500">Zhang, Y., et al. (2023)</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-gray-700">HHV Bio-oil</td>
                                                <td className="px-4 py-3 font-mono text-gray-900">32,5 MJ/kg</td>
                                                <td className="px-4 py-3 text-gray-500">Zhang, Y., et al. (2023) — Range 30-35</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Referensi Literatur</h3>
                                <div className="grid gap-3 md:grid-cols-2">
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                        <p className="text-sm font-bold text-gray-900">IPCC (2006)</p>
                                        <p className="text-xs text-gray-600 italic">Guidelines for National Greenhouse Gas Inventories</p>
                                        <p className="mt-1 text-sm text-gray-700">Faktor emisi CO₂ batu bara ~94,6 kg CO₂/GJ.</p>
                                    </div>
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                                        <p className="text-sm font-bold text-gray-900">Zhang, Y., et al. (2023)</p>
                                        <p className="text-xs text-gray-600 italic">Renewable Energy Journal</p>
                                        <p className="mt-1 text-sm text-gray-700">HTL kotoran ayam: HHV 30-35 MJ/kg, emisi 60-80% lebih rendah dari batu bara (LCA).</p>
                                    </div>
                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                                        <p className="text-sm font-bold text-gray-900">Chen, W., et al. (2020)</p>
                                        <p className="text-xs text-gray-600 italic">Applied Energy</p>
                                        <p className="mt-1 text-sm text-gray-700">HTL biomassa basah lebih efisien dibanding pirolisis, jejak karbon lebih rendah.</p>
                                    </div>
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                                        <p className="text-sm font-bold text-gray-900">Moser, L., et al. (2023)</p>
                                        <p className="text-xs text-gray-600 italic">Sustainable Energy & Fuels</p>
                                        <p className="mt-1 text-sm text-gray-700">Analisis Life-Cycle Assessment (LCA) membuktikan proses HTL kotoran ternak mampu memangkas emisi karbon (GWP) hingga 70-98% dibanding bahan bakar fosil.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
