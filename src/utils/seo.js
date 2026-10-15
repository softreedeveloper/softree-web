import { siteConfig } from './config.js';
import { getPage, normalizeSlug } from './seo/registry.js';
import { buildService } from './seo/schema/nodes.js';

/**
 * Resuelve la metadata de una página.
 *
 * Precedencia: props explícitas > entrada del registro > valores por defecto
 * del sitio. Todas las URLs salen absolutas y normalizadas por
 * siteConfig.absoluteUrl(), que es lo que impide los `//` en og:image.
 */
export function generateSEOTags(props = {}) {
   const { pathname = '/', noIndex = false, publishedTime, modifiedTime } = props;

   const registryEntry = getPage(pathname) || {};

   const title = props.title || registryEntry.title || `${siteConfig.site.name} - ${siteConfig.site.title}`;
   const description = props.description || registryEntry.description || siteConfig.site.description;
   const image = siteConfig.absoluteUrl(props.image || registryEntry.ogImage || siteConfig.assets.defaultOgImage);

   // Sin barra final, igual que el sitemap. Astro sirve las rutas prerenderizadas
   // como /contacto/, así que sin normalizar aquí la canónica y el sitemap
   // apuntarían a dos URLs distintas para la misma página.
   const canonical = siteConfig.absoluteUrl(normalizeSlug(pathname));

   const hidden = noIndex || registryEntry.noindex || siteConfig.noIndex;

   return {
      title,
      description,
      image,
      canonical,
      type: props.type || 'website',
      author: props.author || siteConfig.site.author,
      publishedTime,
      modifiedTime,
      robots: hidden ? siteConfig.seo.robots.staging : siteConfig.seo.robots.production,
   };
}

// Los constructores de nodos Schema.org viven en ./seo/schema/nodes.js.
// Aquí solo queda el envoltorio que usan las páginas.

/**
 * Nodo Service para una página. El @id se deriva del slug, así que dos páginas
 * distintas nunca comparten identificador.
 */
export function generateServiceSchema({ slug, name, description, serviceType = undefined, areaServed = undefined }) {
   return buildService({ slug, name, description, serviceType, areaServed });
}
