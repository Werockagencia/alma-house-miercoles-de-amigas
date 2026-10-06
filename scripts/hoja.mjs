// Hoja de contacto de la campaña (posts arriba, historias abajo). Salida: preview/hoja-campana.jpg
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { plan } from './plan.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const tiles = [];
for (const [i, p] of plan.entries()) {
  const exp = f => path.join(ROOT, 'piezas', p.dir, 'export', f);
  tiles.push({ input: await sharp(exp(`${p.n}-post.png`)).resize(540, 675).toBuffer(), left: i * 560, top: 0 });
  tiles.push({ input: await sharp(exp(`${p.n}-historia.png`)).resize(540, 960).toBuffer(), left: i * 560, top: 695 });
}
await mkdir(path.join(ROOT, 'preview'), { recursive: true });
await sharp({ create: { width: plan.length * 560 - 20, height: 1655, channels: 3, background: '#888' } })
  .composite(tiles).jpeg({ quality: 84 }).toFile(path.join(ROOT, 'preview', 'hoja-campana.jpg'));
console.log('preview/hoja-campana.jpg');
