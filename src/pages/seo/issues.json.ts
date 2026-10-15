import type { APIRoute } from 'astro';
import { scoreAll } from '@/utils/seo/score.js';
import { findOrphans, findDanglingLinks } from '@/utils/seo/linking.js';
import { getPendingLandings } from '@/utils/seo/clusters.js';
import { seoPages } from '@/utils/seo/registry.js';

export const prerender = true;

/**
 * Hallazgos derivables del registro: fallos de score, huérfanas, enlaces a
 * rutas inexistentes y keywords sin landing.
 *
 * No incluye las comprobaciones que necesitan el sistema de archivos (assets,
 * imágenes sin alt, metadata fuera de SEOHead): esas viven en
 * `npm run seo:check`, que corre en build.
 */
export const GET: APIRoute = () => {
   const issues: Record<string, unknown>[] = [];

   for (const entry of scoreAll()) {
      for (const reason of entry.failed) {
         issues.push({ type: 'score', severity: 'MEDIUM', slug: entry.slug, detail: reason });
      }
   }

   for (const slug of findOrphans()) {
      issues.push({ type: 'orphan', severity: 'CRITICAL', slug, detail: 'Sin enlaces internos entrantes.' });
   }

   for (const link of findDanglingLinks()) {
      issues.push({
         type: 'dangling-link',
         severity: 'HIGH',
         slug: link.from,
         detail: `Enlaza a ${link.to}, que no está en el registro.`,
      });
   }

   for (const row of getPendingLandings(seoPages.map((page) => page.slug))) {
      issues.push({
         type: 'missing-landing',
         severity: row.priority === 'P1' ? 'HIGH' : 'MEDIUM',
         slug: row.landing,
         detail: `Keyword "${row.keyword}" (${row.priority}) sin página que la trabaje.`,
      });
   }

   return new Response(
      JSON.stringify({ generatedAt: new Date().toISOString(), count: issues.length, issues }, null, 2),
      {
         headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
      },
   );
};
