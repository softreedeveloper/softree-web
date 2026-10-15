import type { APIRoute } from 'astro';
import { seoPages } from '@/utils/seo/registry.js';
import { scoreAll } from '@/utils/seo/score.js';
import { buildLinkGraph } from '@/utils/seo/linking.js';
import { siteConfig } from '@/utils/config.js';

export const prerender = true;

/**
 * Inventario de páginas con su score y sus enlaces.
 * Solo lectura: la escritura y la publicación nunca se exponen por HTTP.
 */
export const GET: APIRoute = () => {
   const scores = new Map(scoreAll().map((entry) => [entry.slug, entry]));
   const graph = buildLinkGraph();

   const data = seoPages.map((page) => {
      const node = graph.get(page.slug.replace(/\/+$/, '') || '/');
      return {
         slug: page.slug,
         url: siteConfig.absoluteUrl(page.slug),
         title: page.title,
         description: page.description,
         h1: page.h1,
         primaryKeyword: page.primaryKeyword,
         secondaryKeywords: page.secondaryKeywords,
         intent: page.intent,
         cluster: page.cluster,
         schemaTypes: page.schemaTypes,
         indexable: !page.noindex,
         lastmod: page.lastmod,
         source: page.source,
         links: { incoming: node?.incoming ?? [], outgoing: node?.outgoing ?? [] },
         score: scores.get(page.slug)?.score ?? null,
      };
   });

   return json({ generatedAt: new Date().toISOString(), count: data.length, pages: data });
};

function json(body: unknown) {
   return new Response(JSON.stringify(body, null, 2), {
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
   });
}
