
import { Header } from "@/components/layout/Header";
import { ArrowLeft, User, GraduationCap, MapPin } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";

export default function TeamPage() {
    const researchers = [
        {
            name: "Syahid Ma'ashum",
            role: "Principal Investigator",
            uni: "Universitas Gadjah Mada (UGM)",
            major: "Faculty of Animal Science",
            img: "/assets/pp_syahid.jpeg"
        },
        {
            name: "M. Ilham Saripul Milah",
            role: "Process Simulation Engineer",
            uni: "Institut Teknologi Bandung (ITB)",
            major: "Metallurgical Engineering",
            img: "/assets/pp_ilham.jpg"
        },
        {
            name: "Dzaky Zahy Rabbani",
            role: "Software & Digital Twin Architect",
            uni: "Institut Teknologi Bandung (ITB)",
            major: "Oceanography",
            img: "/assets/pp_dzaky.jpg"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto max-w-6xl px-4 py-12">
                <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Link>

                <div className="mb-12 text-center">
                    <span className="mb-2 block text-sm font-semibold uppercase tracking-widest text-blue-600">Our Team</span>
                    <h1 className="text-4xl font-bold text-gray-900">Team Think3rs</h1>
                    <p className="mt-4 text-gray-600">Kolaborasi lintas universitas untuk inovasi energi berkelanjutan Indonesia.</p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {researchers.map((res, i) => (
                        <div key={i} className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                            <div className="relative h-64 w-full bg-gray-100">
                                <Image
                                    src={res.img}
                                    alt={res.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900">{res.name}</h3>
                                <p className="mb-4 text-sm font-medium text-blue-600">{res.role}</p>

                                <div className="space-y-2 text-sm text-gray-500">
                                    <div className="flex items-start gap-2">
                                        <GraduationCap className="mt-0.5 h-4 w-4" />
                                        <span>{res.uni}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{res.major}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Logos again/Instansi */}
                <div className="mt-20 flex flex-col items-center justify-center space-y-6 opacity-60 grayscale transition-all hover:grayscale-0">
                    <h3 className="text-sm font-semibold uppercase text-gray-400">Supported By</h3>
                    <div className="flex items-center gap-12">
                        <div className="relative h-20 w-20">
                            <Image src="/assets/Logo_ITB.png" alt="ITB" fill className="object-contain" />
                        </div>
                        <div className="relative h-20 w-20">
                            <Image src="/assets/Logo_Undip.jpeg" alt="UNDIP" fill className="object-contain" />
                        </div>
                        <div className="relative h-20 w-20">
                            <Image src="/assets/Logo_UGM.jpg" alt="UGM" fill className="object-contain" />
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
