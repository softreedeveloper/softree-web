import { buildOrganization, buildWebSite, buildWebPage, buildBreadcrumbList, ID } from './nodes.js';

/**
 * Ensamblado y validación del grafo JSON-LD.
 *
 * Un solo bloque `@graph` por página en lugar de varios <script> sueltos: los
 * nodos se referencian entre sí por `@id` y Google los lee como un único
 * conjunto conectado.
 */

/**
 * Elimina recursivamente undefined, null, cadenas vacías y arrays/objetos
 * vacíos. Es lo que impide que vuelva a colarse un `contactType: undefined`
 * como el que emitía el Organization antes de la Fase 2.
 */
export function prune(value) {
   if (Array.isArray(value)) {
      const cleaned = value.map(prune).filter((item) => item !== undefined);
      return cleaned.length ? cleaned : undefined;
   }

   if (value && typeof value === 'object') {
      const entries = Object.entries(value)
         .map(([key, val]) => [key, prune(val)])
         .filter(([, val]) => val !== undefined);
      return entries.length ? Object.fromEntries(entries) : undefined;
   }

   if (value === null || value === '') return undefined;
   return value;
}

/**
 * Construye el grafo completo de una página.
 *
 * @param {object} page   entrada del registro (puede ser undefined)
 * @param {object} seo    metadata resuelta por generateSEOTags
 * @param {object[]} extra nodos específicos de la página (Service, FAQPage, Article…)
 */
export function buildGraph(page, seo, extra = []) {
   const nodes = [
      buildOrganization(),
      buildWebSite(),
      buildWebPage(page, seo),
      buildBreadcrumbList(page),
      ...extra,
   ].filter(Boolean);

   // Un mismo @id no puede aparecer dos veces: gana la primera aparición.
   const seen = new Set();
   const unique = nodes.filter((node) => {
      const id = node['@id'];
      if (!id) return true;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
   });

   return prune({ '@context': 'https://schema.org', '@graph': unique });
}

/**
 * Serializa para <script type="application/ld+json">. Escapa `<` para que un
 * texto que contenga "</script>" no cierre la etiqueta.
 */
export function serializeGraph(graph) {
   return JSON.stringify(graph).replace(/</g, '\\u003c');
}

/**
 * Valida un grafo ya construido. Devuelve una lista de problemas; vacía si
 * todo está correcto. La usan tanto el validador de build como Schema.astro
 * fuera de producción.
 */
export function validateGraph(graph) {
   const problems = [];
   const nodes = graph?.['@graph'] ?? [];

   if (!graph?.['@context']) problems.push({ severity: 'CRITICAL', message: 'El grafo no declara @context.' });
   if (!nodes.length) problems.push({ severity: 'CRITICAL', message: 'El grafo está vacío.' });

   const ids = new Set();

   for (const node of nodes) {
      const label = node['@id'] ?? node['@type'] ?? '(nodo sin identificar)';

      if (!node['@type']) problems.push({ severity: 'CRITICAL', message: `${label}: sin @type.` });
      if (!node['@id']) {
         problems.push({ severity: 'HIGH', message: `${label}: sin @id, no puede referenciarse.` });
      } else if (ids.has(node['@id'])) {
         problems.push({ severity: 'CRITICAL', message: `@id duplicado: ${node['@id']}.` });
      } else {
         ids.add(node['@id']);
      }
   }

   // Los nodos anidados con @id (por ejemplo el ImageObject del logo) también
   // son definiciones válidas y pueden ser destino de una referencia.
   const collectNested = (value) => {
      if (Array.isArray(value)) return value.forEach(collectNested);
      if (!value || typeof value !== 'object') return;
      if (value['@id'] && Object.keys(value).length > 1) ids.add(value['@id']);
      Object.values(value).forEach(collectNested);
   };
   nodes.forEach(collectNested);

   // Toda referencia {'@id': x} debe apuntar a un nodo presente en el grafo.
   const walk = (value, path) => {
      if (Array.isArray(value)) return value.forEach((item, i) => walk(item, `${path}[${i}]`));
      if (!value || typeof value !== 'object') return;

      const keys = Object.keys(value);
      if (keys.length === 1 && keys[0] === '@id' && !ids.has(value['@id'])) {
         problems.push({ severity: 'CRITICAL', message: `Referencia rota en ${path}: ${value['@id']} no existe.` });
      }

      for (const [key, val] of Object.entries(value)) walk(val, `${path}.${key}`);
   };
   nodes.forEach((node) => walk(node, node['@id'] ?? node['@type']));

   // Serialización: nada de `undefined`, URLs relativas, dobles barras ni localhost.
   const text = JSON.stringify(graph);
   if (text.includes('undefined')) problems.push({ severity: 'HIGH', message: 'Contiene el literal "undefined".' });
   if (/"(url|item|@id|logo|image)":"\/(?!\/)/.test(text))
      problems.push({ severity: 'HIGH', message: 'URL relativa en el grafo: deben ser absolutas.' });
   const urls = text.match(/https?:\/\/[^"\s]+/g) ?? [];
   const doubled = urls.find((u) => u.replace(/^https?:\/\//, '').includes('//'));
   if (doubled) problems.push({ severity: 'HIGH', message: `URL con doble barra: ${doubled}.` });
   if (/localhost|127\.0\.0\.1/.test(text)) problems.push({ severity: 'CRITICAL', message: 'URL a localhost en el grafo.' });

   // El Organization es la entidad que sostiene el resto del grafo.
   if (!ids.has(ID.organization()))
      problems.push({ severity: 'HIGH', message: 'El grafo no incluye el nodo Organization.' });

   return problems;
}
