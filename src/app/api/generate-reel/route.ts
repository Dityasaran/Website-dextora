import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import path from "path";
import fs from "fs/promises";

const SERVICE_ACCOUNT_PATH = path.join(process.cwd(), "service-account.json");
const PROJECT_ID = "veo-test-487816";
const LOCATION = "us-central1";

async function getAccessToken(): Promise<string> {
    const keyFile = JSON.parse(await fs.readFile(SERVICE_ACCOUNT_PATH, "utf-8"));
    const auth = new GoogleAuth({
        credentials: keyFile,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    return tokenResponse.token || "";
}

export async function POST(req: NextRequest) {
    try {
        const { prompt, duration = 30 } = await req.json();

        const segmentDuration = 5;
        const segmentCount = Math.floor(duration / segmentDuration);

        const systemInstruction = `You are a cinematic Instagram Reels scriptwriter and motion director.
Generate a strictly structured JSON response for a vertical 9:16 Instagram Reel.

REEL STRUCTURE (MANDATORY):
- Each segment is exactly ${segmentDuration} seconds long.
- Total segments: ${segmentCount} to fill ${duration} seconds.
- Avatar speaking in foreground for EVERY scene.
- Animated cinematic b-roll sequence in background for EVERY scene (5 images minimum).

The JSON format MUST be exactly:
{
    "title": "A catchy, short title for the reel",
    "totalDuration": ${duration},
    "segments": [
        {
            "sceneId": 1,
            "duration": ${segmentDuration},
            "script": "Short punchy line. Avatar speaks this.",
            "visualPrompt": "cinematic background: hyper-realistic scene, dramatic lighting, 8k. MUST be descriptive enough to generate 5 distinct images for a sequence.",
            "avatarGesture": "explaining",
            "cameraMotion": "slow zoom cinematic"
        },
        {
            "sceneId": 2,
            "duration": ${segmentDuration},
            "script": "Next short punchy line.",
            "visualPrompt": "cinematic B-roll: another hyper-realistic scene, shallow depth of field, different angle",
            "avatarGesture": "pointing",
            "cameraMotion": "slow pan right"
        }
    ]
}

CRITICAL RULES:
1. Every segment MUST have duration of ${segmentDuration}.
2. Total segments must be exactly ${segmentCount}.
3. Avatar MUST be active in every scene.
4. 'script': punchy, captivating, spoken by the avatar.
5. 'visualPrompt' must be hyper-descriptive to generate 5 distinct background images (e.g. adding 'multiple angles, sequence of shots' to the prompt).
6. 'avatarGesture' must be one of: "explaining", "pointing", "waving", "idle".
7. 'cameraMotion' must be descriptive like "slow zoom cinematic" or "pan left".
8. Static scenes are forbidden. Motion must be continuous.`;

        const accessToken = await getAccessToken();
        const geminiEndpoint = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`;

        const response = await fetch(geminiEndpoint, {
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
            const errorText = await response.text();
            console.error("Vertex AI Error:", errorText);
            throw new Error(`Vertex AI Error: ${response.statusText}`);
        }

        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        const reelPlan = JSON.parse(textContent);

        return NextResponse.json({ success: true, plan: reelPlan });

    } catch (error: any) {
        console.error("Gemini Reels Generation Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate reel plan" }, { status: 500 });
    }
}
