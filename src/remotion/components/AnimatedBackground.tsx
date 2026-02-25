import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface AnimatedBackgroundProps {
    type?: "gradient" | "radialPulse" | "particles" | "aurora";
    colors?: string[];
    speed?: number;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
    type = "gradient",
    colors = ["#0f0c29", "#302b63", "#24243e"],
    speed = 1,
}) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    // Slow zoom for depth
    const scale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
        extrapolateRight: "clamp",
    });

    // Rotation for dynamic feel
    const rotate = interpolate(frame, [0, durationInFrames], [0, 3 * speed], {
        extrapolateRight: "clamp",
    });

    // GPU Hardware Acceleration String
    const getGPUTransform = (baseScale: number, baseRotate: number = 0) => {
        return `scale3d(${baseScale}, ${baseScale}, 1) rotate3d(0, 0, 1, ${baseRotate}deg)`;
    };

    if (type === "radialPulse") {
        const pulse = interpolate(frame, [0, 60, 120], [0.8, 1.2, 0.8], {
            extrapolateRight: "extend",
        });
        return (
            <AbsoluteFill
                style={{
                    background: `radial-gradient(ellipse at 50% 50%, ${colors[0]} 0%, ${colors[1] || "#000"} 60%, ${colors[2] || "#000"} 100%)`,
                    transform: getGPUTransform(pulse * scale),
                    transformOrigin: "center center",
                    willChange: "transform"
                }}
            />
        );
    }

    if (type === "aurora") {
        const shift1 = interpolate(frame, [0, durationInFrames], [0, 360 * speed]);
        const shift2 = interpolate(frame, [0, durationInFrames], [180, 540 * speed]);
        return (
            <AbsoluteFill style={{ overflow: "hidden" }}>
                <div
                    style={{
                        position: "absolute",
                        inset: "-50%",
                        background: `
                            radial-gradient(ellipse 120% 80% at ${30 + Math.sin(shift1 * 0.0174) * 20}% ${40 + Math.cos(shift1 * 0.0174) * 15}%, ${colors[0]}88 0%, transparent 50%),
                            radial-gradient(ellipse 100% 60% at ${70 + Math.cos(shift2 * 0.0174) * 20}% ${60 + Math.sin(shift2 * 0.0174) * 15}%, ${colors[1] || colors[0]}66 0%, transparent 50%),
                            linear-gradient(180deg, #050510 0%, #0a0a1a 100%)
                        `,
                        transform: getGPUTransform(scale, rotate),
                        transformOrigin: "center center",
                        willChange: "transform"
                    }}
                />
            </AbsoluteFill>
        );
    }

    if (type === "particles") {
        const particles = Array.from({ length: 30 }, (_, i) => {
            const x = (i * 137.5) % 100;
            const baseY = (i * 97.3) % 100;
            const y = baseY - (frame * 0.3 * (0.5 + (i % 3) * 0.3)) % 120;
            const size = 2 + (i % 5) * 1.5;
            const opacity = interpolate(
                (y + 120) % 120,
                [0, 30, 90, 120],
                [0, 0.6, 0.6, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: `${x}%`,
                        top: `${y}%`,
                        width: size,
                        height: size,
                        borderRadius: "50%",
                        background: colors[i % colors.length],
                        opacity,
                        boxShadow: `0 0 ${size * 3}px ${colors[i % colors.length]}`,
                        transform: "translate3d(0,0,0)",
                        willChange: "opacity"
                    }}
                />
            );
        });

        return (
            <AbsoluteFill
                style={{
                    background: `linear-gradient(135deg, ${colors[0]}15, #000000, ${colors[1] || colors[0]}10)`,
                    transform: getGPUTransform(scale),
                    transformOrigin: "center center",
                    willChange: "transform"
                }}
            >
                {particles}
            </AbsoluteFill>
        );
    }

    // Default: animated gradient
    const gradientAngle = interpolate(frame, [0, durationInFrames], [135, 225 * speed]);
    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(${gradientAngle}deg, ${colors.join(", ")})`,
                transform: getGPUTransform(scale),
                transformOrigin: "center center",
                willChange: "transform"
            }}
        />
    );
};
