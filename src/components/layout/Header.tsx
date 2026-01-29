
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-2 lg:h-24 lg:px-4">

                {/* Logos Section */}
                <div className="hidden items-center gap-2 lg:flex lg:gap-6">
                    <div className="relative h-[40px] w-[40px] overflow-hidden rounded-full border-2 border-slate-100 shadow-sm lg:h-[60px] lg:w-[60px]">
                        <Image
                            src="/assets/Logo_Undip.jpeg"
                            alt="Logo UNDIP"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="relative h-[40px] w-[40px] overflow-hidden rounded-full border-2 border-slate-100 shadow-sm lg:h-[60px] lg:w-[60px]">
                        <Image
                            src="/assets/Logo_ITB.png"
                            alt="Logo ITB"
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <div className="relative h-[40px] w-[40px] overflow-hidden rounded-full border-2 border-slate-100 shadow-sm lg:h-[60px] lg:w-[60px]">
                        <Image
                            src="/assets/Logo_UGM.jpg"
                            alt="Logo UGM"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Center Title */}
                <div className="flex-1 text-center">
                    <Link href="/">
                        <h1 className="bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-3xl font-bold tracking-[0.2em] text-transparent transition-opacity hover:opacity-90 lg:text-5xl lg:tracking-[0.3em]">
                            AERO
                        </h1>
                    </Link>
                </div>

                {/* Right Section */}
                <div className="hidden items-center gap-6 md:flex">
                    <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                        Simulasi
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                        Metodologi
                    </Link>
                    <Link href="/documentation" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                        Dokumentasi
                    </Link>
                </div>
            </div>
        </header>
    );
}
