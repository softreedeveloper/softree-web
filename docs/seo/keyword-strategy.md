# Estrategia de keywords

Matriz completa en `src/utils/seo/clusters.js` (`keywordMap`), expuesta en
`/seo/keywords.json`.

Cada fila: `keyword`, `intent`, `landing`, `cluster`, `priority`, `difficulty`, `value`.

## Advertencia sobre los datos

**`difficulty` y `value` son estimaciones internas.** No provienen de Search Console ni de
ninguna herramienta de keywords: el proyecto todavía no tiene ninguna conectada. Están para
priorizar, no para reportar. Se sustituirán por datos reales en la Fase 10.

## Regla de asignación

Una keyword principal → una sola página. El validador marca como `CRITICAL` que dos
entradas del registro compartan `primaryKeyword`: es canibalización creada por nosotros.

Las variaciones semánticas van en `secondaryKeywords` de la misma página, nunca en una
página nueva.

## Estado actual

24 de las keywords objetivo no tienen página que las trabaje. `npm run seo:report` las
lista agrupadas por prioridad; 11 son P1. Ese es el backlog de las Fases 4 y 5, y explica
por qué el sitio no puede posicionar hoy: 3 URLs útiles no dan para 25 intenciones.

## Intenciones

| Intención | Qué busca el usuario | Tipo de página |
|-----------|---------------------|----------------|
| Informacional | Entender algo | Blog |
| Comercial | Comparar proveedores | Servicio, casos de éxito |
| Transaccional | Contratar | Servicio, contacto |
| Navegacional | Llegar a Softree | Home, nosotros |
| Local | Proveedor en su zona | Página de ciudad (Fase 8) |
