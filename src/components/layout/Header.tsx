"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-2 lg:h-24 lg:px-4">

                {/* Logos Section */}
                <div className="flex items-center gap-2 lg:gap-6">
                    <div className="relative h-[35px] w-[35px] overflow-hidden rounded-full border-2 border-slate-100 shadow-sm lg:h-[55px] lg:w-[55px]">
                        <Image
                            src="/assets/Logo_Undip.jpeg"
                            alt="Logo UNDIP"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="relative h-[35px] w-[35px] overflow-hidden rounded-full border-2 border-slate-100 shadow-sm lg:h-[55px] lg:w-[55px]">
                        <Image
                            src="/assets/Logo_ITB.png"
                            alt="Logo ITB"
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <div className="relative h-[35px] w-[35px] overflow-hidden rounded-full border-2 border-slate-100 shadow-sm lg:h-[55px] lg:w-[55px]">
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
                        <h1 className="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 bg-clip-text text-4xl font-extrabold tracking-[0.2em] text-transparent drop-shadow-sm transition-all hover:opacity-90 lg:text-6xl lg:tracking-[0.25em]">
                            AERO
                        </h1>
                    </Link>
                </div>

                {/* Right Section - Hamburger Menu */}
                <div className="relative flex items-center">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 focus:outline-none"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-xl backdrop-blur-xl">
                            <Link
                                href="/"
                                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Simulasi
                            </Link>
                            <Link
                                href="/about"
                                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Metodologi
                            </Link>
                            <Link
                                href="/documentation"
                                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Dokumentasi
                            </Link>
                            <Link
                                href="/team"
                                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Tim Kami
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
