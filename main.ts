// News image of Tuesday 17 November 2026. The picture is entry.png beside this file,
// rendered from poster.html (headless Chrome, 1024x1024); this program writes it to
// /output/entry.png, or to $MAKEFUN_OUTPUT_DIR when that is set.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MAX_BYTES = 1048576;
const MAX_SIDE = 1024;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const image = readFileSync(new URL('./entry.png', import.meta.url));

// Refuse to ship a file the gate would reject: a PNG of at most 1 MiB and 1024x1024.
if (!image.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error('entry.png is not a PNG');
if (image.length > MAX_BYTES) throw new Error(`entry.png is ${image.length} bytes, over ${MAX_BYTES}`);
const width = image.readUInt32BE(16);
const height = image.readUInt32BE(20);
if (width > MAX_SIDE || height > MAX_SIDE) throw new Error(`entry.png is ${width}x${height}, over ${MAX_SIDE}`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
writeFileSync(join(outDir, 'entry.png'), image);
