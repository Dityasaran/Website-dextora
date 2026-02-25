import React, { useMemo } from "react";
import {
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    AbsoluteFill,
} from "remotion";
import {
    getAvatarPreset,
    generateAvatarHead,
    generateAvatarEyebrows,
    generateAvatarEyes,
    generateAvatarMouthClosed,
    generateAvatarMouthSmallOpen,
    generateAvatarMouthMediumOpen,
    generateAvatarMouthWideOpen,
    generateAvatarBody,
    generateAvatarArmLeft,
    generateAvatarArmRight,
} from "./avatarLibrary";

type AvatarGesture = "explaining" | "pointing" | "waving" | "idle";

interface ReusableAvatarProps {
    speaking: boolean;
    gesture?: AvatarGesture;
    avatarId?: string; // Selects from avatar library
}

export const ReusableAvatar: React.FC<ReusableAvatarProps> = ({
    speaking,
    gesture = "explaining",
    avatarId = "alex",
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const t = frame / fps;

    // --- Generate SVG layers from avatar preset ---
    const preset = useMemo(() => getAvatarPreset(avatarId), [avatarId]);
    const headSvg = useMemo(() => generateAvatarHead(preset), [preset]);
    const eyebrowsSvg = useMemo(() => generateAvatarEyebrows(preset), [preset]);
    const eyesSvg = useMemo(() => generateAvatarEyes(preset), [preset]);
    const mouthClosedSvg = useMemo(() => generateAvatarMouthClosed(preset), [preset]);
    const mouthSmallSvg = useMemo(() => generateAvatarMouthSmallOpen(), []);
    const mouthMediumSvg = useMemo(() => generateAvatarMouthMediumOpen(), []);
    const mouthWideSvg = useMemo(() => generateAvatarMouthWideOpen(), []);
    const bodySvg = useMemo(() => generateAvatarBody(preset), [preset]);
    const armLeftSvg = useMemo(() => generateAvatarArmLeft(preset), [preset]);
    const armRightSvg = useMemo(() => generateAvatarArmRight(preset), [preset]);

    // --- 1. LIP SYNC SYLLABLE MATCHING (4-Stage) ---
    const jawWave = Math.sin(t * 8.0) * 0.4 + Math.sin(t * 13.0) * 0.4 + Math.sin(t * 19.0) * 0.2;

    let mouthSvg = mouthClosedSvg;
    if (speaking) {
        if (jawWave > 0.6) {
            mouthSvg = mouthWideSvg;
        } else if (jawWave > 0.2) {
            mouthSvg = mouthMediumSvg;
        } else if (jawWave > -0.2) {
            mouthSvg = mouthSmallSvg;
        } else {
            mouthSvg = mouthClosedSvg;
        }
    }

    // --- 2. HEAD MOTION (-2deg to 2deg slowly) ---
    const headTilt = speaking
        ? interpolate(Math.sin(t * 2.0), [-1, 1], [-2, 2])
        : interpolate(Math.sin(t * 0.5), [-1, 1], [-0.5, 0.5]);

    // Head Y micro motion (translateY: 0 to -4px)
    const headY = interpolate(Math.sin(t * 1.8), [-1, 1], [0, -4]);

    // --- Eyebrow Motion (Raises when speaking loudly) ---
    const eyebrowY = speaking && jawWave > 0.5 ? -2 : 0;

    // --- 3. BODY MOTION ---
    // Body breathing: scale 1 to 1.02 to 1, translateY: 0 to -6px to 0
    const bodyScale = interpolate(Math.sin(t * 1.5), [-1, 1], [1.0, 1.02]);
    const bodyY = interpolate(Math.sin(t * 1.5 * Math.PI), [-1, 1], [0, -6]);

    // --- 4. ARM GESTURE MOTION (0 to -12px, rotate 0 to 8deg) ---
    const armY = speaking ? interpolate(Math.sin(t * 4.0), [-1, 1], [0, -12]) : 0;

    let leftArmRotate = 0;
    let rightArmRotate = 0;

    if (gesture === "waving") {
        rightArmRotate = interpolate(Math.sin(t * 8.0), [-1, 1], [-15, 15]);
    } else if (gesture === "explaining") {
        leftArmRotate = interpolate(Math.sin(t * 3.0), [-1, 1], [-4, 4]);
        rightArmRotate = interpolate(Math.sin(t * 3.5), [-1, 1], [0, 8]);
    } else if (gesture === "pointing") {
        rightArmRotate = -25 + interpolate(Math.sin(t * 2.0), [-1, 1], [-2, 2]);
    }

    // --- 5. EYE BLINKING (Every 2-4 seconds randomly) ---
    const blinkInterval = 60 + (frame * 7) % 60;
    const blinkPhase = frame % blinkInterval;
    const isBlinking = blinkPhase >= 0 && blinkPhase < 3;

    // Global Position & Scale overlay (1.0 to 1.05 slowly)
    const globalScale = interpolate(frame, [0, 150], [1.0, 1.05], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill
            style={{
                background: "transparent",
                pointerEvents: "none"
            }}
        >
            <div
                style={{
                    position: "absolute",
                    bottom: "-10px",
                    left: "50%",
                    width: "600px",
                    height: "650px",
                    transform: `translateX(-50%) scale(${globalScale})`,
                    transformOrigin: "bottom center",
                    background: "transparent",
                    filter: "drop-shadow(0px 15px 40px rgba(0,0,0,0.25))",
                }}
            >
                {/* --- BACK ARM LAYER --- */}
                <div
                    style={{
                        position: "absolute",
                        top: 150,
                        left: -50,
                        width: "300px",
                        height: "400px",
                        transform: `translateY(${armY}px) rotate(${leftArmRotate}deg)`,
                        transformOrigin: "top right",
                    }}
                    dangerouslySetInnerHTML={{ __html: armLeftSvg }}
                />

                {/* --- BODY LAYER --- */}
                <div
                    style={{
                        position: "absolute",
                        top: 140,
                        left: 0,
                        width: "600px",
                        height: "400px",
                        transform: `scale(${bodyScale}) translateY(${bodyY}px)`,
                        transformOrigin: "top center",
                    }}
                    dangerouslySetInnerHTML={{ __html: bodySvg }}
                />

                {/* --- HEAD & FACE LAYER --- */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 200,
                        width: "200px",
                        height: "250px",
                        transform: `rotate(${headTilt}deg) translateY(${headY}px)`,
                        transformOrigin: "center 80%",
                    }}
                >
                    {/* 1. Base Head */}
                    <div dangerouslySetInnerHTML={{ __html: headSvg }} />

                    {/* 2. Eyes (Blink toggle) */}
                    {!isBlinking && (
                        <div
                            style={{ position: "absolute", top: 0, left: 0 }}
                            dangerouslySetInnerHTML={{ __html: eyesSvg }}
                        />
                    )}

                    {/* 3. Eyebrows (Dynamic Y) */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            transform: `translateY(${eyebrowY}px)`,
                        }}
                        dangerouslySetInnerHTML={{ __html: eyebrowsSvg }}
                    />

                    {/* 4. Mouth (4-Stage Sync) */}
                    <div
                        style={{ position: "absolute", top: 0, left: 0 }}
                        dangerouslySetInnerHTML={{ __html: mouthSvg }}
                    />
                </div>

                {/* --- FRONT ARM LAYER --- */}
                <div
                    style={{
                        position: "absolute",
                        top: 150,
                        left: 350,
                        width: "300px",
                        height: "400px",
                        transform: `translateY(${armY}px) rotate(${rightArmRotate}deg)`,
                        transformOrigin: "top left",
                    }}
                    dangerouslySetInnerHTML={{ __html: armRightSvg }}
                />
            </div>
        </AbsoluteFill>
    );
};
