import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';

// @ts-ignore
ffmpeg.setFfmpegPath(ffmpegStatic);

const inputPath = path.join(process.cwd(), 'public', 'assets', 'avatar', 'base_human.mp4');
const outputPath = path.join(process.cwd(), 'public', 'assets', 'avatar', 'base_human_long.mp4');

console.log('Generating 45-second long base video...');

ffmpeg(inputPath)
    .inputOptions(['-stream_loop', '3']) // Loop 3 times (11.8 * 4 = 47.2 seconds total)
    .outputOptions(['-c', 'copy']) // Stream copy (instant, lossless, no re-encoding!)
    .save(outputPath)
    .on('end', () => {
        console.log('Successfully created long base video at:', outputPath);
        // Swap them so the long one becomes the default
        fs.renameSync(inputPath, inputPath + '.backup');
        fs.renameSync(outputPath, inputPath);
        console.log('Swapped names! base_human.mp4 is now ~45s long.');
    })
    .on('error', (err) => {
        console.error('Error creating video:', err);
    });
