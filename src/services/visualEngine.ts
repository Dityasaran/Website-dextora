import { GoogleAuth } from "google-auth-library";
import path from "path";
import fs from "fs/promises";

export class VisualEngine {
    private SERVICE_ACCOUNT_PATH = path.join(process.cwd(), "service-account.json");
    private PROJECT_ID = "veo-test-487816";
    private LOCATION = "us-central1";

    private async getAccessToken(): Promise<string> {
        const keyFile = JSON.parse(await fs.readFile(this.SERVICE_ACCOUNT_PATH, "utf-8"));
        const auth = new GoogleAuth({
            credentials: keyFile,
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        });
        const client = await auth.getClient();
        const tokenResponse = await client.getAccessToken();
        return tokenResponse.token || "";
    }

    // Attempt Veo Generation, Fallback to Imagen
    public async generateVisualAsset(prompt: string, sceneId: number): Promise<{ url: string, type: 'video' | 'image' }> {
        const accessToken = await this.getAccessToken();
        const startEndpoint = `https://${this.LOCATION}-aiplatform.googleapis.com/v1/projects/${this.PROJECT_ID}/locations/${this.LOCATION}/publishers/google/models/veo-2.0-generate-001:predict`;

        try {
            // 1. Trigger Veo LRO
            const startResponse = await fetch(startEndpoint, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    instances: [{ prompt }],
                    parameters: {
                        sampleCount: 1,
                        fps: 30,
                        aspectRatio: "1:1", // Assuming 1:1 or 16:9 for general backgrounds
                        enhancePrompt: true
                    },
                }),
            });

            if (!startResponse.ok) throw new Error("Veo generation request failed");

            const startData = await startResponse.json();
            const operationName = startData.name;
            if (!operationName) throw new Error("No operation name returned from Veo");

            // 2. Poll Veo LRO
            const operationEndpoint = `https://${this.LOCATION}-aiplatform.googleapis.com/v1/${operationName}`;
            let isDone = false;
            let videoBytes = null;

            while (!isDone) {
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5s
                const pollResponse = await fetch(operationEndpoint, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const pollData = await pollResponse.json();

                if (pollData.error) throw new Error(`Veo LRO failed: ${pollData.error.message}`);

                if (pollData.done) {
                    isDone = true;
                    videoBytes = pollData.response?.predictions?.[0]?.bytesBase64Encoded;
                }
            }

            if (videoBytes) {
                const fileName = `video-${sceneId}-${Date.now()}.mp4`;
                const filePath = path.join(process.cwd(), "public", "videos", fileName);
                await fs.writeFile(filePath, Buffer.from(videoBytes, "base64"));
                return { url: `/videos/${fileName}`, type: 'video' };
            }

            throw new Error("Veo succeeded but returned no bytesBase64Encoded payload.");

        } catch (error) {
            console.error(error);
            console.warn(`[VisualEngine] Veo generation failed for Scene ${sceneId}. Falling back to Imagen.`);
            return this.fallbackToImagen(prompt, sceneId, accessToken);
        }
    }

    private async fallbackToImagen(prompt: string, sceneId: number, accessToken: string): Promise<{ url: string, type: 'image' }> {
        const imagenEndpoint = `https://${this.LOCATION}-aiplatform.googleapis.com/v1/projects/${this.PROJECT_ID}/locations/${this.LOCATION}/publishers/google/models/imagen-3.0-generate-002:predict`;

        const response = await fetch(imagenEndpoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                instances: [{ prompt }],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: "1:1",
                },
            }),
        });

        if (!response.ok) throw new Error(`Imagen API failed: ${response.statusText}`);

        const data = await response.json();
        const base64Image = data.predictions?.[0]?.bytesBase64Encoded;

        if (!base64Image) throw new Error("Imagen returned no payload.");

        const fileName = `fallback-${sceneId}-${Date.now()}.jpg`;
        const filePath = path.join(process.cwd(), "public", "images", fileName);
        await fs.writeFile(filePath, Buffer.from(base64Image, "base64"));
        return { url: `/images/${fileName}`, type: 'image' };
    }

    // Generate 5 images per scene for multi-image Ken Burns animation
    public async generateMultipleImages(prompt: string, sceneId: number, count: number = 5): Promise<string[]> {
        const accessToken = await this.getAccessToken();
        const imagenEndpoint = `https://${this.LOCATION}-aiplatform.googleapis.com/v1/projects/${this.PROJECT_ID}/locations/${this.LOCATION}/publishers/google/models/imagen-3.0-generate-002:predict`;

        // Prompt variations to get visually diverse images for the same scene
        const variations = [
            prompt,
            `${prompt}, wide establishing shot`,
            `${prompt}, close-up detail shot`,
            `${prompt}, dramatic lighting angle`,
            `${prompt}, aerial perspective view`,
        ];

        const imageUrls: string[] = [];

        for (let i = 0; i < Math.min(count, variations.length); i++) {
            try {
                const response = await fetch(imagenEndpoint, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instances: [{ prompt: variations[i] }],
                        parameters: {
                            sampleCount: 1,
                            aspectRatio: "9:16", // Vertical for reels
                        },
                    }),
                });

                if (!response.ok) {
                    console.warn(`Imagen request ${i + 1} failed: ${response.statusText}`);
                    continue;
                }

                const data = await response.json();
                const base64Image = data.predictions?.[0]?.bytesBase64Encoded;

                if (base64Image) {
                    const fileName = `scene-${sceneId}-${i + 1}-${Date.now()}.png`;
                    const filePath = path.join(process.cwd(), "public", "assets", "images", fileName);
                    await fs.writeFile(filePath, Buffer.from(base64Image, "base64"));
                    imageUrls.push(`/assets/images/${fileName}`);
                }
            } catch (err) {
                console.warn(`Image generation ${i + 1} for scene ${sceneId} failed:`, err);
            }
        }

        return imageUrls;
    }
}
