
import Link from 'next/link';
import { Header } from "@/components/layout/Header";
import { ArrowRight, Factory, LineChart, FlaskConical } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl space-y-8">
            <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
              LKTIN AEROSPACE 2026
            </span>

            <h1 className="text-5xl font-bold tracking-tight text-gray-900 md:text-7xl">
              Integrasi <span className="text-blue-600">Hydrothermal Liquefaction</span> dan <span className="text-emerald-600">Digital Twin</span>
            </h1>

            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Platform simulasi komprehensif produksi bio-oil dari limbah peternakan ayam untuk analisis tekno-ekonomi substitusi bahan bakar industri berat.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/simulation"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-200 sm:w-auto"
              >
                Mulai Simulasi <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:bg-gray-50 sm:w-auto"
              >
                Metodologi
              </Link>
              <Link
                href="/documentation"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:bg-gray-50 sm:w-auto"
              >
                Dokumentasi
              </Link>
              <Link
                href="/team"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:bg-gray-50 sm:w-auto"
              >
                Tim Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <FlaskConical className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Bio-Oil Production</h3>
              <p className="text-gray-600">Simulasi kinetika reaksi HTL dari biomassa menjadi bio-oil, gas, dan char.</p>
            </div>

            <div className="rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Factory className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Process Digital Twin</h3>
              <p className="text-gray-600">Visualisasi 3D interaktif layout pabrik dan aliran proses produksi real-time.</p>
            </div>

            <div className="rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Techno-Economic</h3>
              <p className="text-gray-600">Analisis kelayakan ekonomi lengkap (NPV, ROI, IRR) untuk skala industri.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
