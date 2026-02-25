"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlayCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ReelsPreview = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const phoneRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(phoneRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
                y: 100,
                opacity: 0,
                rotationX: 15,
                duration: 1.5,
                ease: "power3.out"
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="reels" ref={sectionRef} className="py-32 px-6 md:px-16 bg-[#0A0A14] overflow-hidden relative border-t border-white/5">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7B61FF]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
                <div className="flex-1 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight">
                        Generate 9:16 <br /> <span className="text-[#7B61FF] font-drama italic">Avatar Reels.</span>
                    </h2>
                    <p className="text-[#8a8a9a] text-lg max-w-md leading-relaxed">
                        The engine automatically segments scripts into dynamic 5-second alternating blocks: Avatar Narration $\rightarrow$ Cinematic B-Roll $\rightarrow$ Avatar Narration.
                    </p>
                    <ul className="space-y-4 text-white font-medium">
                        <li className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7B61FF]" />
                            Vertical 1080x1920 Export
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7B61FF]" />
                            Lip-synced SVG Avatars
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7B61FF]" />
                            TTS Voice Generation
                        </li>
                    </ul>
                </div>

                <div className="flex-1 flex justify-center lg:justify-end perspective-1000">
                    {/* Simulated Phone Frame */}
                    <div ref={phoneRef} className="relative w-[300px] h-[600px] rounded-[3rem] border-[8px] border-[#18181B] bg-black shadow-[0_0_50px_rgba(123,97,255,0.15)] overflow-hidden">
                        {/* Dynamic Reel Content */}
                        <ReelSimulation />

                        {/* UI Overlay */}
                        <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                            <div className="flex justify-between items-center px-2 pt-2">
                                <span className="text-xs font-bold text-white">9:41</span>
                                <div className="flex gap-1">
                                    <div className="w-4 h-3 rounded-sm bg-white" />
                                </div>
                            </div>
                            <div className="space-y-2 pb-4 px-2">
                                <h3 className="text-white font-bold text-sm shadow-black drop-shadow-md">@dextora_ai</h3>
                                <p className="text-white/80 text-xs shadow-black drop-shadow-md">Cinematic generation in seconds. 🎥✨</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ReelSimulation = () => {
    const [sceneType, setSceneType] = useState<'avatar' | 'visual'>('avatar');

    useEffect(() => {
        // Toggle scene type every 5 seconds to simulate the Reel Composition
        const interval = setInterval(() => {
            setSceneType(prev => prev === 'avatar' ? 'visual' : 'avatar');
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full bg-[#0d0d16]">
            {sceneType === 'avatar' ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1A1A24] to-[#0d0d16]">
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-[#7B61FF] to-[#38bdf8] rounded-full mb-4 animate-pulse-glow" />
                        <span className="text-[#38bdf8] font-data text-xs block mb-1">speaking_duration: 5s</span>
                        <div className="w-32 h-2 mx-auto bg-white/20 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-[#7B61FF] origin-left animate-[scaleX_5s_linear_infinite]" style={{ animationName: 'progress' }} />
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-[5000ms] scale-110"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1080&auto=format&fit=crop")',
                        transform: 'scale(1.0)' // Simulate Remotion interpolate scale
                    }}
                >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
                        <span className="text-white font-data text-xs block mb-1 bg-black/40 inline-px-2 py-1 rounded">visual_duration: 5s</span>
                        <div className="w-32 h-2 mx-auto bg-white/20 rounded-full overflow-hidden mt-4">
                            <div className="w-full h-full bg-[#38bdf8] origin-left animate-[scaleX_5s_linear_infinite]" style={{ animationName: 'progress' }} />
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes progress {
                    0% { transform: scaleX(0); }
                    100% { transform: scaleX(1); }
                }
            `}</style>
        </div>
    );
};
