import { siteConfig } from './config.jsx';

// Generar meta tags SEO
export function generateSEOTags(props = {}) {
  const {
    title = `${siteConfig.site.name} - ${siteConfig.site.title}`,
    description = siteConfig.site.description,
    keywords = siteConfig.site.keywords,
    image = siteConfig.defaultImage,
    type = 'website',
    url = siteConfig.siteUrl,
    author = siteConfig.site.author,
    publishedTime,
    modifiedTime,
    noIndex = false
  } = props;

  return {
    title,
    description,
    keywords,
    image,
    type,
    url,
    author,
    publishedTime,
    modifiedTime,
    canonical: new URL(url, siteConfig.canonicalUrl).href,
    robots: noIndex || siteConfig.noIndex ? 'noindex, nofollow' : siteConfig.robotsContent
  };
}

// Generar Schema.org para la organización
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.site.name,
    "description": siteConfig.site.description,
    "url": siteConfig.canonicalUrl,
    "logo": `${siteConfig.canonicalUrl}${siteConfig.assets.logo}`,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": siteConfig.business.contactType,
      "availableLanguage": siteConfig.business.availableLanguage
    },
    "sameAs": [

      siteConfig.social.instagram
    ],
    "areaServed": {
      "@type": "Country",
      "name": siteConfig.business.country
    },
    "serviceType": siteConfig.business.serviceType
  };
}

// Generar Schema.org para servicios
export function generateServiceSchema(serviceData) {
  const {
    name,
    description,
    provider = siteConfig.site.name,
    areaServed = siteConfig.business.country,
    serviceType = siteConfig.business.serviceType
  } = serviceData;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": provider
    },
    "areaServed": areaServed,
    "serviceType": serviceType
  };
}