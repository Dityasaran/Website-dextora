import React from "react";
import {
    AbsoluteFill,
    Img,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    staticFile,
} from "remotion";

interface AnimatedImageSequenceProps {
    images: string[];
    durationInFrames: number;
}

// Cinematic motion presets based on Simora/Freepik quality requirements
// Base requirement: scale 1->1.18, pan 0->-80, vertical 0->-40, rotate 0->1.5
const MOTION_PRESETS = [
    // 1. Up-Left Pan + Zoom
    { scaleFrom: 1, scaleTo: 1.18, xFrom: 0, xTo: -80, yFrom: 0, yTo: -40, rotateFrom: 0, rotateTo: 1.5 },
    // 2. Up-Right Pan + Zoom
    { scaleFrom: 1, scaleTo: 1.18, xFrom: 0, xTo: 80, yFrom: 0, yTo: -40, rotateFrom: 0, rotateTo: -1.5 },
    // 3. Down-Left Pan + Zoom
    { scaleFrom: 1, scaleTo: 1.18, xFrom: 0, xTo: -80, yFrom: 0, yTo: 40, rotateFrom: 0, rotateTo: 1.5 },
    // 4. Down-Right Pan + Zoom
    { scaleFrom: 1, scaleTo: 1.18, xFrom: 0, xTo: 80, yFrom: 0, yTo: 40, rotateFrom: 0, rotateTo: -1.5 },
    // 5. Center Zoom + Rotate
    { scaleFrom: 1, scaleTo: 1.22, xFrom: 0, xTo: 0, yFrom: 0, yTo: -20, rotateFrom: -1.5, rotateTo: 1.5 },
];

const getPresetForIndex = (index: number) => {
    return MOTION_PRESETS[index % MOTION_PRESETS.length];
};

const SingleAnimatedImage: React.FC<{
    src: string;
    durationInFrames: number;
    motionIndex: number;
}> = ({ src, durationInFrames, motionIndex }) => {
    const frame = useCurrentFrame();
    const preset = getPresetForIndex(motionIndex);

    const progress = frame / Math.max(1, durationInFrames - 1);

    const scale = interpolate(progress, [0, 1], [preset.scaleFrom, preset.scaleTo], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const translateX = interpolate(progress, [0, 1], [preset.xFrom, preset.xTo], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const translateY = interpolate(progress, [0, 1], [preset.yFrom, preset.yTo], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const rotate = interpolate(progress, [0, 1], [preset.rotateFrom, preset.rotateTo], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Fade in at start, fade out at end for crossfade
    const fadeIn = interpolate(frame, [0, 5], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(
        frame,
        [durationInFrames - 6, durationInFrames - 1],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const opacity = Math.min(fadeIn, fadeOut);

    const resolvedSrc = src.startsWith("/") ? staticFile(src.slice(1)) : src;

    return (
        <AbsoluteFill style={{ opacity }}>
            <Img
                src={resolvedSrc}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale}) translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`,
                    transformOrigin: "center center",
                }}
            />
        </AbsoluteFill>
    );
};

export const AnimatedImageSequence: React.FC<AnimatedImageSequenceProps> = ({
    images,
    durationInFrames,
}) => {
    if (!images || images.length === 0) {
        return (
            <AbsoluteFill
                style={{
                    background: "linear-gradient(180deg, #0f0c29 0%, #1a1a2e 100%)",
                }}
            />
        );
    }

    const imageCount = images.length;
    // Each image gets equal frame time, with 5-frame overlap for crossfade
    const framesPerImage = Math.floor(durationInFrames / imageCount);
    const overlap = 5;

    return (
        <AbsoluteFill style={{ overflow: "hidden" }}>
            {images.map((imgSrc, index) => {
                const startFrame = index * framesPerImage;
                // Extend duration by overlap for smooth crossfade (except last image)
                const imgDuration =
                    index < imageCount - 1
                        ? framesPerImage + overlap
                        : durationInFrames - startFrame;

                return (
                    <Sequence
                        key={`img-seq-${index}`}
                        from={startFrame}
                        durationInFrames={Math.max(1, imgDuration)}
                    >
                        <SingleAnimatedImage
                            src={imgSrc}
                            durationInFrames={Math.max(1, imgDuration)}
                            motionIndex={index}
                        />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
