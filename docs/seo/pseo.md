# Programmatic SEO

**La generación está desactivada.** `GENERATION_ENABLED = false` en
`src/utils/seo/pseo/index.js`, ninguna ruta de Astro consume el motor y no existe ninguna
página programática publicada.

Lo que existe es el modelo de datos y la puerta de calidad, para poder ver qué haría falta
antes de escribir una sola página.

## Flujo

```
DIMENSIONES  →  CANDIDATAS  →  QUALITY SCORE  →  ¿≥ 90?  →  publicar
 (catálogo)     (enumerar)      (calcular)         no  →  cola
```

Enumerar no es generar. Hoy hay **68 candidatas y 0 publicables**: todas fallan por falta
de contenido diferencial, que es exactamente el comportamiento correcto.

## Plantillas

| Plantilla | Dimensiones | Ejemplo de slug |
|-----------|-------------|-----------------|
| `servicio-ciudad` | servicio × ciudad estratégica | `/desarrollo-software-medida-cdmx/` |
| `servicio-industria` | servicio × industria | `/automatizacion-empresarial-restaurantes/` |
| `problema-solucion` | problema | `/automatizar-leads/` |

Solo las ciudades marcadas `strategic: true` entran en la cola. Monterrey, Guadalajara y
Querétaro están fuera: no hay presencia real que contar.

## Quality score

100 puntos, umbral de publicación en 90.

| Dimensión | Puntos | Qué mide |
|-----------|--------|----------|
| Unicidad | 35 | Similitud de trigramas contra las hermanas ya publicadas (máx. 40%) y slug no duplicado |
| Contenido | 30 | ≥ 250 palabras de contenido diferencial, ≥ 1 caso real, ≥ 3 FAQs propias |
| Keyword | 15 | Keyword principal declarada y no reclamada por otra página |
| Metadata | 10 | Title ≤ 60, description 120–158 |
| Integración | 10 | ≥ 2 enlaces salientes, ≥ 2 tipos de Schema |

La unicidad pesa más que nada porque el riesgo real del PSEO no es tener poco contenido:
es tener el mismo contenido con la ciudad cambiada.

| Score | Veredicto |
|-------|-----------|
| 90–100 | PUBLICAR |
| 75–89 | REVISAR (aprobación manual) |
| 50–74 | NO PUBLICAR |
| 0–49 | DESCARTAR |

## Qué falta para activar

`uniqueContent` es siempre trabajo humano. El motor no lo inventa y no lo va a inventar:

- `marketContext` — contexto de mercado escrito a mano, ≥ 250 palabras
- `caseStudyRefs` — al menos un caso de éxito real de esa combinación
- `faqs` — al menos 3 preguntas específicas, que además deben renderizarse visibles

Sin esas tres cosas, ninguna combinación pasa de 49 puntos.
