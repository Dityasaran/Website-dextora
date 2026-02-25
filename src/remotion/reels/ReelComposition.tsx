import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig, useCurrentFrame, interpolate } from "remotion";
import { ReelContainer } from "./ReelContainer";
import { AvatarScene } from "./AvatarScene";
import { AnimatedImageScene } from "./AnimatedImageScene";

export interface ReelSegment {
    type?: "avatar" | "visual";
    avatarRequired?: boolean;
    duration: number; // in seconds
    script?: string;
    visualPrompt?: string;
    avatarGesture?: string;

    // Populated later
    avatarVideoUrl?: string;
    visualAsset?: string;
    ttsAudioUrl?: string;
    imageUrls?: string[];
    videoUrl?: string;
}

export interface ReelCompositionProps {
    title: string;
    duration: number;
    segments: ReelSegment[];
    avatarId?: string;
    musicUrl?: string;
}

// Crossfade wrapper for smooth scene transitions
const CrossfadeWrapper: React.FC<{
    children: React.ReactNode;
    durationInFrames: number;
    isFirst: boolean;
    isLast: boolean;
}> = ({ children, durationInFrames, isFirst, isLast }) => {
    const frame = useCurrentFrame();
    const FADE_FRAMES = 8; // ~0.27s crossfade overlap

    // Fade in (skip for first scene)
    const fadeIn = isFirst
        ? 1
        : interpolate(frame, [0, FADE_FRAMES], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });

    // Fade out (skip for last scene)
    const fadeOut = isLast
        ? 1
        : interpolate(
            frame,
            [durationInFrames - FADE_FRAMES, durationInFrames],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

    return (
        <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
            {children}
        </AbsoluteFill>
    );
};

export const ReelComposition: React.FC<ReelCompositionProps> = ({
    title,
    duration,
    segments,
    avatarId,
    musicUrl,
}) => {
    const { fps } = useVideoConfig();
    const OVERLAP_FRAMES = 8; // crossfade overlap

    return (
        <ReelContainer>
            {segments.map((segment, i) => {
                // Calculate start with overlap for crossfade
                const prevDuration = segments
                    .slice(0, i)
                    .reduce((acc, s) => acc + s.duration * fps, 0);
                const startFrame = Math.max(0, Math.round(prevDuration) - (i > 0 ? OVERLAP_FRAMES : 0));
                const baseDuration = Math.max(1, Math.round(segment.duration * fps));
                const currentFrames = baseDuration + (i < segments.length - 1 ? OVERLAP_FRAMES : 0);

                return (
                    <Sequence
                        key={`reel-segment-${i}`}
                        from={startFrame}
                        durationInFrames={currentFrames}
                    >
                        <CrossfadeWrapper
                            durationInFrames={currentFrames}
                            isFirst={i === 0}
                            isLast={i === segments.length - 1}
                        >
                            <AvatarScene segment={segment} index={i} avatarId={avatarId} musicUrl={musicUrl} />
                        </CrossfadeWrapper>
                    </Sequence>
                );
            })}
        </ReelContainer>
    );
};
