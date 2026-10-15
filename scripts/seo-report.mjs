#!/usr/bin/env node
/**
 * Informe SEO legible: score por página, enlaces y estado del motor PSEO.
 * Solo lectura, no modifica nada.
 *
 *   npm run seo:report
 */

const { scoreAll } = await import(new URL('../src/utils/seo/score.js', import.meta.url));
const { buildLinkGraph, suggestRelated, anchorFor } = await import(
   new URL('../src/utils/seo/linking.js', import.meta.url)
);
const { getPendingLandings } = await import(new URL('../src/utils/seo/clusters.js', import.meta.url));
const { seoPages } = await import(new URL('../src/utils/seo/registry.js', import.meta.url));
const { report } = await import(new URL('../src/utils/seo/pseo/index.js', import.meta.url));

const graph = buildLinkGraph();

console.log('\n  SEO REPORT — softree-web');
console.log('  ' + '='.repeat(64));

console.log('\n  SCORE POR PÁGINA\n');
for (const entry of scoreAll()) {
   const node = graph.get(entry.slug.replace(/\/+$/, '') || '/');
   const dims = Object.entries(entry.dimensions)
      .map(([name, d]) => `${name} ${d.points}/${d.max}`)
      .join('  ');
   console.log(`  ${String(entry.score).padStart(3)}/100  ${entry.slug}`);
   console.log(`           ${dims}`);
   console.log(`           enlaces: ${node?.incoming.length ?? 0} entrantes, ${node?.outgoing.length ?? 0} salientes`);
   for (const reason of entry.failed) console.log(`           ✗ ${reason}`);
   console.log('');
}

console.log('  SUGERENCIAS DE ENLAZADO\n');
for (const page of seoPages) {
   const related = suggestRelated(page.slug);
   if (!related.length) continue;
   const labels = related.map((target, i) => `${anchorFor(target, i)} → ${target.slug}`);
   console.log(`  ${page.slug}`);
   for (const label of labels) console.log(`     · ${label}`);
}

const pending = getPendingLandings(seoPages.map((page) => page.slug));
console.log(`\n  BACKLOG DE CONTENIDO — ${pending.length} keywords sin landing\n`);
for (const priority of ['P1', 'P2', 'P3']) {
   const rows = pending.filter((row) => row.priority === priority);
   if (!rows.length) continue;
   console.log(`  ${priority} (${rows.length})`);
   for (const row of rows) console.log(`     · ${row.keyword}  →  ${row.landing}`);
}

const pseo = report();
console.log(`\n  PSEO — generación ${pseo.generationEnabled ? 'ACTIVADA' : 'desactivada'}`);
console.log(`  ${pseo.total} candidatas · ${pseo.publishable} superan el umbral de ${pseo.thresholds.publish}`);
const verdicts = {};
for (const row of pseo.rows) verdicts[row.verdict] = (verdicts[row.verdict] ?? 0) + 1;
console.log(
   '  ' +
      Object.entries(verdicts)
         .map(([v, n]) => `${v}: ${n}`)
         .join('   '),
);
console.log('');
