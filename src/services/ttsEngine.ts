import { GoogleAuth } from "google-auth-library";
import path from "path";
import fs from "fs/promises";

export class TTSEngine {
    private SERVICE_ACCOUNT_PATH = path.join(process.cwd(), "service-account.json");
    private PROJECT_ID = "veo-test-487816";

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

    public async generateVoiceover(script: string, sceneId: number): Promise<string> {
        const accessToken = await this.getAccessToken();
        const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize`;

        // Use SSML for natural speech pacing with pauses and emphasis
        const ssml = `<speak>
            <prosody rate="95%" pitch="-1st">
                ${script}
            </prosody>
        </speak>`;

        const requestPayload = {
            input: { ssml },
            voice: {
                languageCode: "en-US",
                name: "en-US-Studio-Q", // Premium male Studio voice — deep, professional, cinematic
            },
            audioConfig: {
                audioEncoding: "MP3",
                speakingRate: 0.95,        // Slightly slower for cinematic delivery
                effectsProfileId: ["headphone-class-device"], // Studio-quality audio processing
            },
        };

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "x-goog-user-project": this.PROJECT_ID,
            },
            body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
            // Fallback to Journey voice if Studio is unavailable
            console.warn(`Studio voice failed: ${response.statusText}. Falling back to Journey voice...`);
            return this.fallbackToJourneyVoice(script, sceneId, accessToken);
        }

        const data = await response.json();
        const audioContent = data.audioContent;

        if (!audioContent) {
            console.warn("No audio from Studio voice, falling back...");
            return this.fallbackToJourneyVoice(script, sceneId, accessToken);
        }

        // Save to audio directory
        const audioDir = path.join(process.cwd(), "public", "audio");
        await fs.mkdir(audioDir, { recursive: true });
        const fileName = `tts-${sceneId}-${Date.now()}.mp3`;
        const filePath = path.join(audioDir, fileName);
        await fs.writeFile(filePath, Buffer.from(audioContent, "base64"));

        return `/audio/${fileName}`;
    }

    private async fallbackToJourneyVoice(script: string, sceneId: number, accessToken: string): Promise<string> {
        const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize`;

        const requestPayload = {
            input: { text: script },
            voice: {
                languageCode: "en-US",
                name: "en-US-Journey-D", // Male Journey voice — engaging, natural
            },
            audioConfig: {
                audioEncoding: "MP3",
                speakingRate: 0.95,
                effectsProfileId: ["headphone-class-device"],
            },
        };

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "x-goog-user-project": this.PROJECT_ID,
            },
            body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
            throw new Error(`TTS API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const audioContent = data.audioContent;

        if (!audioContent) {
            throw new Error("No audio content received from TTS engine");
        }

        const audioDir = path.join(process.cwd(), "public", "audio");
        await fs.mkdir(audioDir, { recursive: true });
        const fileName = `tts-${sceneId}-${Date.now()}.mp3`;
        const filePath = path.join(audioDir, fileName);
        await fs.writeFile(filePath, Buffer.from(audioContent, "base64"));

        return `/audio/${fileName}`;
    }
}
