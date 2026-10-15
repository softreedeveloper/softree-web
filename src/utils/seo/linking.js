import { seoPages, normalizeSlug } from './registry.js';
import { getCluster } from './clusters.js';

/**
 * Grafo de enlaces internos.
 *
 * Se construye a partir del campo `linksTo` del registro, que es la
 * declaración de intención. El validador comprueba aparte que esos enlaces
 * existan de verdad en el markup, para que el grafo no mienta.
 */

const MAX_RELATED = 4;

/**
 * Rutas enlazadas desde el chrome del sitio (Header, MenuMobile, Footer), y
 * por tanto alcanzables desde cualquier página. Sin esto el grafo daría por
 * huérfanas páginas que sí reciben enlaces, como el aviso de privacidad.
 *
 * `seo-check.mjs` comprueba que cada una aparezca de verdad en esos
 * componentes: si alguien la quita del menú, el validador lo detecta.
 */
export const GLOBAL_NAV = [
   '/',
   '/desarrollo-web',
   '/apps-moviles',
   '/automatizacion',
   '/inteligencia-artificial',
   '/contacto',
   '/aviso-de-privacidad',
];

export const NAV_COMPONENTS = [
   'src/components/Header.astro',
   'src/components/MenuMobile.astro',
   'src/components/Footer.astro',
];

/** Mapa slug → { outgoing, incoming, globalNav }. */
export function buildLinkGraph(pages = seoPages) {
   const graph = new Map();
   for (const page of pages) {
      graph.set(normalizeSlug(page.slug), {
         page,
         outgoing: [],
         incoming: [],
         globalNav: GLOBAL_NAV.some((route) => normalizeSlug(route) === normalizeSlug(page.slug)),
      });
   }

   for (const page of pages) {
      const from = normalizeSlug(page.slug);
      for (const target of page.linksTo ?? []) {
         const to = normalizeSlug(target);
         if (!graph.has(to)) continue; // destino aún no existe: lo reporta el validador
         graph.get(from).outgoing.push(to);
         graph.get(to).incoming.push(from);
      }
   }

   // El chrome enlaza desde todas las páginas menos desde sí misma.
   for (const route of GLOBAL_NAV) {
      const to = normalizeSlug(route);
      const node = graph.get(to);
      if (!node) continue;
      for (const page of pages) {
         const from = normalizeSlug(page.slug);
         if (from === to || node.incoming.includes(from)) continue;
         node.incoming.push(from);
      }
   }

   return graph;
}

/** Páginas indexables sin ningún enlace interno entrante. La home no cuenta. */
export function findOrphans(pages = seoPages) {
   const graph = buildLinkGraph(pages);
   return [...graph.values()]
      .filter(({ page, incoming }) => !page.noindex && normalizeSlug(page.slug) !== '/' && incoming.length === 0)
      .map(({ page }) => page.slug);
}

/** Enlaces declarados hacia rutas que no están en el registro. */
export function findDanglingLinks(pages = seoPages) {
   const known = new Set(pages.map((page) => normalizeSlug(page.slug)));
   const dangling = [];
   for (const page of pages) {
      for (const target of page.linksTo ?? []) {
         if (!known.has(normalizeSlug(target))) dangling.push({ from: page.slug, to: target });
      }
   }
   return dangling;
}

/**
 * Sugiere enlaces para una página, en el orden de prioridad del cluster:
 * primero la pilar del tema, luego hermanas del mismo cluster, luego las
 * páginas comerciales de mayor prioridad.
 *
 * Devuelve solo páginas que existen y son indexables, nunca la propia página
 * ni una que ya esté enlazada.
 */
export function suggestRelated(slug, pages = seoPages, limit = MAX_RELATED) {
   const current = pages.find((page) => normalizeSlug(page.slug) === normalizeSlug(slug));
   if (!current) return [];

   const already = new Set([normalizeSlug(slug), ...(current.linksTo ?? []).map(normalizeSlug)]);

   // Las páginas legales viven en el footer; enlazarlas como "contenido
   // relacionado" no aporta nada al usuario ni reparte autoridad útil.
   const candidates = pages.filter(
      (page) => !page.noindex && page.priority >= 0.5 && !already.has(normalizeSlug(page.slug)),
   );

   const pillar = current.cluster ? getCluster(current.cluster)?.pillar : null;

   const rank = (page) => {
      if (pillar && normalizeSlug(page.slug) === normalizeSlug(pillar)) return 0;
      if (current.cluster && page.cluster === current.cluster) return 1;
      if (page.intent === 'transaccional') return 2;
      if (page.intent === 'comercial') return 3;
      return 4;
   };

   return candidates.sort((a, b) => rank(a) - rank(b) || (b.priority ?? 0) - (a.priority ?? 0)).slice(0, limit);
}

/**
 * Texto del enlace. Rota entre variantes para no repetir el mismo anchor en
 * todo el sitio, que es una señal de enlazado automático.
 *
 * `seed` hace la elección determinista: la misma página produce siempre el
 * mismo anchor, así el HTML no cambia entre builds.
 */
export function anchorFor(page, seed = 0) {
   const variants = [page.h1, page.primaryKeyword, page.breadcrumb?.at(-1)?.label, page.title]
      .filter(Boolean)
      .filter((text) => text.length <= 70);

   if (!variants.length) return page.slug;
   return variants[seed % variants.length];
}
