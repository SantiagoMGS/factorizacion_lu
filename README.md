# Sitio — Factorización LU

Réplica limpia (HTML + CSS + KaTeX) del sitio de Gamma:
https://factorizacion-lu-r5ttq2n.gamma.site/

## Stack

- HTML5 estático (sin build).
- CSS3 propio (`styles.css`) inspirado en la paleta del original (navy/violeta, cards con blur, chevrons).
- [KaTeX](https://katex.org/) cargado por CDN para renderizar LaTeX.
- Fuente Inter desde Google Fonts.

## Cómo ver el sitio

Opción 1 — abrir directamente:
```bash
xdg-open index.html
```

Opción 2 — servidor local (recomendado, evita restricciones CORS de algunos navegadores):
```bash
python3 -m http.server 8000
# luego abrir http://localhost:8000
```

## Estructura

```
sitio/
├── index.html   # Contenido completo (5 secciones)
├── styles.css   # Estilos del sitio
└── README.md    # Este archivo
```

## Personalización rápida

Los colores principales viven como variables CSS en `:root` al inicio de `styles.css`:

- `--accent` — violeta-azul principal
- `--bg-1`, `--bg-2`, `--bg-3` — degradado de fondo
- `--card-bg` — fondo de las cards

## Diferencias con el original de Gamma

- LaTeX se renderiza correctamente (Gamma mostraba texto plano `\frac{...}`).
- Sin watermark "Made with Gamma".
- Código mantenible y editable.
- Sin tracking ni scripts externos (solo KaTeX y Google Fonts).
