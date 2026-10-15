import type { APIRoute } from 'astro';
import { report } from '@/utils/seo/pseo/index.js';

export const prerender = true;

/** Candidatas programáticas y su quality score. La generación sigue apagada. */
export const GET: APIRoute = () =>
   new Response(JSON.stringify({ generatedAt: new Date().toISOString(), ...report() }, null, 2), {
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
   });
