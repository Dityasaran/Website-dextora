"use client";

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { Sparkles, Video, Clapperboard, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Navbar = () => {
    const navRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const activeClasses = ["bg-background/80", "backdrop-blur-xl", "border-white/5", "shadow-2xl"];
            ScrollTrigger.create({
                start: "top -100px",
                end: 99999,
                onToggle: (self) => {
                    if (!navRef.current) return;
                    if (self.isActive) {
                        navRef.current.classList.add(...activeClasses);
                        navRef.current.classList.remove("border-transparent", "bg-transparent");
                    } else {
                        navRef.current.classList.remove(...activeClasses);
                        navRef.current.classList.add("border-transparent", "bg-transparent");
                    }
                }
            });
        }, navRef);
        return () => ctx.revert();
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 px-4 pointer-events-none">
            <nav
                ref={navRef}
                className="pointer-events-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 w-full max-w-5xl bg-transparent border border-transparent"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7B61FF] to-[#38bdf8] flex items-center justify-center">
                        <Clapperboard size={16} className="text-white" />
                    </div>
                    <span className="font-heading font-bold text-lg tracking-tight">Dextora<span className="text-[#7B61FF]">Studio</span></span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                    <a href="#engine" className="hover:text-white transition-colors">Engine</a>
                    <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
                    <a href="#reels" className="hover:text-white transition-colors">Reels</a>
                    <a href="#philosophy" className="hover:text-white transition-colors">Manifesto</a>
                </div>

                <Link href="/studio" className="magnetic-btn px-6 py-2 rounded-full bg-white text-black font-bold text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
                    <Sparkles size={16} className="text-[#7B61FF]" />
                    <span>Launch Studio</span>
                </Link>
            </nav>
        </div>
    );
};
