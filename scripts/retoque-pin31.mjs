// Retoque del pin-31: quita el texto de la marca del tubo de labial (se usa en la pieza 01).
// Filtro de mediana sobre la franja del texto + máscara suave que no toca dedos ni uñas.
// Salida: assets/pinterest/pin-31-limpio.jpg (el original queda intacto).
import sharp from 'sharp';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'assets', 'pinterest', 'pin-31.jpg');
const OUT = path.join(ROOT, 'assets', 'pinterest', 'pin-31-limpio.jpg');

// Zona de trabajo (coordenadas del original 1200×1495)
const R = { left: 560, top: 540, width: 520, height: 420 };
// Franjas del texto, en coordenadas de la zona (siguen el eje del tubo)
const bands = [
  '140,262 148,226 330,156 354,166 364,196 300,236 162,284',   // rhode + líneas pequeñas
  '44,300 82,292 86,318 48,326',                               // "…DES" junto a los dedos
];
const MEDIAN = 23;
// Las letras gruesas del logo necesitan una mediana más ancha (solo en el centro del tubo)
const LOGO = '238,236 250,206 340,170 356,176 362,196 290,226 252,244';
const MEDIAN_LOGO = 49;

const zone = await sharp(SRC).extract(R).toBuffer();
const pass1 = await sharp(zone).median(MEDIAN).toBuffer();
const wide = await sharp(pass1).median(MEDIAN_LOGO).toBuffer();
const logoMask = await sharp(Buffer.from('<svg width="'+R.width+'" height="'+R.height+'" xmlns="http://www.w3.org/2000/svg"><defs><filter id="f"><feGaussianBlur stdDeviation="4"/></filter></defs><polygon filter="url(#f)" fill="#fff" points="'+LOGO+'"/></svg>')).resize(R.width, R.height).greyscale().extractChannel(0).toBuffer();
const clean = await sharp(pass1).composite([{ input: await sharp(wide).joinChannel(logoMask).png().toBuffer() }]).toBuffer();
const mask = await sharp(Buffer.from(`<svg width="${R.width}" height="${R.height}" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="f"><feGaussianBlur stdDeviation="3"/></filter></defs>
  <g filter="url(#f)" fill="#fff">${bands.map(b => `<polygon points="${b}"/>`).join('')}</g></svg>`)).resize(R.width, R.height).greyscale().toBuffer();
const patch = await sharp(clean).joinChannel(await sharp(mask).extractChannel(0).toBuffer()).png().toBuffer();
// Letras del vaso que asoman sobre la funda de cartón (franja negra)
const V = { left: 640, top: 440, width: 140, height: 50 };
const vClean = await sharp(SRC).extract(V).median(15).toBuffer();
const vMask = await sharp(Buffer.from(`<svg width="${V.width}" height="${V.height}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="f"><feGaussianBlur stdDeviation="1.5"/></filter></defs><polygon filter="url(#f)" fill="#fff" points="20,14 104,11 106,27 20,29"/></svg>`)).resize(V.width, V.height).greyscale().extractChannel(0).toBuffer();
const vPatch = await sharp(vClean).joinChannel(vMask).png().toBuffer();
await sharp(SRC).composite([{ input: patch, left: R.left, top: R.top }, { input: vPatch, left: V.left, top: V.top }]).jpeg({ quality: 95 }).toFile(OUT);
await sharp(OUT).extract({ left: 600, top: 420, width: 220, height: 80 }).resize(660).toFile(path.join(ROOT, 'preview', 'pin31-vaso.png'));
await sharp(OUT).extract(R).toFile(path.join(ROOT, 'preview', 'pin31-retoque.png'));
console.log('pin-31-limpio.jpg');
