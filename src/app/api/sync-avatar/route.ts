import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { createAndPollSyncJob } from "@/services/syncEngine";

export async function POST(req: NextRequest) {
    try {
        const { ttsAudioUrl, sceneIndex } = await req.json();

        if (!ttsAudioUrl) {
            return NextResponse.json({ error: "Missing ttsAudioUrl" }, { status: 400 });
        }

        // 1. Define paths
        const publicDir = path.join(process.cwd(), "public");
        const videoPath = path.join(publicDir, "assets", "avatar", "base_human.mp4");

        // Ensure ttsAudioUrl handles relative paths (e.g. "/audio/tts-123.mp3")
        const cleanAudioPath = ttsAudioUrl.startsWith("/") ? ttsAudioUrl : `/${ttsAudioUrl}`;
        const audioPath = path.join(publicDir, cleanAudioPath);

        // 2. Check if base video exists
        try {
            await fs.access(videoPath);
        } catch {
            return NextResponse.json({ error: "No base_human.mp4 found in public/assets/avatar/" }, { status: 400 });
        }

        // 3. Dispatch to TITAN ENGINE — Local L4 GPU (EchoMimic)
        console.log(`[Sync API] Triggering L4 GPU Engine for scene ${sceneIndex}`);
        const syncedVideoUrl = await createAndPollSyncJob(videoPath, audioPath);

        // 4. Return the synced video path (served from /public/assets/)
        console.log(`[Sync API] L4 GPU Engine complete. Output: ${syncedVideoUrl}`);

        return NextResponse.json({
            success: true,
            syncedVideoUrl: syncedVideoUrl
        });

    } catch (e: any) {
        console.error("Sync API Error:", e);
        return NextResponse.json({ error: e.message || "Failed to trigger lip-sync generator" }, { status: 500 });
    }
}
