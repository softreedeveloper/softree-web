# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm run dev       # Astro dev server en http://localhost:7002
npm run build     # Build SSR (adapter Netlify) → dist/
npm run preview   # Sirve el build
npm run check     # astro check (type-check de .astro/.ts)
npm run format    # prettier --write . (3 espacios, comillas simples, printWidth 120)
npm run seo:check # validador SEO (registro, huérfanas, schema, assets). SEO_STRICT=1 lo hace bloqueante
npm run seo:report# score por página, sugerencias de enlazado, backlog de keywords y estado PSEO
npm run seo:audit -- https://dominio  # auditoría SEO HTTP en vivo de cualquier entorno (--expect=staging)
netlify dev       # Necesario para probar las funciones de netlify/functions/ localmente
```

No hay suite de tests ni linter configurados. Las verificaciones son `npm run check`
(type-check, 0 errores), `npm run build` (ejecuta `seo:check` como `prebuild`, en modo warning) y
`npm run seo:audit` contra staging tras desplegar.

## Arquitectura

Sitio corporativo de Softree en **Astro 5 en modo `output: 'server'`** (SSR) con adapter de Netlify.
React 19 está integrado pero se usa solo para islas puntuales (`InitAOS`, hooks de Meta Pixel);
prácticamente todo el UI son componentes `.astro` con Tailwind. El contenido está en español.

### Capas

- **`src/pages/`** — cada página compone secciones y define su propio `title`/`description`/`schema`
  que pasa a `Layout`. Las páginas no llevan lógica.
- **`src/sections/`** — bloques de página completos (Hero, ServicesGrid, ContactForm…). Es donde
  vive el markup real y los `<script>` inline de comportamiento.
- **`src/components/`** — chrome compartido (Header, Footer, tracking) + `components/ui/` para
  primitivas reutilizables (Button, Tag, SectionHeading, ThemeToggle).
- **`src/data/*.js`** — contenido de las secciones exportado como arrays de objetos
  (`service-pages`, `services-catalog`, `services` (garantías), `technologies`, `methodology`,
  `company-stats`). **Al cambiar textos o añadir items, editar estos archivos, no el markup de la
  sección.** Algunos incluyen `snippet:` con tokens (`{k}`, `{v}`, `{s}`, `type: 'com'|'line'`) que
  las secciones renderizan como bloque de código.

### Landings de servicio

`/desarrollo-web`, `/apps-moviles`, `/automatizacion` e `/inteligencia-artificial` son páginas de
una línea: cada `src/pages/<slug>.astro` toma su entrada de `src/data/service-pages.js` y la pasa a
`sections/ServiceLanding.astro` (hero con snippet, alcance, stack, proceso, garantías, FAQs
visibles, «Otros servicios» con las hermanas de `SERVICE_ROUTES`, `FinalCTA`). Emiten `Service` +
`FAQPage`. Para añadir una landing: entrada en `service-pages.js`, entrada en el registro SEO (el `h1`
del registro debe ser `h1.lead + ' ' + h1.highlight`), página `.astro` de una línea, `SERVICE_ROUTES`,
y enlace en `GLOBAL_NAV` + Header, MenuMobile y Footer. El antiguo hub `/servicios` redirige a `/` en
`netlify.toml`.

El catálogo completo (8 servicios, incluidos los que no tienen landing) es la sección `#servicios` de
la home: `sections/ServicesGrid.astro` con datos en `data/services-catalog.js` (`serviceCatalog`,
`href` opcional hacia la landing). «Soluciones» ya no existe como concepto de navegación; queda un
ancla `#soluciones` vacía por compatibilidad con enlaces antiguos.

### Configuración del sitio y SEO

Cadena única: `src/utils/site-config.js` (datos crudos: nombre, URLs, contacto, redes, assets)
→ `src/utils/config.js` (`siteConfig`, entorno y URLs) → `src/utils/seo.js` (`generateSEOTags`,
`generateServiceSchema`) → `src/components/seo/SEOHead.astro` → `Layout.astro`. Teléfono, email,
copyright y URLs se editan **solo** en `site-config.js`.

Estos tres archivos eran `.jsx` sin contener JSX; se renombraron a `.js` para que el validador de
build pueda cargarlos con Node.

**`SEOHead.astro` es la fuente única del `<head>` de SEO**: title, description, canonical, OG,
Twitter, favicons y JSON-LD. No emitir ninguna de esas etiquetas desde otro componente; el
validador marca como CRITICAL cualquier `<title>` o canonical fuera de él.

Alrededor del registro viven los demás módulos SEO, todos en `src/utils/seo/`:
`clusters.js` (topic clusters y mapa de keywords), `linking.js` (grafo de enlaces,
huérfanas, anchors), `score.js` (SEO score explicable), `schema/` (JSON-LD), `llms.js`
(generación de `llms.txt`) y `pseo/` (motor programático, **generación desactivada**).
Detalle en `docs/seo/architecture.md`.

`src/utils/seo/registry.js` es el **registro central de páginas**: una entrada por URL con title,
description, H1, keyword principal, intención, cluster, breadcrumb y enlaces salientes. De ahí leen
`SEOHead`, `Breadcrumbs`, `sitemap.xml.ts` y `seo-check.mjs`. Al añadir una página hay que darla de
alta en el registro; las páginas no repiten su title ni su description en el `.astro`.

`config.js` deriva el entorno de `PUBLIC_SITE_ENV` o del `CONTEXT` de Netlify. Todo lo que no sea
producción sale `noindex` y con `robots.txt` cerrado. `canonicalUrl` siempre apunta a producción.
Las URLs absolutas se construyen **solo** con `siteConfig.absoluteUrl()`.

### Alias de import

Definidos en dos sitios que deben mantenerse sincronizados: `vite.resolve.alias` en
`astro.config.mjs` y `compilerOptions.paths` en `tsconfig.json`.
`@/`, `@components/`, `@layouts/`, `@pages/`, `@styles/`, `@assets/`, `@hooks/`, `@utils/`,
`@api/`, `@constants/`, `@sections/`, `@data/`.

### Schema.org

`src/utils/seo/schema/nodes.js` (constructores por tipo) + `graph.js` (ensamblado, `prune`,
`validateGraph`) + `src/components/seo/Schema.astro`. **Una página = un solo bloque `ld+json`
con un `@graph`**; los nodos se referencian por `@id` estable derivado de la URL canónica.
`Organization`, `WebSite`, `WebPage` y `BreadcrumbList` se añaden solos; la página solo aporta
sus nodos propios por la prop `schema` del `Layout`.

`prune()` elimina `undefined`/`null`/vacíos antes de serializar. No emitir Schema que no
corresponda al contenido real, ni `FAQPage` sin FAQs visibles. Detalle en `docs/seo/schema.md`.

### Rutas generadas

`sitemap.xml` y `robots.txt` son endpoints de Astro (`src/pages/*.ts`) con `prerender = true`, no
archivos en `public/`. El sitemap sale del registro y excluye lo marcado `noindex`. Las canónicas y
el sitemap usan la misma forma de URL (sin barra final): `trailingSlash: 'never'` + `build.format: 'file'`
en `astro.config.mjs` y `urls.trailingSlash: false` en `site-config.js` deben moverse juntos.

Además de `sitemap.xml` y `robots.txt`: `llms.txt`, `llms-full.txt` y cuatro endpoints de
solo lectura en `/seo/*.json` (pages, issues, keywords, pseo) pensados para que n8n consuma
el estado SEO más adelante. `/seo/` va en `Disallow`. **No hay endpoints de escritura**: la
publicación y la optimización nunca se exponen por HTTP.

Las 8 páginas llevan `export const prerender = true`. El adapter de Netlify sigue en `output: 'server'`
para las funciones; solo lo que dependa de la petición debe quedarse en SSR.

### Analítica

Implementación de la skill `tracking-conversiones` (`skills-seo/`), en `components/tracking/`:

- `TagLoader.astro` carga **un solo** contenedor: GTM si hay `PUBLIC_GTM_ID` (modo actual), si
  no gtag con `PUBLIC_GA4_ID`; sin IDs no carga nada. Nunca ambos. Fija `window.__TAG_MODE__`.
- `TrackingEvents.astro` es el **único listener de clics** (delegado, al final del `<body>`).
  Lee atributos `data-*` y emite `whatsapp_click`, `phone_click`, `email_click`, `cta_click`
  (requiere `data-cta`) o el nombre de `data-ga-event` (`select_item` en las tarjetas de
  servicios). Expone `window.siteTrack(evento, params)`; desde scripts empaquetados,
  `import { track } from '@utils/tracking.js'`.
- Convenciones: WhatsApp **siempre** con `<WhatsAppButton id="whatsapp-<pagina>-<seccion>">`
  (nunca `<a href="https://wa.me…">`); otros CTAs con `data-cta="<page_type>_<destino>"` en
  snake_case + `data-page-type`, `data-section-name`, `data-destination-type`; `tel:`/`mailto:`
  con `id="tel-…"`/`id="mail-…"`. `Button.astro` propaga esos `data-*`.
- `MetaPixel.astro` + `public/js/meta-pixel.js`: pixel condicional a `PUBLIC_META_PIXEL_ID`;
  `window.metaPixel.track(name, customData, userData)` dispara navegador + servidor con el mismo
  `event_id`. `WhatsAppButton` manda `Lead` por `data-meta-event`. Lead sin `value`.
- `ContactForm` emite `form_error` (validación / backend) y, solo tras 2xx, `generate_lead` +
  `Lead` de Meta con `user_data` crudo en arrays.
- En GTM hay que mapear los eventos nuevos (`whatsapp_click`, `phone_click`, `email_click`,
  `cta_click`, `select_item`, `form_error`, `generate_lead`); `quote_request` y `form_submit`
  ya no existen.

### Backend: Netlify Functions

`netlify/functions/` (redirigidas desde `/api/*` vía `netlify.toml`, aunque el front las llama por
ruta completa `/.netlify/functions/<name>`):

- `contact-form.js` — envía el formulario por SMTP con nodemailer. Requiere `SMTP_HOST`,
  `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`; valida su presencia y responde 500
  listando las que falten. Espera `{ name, email, phone, message, subject, service }`.
- `meta-conversion.js` — Meta Conversions API server-side (plantilla de la skill): normaliza y hashea
  PII con SHA-256 (solo arrays), toma IP/UA/`_fbp`/`_fbc` de cabeceras y cookies, nunca loguea el body.
  Requiere `META_PIXEL_ID` y `META_ACCESS_TOKEN`; `META_TEST_EVENT_CODE` solo se adjunta si
  `PUBLIC_SITE_ENV !== 'production'` (definirla en la UI de Netlify con scope Functions).

`src/sections/ContactForm.astro` hace el POST a `contact-form` y, si responde ok, dispara
`generate_lead` (GA4) y `Lead` vía `window.metaPixel.track`. Las variables `PUBLIC_*` (`PUBLIC_GTM_ID`,
`PUBLIC_GA4_ID`, `PUBLIC_META_PIXEL_ID`, `PUBLIC_IPAPI_LINK`) llegan al cliente; las demás son
server-only.

### Estilos, tema y animación

- Tailwind con `darkMode: 'class'`. Paleta propia: `accent-{50..950}` (verde base `#27a317`),
  `ink`/`ink.muted`, `cream`, `dark`. Fuentes: Montserrat (body, en `global.css`) y JetBrains Mono
  (`font-mono`, para snippets y detalles técnicos).
- **El toggle de tema tiene su lógica centralizada en un `<script is:inline>` de `Layout.astro`**,
  por delegación de eventos sobre `[data-theme-toggle]`; `ThemeToggle.astro` solo renderiza el botón.
  Un segundo script inline en `<head>` aplica el tema antes del primer paint para evitar flash.
  No duplicar esta lógica en componentes nuevos: basta con añadir `data-theme-toggle`.
- Animaciones de entrada: AOS (inicializado en `src/utils/InitAOS.jsx`, montado `client:load`), más
  clases propias `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale` (+ `.delay-{100..500}`)
  que ese mismo componente activa con un IntersectionObserver añadiendo `.visible`. También gestiona
  la barra `#scroll-progress` y los contadores `[data-count]` / `data-suffix`.

## Git

Flujo de tres ramas: trabajo en `develop` → `stage` → `master`. La skill `/release-stage` automatiza
commit + merge a `develop` + merge a `stage` con push. Los mensajes de commit del repo van en español
con prefijos tipo `Feat - `, `update - `.

## Notas

- `src/utils/crypto.js` tiene la clave AES hardcodeada; es ofuscación, no seguridad.
