# Topic clusters

Definidos en `src/utils/seo/clusters.js`. Cada página del registro declara su `cluster`;
el validador comprueba que exista.

Un cluster tiene una **página pilar** (la que debe posicionar para el término principal) y
contenido de apoyo que enlaza hacia ella. `pillar` puede apuntar a una ruta que aún no
existe: eso marca el objetivo, y aparece en el backlog de `npm run seo:report`.

| Cluster | Pilar | Entidades |
|---------|-------|-----------|
| `desarrollo-software` | `/desarrollo-web` | software a medida, software empresarial, arquitectura, API, backend |
| `aplicaciones-moviles` | `/apps-moviles` | React Native, Swift, Kotlin, App Store, Google Play |
| `automatizacion` | `/automatizacion` | n8n, workflow, integración de sistemas, CRM, WhatsApp Business API |
| `inteligencia-artificial` | `/inteligencia-artificial` | agente de IA, RAG, chatbot, OpenAI, Claude, LLM |
| `saas-cloud` | `/desarrollo-saas` | SaaS, multitenant, dashboard, PostgreSQL, Google Cloud, Supabase |

Las cuatro primeras pilares existen (2026-09-05) como landings de servicio en la raíz del
sitio, compartiendo `sections/ServiceLanding.astro` y con su contenido en
`src/data/service-pages.js`. El antiguo hub `/servicios` se retiró y redirige (301) a la home,
cuya sección `#servicios` enlaza a cada landing. La pilar de `saas-cloud` sigue pendiente.

## Cómo se enlaza un cluster

`suggestRelated()` ordena los candidatos así: pilar del cluster → hermanas del mismo
cluster → páginas transaccionales → comerciales. `RelatedLinks.astro` renderiza el
resultado, y `anchorFor()` rota el texto del enlace entre H1, keyword principal y
breadcrumb para no repetir el mismo anchor en todo el sitio.
