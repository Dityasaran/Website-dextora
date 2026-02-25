"use client";

import React from "react";

interface TimelineProps {
    scenes: any[];
    selectedIndex: number;
    onSelectScene: (index: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
    scenes,
    selectedIndex,
    onSelectScene,
}) => {
    const totalDuration = scenes.reduce((acc: number, s: any) => acc + (s.duration || 5), 0);

    return (
        <div className="w-full">
            <label className="block text-gray-400 mb-2 font-data text-xs uppercase tracking-wider">
                Timeline
            </label>
            <div className="flex gap-1 h-12 w-full rounded-xl overflow-hidden bg-[#05050A] border border-white/10 p-1">
                {scenes.map((scene: any, i: number) => {
                    const width = ((scene.duration || 5) / totalDuration) * 100;
                    const isSelected = selectedIndex === i;

                    return (
                        <button
                            key={i}
                            onClick={() => onSelectScene(i)}
                            className={`
                                relative h-full rounded-lg flex items-center justify-center transition-all duration-200
                                ${isSelected
                                    ? "bg-gradient-to-r from-[#7B61FF] to-[#38bdf8] shadow-lg"
                                    : "bg-white/10 hover:bg-white/20"
                                }
                            `}
                            style={{ width: `${width}%`, minWidth: "30px" }}
                            title={`Scene ${i + 1}: ${scene.script?.slice(0, 30) || ""}...`}
                        >
                            <span className={`text-[10px] font-bold ${isSelected ? "text-white" : "text-gray-400"}`}>
                                {i + 1}
                            </span>
                            {/* Duration label */}
                            <span className={`absolute bottom-0.5 text-[8px] ${isSelected ? "text-white/70" : "text-gray-600"}`}>
                                {scene.duration || 5}s
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
