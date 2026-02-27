import path from "path";
import fs from "fs/promises";
import WebSocket from "ws";

export class TTSEngine {
    private WS_ENDPOINT = "wss://supertts.dextora.org/ws/tts";

    public async generateVoiceover(script: string, sceneId: number): Promise<string> {
        console.log(`[TTSEngine] Connecting to custom TTS server: ${this.WS_ENDPOINT}`);

        const audioBuffer = await new Promise<Buffer>((resolve, reject) => {
            const ws = new WebSocket(this.WS_ENDPOINT);
            const chunks: Buffer[] = [];

            ws.on("open", () => {
                console.log("[TTSEngine] WebSocket connected. Sending TTS request...");
                ws.send(JSON.stringify({
                    text: script,
                    language: "en",
                }));
            });

            ws.on("message", (data: WebSocket.RawData) => {
                // Server may stream audio chunks as binary or signal completion as text
                if (Buffer.isBuffer(data)) {
                    chunks.push(data);
                } else if (typeof data === "string") {
                    try {
                        const msg = JSON.parse(data);
                        // If the server sends a done/complete signal, resolve
                        if (msg.status === "done" || msg.done === true) {
                            ws.close();
                        } else if (msg.error) {
                            ws.close();
                            reject(new Error(`TTS Server Error: ${msg.error}`));
                        }
                    } catch {
                        // Non-JSON text message, ignore
                    }
                }
            });

            ws.on("close", () => {
                if (chunks.length === 0) {
                    reject(new Error("[TTSEngine] WebSocket closed but no audio data was received."));
                } else {
                    resolve(Buffer.concat(chunks));
                }
            });

            ws.on("error", (err) => {
                reject(new Error(`[TTSEngine] WebSocket error: ${err.message}`));
            });

            // Safety timeout — 30 seconds max
            setTimeout(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
                reject(new Error("[TTSEngine] TTS request timed out after 30 seconds."));
            }, 30000);
        });

        // Save audio to public/audio directory for Remotion access
        const audioDir = path.join(process.cwd(), "public", "audio");
        await fs.mkdir(audioDir, { recursive: true });
        const fileName = `tts-${sceneId}-${Date.now()}.mp3`;
        const filePath = path.join(audioDir, fileName);
        await fs.writeFile(filePath, audioBuffer);

        console.log(`[TTSEngine] ✅ Audio saved to: ${filePath}`);
        return `/audio/${fileName}`;
    }
}
