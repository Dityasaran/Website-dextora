"use client";

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Philosophy = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(textRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
                y: 40,
                opacity: 0,
                duration: 1.5,
                ease: "power2.out"
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="philosophy" ref={sectionRef} className="relative py-40 px-6 md:px-16 bg-[#05050A] overflow-hidden">
            {/* Organic Texture Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-20 mix-blend-overlay grayscale"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop")' }}
            />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <span className="text-[#8a8a9a] text-lg font-medium block mb-6 font-heading">
                    Most standard video tools focus on manual timeline editing.
                </span>

                <h2 ref={textRef} className="text-4xl md:text-6xl text-white leading-tight">
                    <span className="block font-heading font-bold tracking-tight">We focus on total</span>
                    <span className="block font-drama italic text-[#38bdf8] mt-2">Cinematic Automation.</span>
                </h2>
            </div>
        </section>
    );
};
