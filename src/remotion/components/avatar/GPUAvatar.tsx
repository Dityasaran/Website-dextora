import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const GPUAvatar: React.FC<{
    speaking: boolean;
    durationInFrames: number;
}> = ({ speaking, durationInFrames }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // --- GPU 3D BREATHING ODD-EVEN ANIMATION ---
    // A constant subtle chest heave mapped to translate3d and scale3d to guarantee GPU compositing.
    const breathScale = interpolate(
        Math.sin(frame / 15),
        [-1, 1],
        [1.0, 1.02]
    );
    const breathY = interpolate(
        Math.sin(frame / 15),
        [-1, 1],
        [0, -4] // Move up 4 pixels on inhale
    );

    // --- GPU 3D BLINKING ANIMATION ---
    // Blink every ~120 frames (4 seconds at 30fps)
    const isBlinking = frame % 120 < 4;

    // --- GPU 3D LIP-SYNC PROXY ---
    // When `speaking` is true, the mouth rapidly interpolates between 3 simulated SVG nodes based on modulo math, mimicking syllables.
    const getMouthState = () => {
        if (!speaking) return "closed";
        const syllableCycle = frame % 12;
        if (syllableCycle < 4) return "open";
        if (syllableCycle < 8) return "wide";
        return "closed";
    };

    const mouthState = getMouthState();

    return (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", overflow: "hidden" }}>

            {/* 3D Hardware Accelerated Container */}
            <div
                style={{
                    position: "relative",
                    width: "400px",
                    height: "500px",
                    transform: `translate3d(0px, ${breathY}px, 0px) scale3d(${breathScale}, ${breathScale}, 1)`,
                    transformOrigin: "bottom center",
                    willChange: "transform" // Force GPU layer
                }}
            >
                {/* --- AVATAR BODY (SVG) --- */}
                <svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">

                    {/* Shoulders & Chest */}
                    <path d="M50 500 C50 350, 150 300, 200 300 C250 300, 350 350, 350 500 Z" fill="#2A2A35" />

                    {/* Neck */}
                    <rect x="180" y="250" width="40" height="60" fill="#E8C3A6" />

                    {/* Head */}
                    <circle cx="200" cy="200" r="75" fill="#FAD6B1" />

                    {/* Left Eye */}
                    <ellipse cx="170" cy="180" rx="10" ry={isBlinking ? 1 : 12} fill="#18181B" style={{ transition: "ry 0.05s ease" }} />
                    <circle cx="170" cy="178" r="3" fill="white" opacity={isBlinking ? 0 : 0.8} />

                    {/* Right Eye */}
                    <ellipse cx="230" cy="180" rx="10" ry={isBlinking ? 1 : 12} fill="#18181B" style={{ transition: "ry 0.05s ease" }} />
                    <circle cx="230" cy="178" r="3" fill="white" opacity={isBlinking ? 0 : 0.8} />

                    {/* Nose */}
                    <path d="M200 180 L195 210 L205 210 Z" fill="#E8C3A6" opacity="0.8" />

                    {/* Mouth (Dynamic Lip Sync) */}
                    {mouthState === "closed" && (
                        <path d="M180 235 Q200 240 220 235" stroke="#18181B" strokeWidth="4" strokeLinecap="round" fill="none" />
                    )}

                    {mouthState === "open" && (
                        <ellipse cx="200" cy="235" rx="15" ry="8" fill="#18181B" />
                    )}

                    {mouthState === "wide" && (
                        <path d="M180 235 Q200 255 220 235 Z" fill="#18181B" />
                    )}

                </svg>
            </div>

        </AbsoluteFill>
    );
};
