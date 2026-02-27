import React from "react";
import {
    AbsoluteFill,
    Video,
    Audio,
    staticFile,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { ReelSegment } from "./ReelComposition";
import { CinematicCaption } from "../components/CinematicCaption";
import { ReusableAvatar } from "../components/avatar/ReusableAvatar";
import { AnimatedImageSequence } from "../components/AnimatedImageSequence";

export const AvatarScene: React.FC<{ segment: ReelSegment; index: number; avatarId?: string; musicUrl?: string }> = ({
    segment,
    index,
    avatarId = "alex",
    musicUrl,
}) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const videoSource = segment.visualAsset || segment.videoUrl || "";
    const hasVideo = videoSource && (videoSource.endsWith(".mp4") || videoSource.endsWith(".webm"));
    const images = segment.imageUrls && segment.imageUrls.length > 0 ? segment.imageUrls : null;

    // Cinematic camera zoom
    const cameraZoom = interpolate(frame, [0, durationInFrames], [1, 1.12], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill>
            {/* 1. Full-screen B-roll background (NO blur — Simora-style) */}
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    transform: `scale(${cameraZoom})`,
                    transformOrigin: "center center",
                    overflow: "hidden",
                }}
            >
                {hasVideo ? (
                    <Video
                        src={videoSource.startsWith("/") ? staticFile(videoSource.slice(1)) : videoSource}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                ) : images ? (
                    <AnimatedImageSequence images={images} durationInFrames={durationInFrames} />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(180deg, #0f0c29 0%, #1a1a2e 50%, #0f0c29 100%)",
                        }}
                    />
                )}
            </div>

            {/* 2. Bottom gradient overlay for caption readability */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "60%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 100%)",
                    zIndex: 5,
                }}
            />

            {/* 3. Avatar — Simora-style UGC creator or Lip-Synced Human */}
            {segment.syncedVideoUrl ? (
                <Video
                    src={segment.syncedVideoUrl.startsWith("/") ? staticFile(segment.syncedVideoUrl.slice(1)) : segment.syncedVideoUrl}
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        height: "85%", // Presenter size
                        objectFit: "contain",
                        zIndex: 10,
                        // For a white/beige background, 'multiply' blends it out leaving the dark subjects. 
                        // For a green screen, we would need a WebGL chroma-key or 'maskImage'.
                        mixBlendMode: "multiply",
                    }}
                />
            ) : (
                <ReusableAvatar
                    speaking={true}
                    gesture={(segment.avatarGesture as "idle" | "explaining" | "pointing" | "waving") || "explaining"}
                    avatarId={avatarId}
                />
            )}

            {/* 4. UGC Captions  */}
            {segment.script && <CinematicCaption text={segment.script} style="ugc" />}

            {/* 5. TTS Audio */}
            {segment.ttsAudioUrl && (
                <Audio
                    src={segment.ttsAudioUrl.startsWith("/") ? staticFile(segment.ttsAudioUrl.slice(1)) : segment.ttsAudioUrl}
                    volume={1}
                />
            )}

            {/* 6. Background Music */}
            {musicUrl && (
                <Audio
                    src={musicUrl.startsWith("/") ? staticFile(musicUrl.slice(1)) : musicUrl}
                    volume={0.12}
                />
            )}
        </AbsoluteFill>
    );
};
