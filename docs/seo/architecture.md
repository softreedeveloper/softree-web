# Arquitectura SEO

## Principio

Un solo sitio donde el dato SEO vive **una vez**. Todo lo que Google, un usuario o un
sistema de IA ven sale de la misma fuente, así que no pueden contradecirse entre sí.

```
src/utils/site-config.js        datos crudos: nombre, URLs, contacto, dirección, assets
        ↓
src/utils/config.js             entorno real, robots por entorno, absoluteUrl()
        ↓
src/utils/seo/registry.js       REGISTRO CENTRAL: una entrada por URL
        ↓
   ├─ components/seo/SEOHead.astro      title, description, canonical, OG, Twitter, favicons
   ├─ components/seo/Schema.astro       @graph JSON-LD
   ├─ components/seo/Breadcrumbs.astro  migas visuales
   ├─ components/seo/RelatedLinks.astro enlaces internos sugeridos (aún sin montar en páginas)
   ├─ pages/sitemap.xml.ts              sitemap
   ├─ pages/robots.txt.ts               robots por entorno
   ├─ pages/llms.txt.ts                 resumen para sistemas de IA
   ├─ pages/seo/*.json                  endpoints de solo lectura
   └─ scripts/seo-check.mjs             validación en build
```

## Módulos

| Módulo | Responsabilidad |
|--------|-----------------|
| `seo/registry.js` | Una entrada por URL: title, description, H1, keyword, intención, cluster, breadcrumb, enlaces |
| `seo/clusters.js` | Topic clusters y mapa de keywords |
| `seo/linking.js` | Grafo de enlaces, huérfanas, sugerencias, rotación de anchor |
| `seo/score.js` | SEO score explicable por página |
| `seo/schema/nodes.js` | Constructores Schema.org |
| `seo/schema/graph.js` | Ensamblado del `@graph`, `prune`, `validateGraph` |
| `seo/llms.js` | Generación de `llms.txt` y `llms-full.txt` |
| `seo/pseo/` | Dimensiones, quality engine y catálogo de candidatas |

## Reglas que el validador hace cumplir

- Ningún `<title>` ni canonical fuera de `SEOHead`.
- Una keyword principal, una sola página (anti-canibalización).
- Ninguna página indexable sin enlaces internos entrantes.
- Ningún enlace declarado hacia una ruta que no existe.
- `GLOBAL_NAV` debe coincidir con lo que enlazan Header, MenuMobile y Footer.
- Ningún `@id` duplicado ni referencia rota en el JSON-LD.
- Ningún asset referenciado en la config que no exista en `public/`.

## Comandos

```bash
npm run seo:check     # validación estática; corre también como `prebuild` (SEO_STRICT=1 la hace bloqueante)
npm run seo:audit -- https://DOMINIO   # auditoría HTTP en vivo (--expect=staging para stage, --json para informe)
npm run seo:report    # score, enlaces, backlog de contenido y estado PSEO
npm run build         # incluye la generación de sitemap, robots, llms y endpoints
```
