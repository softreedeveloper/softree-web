/**
 * Meta Conversions API (servidor). Recibe del navegador
 *   { event_name, event_id, event_source_url, custom_data, user_data }
 * con user_data CRUDO; normaliza, hashea (SHA-256) y reenvía a Graph API con el
 * mismo event_id que usó fbq → Meta deduplica navegador/servidor.
 *
 * Variables (runtime, scope Functions):
 *   META_PIXEL_ID, META_ACCESS_TOKEN   obligatorias (mismo pixel que PUBLIC_META_PIXEL_ID)
 *   META_TEST_EVENT_CODE               solo en staging
 *   PUBLIC_SITE_ENV                    'production' | 'staging' — guard del test code
 *   ALLOWED_ORIGINS                    coma-separado; vacío = acepta mismo host (Referer/Origin)
 *
 * Reglas: nunca loguear el body ni user_data; no inventar IP/UA; test code
 * nunca en producción (NODE_ENV no sirve: el hosting lo fuerza a 'production'
 * en todos los contextos).
 */
import { createHash } from 'node:crypto';

const GRAPH_API_VERSION = 'v21.0'; // ← revisar soporte (~2 años) y subir

const strip = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
const normalizers = {
   em: (v) => strip(v),
   ph: (v) => String(v).replace(/\D/g, ''), // E.164 sin '+': el país lo agrega quien llama si falta
   fn: (v) => strip(v),
   ln: (v) => strip(v),
   ct: (v) => strip(v).replace(/[^a-z]/g, ''),
   st: (v) => strip(v).replace(/[^a-z]/g, ''),
   zp: (v) => strip(v).replace(/\s/g, '').split('-')[0],
   country: (v) => (/^[a-z]{2}$/i.test(String(v).trim()) ? strip(v) : ''),
   external_id: (v) => String(v).trim(),
};

const sha256 = (v) => createHash('sha256').update(v).digest('hex');

/** Acepta SOLO arrays; normaliza, descarta vacíos y hashea. */
function hashField(values, normalize) {
   if (!Array.isArray(values)) return undefined;
   const out = values.map((v) => normalize(v)).filter(Boolean).map(sha256);
   return out.length ? out : undefined;
}

const cookie = (header, name) => header?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1];

const json = (statusCode, body, origin) => ({
   statusCode,
   headers: {
      'Content-Type': 'application/json',
      ...(origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
   },
   body: JSON.stringify(body),
});

function resolveOrigin(headers) {
   const origin = headers.origin || (headers.referer ? new URL(headers.referer).origin : '');
   const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
   if (!allowed.length) return origin; // mismo sitio: el navegador no manda Origin cross-site aquí
   return allowed.includes(origin) ? origin : null;
}

export async function handler(event) {
   const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
   const origin = resolveOrigin(headers);

   if (event.httpMethod === 'OPTIONS') {
      return {
         statusCode: 204,
         headers: {
            'Access-Control-Allow-Origin': origin || '',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
         },
         body: '',
      };
   }
   if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' }, origin);
   if (origin === null) return json(403, { error: 'Origin not allowed' }, null);

   const missing = ['META_PIXEL_ID', 'META_ACCESS_TOKEN'].filter((k) => !process.env[k]);
   if (missing.length) return json(500, { error: `Missing env: ${missing.join(', ')}` }, origin);

   let payload;
   try {
      payload = JSON.parse(event.body || '{}');
   } catch {
      return json(400, { error: 'Invalid JSON' }, origin);
   }
   const { event_name, event_id, event_source_url, custom_data = {}, user_data = {} } = payload;
   if (!event_name) return json(400, { error: 'event_name required' }, origin);

   const ip = (headers['x-forwarded-for'] || headers['x-nf-client-connection-ip'] || '').split(',')[0].trim();

   const userData = {
      client_ip_address: ip || undefined, // nunca un placeholder
      client_user_agent: headers['user-agent'] || undefined,
      fbp: cookie(headers.cookie, '_fbp'),
      fbc: cookie(headers.cookie, '_fbc'),
   };
   for (const [key, normalize] of Object.entries(normalizers)) {
      const hashed = hashField(user_data[key], normalize);
      if (hashed) userData[key] = hashed;
   }
   for (const k of Object.keys(userData)) if (userData[k] === undefined) delete userData[k];

   const metaEvent = {
      event_name,
      event_id: event_id || `server-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: event_source_url || headers.referer || undefined,
      user_data: userData,
      custom_data,
   };

   const body = { data: [metaEvent], access_token: process.env.META_ACCESS_TOKEN };
   const env = process.env.PUBLIC_SITE_ENV || 'sin definir';
   if (process.env.META_TEST_EVENT_CODE && env !== 'production') {
      body.test_event_code = process.env.META_TEST_EVENT_CODE;
      console.log(`[meta-capi] test_event_code activo (entorno: ${env})`);
   }

   console.log(`[meta-capi] ${event_name} ${metaEvent.event_id}`);

   try {
      const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${process.env.META_PIXEL_ID}/events`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(body),
      });
      const result = await res.json();
      console.log(`[meta-capi] Graph API ${res.status}`);
      if (!res.ok) return json(400, { error: 'Meta API error', details: result.error }, origin);
      return json(200, { success: true, event_id: metaEvent.event_id, events_received: result.events_received ?? 1 }, origin);
   } catch (err) {
      console.error('[meta-capi] fetch failed:', err.message);
      return json(502, { error: 'Upstream error' }, origin);
   }
}
