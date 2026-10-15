# AI Search / GEO

## Qué se ha implementado

**`/llms.txt`** y **`/llms-full.txt`**, generados en build desde el registro, los clusters,
`site-config.js` y `src/data/*.js` (`src/utils/seo/llms.js`). Al salir de la misma fuente
que el resto del sitio, no pueden contradecirlo.

- `llms.txt` (~3,6 KB): descripción, servicios, áreas de especialidad, páginas,
  tecnologías y contacto.
- `llms-full.txt` (~10 KB): añade cada servicio en detalle (qué incluye, stack, fases),
  la metodología de trabajo y los datos de identidad.

**Estructura semántica**: `@graph` JSON-LD con entidades conectadas por `@id`, encabezados
jerárquicos, y el `<footer>` fuera de `<main>` para que los extractores de contenido
principal no lo confundan con el cuerpo de la página.

## Qué NO se afirma

`llms.txt` **no sustituye** a robots.txt, al sitemap, al Schema ni al contenido. Es un
resumen legible, y su adopción por parte de los distintos sistemas es desigual.

**Implementar esto no garantiza aparecer en ChatGPT, Gemini, Perplexity ni en ningún otro
sistema de respuesta.** Lo que hace es que, cuando esos sistemas lean el sitio, encuentren
información estructurada, verificable y consistente en lugar de tener que inferirla.

## Regla de contenido

Ninguno de los dos archivos incluye cifras de resultados, casos de clientes ni métricas.
Solo se documenta lo que puede verificarse en la web pública. Un sistema de IA que cite
una cifra inventada la atribuirá a Softree.

## Pendiente

- Respuestas directas y definiciones al inicio de cada página de servicio (Fase 4).
- FAQs visibles con su `FAQPage` correspondiente (Fase 4).
- Comparativas y casos reales, que son el contenido que estos sistemas citan (Fases 4 y 5).
