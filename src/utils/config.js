import { siteConfigData } from './site-config.js';

/**
 * Configuración resuelta: entorno, URLs y helpers. Única capa con lógica sobre
 * site-config.js. Import relativo (no alias) para que scripts/seo-check.mjs
 * pueda cargarla con Node sin Vite.
 *
 * Entorno — orden de precedencia:
 *   1. PUBLIC_SITE_ENV          override explícito ('production' | 'staging' | 'development')
 *   2. CONTEXT (Netlify)        'production' | 'deploy-preview' | 'branch-deploy' | 'dev'
 *   3. import.meta.env.DEV      dev server de Astro
 *
 * Cualquier cosa que no sea producción se marca noindex: es lo que evita que
 * stage.softree.com.mx acabe indexado (hallazgo H-06). Nunca inferir el
 * entorno solo por hostname: las páginas prerenderizadas reciben un request
 * sintético de localhost durante el build.
 */
function readEnv(key) {
   const fromVite = import.meta.env?.[key];
   if (fromVite) return String(fromVite);
   if (typeof process !== 'undefined' && process.env?.[key]) return String(process.env[key]);
   return undefined;
}

function detectEnvironment() {
   const explicit = readEnv('PUBLIC_SITE_ENV');
   if (explicit) return explicit;

   const netlifyContext = readEnv('CONTEXT');
   if (netlifyContext === 'production') return 'production';
   if (netlifyContext === 'deploy-preview' || netlifyContext === 'branch-deploy') return 'staging';

   if (import.meta.env?.DEV) return 'development';
   if (import.meta.env?.PROD) return 'production';
   return 'development';
}

const environment = detectEnvironment();

/** Quita barras finales para poder concatenar rutas sin generar `//`. */
function trimTrailingSlash(url) {
   return String(url).replace(/\/+$/, '');
}

/** Aplica la política de barra final a una ruta. '/' y archivos con extensión no se tocan. */
export function formatPath(path = '/') {
   const [pathname, hash = ''] = String(path).trim().split('#');
   let clean = '/' + pathname.replace(/^\/+/, '');
   if (clean !== '/') {
      clean = clean.replace(/\/+$/, '');
      const isFile = /\.[a-z0-9]{2,5}$/i.test(clean);
      if (siteConfigData.urls.trailingSlash && !isFile) clean += '/';
   }
   return hash ? `${clean}#${hash}` : clean;
}

// Configuración centralizada
export const siteConfig = {
   ...siteConfigData,

   environment,
   isDev: environment === 'development',
   isStaging: environment === 'staging',
   isProduction: environment === 'production',
   debugMode: environment !== 'production',

   // URL del entorno actual (para logs, previews y enlaces internos absolutos en dev)
   get siteUrl() {
      if (this.isDev) return trimTrailingSlash(this.urls.development);
      if (this.isStaging) return trimTrailingSlash(this.urls.staging);
      return trimTrailingSlash(this.urls.production);
   },

   // URL canónica: siempre producción. Un deploy de stage no debe reclamar
   // canonicalidad sobre sí mismo, y va acompañado de noindex.
   get canonicalUrl() {
      return trimTrailingSlash(this.urls.production);
   },

   // Control de indexación
   get noIndex() {
      return !this.isProduction;
   },

   get robotsContent() {
      return this.noIndex ? this.seo.robots.staging : this.seo.robots.production;
   },

   /**
    * Única vía permitida para emitir URLs de RUTAS en metadata, Schema, sitemap
    * y llms.txt. Normaliza dobles slashes, espacios y la política de barra final
    * (hallazgos H-01 y H-03).
    */
   absoluteUrl(path = '/') {
      const clean = String(path).trim();
      if (/^https?:\/\//i.test(clean)) return clean;
      return `${this.canonicalUrl}${formatPath(clean)}`;
   },

   /** URLs de ARCHIVOS (imágenes, logo, sitemap.xml): sin política de barra final. */
   assetUrl(path) {
      const clean = String(path).trim();
      if (/^https?:\/\//i.test(clean)) return clean;
      return `${this.canonicalUrl}/${clean.replace(/^\/+/, '')}`;
   },

   // URLs de assets
   get logoUrl() {
      return this.assetUrl(this.assets.logo);
   },

   get defaultImage() {
      return this.assetUrl(this.assets.defaultOgImage);
   },
};
