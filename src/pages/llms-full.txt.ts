import type { APIRoute } from 'astro';
import { buildLlmsFullTxt } from '@/utils/seo/llms.js';

export const prerender = true;

/** Versión extendida: servicios en detalle, metodología e identidad. */
export const GET: APIRoute = () =>
   new Response(buildLlmsFullTxt(), {
      headers: {
         'Content-Type': 'text/plain; charset=utf-8',
         'Cache-Control': 'public, max-age=3600',
      },
   });
