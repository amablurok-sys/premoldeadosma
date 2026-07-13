# Cómo agregar fotos a la galería

La galería y el lightbox toman **automáticamente** todas las fotos que haya en el
grid, en el orden en que aparecen. Sumar una foto nueva son 3 pasos.

## 1. Poné la foto en `images/`

Copiá tu foto (JPG) a la carpeta `images/`, con un nombre claro y sin espacios ni
tildes. Ejemplo: `images/gallery-5.jpg`.

## 2. Optimizala a WebP

Desde la carpeta del proyecto, corré:

```bash
python scripts/optimize-images.py images/gallery-5.jpg
```

Eso crea `images/gallery-5.webp` (mucho más liviana) y deja el JPG como respaldo.
Para fotos muy grandes podés limitar el ancho: `--max-width 1000`.

## 3. Sumala al grid en `index.html`

Buscá la sección `<div class="gallery-grid">` y agregá un bloque como este
(copiá uno existente y cambiá los nombres de archivo y el texto `alt`):

```html
<a href="images/gallery-5.jpg" target="_blank" rel="noopener">
  <picture>
    <source srcset="images/gallery-5.webp" type="image/webp">
    <img src="images/gallery-5.jpg" alt="Descripción del trabajo"
         width="760" height="1013" loading="lazy" decoding="async">
  </picture>
</a>
```

- El `alt` es la descripción que se ve en el lightbox y ayuda al SEO — poné algo
  como "Muro premoldeado símil piedra en Ezeiza".
- `width` y `height` deberían ser las dimensiones reales del `.webp` (te las
  muestra el script al convertir). No hace falta que sean exactas, pero mantener
  la proporción evita saltos de layout.

## Consejo

Fotos apaisadas (horizontales) o verticales, todas entran: el grid las recorta a
un alto uniforme y el lightbox muestra la foto completa. Ideal subir de a varias
para que la galería luzca llena.
