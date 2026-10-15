# Schema.org — arquitectura JSON-LD

## Cómo funciona

Cada página emite **un único bloque** `<script type="application/ld+json">` con un `@graph`.
Los nodos se referencian entre sí por `@id` en lugar de repetirse, de modo que Google lee
un conjunto conectado y no varios objetos sueltos.

```
Layout.astro
  └─ SEOHead.astro          resuelve metadata + entrada del registro
       └─ Schema.astro      llama a buildGraph() y serializa
            └─ seo/schema/graph.js   ensambla, poda y valida
                 └─ seo/schema/nodes.js   constructores por tipo
```

`buildGraph()` añade siempre `Organization`, `WebSite`, `WebPage` y —si la página tiene
migas— `BreadcrumbList`. La página solo aporta sus nodos propios vía la prop `schema`
del `Layout` (un objeto o un array).

## Identificadores

Estables y derivados de la URL canónica, así que dos páginas nunca colisionan:

| Nodo | `@id` |
|------|-------|
| Organization | `{base}/#organization` |
| ImageObject (logo) | `{base}/#logo` |
| WebSite | `{base}/#website` |
| WebPage | `{url}#webpage` |
| BreadcrumbList | `{url}#breadcrumb` |
| Service | `{url}#service` |
| FAQPage | `{url}#faq` |
| Article | `{url}#article` |

## Constructores disponibles

`buildOrganization`, `buildWebSite`, `buildWebPage`, `buildBreadcrumbList`, `buildService`,
`buildFAQPage`, `buildArticle` — en `src/utils/seo/schema/nodes.js`.

El subtipo de `WebPage` se controla con el campo `pageType` del registro
(`ContactPage`, `AboutPage`, `CollectionPage`…). Por defecto, `WebPage`.

## Garantías

- **`prune()`** elimina recursivamente `undefined`, `null`, cadenas y colecciones vacías
  antes de serializar. Es lo que impide que reaparezca un `contactType: undefined` como el
  que emitía el Organization antes de la Fase 2.
- **`validateGraph()`** comprueba: `@context` presente, todo nodo con `@type` y `@id`,
  `@id` sin duplicados, toda referencia `{'@id': …}` resuelta dentro del grafo, y presencia
  del nodo Organization. Corre en cada build vía `npm run seo:check`, y en desarrollo avisa
  por consola desde `Schema.astro`.
- **Ningún dato inventado.** Los constructores solo leen de `site-config.js` y del registro.
  Si un campo no existe, no se emite en lugar de rellenarse.

## Reglas al añadir tipos

- No declarar un tipo que no corresponda al contenido real. `/contacto` es `ContactPage`,
  no un `Service`: emitirlo como servicio fue un error heredado, corregido en Fase 3.
- **`FAQPage` solo con FAQs visibles en la página.** Marcado estructurado sin contenido
  visible equivalente es motivo de acción manual por parte de Google.
- Nada de `AggregateRating`, `Review` ni métricas sin fuente verificable. Las cifras de
  `src/data/company-stats.js` **no** están en el grafo por este motivo.

## Pendiente

- `LocalBusiness` cuando existan páginas de ciudad con contenido propio (Fase 8).
- `Article` / `BlogPosting`: constructor listo, sin consumidor hasta el blog (Fase 5).
- `AggregateRating` y `Review`: solo si llegan reseñas reales y verificables.
