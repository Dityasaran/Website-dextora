"use client";

import React from "react";
import { AVATAR_PRESETS } from "@/remotion/components/avatar/avatarLibrary";

interface AvatarSelectorProps {
    selectedId: string;
    onSelect: (id: string) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedId, onSelect }) => {
    return (
        <div>
            <label className="block text-gray-400 mb-3 font-data text-xs uppercase tracking-wider">
                Avatar Presenter
            </label>
            <div className="grid grid-cols-3 gap-3">
                {AVATAR_PRESETS.map((avatar) => (
                    <button
                        key={avatar.id}
                        onClick={() => onSelect(avatar.id)}
                        className={`
                            relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                            ${selectedId === avatar.id
                                ? "border-[#7B61FF] bg-[#7B61FF]/10 shadow-[0_0_20px_rgba(123,97,255,0.2)]"
                                : "border-white/10 bg-[#0A0A14] hover:border-white/30 hover:bg-white/5"
                            }
                        `}
                    >
                        {/* Avatar Preview Circle */}
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                            style={{
                                background: `linear-gradient(135deg, ${avatar.skinBase}, ${avatar.skinHighlight})`,
                                border: `3px solid ${avatar.shirtColor}`,
                            }}
                        >
                            {avatar.thumbnail}
                        </div>
                        <span className={`text-xs font-bold tracking-wide ${selectedId === avatar.id ? "text-[#7B61FF]" : "text-gray-400"}`}>
                            {avatar.name}
                        </span>
                        {selectedId === avatar.id && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#7B61FF] animate-pulse" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
