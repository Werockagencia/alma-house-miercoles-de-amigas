// Copia los pines seleccionados del tablero de Pinterest con nombres semánticos,
// redimensionados a máx. 2160 px de lado largo. (Los logos ya vienen recortados en assets/brand/logos.)
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PIN_SRC = path.join(ROOT, 'assets', 'pinterest');
const OUT = path.join(ROOT, 'assets', 'photos');

const photos = {
  'pin-36.jpg': 'amigas-menique.jpg',     // dos amigas, meñique entrelazado
  'pin-21.jpg': 'amigas-abanico-tonos.jpg',
  'pin-25.jpg': 'amigas-pedicure-jeans.jpg',
  'pin-50.jpg': 'amigas-copa-lunares.jpg',
  'pin-49.jpg': 'amigas-rojo-labial.jpg',
  'pin-28.jpg': 'amigas-helado.jpg',
  'pin-55.png': 'amigas-pies-sabana.jpg',
  'pin-09.jpg': 'kit-pulsera-luz.jpg',
  'pin-15.jpg': 'kit-reflejo-vidrio.jpg',
};

await mkdir(OUT, { recursive: true });
for (const [src, out] of Object.entries(photos)) {
  await sharp(path.join(PIN_SRC, src)).rotate()
    .resize({ width: 2160, height: 2160, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(OUT, out));
  console.log('photo', out);
}
