const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createPng(width, height) {
  // RGBA buffer with filter byte at start of each scanline
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None

    const ny = y / height;

    for (let x = 0; x < width; x++) {
      const colOffset = rowOffset + 1 + x * 4;
      const nx = x / width;

      // Distance from rising sun center (nx: 0.68, ny: 0.65)
      const dx = (nx - 0.68) * 1.2;
      const dy = (ny - 0.65);
      const sunDist = Math.sqrt(dx * dx + dy * dy);

      let r = 10, g = 6, b = 24; // Sky deep purple base

      if (ny < 0.4) {
        // Upper twilight purple
        const t = ny / 0.4;
        r = Math.round(15 + 40 * t);
        g = Math.round(10 + 20 * t);
        b = Math.round(35 + 45 * t);
      } else if (ny < 0.68) {
        // Mid-sky magenta to amber
        const t = (ny - 0.4) / 0.28;
        r = Math.round(55 + 180 * t);
        g = Math.round(30 + 100 * t);
        b = Math.round(80 - 20 * t);
      } else {
        // Lower earth / silhouette
        r = 18; g = 10; b = 20;
      }

      // Rising Sun Core & Corona
      if (sunDist < 0.12) {
        // Sun core
        r = 255; g = 240; b = 200;
      } else if (sunDist < 0.32) {
        // Sun glowing corona
        const s = (0.32 - sunDist) / 0.20;
        r = Math.min(255, Math.round(r + 200 * s));
        g = Math.min(255, Math.round(g + 130 * s));
        b = Math.min(255, Math.round(b + 30 * s));
      }

      // Rounded app icon border
      const edgeDistX = Math.abs(nx - 0.5) * 2;
      const edgeDistY = Math.abs(ny - 0.5) * 2;
      let alpha = 255;

      rawData[colOffset] = r;
      rawData[colOffset + 1] = g;
      rawData[colOffset + 2] = b;
      rawData[colOffset + 3] = alpha;
    }
  }

  // Deflate IDAT
  const compressed = zlib.deflateSync(rawData);

  // PNG Header
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 6;  // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // IDAT chunk
  const idat = makeChunk('IDAT', compressed);

  // IEND chunk
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc >>> 0, 8 + len);
  return chunk;
}

// CRC32 table
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return c ^ -1;
}

const outDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(outDir, 'icon-192.png'), createPng(192, 192));
fs.writeFileSync(path.join(outDir, 'icon-512.png'), createPng(512, 512));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPng(180, 180));
console.log('Successfully generated icon-192.png, icon-512.png, and apple-touch-icon.png');
