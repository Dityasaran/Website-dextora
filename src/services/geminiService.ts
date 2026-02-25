import { GoogleAuth } from "google-auth-library";
import path from "path";
import fs from "fs/promises";

export class GeminiService {
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

    public async generateReelScript(prompt: string, duration: number = 30) {
        // 3-second segments for cinematic pacing
        const segmentDuration = 3;
        const segmentCount = Math.floor(duration / segmentDuration);

        const systemInstruction = `You are a cinematic Instagram Reels scriptwriter and motion director.
Generate a strictly structured JSON response for a vertical 9:16 Instagram Reel.

REEL STRUCTURE (MANDATORY):
- Each segment is exactly ${segmentDuration} seconds long.
- Total segments: ${segmentCount} to fill ${duration} seconds.
- Segments MUST alternate: Avatar talking → B-roll visual → Avatar talking → B-roll visual...

CRITICAL: The reel must feel like a professional Instagram AI reel similar to Freepik quality.

The JSON format MUST be exactly:
{
    "title": "A catchy, short title for the reel",
    "totalDuration": ${duration},
    "segments": [
        {
            "sceneId": 1,
            "duration": ${segmentDuration},
            "script": "Short punchy line the avatar speaks — max 10 words. This is a hook.",
            "visualPrompt": "cinematic background prompt for the avatar scene, dramatic lighting, 8k",
            "avatarGesture": "explaining",
            "avatarRequired": true
        },
        {
            "sceneId": 2,
            "duration": ${segmentDuration},
            "script": "Continue narration as voiceover over B-roll visuals.",
            "visualPrompt": "cinematic B-roll: hyper-realistic scene matching the narration, dramatic lighting, shallow depth of field, 8k quality",
            "avatarGesture": "idle",
            "avatarRequired": false
        }
    ]
}

CRITICAL RULES:
1. Every segment MUST have duration of ${segmentDuration}.
2. Total segments must be exactly ${segmentCount}.
3. 'avatarRequired' MUST alternate strictly: true, false, true, false, etc.
4. 'script' for avatar scenes must be punchy, short (under 10 words), captivating hooks.
5. 'script' for B-roll scenes must continue the narration naturally.
6. 'visualPrompt' must be hyper-descriptive for cinematic AI image generation. Always include lighting, mood, and camera angle.
7. 'avatarGesture' must be one of: "explaining", "pointing", "waving", "idle".
8. The script must tell a compelling story with emotional arc across all segments.`;

        const accessToken = await this.getAccessToken();
        const endpoint = `https://${this.LOCATION}-aiplatform.googleapis.com/v1/projects/${this.PROJECT_ID}/locations/${this.LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: `Create a ${duration}-second cinematic Instagram reel about: ${prompt}` },
                        ],
                    },
                ],
                systemInstruction: {
                    parts: [{ text: systemInstruction }],
                },
                generationConfig: {
                    temperature: 0.8,
                    responseMimeType: "application/json",
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Vertex AI Error: ${response.statusText}`);
        }

        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        return JSON.parse(textContent);
    }
}
