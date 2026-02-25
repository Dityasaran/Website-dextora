"use client";

import React from "react";

export interface CaptionStyle {
    fontFamily: string;
    fontSize: number;
    color: string;
    activeColor: string;
    position: "top" | "center" | "bottom";
}

const FONT_OPTIONS = [
    { label: "Inter", value: "'Inter', sans-serif" },
    { label: "Montserrat", value: "'Montserrat', sans-serif" },
    { label: "Outfit", value: "'Outfit', sans-serif" },
    { label: "Bebas Neue", value: "'Bebas Neue', sans-serif" },
];

const COLOR_PRESETS = [
    { label: "White", value: "#FFFFFF" },
    { label: "Cream", value: "#FFF8E1" },
    { label: "Cyan", value: "#00FFFF" },
    { label: "Pink", value: "#FF6B9D" },
];

const HIGHLIGHT_PRESETS = [
    { label: "Yellow", value: "#FACC15" },
    { label: "Orange", value: "#FB923C" },
    { label: "Cyan", value: "#22D3EE" },
    { label: "Green", value: "#4ADE80" },
    { label: "Pink", value: "#F472B6" },
];

interface CaptionControlsProps {
    style: CaptionStyle;
    onChange: (style: CaptionStyle) => void;
}

export const CaptionControls: React.FC<CaptionControlsProps> = ({ style, onChange }) => {
    return (
        <div className="space-y-5">
            <label className="block text-gray-400 mb-1 font-data text-xs uppercase tracking-wider">
                Caption Style
            </label>

            {/* Font Family */}
            <div>
                <label className="block text-gray-500 mb-2 text-xs">Font</label>
                <div className="grid grid-cols-2 gap-2">
                    {FONT_OPTIONS.map((font) => (
                        <button
                            key={font.value}
                            onClick={() => onChange({ ...style, fontFamily: font.value })}
                            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${style.fontFamily === font.value
                                    ? "bg-[#7B61FF]/20 border border-[#7B61FF] text-white"
                                    : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                                }`}
                            style={{ fontFamily: font.value }}
                        >
                            {font.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Size */}
            <div>
                <label className="block text-gray-500 mb-2 text-xs">Size: {style.fontSize}px</label>
                <input
                    type="range"
                    min={32}
                    max={72}
                    value={style.fontSize}
                    onChange={(e) => onChange({ ...style, fontSize: Number(e.target.value) })}
                    className="w-full accent-[#7B61FF]"
                />
            </div>

            {/* Text Color */}
            <div>
                <label className="block text-gray-500 mb-2 text-xs">Text Color</label>
                <div className="flex gap-2">
                    {COLOR_PRESETS.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => onChange({ ...style, color: c.value })}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${style.color === c.value ? "border-[#7B61FF] scale-110" : "border-white/20"
                                }`}
                            style={{ background: c.value }}
                            title={c.label}
                        />
                    ))}
                </div>
            </div>

            {/* Highlight Color */}
            <div>
                <label className="block text-gray-500 mb-2 text-xs">Highlight Color</label>
                <div className="flex gap-2">
                    {HIGHLIGHT_PRESETS.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => onChange({ ...style, activeColor: c.value })}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${style.activeColor === c.value ? "border-white scale-110" : "border-white/20"
                                }`}
                            style={{ background: c.value }}
                            title={c.label}
                        />
                    ))}
                </div>
            </div>

            {/* Position */}
            <div>
                <label className="block text-gray-500 mb-2 text-xs">Position</label>
                <div className="flex gap-2">
                    {(["top", "center", "bottom"] as const).map((pos) => (
                        <button
                            key={pos}
                            onClick={() => onChange({ ...style, position: pos })}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${style.position === pos
                                    ? "bg-[#7B61FF]/20 border border-[#7B61FF] text-white"
                                    : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            {pos}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
