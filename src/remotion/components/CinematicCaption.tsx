import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface CinematicCaptionProps {
    text: string;
    style?: "modern" | "bold" | "ugc";
}

export const CinematicCaption: React.FC<CinematicCaptionProps> = ({
    text,
    style = "ugc",
}) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    const words = text.split(" ");

    // Fade out near scene end
    const fadeOut = interpolate(
        frame,
        [durationInFrames - 10, durationInFrames],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Style presets
    const styles = {
        modern: {
            fontSize: 48,
            fontWeight: 800,
            fontFamily: "'Inter', 'SF Pro Display', sans-serif",
            color: "#ffffff",
            activeColor: "#4A6CF7",
            hasBackdrop: true,
        },
        bold: {
            fontSize: 54,
            fontWeight: 900,
            fontFamily: "'Inter', sans-serif",
            color: "#ffffff",
            activeColor: "#FF6B35",
            hasBackdrop: true,
        },
        ugc: {
            fontSize: 56,
            fontWeight: 900,
            fontFamily: "'Inter', sans-serif",
            color: "#ffffff",
            activeColor: "#FACC15", // Yellow highlight like Simora/UGC reels
            hasBackdrop: false,     // No backdrop — clean UGC look
        },
    };

    const preset = styles[style];

    // Which word is currently being spoken
    const wordsPerSecond = 3.2;
    const framesPerWord = Math.max(1, Math.round(fps / wordsPerSecond));
    const activeWordIndex = Math.floor(frame / framesPerWord);

    return (
        <div
            style={{
                position: "absolute",
                bottom: "25%",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                padding: "0 6%",
                opacity: fadeOut,
                zIndex: 200,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "6px 10px",
                    maxWidth: "92%",
                    ...(preset.hasBackdrop
                        ? {
                            background: "rgba(0, 0, 0, 0.4)",
                            backdropFilter: "blur(10px)",
                            padding: "8px 20px",
                            borderRadius: 12,
                        }
                        : { padding: "4px 8px" }),
                }}
            >
                {words.map((word, i) => {
                    const wordDelay = i * 3;
                    const wordFrame = frame - wordDelay;

                    const wordOpacity = interpolate(wordFrame, [0, 5], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    });

                    // User requested precise translate 50px -> 0
                    const wordY = interpolate(wordFrame, [0, 5], [50, 0], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    });

                    const wordScale = spring({
                        frame: Math.max(0, wordFrame),
                        fps,
                        config: { damping: 14, stiffness: 200, mass: 0.4 },
                    });

                    const isActive = i === activeWordIndex % words.length;

                    return (
                        <span
                            key={`caption-${i}-${word}`}
                            style={{
                                fontSize: preset.fontSize,
                                fontFamily: preset.fontFamily,
                                fontWeight: preset.fontWeight,
                                color: isActive ? preset.activeColor : preset.color,
                                opacity: wordOpacity,
                                transform: `translateY(${wordY}px) scale(${wordScale})`,
                                display: "inline-block",
                                textShadow: isActive
                                    ? `0 0 24px ${preset.activeColor}90, 0 3px 12px rgba(0,0,0,0.9)`
                                    : "0 3px 10px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.8)",
                                lineHeight: 1.35,
                                letterSpacing: "-0.02em",
                                textTransform: "uppercase",
                            }}
                        >
                            {word}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};
