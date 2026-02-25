"use client";

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

export const Hero = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Background slow zoom
            gsap.from(bgRef.current, {
                scale: 1.1,
                opacity: 0,
                duration: 2.5,
                ease: "power2.out"
            });

            // Text stagger
            if (textRef.current) {
                const elements = textRef.current.children;
                gsap.from(elements, {
                    y: 60,
                    opacity: 0,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "power3.out",
                    delay: 0.3
                });
            }
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full h-[100dvh] flex items-end pb-24 px-6 md:px-16 overflow-hidden">
            {/* Cinematic Background */}
            <div
                ref={bgRef}
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1626226068213-c90a880ae601?q=80&w=2070&auto=format&fit=crop")',
                    backgroundPosition: '50% 30%'
                }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A0A14] via-[#0A0A14]/80 to-transparent" />
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0A0A14] via-[#0A0A14]/50 to-transparent" />

            {/* Content */}
            <div ref={textRef} className="relative z-20 max-w-4xl w-full mx-auto md:mx-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7B61FF]/30 bg-[#7B61FF]/10 backdrop-blur-sm mb-6">
                    <div className="w-2 h-2 rounded-full bg-[#7B61FF] animate-pulse" />
                    <span className="text-xs font-data text-[#7B61FF] font-medium tracking-wide uppercase">Dextora Studio OS v2.4 Online</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl w-full leading-[1.1] text-white">
                    <span className="block font-heading font-bold tracking-tight">Create Videos Beyond</span>
                    <span className="block font-drama italic text-[#7B61FF]">Automation.</span>
                </h1>

                <p className="mt-8 text-lg md:text-xl text-white/60 font-heading max-w-xl leading-relaxed">
                    Dextora Studio allows anyone to create cinematic AI videos, generate automated talking avatars, and render professional Instagram reels instantly.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <Link href="/studio" className="magnetic-btn px-8 py-4 rounded-full bg-white text-black font-bold text-base flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                        <span>Start Creating</span>
                        <ArrowRight size={18} />
                    </Link>
                    <button className="magnetic-btn px-8 py-4 rounded-full bg-white/10 text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-md">
                        <Play size={18} className="fill-white" />
                        <span>Watch Logic Engine</span>
                    </button>
                </div>
            </div>
        </section>
    );
};
