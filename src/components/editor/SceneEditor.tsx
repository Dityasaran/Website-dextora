"use client";

import React, { useState } from "react";
import { Pencil, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

interface SceneEditorProps {
    scenes: any[];
    selectedIndex: number;
    onSelectScene: (index: number) => void;
    onUpdateScene: (index: number, updates: Partial<any>) => void;
    onRegenerateTTS: (index: number) => void;
}

const GESTURE_OPTIONS = [
    { label: "Explaining", value: "explaining" },
    { label: "Pointing", value: "pointing" },
    { label: "Waving", value: "waving" },
    { label: "Idle", value: "idle" },
];

export const SceneEditor: React.FC<SceneEditorProps> = ({
    scenes,
    selectedIndex,
    onSelectScene,
    onUpdateScene,
    onRegenerateTTS,
}) => {
    const [expandedScene, setExpandedScene] = useState<number>(selectedIndex);

    const toggleExpand = (index: number) => {
        setExpandedScene(expandedScene === index ? -1 : index);
        onSelectScene(index);
    };

    return (
        <div className="space-y-2">
            <label className="block text-gray-400 mb-3 font-data text-xs uppercase tracking-wider">
                <Pencil className="w-3 h-3 inline mr-1" /> Scene Editor ({scenes.length} scenes)
            </label>

            {scenes.map((scene, i) => {
                const isExpanded = expandedScene === i;
                const isSelected = selectedIndex === i;

                return (
                    <div
                        key={i}
                        className={`
                            rounded-xl border transition-all duration-200 overflow-hidden
                            ${isSelected
                                ? "border-[#7B61FF]/50 bg-[#7B61FF]/5"
                                : "border-white/10 bg-[#0A0A14]"
                            }
                        `}
                    >
                        {/* Scene Header */}
                        <button
                            onClick={() => toggleExpand(i)}
                            className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${isSelected ? "bg-[#7B61FF] text-white" : "bg-white/10 text-gray-400"
                                        }`}
                                >
                                    {i + 1}
                                </div>
                                <div>
                                    <div className="text-sm font-bold truncate max-w-[200px]">
                                        {scene.script?.slice(0, 40) || `Scene ${i + 1}`}...
                                    </div>
                                    <div className="text-xs text-gray-500">{scene.duration}s • {scene.avatarGesture || "explaining"}</div>
                                </div>
                            </div>
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                        </button>

                        {/* Expanded Edit Panel */}
                        {isExpanded && (
                            <div className="px-3 pb-4 space-y-4 border-t border-white/5 pt-3">
                                {/* Script */}
                                <div>
                                    <label className="block text-gray-500 mb-1 text-xs">Script</label>
                                    <textarea
                                        value={scene.script || ""}
                                        onChange={(e) => onUpdateScene(i, { script: e.target.value })}
                                        className="w-full h-20 bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white resize-none focus:border-[#7B61FF] focus:outline-none"
                                    />
                                    <button
                                        onClick={() => onRegenerateTTS(i)}
                                        className="mt-1 flex items-center gap-1 text-xs text-[#38bdf8] hover:text-[#7dd3fc] transition-colors"
                                    >
                                        <RefreshCw className="w-3 h-3" /> Regenerate Voice
                                    </button>
                                </div>

                                {/* Gesture */}
                                <div>
                                    <label className="block text-gray-500 mb-1 text-xs">Avatar Gesture</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {GESTURE_OPTIONS.map((g) => (
                                            <button
                                                key={g.value}
                                                onClick={() => onUpdateScene(i, { avatarGesture: g.value })}
                                                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${(scene.avatarGesture || "explaining") === g.value
                                                        ? "bg-[#7B61FF]/20 border border-[#7B61FF] text-white"
                                                        : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                                                    }`}
                                            >
                                                {g.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="block text-gray-500 mb-1 text-xs">Duration: {scene.duration}s</label>
                                    <input
                                        type="range"
                                        min={3}
                                        max={8}
                                        step={1}
                                        value={scene.duration}
                                        onChange={(e) => onUpdateScene(i, { duration: Number(e.target.value) })}
                                        className="w-full accent-[#7B61FF]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
