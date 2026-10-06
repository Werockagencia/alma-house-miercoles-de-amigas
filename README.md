# Alma House · Miércoles de Octubre

**Campaña de los miércoles · octubre 2026 · temporada de Halloween**
Por **We Rock Agencia** para Alma House Nails Bar (Cajicá).

**Página para la cliente:** https://werockagencia.github.io/alma-house-miercoles-de-amigas/
**Todos los captions:** [CAPTIONS.md](CAPTIONS.md)
**Miércoles de Amigas (noviembre):** guardado completo en la rama [`amigas-noviembre`](https://github.com/Werockagencia/alma-house-miercoles-de-amigas/tree/amigas-noviembre), listo para retomarlo con la carta de cócteles.

---

## El brief

Alma House mueve **Miércoles de Amigas a noviembre**, para lanzarlo como combo con la nueva carta de cócteles (lista a finales de octubre). En octubre va un **15% por Halloween**. Las imágenes de Amigas le encantaron, así que esta campaña conserva ese sistema visual.

## La idea: *Octubre se pinta oscuro*

- **Halloween sin disfraz.** Nada de calabazas ni telarañas: la temporada se cuenta con tonos de uña (cereza negra, rojo, espresso, un guiño de lunares) y una versión nocturna del sistema de Amigas: fondos espresso, fotos más profundas y acentos en rosa empolvado.
- **El 15% como temporada, no como rebaja.** Se comunica como "los miércoles de octubre" de la casa, con fecha de cierre real (28 de octubre, antes de la noche del 31).
- **Mismo sello, otro texto:** "Miércoles de Octubre · 15% · en todo". Así Amigas queda intacto para noviembre.

### Mecánica (confirmada por Alma House el 2 de octubre)

| | |
|---|---|
| Qué | 15% en todos los servicios |
| Cuándo | Todos los miércoles de octubre: 7, 14, 21 y 28 |
| Cómo | Con reserva por WhatsApp (311 566 2051) |

### Por validar

- [ ] Que los tonos de la pieza 04 (cereza negra, rojo, espresso, negro con lunares) estén disponibles, antes del 21 de octubre.
- [ ] Si la promo se acumula con otras (por ahora no se dice nada en las piezas).

## Las piezas (post 1080×1350 + historia 1080×1920 cada una)

| Fecha | # | Pieza | Rol |
|---|---|---|---|
| Lun 5 oct · 6:00 p. m. | 01 | [Octubre se pinta oscuro](piezas/01-octubre-se-pinta-oscuro/copy.md) | Lanzamiento, antes del primer miércoles |
| Mié 7 oct · 8:00 a. m. | 02 | [Así funciona tu miércoles](piezas/02-asi-funciona/copy.md) | La mecánica en tres pasos |
| Mié 14 oct · 8:00 a. m. | 03 | [Tu cita de octubre](piezas/03-tu-cita-de-octubre/copy.md) | Para guardar y compartir |
| Mié 21 oct · 8:00 a. m. | 04 | [Los tonos de octubre](piezas/04-los-tonos-de-octubre/copy.md) | Curaduría con guiño de Halloween |
| Mié 28 oct · 8:00 a. m. | 05 | [No necesitas disfraz](piezas/05-la-noche-del-31/copy.md) | Último miércoles, antes del 31 |
| Cada miércoles · 11:00 a. m. | 06 | [Hoy es miércoles](piezas/06-hoy-es-miercoles/copy.md) | Recordatorio semanal (historia) |

Los posts regulares de martes y jueves siguen su calendario; estas piezas ocupan los miércoles.

## Sistema visual

- `assets/css/alma.css` (tokens de marca) + `miercoles.css` (sello y legibilidad, heredados de Amigas) + `octubre.css` (versión nocturna).
- Fotos: tablero de Pinterest de la cliente (pines 44, 54, 47, 50, 02 y 01). Al pin 44 se le recorta un texto de tienda que traía abajo.

## Derechos

Las fotografías vienen del tablero de Pinterest aprobado por Alma House y pertenecen a sus autores ([SOURCES.md](assets/pinterest/SOURCES.md)). Uso **orgánico, no pauta paga**. Para pautar, reemplazarlas por fotos propias.

## Re-exportar

```bash
npm install
npm run build        # fotos + PNG + página y CAPTIONS.md
npm run render -- 04 # solo una pieza
```
