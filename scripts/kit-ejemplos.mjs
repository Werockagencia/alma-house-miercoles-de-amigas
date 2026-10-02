// Arma 3 historias de ejemplo con el kit sobre fotos reales (referencia visual para la guía).
import sharp from 'sharp';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const K = path.join(ROOT, 'piezas/07-kit-de-historias/export');
const OUT = path.join(ROOT, 'piezas/07-kit-de-historias/ejemplos');
const mk = async (name, photo, layers) => {
  const comp = [];
  for (const [f, w, left, top] of layers) comp.push({ input: await sharp(path.join(K, f)).resize({ width: w }).toBuffer(), left, top });
  const base = await sharp(path.join(ROOT, 'assets/photos', photo)).resize(1080, 1920, { fit: 'cover' }).toBuffer();
  await sharp(base).composite(comp).jpeg({ quality: 86 }).toFile(path.join(OUT, name));
  console.log('ejemplo', name);
};
await mk('ejemplo-1-recien-salidas.jpg', 'kit-reflejo-vidrio.jpg', [['marco-editorial-claro.png', 1080, 0, 0], ['sticker-recien-salidas-claro.png', 640, 80, 1180]]);
await mk('ejemplo-2-hoy-en-la-casa.jpg', 'kit-pulsera-luz.jpg', [['sticker-hoy-en-la-casa-oscuro.png', 620, 230, 300], ['sticker-reserva-tu-momento-oscuro.png', 760, 160, 1420]]);
await mk('ejemplo-3-miercoles-de-amigas.jpg', 'amigas-pies-sabana.jpg', [['sticker-miercoles-de-amigas-claro.png', 700, 190, 1050], ['sticker-sello-15-claro.png', 300, 700, 320]]);
