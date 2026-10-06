// Inyecta el sello "Miércoles de Octubre · 15%" en cada <div class="seal" data-sub="…">.
document.querySelectorAll('.seal').forEach((el, i) => {
  const sub = el.dataset.sub ?? 'en todo';
  const id = `arc${i}`;
  el.innerHTML = `
  <svg viewBox="0 0 300 300" aria-hidden="true">
    <defs><path id="${id}" d="M150,150 m-118,0 a118,118 0 1,1 236,0 a118,118 0 1,1 -236,0"/></defs>
    <circle class="disc" cx="150" cy="150" r="150"/>
    <circle class="ring" cx="150" cy="150" r="141"/>
    <circle class="ring" cx="150" cy="150" r="92"/>
    <text class="curve"><textPath href="#${id}" startOffset="0">Miércoles de Octubre · Alma House · </textPath></text>
    <text x="142" y="172" text-anchor="middle"><tspan class="num">15</tspan><tspan class="pct" dy="-28">%</tspan></text>
    <text class="sub" x="150" y="205" text-anchor="middle">${sub}</text>
  </svg>`;
});
