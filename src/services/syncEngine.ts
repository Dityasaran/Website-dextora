import fs from 'fs/promises';
import { fal } from '@fal-ai/client';

/**
 * Uploads local file securely to Fal.ai's lightning-fast native blob storage.
 * Completely bypasses problematic temporary file hosts.
 */
async function uploadToFalStorage(filePath: string, type: 'video/mp4' | 'audio/mpeg'): Promise<string> {
    fal.config({ credentials: process.env.FAL_KEY || "" });
    console.log(`[SyncEngine] Uploading ${filePath} to Fal Storage...`);
    const fileBuffer = await fs.readFile(filePath);
    const blob = new Blob([fileBuffer], { type });
    const url = await fal.storage.upload(blob);
    console.log(`[SyncEngine] Uploaded! URL: ${url}`);
    return url;
}

/**
 * Submits to Fal.ai using their official robust client SDK.
 * Handles queue, polling, and final video retrieval natively.
 */
export async function createAndPollSyncJob(videoPath: string, audioPath: string): Promise<string> {
    const FAL_KEY = process.env.FAL_KEY || "";
    if (!FAL_KEY) throw new Error("Missing FAL_KEY in environment variables");
    fal.config({ credentials: FAL_KEY });

    const videoUrl = await uploadToFalStorage(videoPath, 'video/mp4');
    const audioUrl = await uploadToFalStorage(audioPath, 'audio/mpeg');

    console.log(`[SyncEngine] Submitting and Subscribing to Fal.ai Sync-Lipsync v2 Pro...`);

    try {
        const result: any = await fal.subscribe("fal-ai/sync-lipsync/v2/pro", {
            input: {
                video_url: videoUrl,
                audio_url: audioUrl,
                sync_mode: "bounce", // Natively ping-pongs the video to match the audio length!
            },
            pollInterval: 3000,
            onQueueUpdate: (update) => {
                if (update.status === 'IN_PROGRESS') {
                    console.log("[SyncEngine] Fal.ai processing in progress...");
                } else if (update.status === "IN_QUEUE") {
                    console.log(`[SyncEngine] Position in queue: ${update.queue_position}`);
                }
            }
        });

        const finalUrl = result.data?.video?.url || result.video?.url;
        if (finalUrl) {
            console.log(`[SyncEngine] Fal.ai Success! URL: ${finalUrl}`);
            return finalUrl;
        } else {
            throw new Error(`Fal.ai succeeded but no video URL found: ${JSON.stringify(result)}`);
        }
    } catch (e: any) {
        throw new Error(`Fal.ai SDK Error: ${e.message}`);
    }
}
