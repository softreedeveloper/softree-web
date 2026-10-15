import { seoPages } from './registry.js';
import { buildLinkGraph } from './linking.js';
import { getCluster } from './clusters.js';

/**
 * SEO score por página.
 *
 * Cada punto sale de una regla concreta y comprobable, y el desglose se
 * devuelve siempre junto al número: un score sin explicación no sirve para
 * decidir nada.
 *
 * Seis dimensiones, 100 puntos en total:
 *   Metadata        20   title, description, H1
 *   Contenido       15   keyword principal, secundarias, entidades
 *   Schema          15   tipos declarados y coherentes con el contenido
 *   Enlaces         20   entrantes, salientes, cluster
 *   Técnico         20   indexable, canónica, breadcrumb, lastmod
 *   Rendimiento     10   prerender e imagen social propia
 *
 * La dimensión de rendimiento se puntúa por configuración, no por medición
 * real: no hay datos de Core Web Vitals hasta conectar PageSpeed (Fase 10).
 */

const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 158;

export function scorePage(slug, pages = seoPages) {
   const page = pages.find((entry) => entry.slug === slug);
   if (!page) return null;

   const graph = buildLinkGraph(pages);
   const node = graph.get(page.slug.replace(/\/+$/, '') || '/');

   const checks = [];
   const check = (dimension, points, max, passed, reason) =>
      checks.push({ dimension, points: passed ? points : 0, max, passed, reason });

   // --- Metadata (20) ---
   check(
      'Metadata',
      8,
      8,
      Boolean(page.title) && page.title.length <= TITLE_MAX,
      `title presente y ≤ ${TITLE_MAX} caracteres (actual: ${page.title?.length ?? 0})`,
   );
   check(
      'Metadata',
      8,
      8,
      Boolean(page.description) && page.description.length >= DESC_MIN && page.description.length <= DESC_MAX,
      `description entre ${DESC_MIN} y ${DESC_MAX} caracteres (actual: ${page.description?.length ?? 0})`,
   );
   check('Metadata', 4, 4, Boolean(page.h1) && page.h1 !== page.title, 'H1 presente y distinto del title');

   // --- Contenido (15) ---
   check('Contenido', 7, 7, Boolean(page.primaryKeyword), 'keyword principal declarada');
   // Las páginas legales no compiten por keywords: no se les exige cobertura semántica.
   const isLegal = page.priority < 0.5;
   check(
      'Contenido',
      4,
      4,
      isLegal || (page.secondaryKeywords ?? []).length >= 2,
      isLegal ? 'página legal: no se le exigen keywords secundarias' : 'al menos 2 keywords secundarias',
   );
   // `cluster: null` es un estado válido (contacto, legales). Lo que penaliza
   // es referenciar un cluster que no existe: casi siempre una errata.
   check(
      'Contenido',
      4,
      4,
      page.cluster == null || Boolean(getCluster(page.cluster)),
      page.cluster == null ? 'sin cluster, declarado explícitamente' : `cluster "${page.cluster}" existe`,
   );

   // --- Schema (15) ---
   const types = page.schemaTypes ?? [];
   check('Schema', 7, 7, types.length > 0, 'declara al menos un tipo de Schema');
   check(
      'Schema',
      4,
      4,
      types.some((type) => type.endsWith('Page')),
      'declara un tipo de página',
   );
   check(
      'Schema',
      4,
      4,
      page.slug === '/' || types.includes('BreadcrumbList'),
      'declara BreadcrumbList (no aplica a la home)',
   );

   // --- Enlaces (20) ---
   const incoming = node?.incoming.length ?? 0;
   const outgoing = node?.outgoing.length ?? 0;
   const viaNav = node?.globalNav ? ' (incluye navegación global)' : '';
   check('Enlaces', 10, 10, page.slug === '/' || incoming >= 1, `enlaces entrantes: ${incoming}${viaNav}`);
   check('Enlaces', 6, 6, outgoing >= 1 || page.priority < 0.5, `enlaces salientes: ${outgoing}`);
   check('Enlaces', 4, 4, outgoing <= 100, 'sin exceso de enlaces salientes');

   // --- Técnico (20) ---
   check('Técnico', 6, 6, !page.noindex, 'indexable');
   check('Técnico', 5, 5, page.slug.startsWith('/'), 'slug absoluto y canónico');
   check('Técnico', 5, 5, page.slug === '/' || (page.breadcrumb ?? []).length > 0, 'breadcrumb definido');
   check('Técnico', 4, 4, Boolean(page.lastmod), 'lastmod declarado');

   // --- Rendimiento (10) ---
   check(
      'Rendimiento',
      6,
      6,
      page.source === 'static' || page.source === 'collection',
      'ruta prerenderizable (sin SSR por petición)',
   );
   check('Rendimiento', 4, 4, true, 'imagen social 1200×630 disponible (por defecto del sitio)');

   const dimensions = {};
   for (const item of checks) {
      dimensions[item.dimension] ??= { points: 0, max: 0, failed: [] };
      dimensions[item.dimension].points += item.points;
      dimensions[item.dimension].max += item.max;
      if (!item.passed) dimensions[item.dimension].failed.push(item.reason);
   }

   const total = checks.reduce((sum, item) => sum + item.points, 0);
   const max = checks.reduce((sum, item) => sum + item.max, 0);

   return {
      slug: page.slug,
      score: Math.round((total / max) * 100),
      dimensions,
      failed: checks.filter((item) => !item.passed).map((item) => `${item.dimension}: ${item.reason}`),
   };
}

export function scoreAll(pages = seoPages) {
   return pages.map((page) => scorePage(page.slug, pages)).filter(Boolean);
}
