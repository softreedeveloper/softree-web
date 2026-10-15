import type { APIRoute } from 'astro';
import { siteConfig } from '@/utils/config.js';
import { getIndexablePages } from '@/utils/seo/registry.js';

export const prerender = true;

/**
 * Sitemap generado desde el registro central de páginas.
 * Solo entran URLs públicas, indexables y canónicas: cualquier entrada con
 * `noindex` queda fuera automáticamente.
 */
export const GET: APIRoute = () => {
   const urls = getIndexablePages()
      .map((page) => {
         const loc = siteConfig.absoluteUrl(page.slug);
         return [
            '   <url>',
            `      <loc>${loc}</loc>`,
            page.lastmod ? `      <lastmod>${page.lastmod}</lastmod>` : null,
            page.changefreq ? `      <changefreq>${page.changefreq}</changefreq>` : null,
            typeof page.priority === 'number' ? `      <priority>${page.priority.toFixed(1)}</priority>` : null,
            '   </url>',
         ]
            .filter(Boolean)
            .join('\n');
      })
      .join('\n');

   const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

   return new Response(body, {
      headers: {
         'Content-Type': 'application/xml; charset=utf-8',
         'Cache-Control': 'public, max-age=3600',
      },
   });
};
