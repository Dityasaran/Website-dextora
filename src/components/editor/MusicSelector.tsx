"use client";

import React from "react";
import { Music, Play, Check } from "lucide-react";

export interface MusicTrack {
    id: string;
    name: string;
    mood: string;
    url: string; // relative to public/
    duration: string;
}

// Built-in royalty-free music tracks (placeholder URLs — replace with real tracks)
export const MUSIC_TRACKS: MusicTrack[] = [
    { id: "none", name: "No Music", mood: "Silent", url: "", duration: "—" },
    { id: "upbeat", name: "Upbeat Energy", mood: "Energetic", url: "/assets/music/upbeat.mp3", duration: "0:30" },
    { id: "chill", name: "Chill Vibes", mood: "Relaxed", url: "/assets/music/chill.mp3", duration: "0:30" },
    { id: "cinematic", name: "Cinematic Rise", mood: "Epic", url: "/assets/music/cinematic.mp3", duration: "0:30" },
    { id: "lofi", name: "Lo-Fi Study", mood: "Calm", url: "/assets/music/lofi.mp3", duration: "0:30" },
    { id: "corporate", name: "Corporate Clean", mood: "Professional", url: "/assets/music/corporate.mp3", duration: "0:30" },
];

const MOOD_COLORS: Record<string, string> = {
    Silent: "#6B7280",
    Energetic: "#EF4444",
    Relaxed: "#3B82F6",
    Epic: "#A855F7",
    Calm: "#10B981",
    Professional: "#F59E0B",
};

interface MusicSelectorProps {
    selectedId: string;
    onSelect: (track: MusicTrack) => void;
}

export const MusicSelector: React.FC<MusicSelectorProps> = ({ selectedId, onSelect }) => {
    return (
        <div>
            <label className="block text-gray-400 mb-3 font-data text-xs uppercase tracking-wider">
                <Music className="w-3 h-3 inline mr-1" /> Background Music
            </label>
            <div className="space-y-2">
                {MUSIC_TRACKS.map((track) => (
                    <button
                        key={track.id}
                        onClick={() => onSelect(track)}
                        className={`
                            w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left
                            ${selectedId === track.id
                                ? "border-[#7B61FF] bg-[#7B61FF]/10"
                                : "border-white/10 bg-[#0A0A14] hover:border-white/20 hover:bg-white/5"
                            }
                        `}
                    >
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `${MOOD_COLORS[track.mood] || "#666"}20` }}
                        >
                            {selectedId === track.id ? (
                                <Check className="w-4 h-4 text-[#7B61FF]" />
                            ) : (
                                <Play className="w-3 h-3" style={{ color: MOOD_COLORS[track.mood] }} />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate">{track.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                <span
                                    className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                                    style={{
                                        background: `${MOOD_COLORS[track.mood] || "#666"}20`,
                                        color: MOOD_COLORS[track.mood],
                                    }}
                                >
                                    {track.mood}
                                </span>
                                <span>{track.duration}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
