import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json();

        if (!text || typeof text !== "string") {
            return NextResponse.json({ error: "Text is required for TTS." }, { status: 400 });
        }

        console.log("[TTS] Generating audio for:", text.substring(0, 60));

        // Use Google Translate TTS — free, no API key needed, works instantly
        // Split long text into chunks (Google Translate TTS has ~200 char limit per request)
        const chunks = splitTextIntoChunks(text, 180);
        const audioBuffers: Buffer[] = [];

        for (const chunk of chunks) {
            const encodedText = encodeURIComponent(chunk);
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodedText}`;

            const response = await fetch(ttsUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                    "Referer": "https://translate.google.com/",
                },
            });

            if (!response.ok) {
                console.warn(`[TTS] Google Translate TTS chunk failed: ${response.status}`);
                continue;
            }

            const arrayBuffer = await response.arrayBuffer();
            audioBuffers.push(Buffer.from(arrayBuffer));
        }

        if (audioBuffers.length === 0) {
            // Fallback: try StreamElements TTS (also free, no key needed)
            console.log("[TTS] Trying StreamElements fallback...");
            const seUrl = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(text.substring(0, 500))}`;

            const seRes = await fetch(seUrl);
            if (seRes.ok) {
                const ab = await seRes.arrayBuffer();
                audioBuffers.push(Buffer.from(ab));
                console.log("[TTS] StreamElements success");
            }
        }

        if (audioBuffers.length === 0) {
            return NextResponse.json({ error: "TTS generation failed" }, { status: 500 });
        }

        // Combine all audio chunks
        const combinedAudio = Buffer.concat(audioBuffers);

        // Save audio file
        const audioDir = path.join(process.cwd(), "public", "audio");
        await fs.mkdir(audioDir, { recursive: true });

        const filename = `tts-${Date.now()}.mp3`;
        const filepath = path.join(audioDir, filename);
        await fs.writeFile(filepath, combinedAudio);

        console.log(`[TTS] Audio saved: /audio/${filename} (${combinedAudio.length} bytes)`);

        return NextResponse.json({
            success: true,
            audioUrl: `/audio/${filename}`,
        });
    } catch (error: unknown) {
        console.error("[TTS] Fatal error:", error);
        const message = error instanceof Error ? error.message : "TTS generation failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// Split text into chunks that respect sentence boundaries
function splitTextIntoChunks(text: string, maxLength: number): string[] {
    if (text.length <= maxLength) return [text];

    const chunks: string[] = [];
    const sentences = text.split(/(?<=[.!?])\s+/);
    let current = "";

    for (const sentence of sentences) {
        if ((current + " " + sentence).trim().length <= maxLength) {
            current = (current + " " + sentence).trim();
        } else {
            if (current) chunks.push(current);
            // If a single sentence is too long, split by commas or words
            if (sentence.length > maxLength) {
                const words = sentence.split(" ");
                current = "";
                for (const word of words) {
                    if ((current + " " + word).trim().length <= maxLength) {
                        current = (current + " " + word).trim();
                    } else {
                        if (current) chunks.push(current);
                        current = word;
                    }
                }
            } else {
                current = sentence;
            }
        }
    }
    if (current) chunks.push(current);

    return chunks;
}
