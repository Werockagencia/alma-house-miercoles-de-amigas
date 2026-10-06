// Copia los pines seleccionados del tablero de Pinterest con nombres semánticos,
// redimensionados a máx. 2160 px de lado largo. (Los logos ya vienen recortados en assets/brand/logos.)
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PIN_SRC = path.join(ROOT, 'assets', 'pinterest');
const OUT = path.join(ROOT, 'assets', 'photos');

// crop: recorte en px sobre el original (pin-44 trae un texto de tienda abajo que se quita)
const photos = {
  'pin-44.jpg': { out: 'octubre-manos-cabello.jpg', crop: { left: 0, top: 0, width: 1008, height: 1330 } },
  'pin-54.jpg': { out: 'octubre-cereza-rostro.jpg' },
  'pin-47.jpg': { out: 'octubre-as-de-picas.jpg' },
  'pin-50.jpg': { out: 'octubre-lunares-copa.jpg' },
  'pin-02.jpg': { out: 'octubre-rojo-libro.jpg' },
  'pin-01.jpg': { out: 'octubre-rojo-blazer.jpg' },
};

await mkdir(OUT, { recursive: true });
for (const [src, { out, crop }] of Object.entries(photos)) {
  let img = sharp(path.join(PIN_SRC, src)).rotate();
  if (crop) img = sharp(await img.extract(crop).toBuffer());
  await img.resize({ width: 2160, height: 2160, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(OUT, out));
  console.log('photo', out);
}
