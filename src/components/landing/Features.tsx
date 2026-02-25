"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, Wand2, Terminal, MousePointer2, Settings2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Features = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(titleRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="features" ref={containerRef} className="py-32 px-6 md:px-16 bg-[#0A0A14] overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="mb-20">
                    <h2 ref={titleRef} className="text-4xl md:text-5xl font-heading font-bold text-white max-w-2xl leading-tight">
                        Internal Modules of the <br /> <span className="text-[#38bdf8] italic font-drama">Creative Engine.</span>
                    </h2>
                    <p className="mt-4 text-[#8a8a9a] text-lg max-w-xl">
                        A transparent look into the systems generating your cinematic timelines and avatar reels.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Card 1: Diagnostic Shuffler (Gemini Scene Intelligence) */}
                    <div className="group relative bg-[#0a0a14]/60 bg-blur-glass border border-white/10 rounded-cinematic p-8 h-[400px] flex flex-col justify-between hover:border-[#7B61FF]/50 transition-colors">
                        <div>
                            <div className="w-10 h-10 rounded-full bg-[#7B61FF]/20 flex items-center justify-center mb-6">
                                <Wand2 size={20} className="text-[#7B61FF]" />
                            </div>
                            <h3 className="text-xl font-bold font-heading text-white mb-2">Scene Intelligence Engine</h3>
                            <p className="text-sm text-[#8a8a9a] leading-relaxed">
                                Gemini continuously parses context to output structured cinematic direction, avatar actions, and camera motions.
                            </p>
                        </div>
                        <DiagnosticShuffler />
                    </div>

                    {/* Card 2: Telemetry Typewriter (Veo Render Engine) */}
                    <div className="group relative bg-[#0a0a14]/60 bg-blur-glass border border-white/10 rounded-cinematic p-8 h-[400px] flex flex-col justify-between hover:border-[#38bdf8]/50 transition-colors">
                        <div>
                            <div className="w-10 h-10 rounded-full bg-[#38bdf8]/20 flex items-center justify-center mb-6">
                                <Terminal size={20} className="text-[#38bdf8]" />
                            </div>
                            <h3 className="text-xl font-bold font-heading text-white mb-2">Cinematic Render Engine</h3>
                            <p className="text-sm text-[#8a8a9a] leading-relaxed">
                                Live console telemetry tracking Veo visual compilation, Remotion interpolations, and FFmpeg exporting.
                            </p>
                        </div>
                        <TelemetryTypewriter />
                    </div>

                    {/* Card 3: Cursor Protocol Scheduler (Animation Engine) */}
                    <div className="group relative bg-[#0a0a14]/60 bg-blur-glass border border-white/10 rounded-cinematic p-8 h-[400px] flex flex-col justify-between hover:border-white/30 transition-colors lg:col-span-1 md:col-span-2">
                        <div>
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-6">
                                <Settings2 size={20} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold font-heading text-white mb-2">Animation Timeline</h3>
                            <p className="text-sm text-[#8a8a9a] leading-relaxed">
                                Automated assembly of avatar layers, B-Roll footage, text captions, and TTS audio into a unified timeline.
                            </p>
                        </div>
                        <CursorScheduler />
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Micro-Animations ---

const DiagnosticShuffler = () => {
    const labels = ["Generating Title Sequence", "Parsing Visual Prompts", "Assigning Camera Motion"];
    const [order, setOrder] = useState([0, 1, 2]);

    useEffect(() => {
        const interval = setInterval(() => {
            setOrder((prev) => {
                const newArr = [...prev];
                const last = newArr.pop()!;
                newArr.unshift(last);
                return newArr;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-32 flex flex-col justify-end mt-4">
            {order.map((labelIndex, visualIndex) => {
                const isFront = visualIndex === 2;
                return (
                    <div
                        key={labelIndex}
                        className="absolute w-full py-3 px-4 rounded-xl border border-white/10 flex justify-between items-center bg-[#0d0d16]"
                        style={{
                            transform: `translateY(-${(2 - visualIndex) * 12}px) scale(${1 - (2 - visualIndex) * 0.05})`,
                            opacity: 1 - (2 - visualIndex) * 0.3,
                            zIndex: visualIndex,
                            transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            borderColor: isFront ? 'rgba(123, 97, 255, 0.4)' : 'rgba(255,255,255,0.05)'
                        }}
                    >
                        <span className="text-xs font-data text-white">{labels[labelIndex]}</span>
                        {isFront && <div className="w-2 h-2 rounded-full bg-[#7B61FF] animate-pulse-glow" />}
                    </div>
                );
            })}
        </div>
    );
};

const TelemetryTypewriter = () => {
    const fullText = "Generating cinematic visuals...\nApplying motion animation...\nRendering Remotion composition...\nExporting video...";
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(fullText.slice(0, i));
            i++;
            if (i > fullText.length + 10) {
                i = 0; // Restart animation
            }
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-black/40 rounded-xl p-4 border border-white/5 font-data text-xs h-32 overflow-hidden flex flex-col relative">
            <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                <span className="text-[#8a8a9a]">Terminal • Veo.LRO</span>
            </div>
            <div className="text-[#38bdf8] whitespace-pre-line leading-relaxed flex-1">
                {displayedText}
                <span className="animate-blink inline-block w-2 bg-[#38bdf8] h-3 ml-1" />
            </div>
        </div>
    );
};

const CursorScheduler = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, yoyo: true });

            tl.to(cursorRef.current, {
                x: 80,
                y: 10,
                duration: 1.5,
                ease: "power2.inOut"
            })
                .to(cursorRef.current, { scale: 0.8, duration: 0.1 })
                .to(boxRef.current, { backgroundColor: "rgba(255,255,255,0.2)", scale: 0.95, duration: 0.1 })
                .to(cursorRef.current, { scale: 1, duration: 0.1 })
                .to(boxRef.current, { scale: 1, duration: 0.1 })
                .to(cursorRef.current, {
                    x: 10,
                    y: 60,
                    duration: 1.5,
                    ease: "power2.inOut",
                    delay: 0.5
                });

        }, []);
        return () => ctx.revert();
    }, []);

    return (
        <div className="relative w-full h-32 bg-black/20 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center p-4">
            <div className="w-full flex gap-2 h-full">
                <div className="flex-1 bg-white/5 rounded-lg border border-white/10" />
                <div ref={boxRef} className="flex-1 bg-white/5 rounded-lg border border-white/10 transition-colors" />
                <div className="flex-1 bg-white/5 rounded-lg border border-white/10" />
            </div>

            {/* SVG Cursor Override */}
            <div ref={cursorRef} className="absolute top-4 left-4 z-10 filter drop-shadow-md">
                <MousePointer2 className="text-white fill-white stroke-black" size={24} />
            </div>
        </div>
    );
};
