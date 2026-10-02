# Alma House · Miércoles de Amigas

**Campaña de promociones de los miércoles · octubre 2026**
Por **We Rock Agencia** para Alma House Nails Bar (Cajicá).

**Página para la cliente:** https://werockagencia.github.io/alma-house-miercoles-de-amigas/
**Todos los captions:** [CAPTIONS.md](CAPTIONS.md)

---

## El brief

> Los miércoles son nuestros días más solitos; queremos moverlos con promociones. Podríamos iniciar con un 15%, como un miércoles de amigas. — Alma House

(La guía y el kit de historias con la tipografía de Alma van en otra URL.)

## La idea: *Los miércoles se comparten*

- **Una promo que suma, no que abarata.** Alma House no compite por precio, así que el 15% no se comunica como "descuento", sino como un **ritual para dos**. Lo que se vende es el plan con la amiga; el 15% es la excusa.
- **El día más solo se llena de a dos.** Cada reserva trae dos clientas, y muchas veces una es nueva. Es boca a boca con mecánica.
- **Mismo lenguaje de marca** que el Capítulo III (tipografía, paleta, tono), más un elemento propio: el **sello circular "Miércoles de Amigas · 15%"**, para que la promo se reconozca al instante.

### Mecánica propuesta (por confirmar con la cliente)

| | |
|---|---|
| Qué | 15% para cada una en su servicio de manos o pies |
| Cuándo | Todos los miércoles, desde el 7 de octubre |
| Cómo | Reservando juntas por WhatsApp (311 566 2051). No acumulable con otras promociones |

- [ ] Confirmar qué servicios incluye
- [ ] Confirmar si aplica a dos amigas o a grupos
- [ ] Confirmar si tiene fecha de cierre
- [ ] Confirmar fecha de arranque (7 de octubre)

## Las piezas (post 1080×1350 + historia 1080×1920 cada una)

| Fecha | # | Pieza | Rol |
|---|---|---|---|
| Lun 5 oct · 6:00 p. m. | 01 | [Los miércoles se comparten](piezas/01-los-miercoles-se-comparten/copy.md) | Lanzamiento, con tiempo para coordinar con la amiga |
| Mié 7 oct · 8:00 a. m. | 02 | [Así funciona tu miércoles](piezas/02-asi-funciona/copy.md) | La mecánica en 3 pasos + letra pequeña |
| Mié 14 oct · 8:00 a. m. | 03 | [Estás invitada](piezas/03-estas-invitada/copy.md) | Invitación para etiquetar y enviar: alcance orgánico |
| Mié 21 oct · 8:00 a. m. | 04 | [El plan de mitad de semana](piezas/04-el-plan-de-mitad-de-semana/copy.md) | Alma House compite con el after office, no con otro salón |
| Mié 28 oct · 8:00 a. m. | 05 | [¿Iguales u opuestas?](piezas/05-tonos-para-dos/copy.md) | Juego de tonos entre amigas (retoma La edición de octubre) |
| Cada miércoles · 11:00 a. m. | 06 | [Hoy es miércoles](piezas/06-hoy-es-miercoles/copy.md) | Recordatorio semanal en historia; el post, para un miércoles sin pieza nueva |

Los posts de la promo salen los **miércoles**: es el día de la campaña, y como es el más libre, se puede reservar el mismo día. Conviven con la parrilla del Capítulo III (martes y jueves).

**Lenguaje:** se habla de *momento*, nunca de *hora*. Dirección: CC Montaña Plaza, **local 4**, Cajicá.

**Nota de derechos:** las fotos son de terceros, tomadas del tablero de Pinterest aprobado por la cliente ([SOURCES.md](assets/pinterest/SOURCES.md)). **Uso: contenido orgánico, no pauta.**

## Editar y volver a exportar

Requiere Node 18+ y Google Chrome instalado.

```bash
npm install
npm run build          # fotos + render + página
npm run render -- 03   # re-exporta solo la pieza 03
npm run site           # regenera index.html, web/ y CAPTIONS.md
```

- Cada `<section class="slide" data-file="…">` de `piezas/*/slides.html` es un PNG. `data-transparent` exporta con fondo transparente.
- El sello se dibuja con `assets/js/seal.js`; los estilos de campaña están en `assets/css/miercoles.css`, encima de `alma.css`.
