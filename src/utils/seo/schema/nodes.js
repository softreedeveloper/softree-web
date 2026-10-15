// Import relativo, no alias: el validador de build (scripts/seo-check.mjs)
// carga este módulo con Node a secas, donde `@/` no se resuelve.
import { siteConfig } from '../../config.js';

/**
 * Constructores de nodos Schema.org.
 *
 * Cada nodo lleva un `@id` estable derivado de la URL canónica para que los
 * demás lo referencien con { '@id': … } en lugar de repetir el objeto entero.
 * Ningún constructor inventa datos: si un campo no existe en site-config.js o
 * en el registro, prune() lo elimina y no se emite. Solo se declara lo que el
 * usuario ve en la página.
 */

export const ID = {
   organization: () => `${siteConfig.canonicalUrl}/#organization`,
   website: () => `${siteConfig.canonicalUrl}/#website`,
   logo: () => `${siteConfig.canonicalUrl}/#logo`,
   webPage: (slug) => `${siteConfig.absoluteUrl(slug)}#webpage`,
   breadcrumb: (slug) => `${siteConfig.absoluteUrl(slug)}#breadcrumb`,
   service: (slug, key = 'service') => `${siteConfig.absoluteUrl(slug)}#${key}`,
   faq: (slug) => `${siteConfig.absoluteUrl(slug)}#faq`,
   article: (slug) => `${siteConfig.absoluteUrl(slug)}#article`,
   product: (slug) => `${siteConfig.absoluteUrl(slug)}#product`,
   howto: (slug) => `${siteConfig.absoluteUrl(slug)}#howto`,
};

/** Referencia a otro nodo del grafo. */
export const ref = (id) => ({ '@id': id });

const lang = () => siteConfig.site.language;

// --- Entidad -----------------------------------------------------------------

export function buildOrganization() {
   const { site, contacto, address, business, social } = siteConfig;
   const hasAddress = Boolean(address.locality || address.street);

   return {
      '@type': business.schemaType || 'Organization',
      '@id': ID.organization(),
      name: site.name,
      legalName: site.legalName,
      description: site.description,
      url: siteConfig.absoluteUrl('/'),
      logo: {
         '@type': 'ImageObject',
         '@id': ID.logo(),
         url: siteConfig.logoUrl,
         width: siteConfig.assets.logoWidth,
         height: siteConfig.assets.logoHeight,
         caption: site.name,
      },
      image: ref(ID.logo()),
      email: contacto.EMAIL,
      telephone: contacto.TELEFONO,
      foundingDate: business.foundingDate,
      address: hasAddress
         ? {
              '@type': 'PostalAddress',
              streetAddress: address.street,
              addressLocality: address.locality,
              addressRegion: address.region,
              postalCode: address.postalCode,
              addressCountry: address.country,
           }
         : undefined,
      contactPoint:
         contacto.EMAIL || contacto.TELEFONO
            ? {
                 '@type': 'ContactPoint',
                 contactType: business.contactType,
                 email: contacto.EMAIL,
                 telephone: contacto.TELEFONO,
                 availableLanguage: business.availableLanguage,
              }
            : undefined,
      sameAs: Object.values(social).filter((url) => /^https?:\/\//.test(String(url ?? ''))),
      areaServed: business.areaServed ? { '@type': 'Country', name: business.areaServed } : undefined,
      knowsLanguage: business.availableLanguage,
   };
}

/**
 * Sin SearchAction a propósito: no hay URL de resultados de búsqueda real.
 */
export function buildWebSite() {
   return {
      '@type': 'WebSite',
      '@id': ID.website(),
      name: siteConfig.site.name,
      description: siteConfig.site.description,
      url: siteConfig.absoluteUrl('/'),
      publisher: ref(ID.organization()),
      inLanguage: lang(),
   };
}

// --- Página --------------------------------------------------------------------

/**
 * @param {object} page  entrada del registro
 * @param {object} seo   metadata ya resuelta por generateSEOTags
 */
export function buildWebPage(page, seo) {
   const slug = page?.slug ?? '/';

   return {
      '@type': page?.pageType ?? 'WebPage',
      '@id': ID.webPage(slug),
      url: seo.canonical,
      name: seo.title,
      description: seo.description,
      isPartOf: ref(ID.website()),
      about: ref(ID.organization()),
      breadcrumb: page?.breadcrumb?.length ? ref(ID.breadcrumb(slug)) : undefined,
      primaryImageOfPage: { '@type': 'ImageObject', url: seo.image, width: 1200, height: 630 },
      inLanguage: lang(),
      dateModified: page?.lastmod,
   };
}

/** "Inicio" se antepone solo; el registro no lo incluye. */
export function buildBreadcrumbList(page) {
   const trail = page?.breadcrumb ?? [];
   if (!trail.length) return null;

   const items = [{ label: 'Inicio', href: '/' }, ...trail];

   return {
      '@type': 'BreadcrumbList',
      '@id': ID.breadcrumb(page.slug),
      itemListElement: items.map((item, index) => ({
         '@type': 'ListItem',
         position: index + 1,
         name: item.label,
         item: siteConfig.absoluteUrl(item.href),
      })),
   };
}

// --- Nodos de contenido (los aporta cada página por la prop `schema`) ------------

export function buildService({ slug = '/', key, name, description, serviceType, areaServed, offer }) {
   const country = siteConfig.business.areaServed;
   return {
      '@type': 'Service',
      '@id': ID.service(slug, key),
      name,
      description,
      provider: ref(ID.organization()),
      serviceType: serviceType ?? siteConfig.business.serviceType,
      areaServed: areaServed ?? (country ? { '@type': 'Country', name: country } : undefined),
      url: siteConfig.absoluteUrl(slug),
      offers: offer ? buildOffer({ ...offer, url: siteConfig.absoluteUrl(slug) }) : undefined,
   };
}

/**
 * Precio: solo el que se muestra en la página. "Desde $X" → priceSpecification
 * con minPrice. No usar AggregateOffer sin offerCount real.
 */
export function buildOffer({ price, minPrice, currency, url, description, availability }) {
   return {
      '@type': 'Offer',
      price: price != null ? String(price) : undefined,
      priceCurrency: currency,
      priceSpecification:
         minPrice != null
            ? { '@type': 'PriceSpecification', minPrice: Number(minPrice), priceCurrency: currency }
            : undefined,
      availability: availability ? `https://schema.org/${availability}` : undefined,
      description,
      url,
   };
}

/**
 * Solo debe llamarse con preguntas que el usuario ve renderizadas en la página,
 * con el mismo texto. Acepta {question, answer} o {q, a}.
 */
export function buildFAQPage({ slug = '/', faqs = [] }) {
   if (!faqs.length) return null;

   return {
      '@type': 'FAQPage',
      '@id': ID.faq(slug),
      isPartOf: ref(ID.webPage(slug)),
      mainEntity: faqs.map((faq) => ({
         '@type': 'Question',
         name: faq.question ?? faq.q,
         acceptedAnswer: { '@type': 'Answer', text: faq.answer ?? faq.a },
      })),
   };
}

/** Sin totalTime salvo que la página muestre una duración. */
export function buildHowTo({ slug = '/', name, description, steps = [], tool, totalTime }) {
   if (!steps.length) return null;
   return {
      '@type': 'HowTo',
      '@id': ID.howto(slug),
      name,
      description,
      totalTime,
      tool: tool ? { '@type': 'HowToTool', name: tool } : undefined,
      step: steps.map((s, i) => ({
         '@type': 'HowToStep',
         position: i + 1,
         name: s.name ?? s.title,
         text: s.text ?? s.description,
      })),
   };
}

/** Fechas en ISO 'AAAA-MM-DD'. headline = H1, no el title con sufijo de marca. */
export function buildArticle({
   slug,
   headline,
   description,
   image,
   datePublished,
   dateModified,
   author,
   type = 'BlogPosting',
}) {
   return {
      '@type': type,
      '@id': ID.article(slug),
      headline,
      description,
      image: image ? siteConfig.assetUrl(image) : undefined,
      url: siteConfig.absoluteUrl(slug),
      isPartOf: ref(ID.webPage(slug)),
      mainEntityOfPage: ref(ID.webPage(slug)),
      author: author ? { '@type': 'Person', name: author } : ref(ID.organization()),
      publisher: ref(ID.organization()),
      datePublished,
      dateModified: dateModified ?? datePublished,
      inLanguage: lang(),
   };
}

export function buildProduct({ slug, name, description, image, sku, brand, offer }) {
   return {
      '@type': 'Product',
      '@id': ID.product(slug),
      name,
      description,
      image: image ? siteConfig.assetUrl(image) : undefined,
      sku,
      brand: { '@type': 'Brand', name: brand ?? siteConfig.site.name },
      offers: offer ? buildOffer({ ...offer, url: siteConfig.absoluteUrl(slug) }) : undefined,
   };
}

export function buildVideoObject({ name, description, thumbnailUrl, uploadDate, embedUrl, contentUrl, duration }) {
   return { '@type': 'VideoObject', name, description, thumbnailUrl, uploadDate, embedUrl, contentUrl, duration };
}
