import { services, industries, cities, problems, templates } from './dimensions.js';
import { scoreCandidate, THRESHOLDS } from './quality.js';

/**
 * Motor PSEO.
 *
 * **La generación está desactivada.** `GENERATION_ENABLED` sigue en false y
 * ninguna ruta de Astro consume este módulo: no existe página programática
 * publicada ni se creará hasta que haya casos de éxito reales por combinación.
 *
 * Lo que sí funciona hoy es el catálogo de candidatas y la puntuación, para
 * poder ver qué falta antes de escribir una sola página.
 */

export const GENERATION_ENABLED = false;

/** Contenido diferencial aportado a mano, indexado por slug. Hoy vacío. */
export const uniqueContentBySlug = {};

/**
 * Enumera las combinaciones posibles de una plantilla. Enumerar no es generar:
 * son candidatas, y cada una tiene que ganarse su publicación.
 */
export function listCandidates(templateId) {
   const template = templates[templateId];
   if (!template) throw new Error(`Plantilla desconocida: ${templateId}`);

   const combos = [];

   if (templateId === 'servicio-ciudad') {
      for (const service of services) {
         // Solo mercados estratégicos: el resto ni entra en la cola.
         for (const city of cities.filter((entry) => entry.strategic)) combos.push({ service, city });
      }
   } else if (templateId === 'servicio-industria') {
      for (const service of services) for (const industry of industries) combos.push({ service, industry });
   } else if (templateId === 'problema-solucion') {
      for (const problem of problems) combos.push({ problem });
   }

   return combos.map((dims) => {
      const slug = template.slug(dims);
      return {
         template: templateId,
         dimensions: dims,
         slug,
         title: template.title(dims),
         description: null,
         primaryKeyword: null,
         linksTo: [],
         schemaTypes: [],
         uniqueContent: uniqueContentBySlug[slug] ?? {},
         status: 'draft',
      };
   });
}

/** Informe completo: qué se podría generar y qué le falta a cada candidata. */
export function report() {
   const rows = [];
   for (const templateId of Object.keys(templates)) {
      for (const candidate of listCandidates(templateId)) {
         rows.push({ ...scoreCandidate(candidate), template: templateId });
      }
   }
   return {
      generationEnabled: GENERATION_ENABLED,
      thresholds: THRESHOLDS,
      total: rows.length,
      publishable: rows.filter((row) => row.verdict === 'PUBLICAR').length,
      rows,
   };
}
