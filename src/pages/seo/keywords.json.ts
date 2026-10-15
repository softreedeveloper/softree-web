import type { APIRoute } from 'astro';
import { clusters, keywordMap } from '@/utils/seo/clusters.js';

export const prerender = true;

/**
 * Mapa de keywords y topic clusters.
 * `difficulty` y `value` son estimaciones propias, no datos de herramienta:
 * se marcan como tal hasta conectar Search Console (Fase 10).
 */
export const GET: APIRoute = () =>
   new Response(
      JSON.stringify(
         {
            generatedAt: new Date().toISOString(),
            disclaimer: 'difficulty y value son estimaciones internas, sin datos de Search Console ni de terceros.',
            clusters,
            keywords: keywordMap,
         },
         null,
         2,
      ),
      { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=600' } },
   );
