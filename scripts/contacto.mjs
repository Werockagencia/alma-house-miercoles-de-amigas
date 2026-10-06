// Hoja de contacto de los pines (para elegir fotos). Salida: preview/contacto-pines.jpg
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'assets', 'pinterest');
const files = (await readdir(SRC)).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort();
const W = 220, H = 300, COLS = 10;
const tiles = [];
for (const [i, f] of files.entries()) {
  const img = await sharp(path.join(SRC, f)).rotate().resize(W, H, { fit: 'cover' }).toBuffer();
  const label = Buffer.from(`<svg width="${W}" height="34"><rect width="${W}" height="34" fill="#000" opacity=".7"/><text x="8" y="24" font-size="20" font-family="Arial" fill="#fff">${f.replace(/\.\w+$/, '')}</text></svg>`);
  const tile = await sharp(img).composite([{ input: label, top: H - 34, left: 0 }]).toBuffer();
  tiles.push({ input: tile, left: (i % COLS) * W, top: Math.floor(i / COLS) * H });
}
await mkdir(path.join(ROOT, 'preview'), { recursive: true });
await sharp({ create: { width: COLS * W, height: Math.ceil(files.length / COLS) * H, channels: 3, background: '#222' } })
  .composite(tiles).jpeg({ quality: 80 }).toFile(path.join(ROOT, 'preview', 'contacto-pines.jpg'));
console.log(files.length, 'pines');
