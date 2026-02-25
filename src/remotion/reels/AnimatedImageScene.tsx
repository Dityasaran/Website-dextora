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
import { AnimatedImageSequence } from "../components/AnimatedImageSequence";

export const AnimatedImageScene: React.FC<{
    segment: ReelSegment;
    index: number;
}> = ({ segment, index }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    const videoSource = segment.visualAsset || segment.videoUrl || "";
    const hasVideo = videoSource && videoSource.includes(".mp4");
    const images = segment.imageUrls && segment.imageUrls.length > 0
        ? segment.imageUrls
        : [
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1080&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1080&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1080&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1080&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1080&auto=format&fit=crop",
        ];

    // Camera zoom
    const cameraZoom = interpolate(frame, [0, durationInFrames], [1, 1.08], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill>
            {/* Full-screen B-roll */}
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
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <AnimatedImageSequence images={images} durationInFrames={durationInFrames} />
                )}
            </div>

            {/* Bottom gradient for captions */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "50%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)",
                    zIndex: 5,
                }}
            />

            {/* UGC Captions */}
            {segment.script && <CinematicCaption text={segment.script} style="ugc" />}

            {/* TTS Audio */}
            {segment.ttsAudioUrl && (
                <Audio
                    src={segment.ttsAudioUrl.startsWith("/") ? staticFile(segment.ttsAudioUrl.slice(1)) : segment.ttsAudioUrl}
                    volume={1}
                />
            )}
        </AbsoluteFill>
    );
};
