#!/usr/bin/env node
/**
 * Validador SEO estático (sobre el código fuente, sin levantar el servidor).
 *
 *   npm run seo:check              → informa (también corre como `prebuild`)
 *   SEO_STRICT=1 npm run seo:check → falla con código 1 si hay CRITICAL
 *
 * Reglas comunes de la skill `seo-tecnico` + las propias del proyecto
 * (clusters, PSEO, backlog de keywords). Los módulos que importa usan rutas
 * relativas y extensión .js para que Node los cargue sin Vite.
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const STRICT = process.env.SEO_STRICT === '1';

const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 158;

const issues = [];
const add = (severity, rule, target, message) => issues.push({ severity, rule, target, message });
const mod = (path) => import(new URL(`../${path}`, import.meta.url));

const { seoPages, normalizeSlug } = await mod('src/utils/seo/registry.js');
const { siteConfigData } = await mod('src/utils/site-config.js');
const { buildGraph, validateGraph } = await mod('src/utils/seo/schema/graph.js');
const { generateSEOTags } = await mod('src/utils/seo.js');
const { findOrphans, findDanglingLinks, GLOBAL_NAV, NAV_COMPONENTS } = await mod('src/utils/seo/linking.js');
const { getCluster, getPendingLandings } = await mod('src/utils/seo/clusters.js');
const pseo = await mod('src/utils/seo/pseo/index.js');

// ---------------------------------------------------------------------------
// 1. Registro central
// ---------------------------------------------------------------------------

const slugs = new Set();
const keywords = new Map();
const titles = new Map();
const descriptions = new Map();

for (const page of seoPages) {
   const at = page.slug;
   const key = normalizeSlug(at);

   if (slugs.has(key)) add('CRITICAL', 'slug-duplicado', at, 'Dos entradas del registro comparten slug.');
   slugs.add(key);
   if (at !== '/' && at.endsWith('/')) add('MEDIUM', 'slug-con-barra', at, 'Los slugs del registro van sin barra final.');

   if (!page.title) add('CRITICAL', 'title-faltante', at, 'Sin title.');
   else {
      if (page.title.length > TITLE_MAX)
         add('MEDIUM', 'title-largo', at, `${page.title.length} caracteres (máx. recomendado ${TITLE_MAX}).`);
      if (!page.noindex && titles.has(page.title)) add('HIGH', 'title-duplicado', at, `Igual que ${titles.get(page.title)}.`);
      if (!page.noindex) titles.set(page.title, at);
   }

   if (!page.description) add('CRITICAL', 'description-faltante', at, 'Sin meta description.');
   else if (!page.noindex) {
      const n = page.description.length;
      if (n < DESC_MIN || n > DESC_MAX)
         add('MEDIUM', 'description-longitud', at, `${n} caracteres (rango recomendado ${DESC_MIN}–${DESC_MAX}).`);
      if (descriptions.has(page.description))
         add('HIGH', 'description-duplicada', at, `Igual que ${descriptions.get(page.description)}.`);
      descriptions.set(page.description, at);
   }

   if (!page.h1) add('HIGH', 'h1-faltante', at, 'Sin H1 declarado en el registro.');
   else if (page.h1 === page.title) add('MEDIUM', 'h1-igual-title', at, 'El H1 repite literalmente el title.');

   // Canibalización: una keyword principal, una sola página.
   if (page.primaryKeyword) {
      const owner = keywords.get(page.primaryKeyword.toLowerCase());
      if (owner) add('CRITICAL', 'canibalizacion', at, `Comparte keyword principal con ${owner}.`);
      else keywords.set(page.primaryKeyword.toLowerCase(), page.slug);
   } else if (!page.noindex) {
      add('HIGH', 'keyword-faltante', at, 'Página indexable sin keyword principal.');
   }

   if (!page.noindex && page.slug !== '/' && (!page.breadcrumb || page.breadcrumb.length === 0))
      add('MEDIUM', 'breadcrumb-faltante', at, 'Página interna sin migas de pan.');

   // Las páginas legales quedan fuera: su función no es distribuir autoridad.
   if (!page.noindex && page.priority >= 0.5 && (!page.linksTo || page.linksTo.length === 0))
      add('MEDIUM', 'sin-enlaces-salientes', at, 'No enlaza a ninguna otra página.');

   if (page.lastmod && !/^\d{4}-\d{2}-\d{2}$/.test(page.lastmod))
      add('MEDIUM', 'lastmod-formato', at, 'lastmod debe ser AAAA-MM-DD.');

   if (page.cluster != null && !getCluster(page.cluster))
      add('HIGH', 'cluster-inexistente', at, `Referencia el cluster "${page.cluster}", que no existe.`);
}

// ---------------------------------------------------------------------------
// 2. Enlazado interno: huérfanas, colgantes y navegación global
// ---------------------------------------------------------------------------

// El grafo de seo/linking.js ya modela la navegación global, así que no hace
// falta rastrear el markup a mano.
for (const slug of findOrphans()) {
   const page = seoPages.find((p) => normalizeSlug(p.slug) === normalizeSlug(slug));
   if (page?.noindex) continue;
   add('CRITICAL', 'pagina-huerfana', slug, 'Sin ningún enlace interno entrante.');
}

for (const link of findDanglingLinks()) {
   add('HIGH', 'enlace-colgante', link.from, `Declara un enlace a ${link.to}, que no está en el registro.`);
}

// GLOBAL_NAV declara qué rutas enlaza el chrome. Si alguien las quita del menú,
// el grafo de enlaces pasaría a mentir sobre las páginas huérfanas.
const navSource = NAV_COMPONENTS.filter((file) => existsSync(join(ROOT, file)))
   .map((file) => readFileSync(join(ROOT, file), 'utf8'))
   .join('\n');
for (const route of GLOBAL_NAV) {
   if (route === '/') continue;
   const variants = [route, `${route}/`];
   if (!variants.some((r) => navSource.includes(`'${r}'`) || navSource.includes(`"${r}"`) || navSource.includes(`\`${r}\``)))
      add(
         'CRITICAL',
         'nav-desincronizada',
         route,
         'GLOBAL_NAV la declara enlazada desde el chrome, pero no aparece en Header, MenuMobile ni Footer.',
      );
}

// ---------------------------------------------------------------------------
// 3. Assets referenciados en la configuración y en el registro
// ---------------------------------------------------------------------------

const inPublic = (assetPath) => existsSync(join(ROOT, 'public', String(assetPath).trim().replace(/^\//, '')));

for (const [key, value] of Object.entries(siteConfigData.assets ?? {})) {
   if (typeof value !== 'string') continue;
   if (value !== value.trim()) add('HIGH', 'asset-con-espacios', key, `"${value}" lleva espacios: rompe las URLs absolutas.`);
   if (!inPublic(value)) add('HIGH', 'asset-inexistente', key, `${value} referenciado en la config pero no está en public/.`);
}
for (const page of seoPages) {
   if (page.ogImage && !inPublic(page.ogImage)) add('HIGH', 'og-image-inexistente', page.slug, `${page.ogImage} no existe en public/.`);
}
for (const favicon of ['favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png']) {
   if (!inPublic(favicon)) add('MEDIUM', 'favicon-faltante', favicon, 'SEOHead lo referencia y no existe en public/.');
}

// ---------------------------------------------------------------------------
// 4. Código fuente: metadata fuera de SEOHead, on-page, hrefs
// ---------------------------------------------------------------------------

function walk(dir, out = []) {
   if (!existsSync(dir)) return out;
   for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full, out);
      else if (/\.(astro|jsx?|tsx?|mdx?)$/.test(entry)) out.push(full);
   }
   return out;
}

/** Quita comentarios HTML y de bloque para no auditar documentación. */
const stripComments = (source) => source.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

const sourceFiles = walk(join(ROOT, 'src'));
const wantSlash = Boolean(siteConfigData.urls?.trailingSlash);

for (const file of sourceFiles) {
   const rel = relative(ROOT, file);
   const content = stripComments(readFileSync(file, 'utf8'));
   const isHead = rel.endsWith('components/seo/SEOHead.astro');
   const isSchema = rel.endsWith('components/seo/Schema.astro');

   if (!isHead && /<title[\s>]/.test(content))
      add('CRITICAL', 'title-fuera-de-seohead', rel, 'Emite <title> por su cuenta: SEOHead es la fuente única.');
   if (!isHead && /rel=["']canonical["']/.test(content)) add('CRITICAL', 'canonical-fuera-de-seohead', rel, 'Emite canonical por su cuenta.');
   if (!isHead && /name=["']description["']/.test(content))
      add('HIGH', 'description-fuera-de-seohead', rel, 'Emite meta description por su cuenta.');
   if (!isSchema && /application\/ld\+json/.test(content))
      add('HIGH', 'jsonld-fuera-de-schema', rel, 'JSON-LD suelto: usar la prop schema del Layout.');
   if (/name=["']keywords["']/.test(content)) add('LOW', 'meta-keywords', rel, 'meta keywords está obsoleta desde 2009.');
   if (/http-equiv=["']X-Frame-Options/i.test(content))
      add('LOW', 'header-como-meta', rel, 'X-Frame-Options como <meta> no tiene efecto; va como cabecera HTTP.');
   if (/localhost:\d+/.test(content) && !/utils\/(site-)?config\.js$/.test(rel))
      add('HIGH', 'localhost-hardcodeado', rel, 'URL a localhost en el código.');

   // Solo en archivos con markup: un comentario `// … <img>` en un .js no es una etiqueta.
   const isMarkup = /\.(astro|jsx|tsx|mdx?)$/.test(rel);

   const h1s = isMarkup ? (content.match(/<h1[\s>]/g) ?? []).length : 0;
   if (h1s > 1) add('HIGH', 'h1-multiple', rel, `${h1s} <h1> en el mismo archivo.`);

   for (const match of isMarkup ? content.matchAll(/<img\b[^>]*>/gs) : []) {
      const tag = match[0];
      if (!/\balt\s*=/.test(tag)) add('HIGH', 'img-sin-alt', rel, 'Etiqueta <img> sin atributo alt (decorativa → alt="").');
      if (!/\bwidth\s*=/.test(tag) || !/\bheight\s*=/.test(tag))
         add('MEDIUM', 'img-sin-dimensiones', rel, '<img> sin width/height: provoca layout shift (CLS).');
   }

   // hrefs internos literales: política de barra final y existencia en el registro.
   for (const match of content.matchAll(/href=["'](\/[^"'#?{]*)["'#?]/g)) {
      const href = match[1];
      if (href === '/' || href.startsWith('//') || /\.[a-z0-9]{2,5}$/i.test(href) || href.startsWith('/api/')) continue;
      if (wantSlash !== href.endsWith('/'))
         add('MEDIUM', 'href-barra-final', rel, `${href} no sigue la política de barra final (${wantSlash ? 'con' : 'sin'} barra).`);
      if (!slugs.has(normalizeSlug(href)))
         add('LOW', 'href-fuera-de-registro', rel, `${href} no está en el registro (¿página sin dar de alta o enlace roto?).`);
   }
}

// ---------------------------------------------------------------------------
// 5. Grafo JSON-LD de cada página
// ---------------------------------------------------------------------------

for (const page of seoPages) {
   const seo = generateSEOTags({ pathname: page.slug });
   const graph = buildGraph(page, seo);

   for (const problem of validateGraph(graph)) add(problem.severity, 'schema', page.slug, problem.message);

   const declared = new Set(page.schemaTypes ?? []);
   const emitted = new Set((graph['@graph'] ?? []).map((node) => node['@type']));
   for (const type of declared) {
      // Estos los aporta la página por la prop `schema`; aquí solo se construye la base.
      if (['Service', 'Article', 'BlogPosting', 'FAQPage', 'Product', 'HowTo'].includes(type)) continue;
      if (!emitted.has(type))
         add('MEDIUM', 'schema-declarado-no-emitido', page.slug, `El registro declara ${type} pero el grafo no lo emite.`);
   }
}

// ---------------------------------------------------------------------------
// 6. Cobertura de keywords — backlog, no error
// ---------------------------------------------------------------------------

const pending = getPendingLandings(seoPages.map((page) => page.slug));
const pendingP1 = pending.filter((row) => row.priority === 'P1');
if (pendingP1.length)
   add('LOW', 'keyword-sin-landing', `${pendingP1.length} keywords P1`, 'Sin página que las trabaje. Backlog de contenido, no un defecto.');

// ---------------------------------------------------------------------------
// 7. PSEO — la generación debe seguir apagada mientras no haya contenido
// ---------------------------------------------------------------------------

const pseoReport = pseo.report();
if (pseoReport.generationEnabled && pseoReport.publishable === 0)
   add('CRITICAL', 'pseo-sin-contenido', 'motor PSEO', 'La generación está activada pero ninguna candidata supera el quality score.');

// ---------------------------------------------------------------------------
// Informe
// ---------------------------------------------------------------------------

const ORDER = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const counts = Object.fromEntries(ORDER.map((s) => [s, issues.filter((i) => i.severity === s).length]));

console.log(`\n  SEO CHECK — ${siteConfigData.site?.name ?? ''}`);
console.log('  ' + '-'.repeat(58));

if (issues.length === 0) {
   console.log('  Sin hallazgos.\n');
} else {
   for (const severity of ORDER) {
      const group = issues.filter((i) => i.severity === severity);
      if (!group.length) continue;
      console.log(`\n  ${severity}  (${group.length})`);
      for (const i of group) console.log(`    · [${i.rule}] ${i.target}\n      ${i.message}`);
   }
   console.log('');
}

console.log(
   '  ' +
      ORDER.map((s) => `${s}: ${counts[s]}`).join('   ') +
      `   ·   páginas en registro: ${seoPages.length}` +
      `   ·   modo: ${STRICT ? 'STRICT' : 'warning'}\n`,
);

if (STRICT && counts.CRITICAL > 0) {
   console.error(`  BUILD FAILED — ${counts.CRITICAL} hallazgo(s) CRITICAL.\n`);
   process.exit(1);
}

if (counts.CRITICAL > 0) console.log('  Hay hallazgos CRITICAL (modo warning: el build continúa).\n');
