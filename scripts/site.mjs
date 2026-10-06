// Construye la página para la cliente (index.html, GitHub Pages) y CAPTIONS.md
// a partir de scripts/plan.mjs + piezas/*/copy.md + exports.
import sharp from 'sharp';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { plan } from './plan.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const REPO = 'https://github.com/Werockagencia/alma-house-miercoles-de-amigas';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

function md(src) {
  const out = []; const lines = src.trim().split('\n'); let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim() || l.startsWith('---')) { i++; continue; }
    if (l.startsWith('## ')) { out.push(`<h4>${inline(l.slice(3))}</h4>`); i++; continue; }
    if (l.startsWith('# ')) { i++; continue; }
    if (l.startsWith('> ')) { out.push(`<p class="tip">${inline(l.slice(2))}</p>`); i++; continue; }
    if (/^(- |\d+\. )/.test(l)) {
      const ordered = /^\d+\. /.test(l); const items = [];
      while (i < lines.length && /^(- |\d+\. )/.test(lines[i])) items.push(lines[i++].replace(/^(- |\d+\. )/, ''));
      out.push(`<${ordered ? 'ol' : 'ul'}>${items.map(x => `<li>${inline(x)}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`);
      continue;
    }
    const para = []; while (i < lines.length && lines[i].trim() && !/^(- |\d+\. |## |> |---)/.test(lines[i])) para.push(lines[i++]);
    out.push(`<p>${para.map(inline).join('<br>')}</p>`);
  }
  return out.join('\n');
}

function parseCopy(text) {
  const [head, ...parts] = text.split(/\n## /);
  const meta = {};
  for (const m of head.matchAll(/\*\*(.+?):\*\* (.+)/g)) meta[m[1]] = m[2];
  const sections = {};
  for (const p of parts) { const nl = p.indexOf('\n'); sections[p.slice(0, nl).trim()] = p.slice(nl + 1).trim(); }
  return { meta, sections };
}

await mkdir(path.join(ROOT, 'web'), { recursive: true });
const web = async (src, name, flatten) => {
  let img = sharp(src);
  if (flatten) img = img.flatten({ background: flatten });
  await img.resize({ width: 1080, withoutEnlargement: true }).jpeg({ quality: 88, chromaSubsampling: '4:4:4', mozjpeg: true }).toFile(path.join(ROOT, 'web', name));
  return `web/${name}`;
};

// JPG en tamaño completo para descargar una por una (calidad alta, listo para Instagram)
await mkdir(path.join(ROOT, 'descargas'), { recursive: true });
const full = async (src, name) => {
  await sharp(src).flatten({ background: '#1C1411' }).jpeg({ quality: 93, chromaSubsampling: '4:4:4', mozjpeg: true }).toFile(path.join(ROOT, 'descargas', name));
  return `descargas/${name}`;
};

const pieces = [];
for (const p of plan) {
  const dir = path.join(ROOT, 'piezas', p.dir);
  const { meta, sections } = parseCopy(await readFile(path.join(dir, 'copy.md'), 'utf8'));
  const post = await web(path.join(dir, 'export', `${p.n}-post.png`), `${p.n}-post.jpg`);
  const story = await web(path.join(dir, 'export', `${p.n}-historia.png`), `${p.n}-historia.jpg`);
  const slug = p.dir.replace(/^\d+-/, '');
  const postJpg = await full(path.join(dir, 'export', `${p.n}-post.png`), `alma-house-octubre-${p.n}-${slug}-post.jpg`);
  const storyJpg = await full(path.join(dir, 'export', `${p.n}-historia.png`), `alma-house-octubre-${p.n}-${slug}-historia.jpg`);
  pieces.push({ ...p, meta, sections, post, story, postJpg, storyJpg, postPng: `piezas/${p.dir}/export/${p.n}-post.png`, storyPng: `piezas/${p.dir}/export/${p.n}-historia.png` });
}

// ---------- CAPTIONS.md ----------
let caps = `# Captions · Miércoles de Octubre\n\nTodos los captions en orden de publicación. Fuente: \`piezas/<pieza>/copy.md\`.\n\n`;
for (const p of pieces) caps += `---\n\n## ${p.n} · ${p.title}\n**${p.date} · ${p.time}**\n\n### Caption\n\n${p.sections['Caption']}\n\n${p.sections['Hashtags'] ?? ''}\n\n### Versión corta\n\n${p.sections['Versión corta'] ?? ''}\n\n`;
await writeFile(path.join(ROOT, 'CAPTIONS.md'), caps);

// ---------- index.html ----------
const pieceHtml = p => {
  const extras = Object.entries(p.sections).filter(([k]) => k === 'Notas');
  return `
<section class="piece" id="p${p.n}">
  <header class="ph">
    <p class="eyebrow">${p.n} · ${esc(p.role)}</p>
    <h2>${esc(p.title)}</h2>
    <p class="when"><span>${p.date}</span><span>${p.time}</span></p>
    ${p.meta['Rol en la campaña'] ? `<p class="role">${inline(p.meta['Rol en la campaña'].replace(/^./, c => c.toUpperCase()))}</p>` : ''}
  </header>
  <div class="duo">
    <figure><a href="${p.postJpg}" target="_blank"><img src="${p.post}" alt="" loading="lazy"></a><figcaption><span>Post · 1080×1350</span><a class="dl" href="${p.postJpg}" download>↓ Descargar JPG</a></figcaption></figure>
    <figure class="st"><a href="${p.storyJpg}" target="_blank"><img src="${p.story}" alt="" loading="lazy"></a><figcaption><span>Historia · 1080×1920</span><a class="dl" href="${p.storyJpg}" download>↓ Descargar JPG</a></figcaption></figure>
    <div class="capbox">
      <div class="cap-h"><span class="label">Caption</span><button class="copy" data-copy="cap${p.n}">Copiar caption</button></div>
      <div class="cap" id="cap${p.n}">${esc(p.sections['Caption'] ?? '')}\n\n${esc(p.sections['Hashtags'] ?? '')}</div>
      <div class="details">${extras.map(([k, v]) => `<details><summary>${esc(k)}</summary>${md(v)}</details>`).join('')}</div>
    </div>
  </div>
</section>`;
};

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Miércoles de Octubre · Alma House</title>
<link rel="icon" href="assets/brand/logos/isotipo-terracota.png">
<style>
@font-face{font-family:'Aurora';src:url('assets/brand/fonts/aurora-serif.otf');font-style:normal}
@font-face{font-family:'Aurora';src:url('assets/brand/fonts/aurora-serif-italic.otf');font-style:italic}
@font-face{font-family:'Uncage';src:url('assets/brand/fonts/uncage-vf.ttf');font-weight:100 900}
@font-face{font-family:'Figtree';src:url('assets/brand/fonts/figtree-vf.ttf');font-weight:300 900}
:root{--cream:#F7EFE7;--paper:#FBF6F0;--blush:#CEBAAA;--sage:#A3A287;--brown:#99471D;--bakery:#AF9175;--forest:#3F412F;--espresso:#2A1F1A;--ink:#32342A;--ink2:#45473A;--line:rgba(50,52,42,.14)}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--cream);color:var(--ink);font-family:'Figtree',system-ui,sans-serif;font-size:17px;line-height:1.6;font-weight:450;-webkit-font-smoothing:antialiased}
a{color:inherit}
img{display:block;max-width:100%}
.label,.eyebrow{font-family:'Uncage','Figtree',sans-serif;text-transform:uppercase;letter-spacing:.24em;font-size:12px;font-weight:650}
.wrap{max-width:1240px;margin:0 auto;padding:0 32px}
.serif{font-family:'Aurora',Georgia,serif;font-weight:400}

.hero{background:#1C1411;padding:40px 0 80px;color:var(--cream)}
.mast{display:flex;align-items:center;gap:20px;color:var(--blush)}
.mast .rule{flex:1;height:1px;background:currentColor;opacity:.3}
.hero-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:56px;align-items:center;margin-top:64px}
.hero h1{font-family:'Aurora',serif;font-weight:400;font-size:clamp(50px,6.6vw,100px);line-height:.86;letter-spacing:-.03em}
.hero h1 em{color:var(--blush)}
.hero .lede{font-family:'Aurora',serif;font-style:italic;-webkit-text-stroke:.4px currentColor;font-size:clamp(22px,2.4vw,30px);line-height:1.25;margin-top:30px;max-width:32ch}
.hero .by{margin-top:34px;color:var(--blush);line-height:2}
.hero .pair{display:grid;grid-template-columns:1fr .62fr;gap:16px;align-items:end}
.hero .pair img{border-radius:4px;box-shadow:0 30px 70px rgba(0,0,0,.5)}

.sec{padding:80px 0 10px}
.sec-h{display:flex;align-items:baseline;justify-content:space-between;gap:20px;border-bottom:1px solid var(--line);padding-bottom:16px;margin-bottom:30px;flex-wrap:wrap}
.sec-h h3{font-family:'Aurora',serif;font-weight:400;font-size:44px;line-height:1}
.sec-h .label{color:#8a6a50}
.terms{margin-top:36px;background:var(--paper);border:1px solid var(--line);border-radius:6px;padding:26px 28px;display:grid;grid-template-columns:auto 1fr;gap:10px 28px}
.terms .label{color:var(--brown);grid-column:1/-1;margin-bottom:6px}
.terms dt{font-weight:600}
.terms dd{color:var(--ink2)}
.terms .warn{grid-column:1/-1;margin-top:10px;font-size:15px;color:var(--brown);font-weight:600}

.cals{display:grid;grid-template-columns:repeat(6,1fr);gap:14px}
.cal{text-decoration:none;display:flex;flex-direction:column;gap:8px}
.cal img{aspect-ratio:4/5;object-fit:cover;width:100%;border-radius:3px;transition:transform .3s}
.cal:hover img{transform:translateY(-4px)}
.cal-d{font-family:'Uncage',sans-serif;text-transform:uppercase;letter-spacing:.18em;font-size:10px;color:var(--brown)}
.cal-t{font-family:'Aurora',serif;font-size:20px;line-height:1.15;-webkit-text-stroke:.35px currentColor}

.piece{padding:80px 0 30px;border-top:1px solid var(--line);margin-top:40px}
.ph{display:grid;grid-template-columns:1fr auto;gap:6px 32px;align-items:end}
.ph .eyebrow{color:var(--brown);grid-column:1/-1}
.ph h2{font-family:'Aurora',serif;font-weight:400;font-size:clamp(40px,5.4vw,70px);line-height:.95;letter-spacing:-.02em}
.when{display:flex;gap:10px;flex-wrap:wrap}
.when span{font-family:'Uncage',sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;border:1px solid var(--ink);border-radius:999px;padding:9px 16px;white-space:nowrap}
.when span:first-child{background:var(--ink);color:var(--cream)}
.role{grid-column:1/-1;color:var(--ink2);max-width:80ch;margin-top:16px;font-size:16.5px}
.duo{display:grid;grid-template-columns:1.25fr .78fr 1.2fr;gap:22px;margin-top:30px;align-items:start}
.duo figure img{width:100%;border-radius:3px;box-shadow:0 14px 40px rgba(50,40,30,.13)}
.duo figcaption{font-size:13px;color:#7d6550;font-weight:600;margin-top:10px;letter-spacing:.04em;display:flex;flex-direction:column;gap:8px;align-items:flex-start}
.dl{display:inline-block;background:var(--brown);color:var(--cream);text-decoration:none;border-radius:999px;padding:10px 16px;font-family:'Uncage',sans-serif;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;font-weight:650}
.dl:hover{background:var(--forest)}
.dl:focus-visible{outline:2px solid var(--brown);outline-offset:3px}
.capbox{background:var(--paper);border:1px solid var(--line);border-radius:6px;padding:24px 26px}
.cap-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;color:var(--bakery)}
.cap{white-space:pre-line;font-size:16px;line-height:1.62;color:var(--ink)}
.copy{font-family:'Uncage',sans-serif;font-size:10px;letter-spacing:.18em;text-transform:uppercase;background:var(--brown);color:var(--cream);border:0;border-radius:999px;padding:10px 16px;cursor:pointer}
.copy.ok{background:var(--forest)}
.copy:focus-visible,summary:focus-visible,a:focus-visible{outline:2px solid var(--brown);outline-offset:3px}
.details{margin-top:18px}
.details details{border-top:1px solid var(--line)}
.details summary{cursor:pointer;list-style:none;padding:13px 0;font-family:'Aurora',serif;font-size:21px;-webkit-text-stroke:.3px currentColor;display:flex;justify-content:space-between}
.details summary::after{content:'+';color:var(--brown)}
.details details[open] summary::after{content:'–'}
.details details>*:not(summary){margin-bottom:12px;font-size:15px;color:var(--ink2)}
.details ul,.details ol{padding-left:20px}
code{font-size:12.5px;background:rgba(153,71,29,.08);padding:1px 5px;border-radius:3px}

.btn{display:inline-block;border:1px solid var(--brown);color:var(--brown);text-decoration:none;border-radius:999px;padding:11px 18px;font-family:'Uncage',sans-serif;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase}
.btn:hover{background:var(--brown);color:var(--cream)}

.foot{background:#1C1411;color:var(--cream);margin-top:90px;padding:64px 0}
.foot-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px}
.foot h4{font-family:'Aurora',serif;font-weight:400;font-size:30px;line-height:1.05;margin-bottom:14px}
.foot p{color:rgba(247,239,231,.92);font-size:15.5px;margin-bottom:12px}
.foot .label{color:var(--blush)}
.foot .btn{border-color:var(--blush);color:var(--cream);margin:8px 8px 0 0}
.sign{display:flex;justify-content:space-between;align-items:center;margin-top:56px;padding-top:26px;border-top:1px solid rgba(247,239,231,.15);gap:18px;flex-wrap:wrap}
.sign img{height:42px}

@media (max-width:980px){
  .hero-grid,.foot-grid{grid-template-columns:1fr}
  .duo{grid-template-columns:1fr 1fr}
  .duo .capbox{grid-column:1/-1}
  .cals{grid-template-columns:repeat(3,1fr)}
  .ph{grid-template-columns:1fr}
}
@media (max-width:560px){
  .wrap{padding:0 16px}
  .cals{grid-template-columns:repeat(2,1fr)}
  .terms{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
</style>
</head>
<body>

<header class="hero">
  <div class="wrap">
    <div class="mast label"><span>Alma House · Nails Bar</span><span class="rule"></span><span>Campaña · Octubre 2026</span></div>
    <div class="hero-grid">
      <div>
        <h1>Octubre<br><em>se pinta oscuro.</em></h1>
        <p class="lede">Miércoles de Octubre: la temporada de Halloween de Alma House, sin disfraz. Cada miércoles del mes, 15% en todos los servicios.</p>
        <p class="by label">6 piezas · post + historia<br>Dirección creativa · We Rock Agencia</p>
      </div>
      <div class="pair"><img src="${pieces[0].post}" alt="Post de lanzamiento: Octubre se pinta oscuro"><img src="${pieces[0].story}" alt="Historia de lanzamiento"></div>
    </div>
  </div>
</header>

<main class="wrap">
  <section class="sec">
    <div class="sec-h"><h3>La promo</h3><span class="label">Confirmada por Alma House</span></div>
    <dl class="terms">
      <dt>Qué</dt><dd>15% en todos los servicios.</dd>
      <dt>Cuándo</dt><dd>Todos los miércoles de octubre: 7, 14, 21 y 28.</dd>
      <dt>Cómo</dt><dd>Con reserva por WhatsApp (311 566 2051).</dd>
      <p class="warn">Antes del 21 de octubre: confirmar que los tonos de la pieza 04 (cereza negra, rojo, espresso y negro con lunares) están disponibles. Miércoles de Amigas pasa a noviembre, con la carta de cócteles.</p>
    </dl>
  </section>

  <section class="sec">
    <div class="sec-h"><h3>Calendario</h3><span class="label">Post + historia de cada pieza</span></div>
    <div class="cals">${pieces.map(p => `<a class="cal" href="#p${p.n}"><span class="cal-d">${p.date}</span><img src="${p.post}" alt="" loading="lazy"><span class="cal-t">${esc(p.title)}</span></a>`).join('')}</div>
  </section>

  ${pieces.map(pieceHtml).join('\n')}

</main>

<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <p class="label">Sobre las imágenes</p>
        <h4>Fotografía de referencia</h4>
        <p>Las fotografías vienen del tablero de Pinterest aprobado por Alma House y pertenecen a sus autores. Se usan como dirección de arte en contenido orgánico, no en pauta paga (fuentes en <a href="${REPO}/blob/main/assets/pinterest/SOURCES.md" target="_blank">SOURCES.md</a>).</p>
      </div>
      <div>
        <p class="label">Archivos</p>
        <h4>Todo listo para subir</h4>
        <p>Cada imagen tiene su botón para descargar el JPG en tamaño completo (post 1080×1350 · historia 1080×1920).</p>
        <a class="btn" href="${REPO}/blob/main/CAPTIONS.md" target="_blank">Todos los captions</a>
        <a class="btn" href="${REPO}/archive/refs/heads/main.zip">Descargar todo (.zip)</a>
      </div>
    </div>
    <div class="sign">
      <img src="assets/brand/logos/logo-crema.png" alt="Alma House Nails Bar">
      <span class="label" style="color:var(--blush)">WhatsApp 311 566 2051 · CC Montaña Plaza, local 4 · Cajicá</span>
    </div>
  </div>
</footer>

<script>
document.querySelectorAll('.copy').forEach(b => b.addEventListener('click', async () => {
  const el = document.getElementById(b.dataset.copy), t = el.innerText.trim();
  try { await navigator.clipboard.writeText(t); } catch { const r = document.createRange(); r.selectNodeContents(el); getSelection().removeAllRanges(); getSelection().addRange(r); document.execCommand('copy'); }
  const o = b.textContent; b.textContent = 'Copiado'; b.classList.add('ok'); setTimeout(() => { b.textContent = o; b.classList.remove('ok'); }, 1600);
}));
</script>
</body>
</html>
`;
await writeFile(path.join(ROOT, 'index.html'), html);
console.log(`index.html · CAPTIONS.md · ${pieces.length} piezas`);
