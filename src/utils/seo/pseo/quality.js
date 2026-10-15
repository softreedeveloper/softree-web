/**
 * PSEO Quality Engine.
 *
 * Puerta de entrada obligatoria: ninguna página programática se publica sin
 * pasar por aquí. El score no es una estimación, se calcula con reglas
 * verificables sobre el contenido diferencial que aporta un humano.
 *
 *   90-100  PUBLICAR
 *   75-89   REVISAR      (requiere aprobación manual)
 *   50-74   NO PUBLICAR
 *   0-49    DESCARTAR
 *
 * La dimensión que más pesa es la unicidad, porque el riesgo real del PSEO no
 * es tener poco contenido: es tener el mismo contenido con la ciudad cambiada.
 */

export const THRESHOLDS = { publish: 90, review: 75, reject: 50 };

const MIN_UNIQUE_WORDS = 250;
const MIN_FAQS = 3;
const MAX_SIMILARITY = 0.4;

/** Trigramas de caracteres, normalizados: base de la comparación de unicidad. */
function trigrams(text) {
   const clean = String(text ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

   const set = new Set();
   for (let i = 0; i < clean.length - 2; i++) set.add(clean.slice(i, i + 3));
   return set;
}

/** Similitud de Jaccard entre dos textos. 0 = nada en común, 1 = idénticos. */
export function similarity(a, b) {
   const setA = trigrams(a);
   const setB = trigrams(b);
   if (!setA.size || !setB.size) return 0;

   let shared = 0;
   for (const gram of setA) if (setB.has(gram)) shared++;
   return shared / (setA.size + setB.size - shared);
}

function wordCount(text) {
   return String(text ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
}

/**
 * Puntúa una página candidata.
 *
 * @param {object} candidate  { slug, title, description, uniqueContent, linksTo, schemaTypes, primaryKeyword }
 * @param {object[]} siblings páginas ya publicadas de la misma plantilla, para medir unicidad
 */
export function scoreCandidate(candidate, siblings = []) {
   const unique = candidate.uniqueContent ?? {};
   const body = [unique.marketContext, ...(unique.faqs ?? []).map((faq) => `${faq.question} ${faq.answer}`)]
      .filter(Boolean)
      .join(' ');

   const checks = [];
   const check = (dimension, max, passed, reason, partial = null) =>
      checks.push({ dimension, points: passed ? max : (partial ?? 0), max, passed, reason });

   // --- Unicidad (35) ---
   const worst = siblings.reduce((peak, sibling) => Math.max(peak, similarity(body, sibling.body ?? '')), 0);
   check(
      'Unicidad',
      25,
      worst <= MAX_SIMILARITY,
      `similitud máxima con páginas hermanas: ${(worst * 100).toFixed(0)}% (límite ${MAX_SIMILARITY * 100}%)`,
      worst <= 0.6 ? 10 : 0,
   );
   check(
      'Unicidad',
      10,
      siblings.every((sibling) => sibling.slug !== candidate.slug),
      'slug no duplicado',
   );

   // --- Contenido real (30) ---
   const words = wordCount(body);
   check(
      'Contenido',
      15,
      words >= MIN_UNIQUE_WORDS,
      `${words} palabras de contenido diferencial (mínimo ${MIN_UNIQUE_WORDS})`,
      words >= MIN_UNIQUE_WORDS * 0.6 ? 7 : 0,
   );
   check(
      'Contenido',
      10,
      (unique.caseStudyRefs ?? []).length >= 1,
      `casos reales referenciados: ${(unique.caseStudyRefs ?? []).length} (mínimo 1)`,
   );
   check(
      'Contenido',
      5,
      (unique.faqs ?? []).length >= MIN_FAQS,
      `FAQs propias: ${(unique.faqs ?? []).length} (mínimo ${MIN_FAQS})`,
   );

   // --- Intención y keyword (15) ---
   check('Keyword', 8, Boolean(candidate.primaryKeyword), 'keyword principal declarada');
   check(
      'Keyword',
      7,
      !siblings.some((sibling) => sibling.primaryKeyword === candidate.primaryKeyword),
      'la keyword principal no la reclama ya otra página',
   );

   // --- Metadata (10) ---
   check(
      'Metadata',
      5,
      Boolean(candidate.title) && candidate.title.length <= 60,
      `title ≤ 60 caracteres (actual: ${candidate.title?.length ?? 0})`,
   );
   check(
      'Metadata',
      5,
      Boolean(candidate.description) && candidate.description.length >= 120 && candidate.description.length <= 158,
      `description entre 120 y 158 caracteres (actual: ${candidate.description?.length ?? 0})`,
   );

   // --- Integración en el sitio (10) ---
   check(
      'Integración',
      5,
      (candidate.linksTo ?? []).length >= 2,
      `enlaces internos salientes: ${(candidate.linksTo ?? []).length} (mínimo 2)`,
   );
   check(
      'Integración',
      5,
      (candidate.schemaTypes ?? []).length >= 2,
      `tipos de Schema declarados: ${(candidate.schemaTypes ?? []).length} (mínimo 2)`,
   );

   const total = checks.reduce((sum, item) => sum + item.points, 0);
   const max = checks.reduce((sum, item) => sum + item.max, 0);
   const score = Math.round((total / max) * 100);

   let verdict = 'DESCARTAR';
   if (score >= THRESHOLDS.publish) verdict = 'PUBLICAR';
   else if (score >= THRESHOLDS.review) verdict = 'REVISAR';
   else if (score >= THRESHOLDS.reject) verdict = 'NO PUBLICAR';

   const dimensions = {};
   for (const item of checks) {
      dimensions[item.dimension] ??= { points: 0, max: 0 };
      dimensions[item.dimension].points += item.points;
      dimensions[item.dimension].max += item.max;
   }

   return {
      slug: candidate.slug,
      score,
      verdict,
      dimensions,
      failed: checks.filter((item) => !item.passed).map((item) => `${item.dimension}: ${item.reason}`),
   };
}

/** Solo pasan las candidatas con veredicto PUBLICAR. Las demás quedan en cola. */
export function filterPublishable(candidates, siblings = []) {
   return candidates
      .map((candidate) => ({ candidate, result: scoreCandidate(candidate, siblings) }))
      .filter(({ result }) => result.verdict === 'PUBLICAR');
}
