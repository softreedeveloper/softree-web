import type { APIRoute } from 'astro';
import { siteConfig } from '@/utils/config.js';

export const prerender = true;

/**
 * robots.txt generado según el entorno.
 *
 * Producción: crawling abierto, sin bloquear CSS, JS ni imágenes.
 * Staging y previews: bloqueo total, para que no se indexe el entorno de pruebas.
 */
export const GET: APIRoute = () => {
   const sitemap = siteConfig.absoluteUrl('/sitemap.xml');

   const body = siteConfig.noIndex
      ? `# Entorno: ${siteConfig.environment} — no indexable
User-agent: *
Disallow: /
`
      : `User-agent: *
Allow: /

# Endpoints internos: no aportan nada al índice
Disallow: /api/
Disallow: /.netlify/
Disallow: /seo/

Sitemap: ${sitemap}
`;

   return new Response(body, {
      headers: {
         'Content-Type': 'text/plain; charset=utf-8',
         'Cache-Control': 'public, max-age=3600',
      },
   });
};
