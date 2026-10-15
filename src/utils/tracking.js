/**
 * Helpers de tracking para scripts empaquetados por Vite (<script> de componente,
 * islas React, utils). El listener inline define window.siteTrack; aquí solo se
 * envuelve para poder importarlo con tipos y constantes.
 *
 * Catálogos cerrados: un valor fuera de catálogo rompe los informes (una
 * dimensión con 40 variantes de "hero" no sirve). Añadir aquí antes de usar.
 */

export const PLACEMENTS = ['header', 'hero', 'footer', 'sticky', 'contenido'];

export const DESTINATION_TYPES = [
   'whatsapp',
   'phone',
   'email',
   'internal_page',
   'external',
   'anchor',
   'form',
   'app_store',
   'ecommerce',
];

/** Tipos de error de formulario/checkout. Nombres de campo, nunca valores. */
export const ERROR_TYPES = ['validation', 'backend_error', 'payment_declined', 'network'];

/**
 * Valor monetario asignado a un lead para Meta/GA4 (decisión de marketing).
 * null → no se envía value/currency (nunca mandar 0).
 */
export const LEAD_VALUE = null; // ← p. ej. { value: 20, currency: 'MXN' }

/** Emite un evento. No-op en SSR o sin contenedor cargado. */
export function track(event, params = {}) {
   if (typeof window === 'undefined' || typeof window.siteTrack !== 'function') return false;
   return window.siteTrack(event, stripPII(params));
}

/** Quita campos que nunca deben viajar a analítica. */
export function stripPII(params) {
   const banned = ['email', 'phone', 'name', 'message', 'address', 'em', 'ph'];
   const out = {};
   for (const [k, v] of Object.entries(params || {})) {
      if (banned.includes(k.toLowerCase())) continue;
      if (typeof v === 'string' && /@|^\+?\d{8,}$/.test(v)) continue;
      out[k] = v;
   }
   return out;
}

/** Item de ecommerce GA4. `id` siempre como string estable (SKU/ID), nunca el nombre. */
export function mapItem({ id, name, category, price, quantity = 1 }) {
   return {
      item_id: String(id),
      item_name: name,
      item_category: category,
      price: price != null ? Number(price) : undefined,
      quantity,
   };
}

/**
 * Dedupe por clave en localStorage (p. ej. purchase por transaction_id):
 * devuelve true solo la primera vez.
 */
export function once(key) {
   try {
      const k = `track_once_${key}`;
      if (localStorage.getItem(k)) return false;
      localStorage.setItem(k, '1');
      return true;
   } catch {
      return true;
   }
}
