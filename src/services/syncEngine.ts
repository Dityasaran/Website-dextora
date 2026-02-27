import fs from 'fs';
import path from 'path';

/**
 * TITAN ENGINE — dispatches video + audio to local EchoMimic GPU inference.
 * Sends files directly to the L4 GPU on port 8000. Waits up to 15 minutes.
 */
export async function createAndPollSyncJob(videoPath: string, audioPath: string): Promise<string> {
    console.log(`[SyncEngine] Loading files: Video: ${videoPath}, Audio: ${audioPath}`);

    const videoBuffer = fs.readFileSync(videoPath);
    const audioBuffer = fs.readFileSync(audioPath);

    const formData = new FormData();
    formData.append("base_human", new Blob([videoBuffer]), "base_human.mp4");
    formData.append("audio", new Blob([audioBuffer]), "audio.mp3");

    console.log("🚀 TITAN ENGINE: Dispatching to local L4 GPU (EchoMimic) on localhost:8000...");

    // 15-minute timeout — EchoMimic loads ~13GB of weights on first run
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000);

    let response: Response;
    try {
        response = await fetch("http://127.0.0.1:8000/generate-sync", {
            method: "POST",
            body: formData,
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timeoutId);
    }

    if (!response.ok) {
        let errorBody = response.statusText;
        try {
            const errJson = await response.json();
            errorBody = errJson.error || errJson.details || JSON.stringify(errJson);
        } catch { /* ignore parse errors */ }
        throw new Error(`TITAN ENGINE Error (${response.status}): ${errorBody}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const finalBuffer = Buffer.from(arrayBuffer);

    // Save to Next.js public directory so Remotion can serve it
    const outputPath = path.join(process.cwd(), 'public', 'assets', 'final_synced_output.mp4');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, finalBuffer);

    console.log(`✅ TITAN ENGINE complete! Synced video: ${outputPath} (${(finalBuffer.length / 1024 / 1024).toFixed(1)} MB)`);
    return '/assets/final_synced_output.mp4';
}

