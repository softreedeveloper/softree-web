# Auditoría técnica SEO — softree.com.mx

Base: commit `c2a8af4`, rama `develop`. Verificaciones HTTP contra producción el 2026-09-03.
Estado de los hallazgos tras la **Fase 2 (SEO técnico)**.

Severidades: `CRITICAL` rompe indexación · `HIGH` pierde señales o rendimiento ·
`MEDIUM` techo estructural · `LOW` limpieza.

## Resueltos en Fase 2

| ID | Severidad | Hallazgo | Resolución |
|----|-----------|----------|------------|
| C-01 | CRITICAL | `Layout` declaraba la prop `schema` pero nunca la renderizaba: todo el JSON-LD por página se descartaba | `SEOHead.astro` emite Organization + schema de página + BreadcrumbList |
| C-02 | CRITICAL | Doble `<title>` en todas las páginas (`Layout.astro:57` y `:120`) | Un solo `<title>`, emitido por `SEOHead` |
| C-03 | CRITICAL | `/servicios` y `/contacto` huérfanas: 0 enlaces internos | Navegación de `Header`, `MenuMobile` y `Footer` reescrita sobre rutas reales (`/servicios` se retiró después con 301 a `/`) |
| C-04 | CRITICAL | `public/sitemap.xml` manual con 1 URL y restos de otro proyecto | `src/pages/sitemap.xml.ts` generado desde el registro central |
| C-05 | CRITICAL | `/notfound` indexable y thin; `404.astro` con `title="Error en el pago"` | `/notfound` eliminada + 301 a `/404`; 404 reescrita y en `noindex` |
| H-01 | HIGH | `og:image` con doble barra apuntando a un archivo inexistente | `absoluteUrl()` normaliza las URLs; `public/img/og-default.jpg` creada (1200×630) |
| H-02 | HIGH | 4 referencias de favicon a archivos inexistentes | Set completo generado: `favicon.ico`, 16×16, 32×32, apple-touch-icon |
| H-03 | HIGH | `assets.logo: ' /img/Logo.png'` con espacio inicial | Corregido; el validador falla si reaparece |
| H-04 | HIGH | `Organization` con `contactType` `undefined`, sin `@id`, sin teléfono ni email | Nodo completo con `@id` estable, `PostalAddress`, `legalName` y `ContactPoint` (Fase 3) |
| H-05 | HIGH | Font Awesome y flag-icons bloqueantes con **0 usos** en `src/` | Eliminados. Las dos familias tipográficas van en una sola hoja con `display=swap` |
| H-06 | HIGH | `environment` fijo en `'production'`: staging se anunciaba indexable | Detección real vía `PUBLIC_SITE_ENV` / `CONTEXT` de Netlify |
| H-07 | HIGH | SSR sin caché en todas las rutas | `prerender = true` en las 5 páginas; sitemap y robots también estáticos |
| M-05 | MEDIUM | `<Footer>` renderizado dentro de `<main>` | Ahora es hermano de `<main>` |
| M-07 | MEDIUM | Sin infraestructura de redirects | Bloque de redirects y cabeceras en `netlify.toml` |
| M-09 | MEDIUM | `netlify dev` no levantaba (`targetPort` 7001 vs 7002) | Alineado a 7002 |
| L-01 | LOW | `meta keywords`, obsoleta desde 2009 | Retirada |
| L-02 | LOW | `X-Frame-Options` como `meta http-equiv`, que los navegadores ignoran | Cabecera HTTP real en `netlify.toml` |
| L-03 | LOW | Sitemap sin `lastmod` | Incluido, desde el registro |
| L-04 | LOW | `robots.txt` bloqueando rutas inexistentes | Regenerado por entorno |

Extras detectados y corregidos durante la Fase 2:

- `assets.logoshort` apuntaba a `/img/softree_logo.png`, que **no existía**: la imagen del
  aviso de privacidad estaba rota. Archivo creado.
- El logo de la cabecera cargaba `Logo.png` (3798×897, **854 KB**) para mostrarlo a 44 px
  de alto. Sustituido por una versión de 720×170 (78 KB) con `width`/`height` explícitos.
- `404.astro` usaba clases `brand-*`, que no existen en la paleta de Tailwind.
- `privacypolicy.astro` tenía un BOM UTF-8 al inicio del archivo.
- `themeColor` era `#1e5c80` (azul), ajeno a la marca. Ahora `#27a317`, el verde base.

## Resueltos en Fase 3

| Cambio | Detalle |
|--------|---------|
| Motor de Schema | `seo/schema/nodes.js` (7 constructores) + `graph.js` (ensamblado, `prune`, `validateGraph`) + `Schema.astro` |
| Un solo `@graph` por página | Sustituye a los bloques `ld+json` sueltos; los nodos se referencian por `@id` |
| `Organization` completo | `@id`, `legalName`, `PostalAddress`, `ContactPoint`, `logo` como `ImageObject` con dimensiones reales |
| Validación de Schema en build | 4 reglas nuevas en `seo-check.mjs`: `@id` duplicados, referencias rotas, literales `undefined`, tipos declarados pero no emitidos |
| `/contacto` era un `Service` | Ahora `ContactPage`. Un formulario de contacto no es un servicio |
| Logo del Schema | Declaraba 720×170 apuntando al archivo de 3798×897. Alineado, y las dimensiones salen de la config |
| `config.jsx`, `site-config.jsx`, `seo.jsx` → `.js` | No contenían JSX; la extensión impedía que Node los cargara en el validador |
| `@astrojs/check` + `typescript` | Instalados. `npm run check`: **0 errores** |

## Resueltos en Fase 4 (alineación con las skills `seo-tecnico` y `tracking-conversiones`)

| Cambio | Detalle |
|--------|---------|
| `/privacypolicy` → `/aviso-de-privacidad` | 301 en `netlify.toml`; registro, footer y enlaces actualizados. `/notfound` pasa a 410 |
| Política de barra final explícita | `trailingSlash: 'never'` + `build.format: 'file'` en Astro; `urls.trailingSlash` en site-config; el validador comprueba los hrefs |
| `PUBLIC_SITE_ENV` por contexto | Bloques `[context.*.environment]` en `netlify.toml`; `.env.example` documenta todas las variables |
| Sin datos de marca en código | `legalName`, `schemaType`, `areaServed` salen de `site-config.js`; `nodes.js` ya no tiene literales |
| `serializeGraph` | Escapa `<` en el JSON-LD; `validateGraph` detecta `undefined`, relativas, dobles barras y localhost |
| Validador ampliado | title/description duplicados, hrefs fuera de política o de registro, assets/favicons, localhost, JSON-LD fuera de `Schema.astro`, H1 múltiple |
| `scripts/seo-audit-live.mjs` | Auditoría HTTP de cualquier dominio (`npm run seo:audit`) |
| Tracking | Un solo loader (GTM), listener delegado único, `WhatsAppButton` con ids, CAPI con normalización/hash/dedupe; gtag roto y `ButtonContact` (Lead en hover) eliminados |
| `/404` en el registro | `noindex`; la página ya no repite title/description |

## Pendientes

| ID | Severidad | Hallazgo | Fase |
|----|-----------|----------|------|
| M-01 | MEDIUM | 15 keywords objetivo contra 3 URLs útiles | 4 |
| M-02 | MEDIUM | Breadcrumbs: implementados, pero sin jerarquía real hasta que existan subrutas | 4 |
| M-03 | MEDIUM | Cifras de `company-stats.js` sin fuente verificable. **No pasan a Schema ni a `llms.txt` sin confirmación.** La home dice «15 años digitalizando empresas» y el bloque de stats «8+ años de experiencia» | 3 |
| M-04 | MEDIUM | Sin blog, casos de éxito, industrias ni ciudades | 4–5 |
| M-06 | MEDIUM | 20+ peticiones de imagen a `cdn.simpleicons.org` en la home | 5 |
| M-08 | MEDIUM | `src/api/api.jsx` importa `configCountries.json`, que no existe | — |

## Verificación

```bash
npm run seo:check     # validador de reglas SEO (modo warning en Fase 2)
npm run build         # debe prerenderizar las 7 rutas
```

`SEO_STRICT=1 npm run seo:check` falla con código 1 ante cualquier `CRITICAL`. Se activará
por defecto cuando el sitio pase limpio de forma estable.

`npm run check` (astro check) requiere instalar `@astrojs/check` y `typescript`, que no
están en el proyecto.
