import { siteConfig } from '../config.js';
import { getIndexablePages } from './registry.js';
import { clusters } from './clusters.js';
import { serviceCatalog } from '../../data/services-catalog.js';
import { technologies } from '../../data/technologies.js';
import { methodology } from '../../data/methodology.js';

/**
 * Generación de /llms.txt y /llms-full.txt.
 *
 * Todo sale de la misma fuente central que el resto del SEO (registro,
 * clusters, site-config y src/data), así que no puede contradecir al sitio.
 *
 * No sustituye a robots.txt, al sitemap ni al Schema: es un resumen legible
 * para sistemas que leen el sitio como texto. Y no afirma nada que no esté
 * ya publicado en la web.
 */

const sep = '\n';

function servicesSection() {
   return serviceCatalog.map((service) => `- **${service.title}**: ${service.description}`).join(sep);
}

function pagesSection() {
   return getIndexablePages()
      .map((page) => `- [${page.h1 ?? page.title}](${siteConfig.absoluteUrl(page.slug)}): ${page.description}`)
      .join(sep);
}

function clustersSection() {
   return clusters.map((cluster) => `- **${cluster.name}**: ${cluster.description}`).join(sep);
}

export function buildLlmsTxt() {
   const { site, contacto } = siteConfig;

   return `# ${site.name}

> ${site.description}

${site.name} es una empresa mexicana de desarrollo de software con sede en Ciudad de México.
Construye software a medida, aplicaciones móviles, plataformas SaaS, sistemas CRM/ERP,
automatizaciones y agentes de inteligencia artificial para empresas.

## Servicios

${servicesSection()}

## Áreas de especialidad

${clustersSection()}

## Páginas

${pagesSection()}

## Tecnologías

${technologies.map((tech) => tech.name).join(', ')}.

## Contacto

- Sitio web: ${siteConfig.absoluteUrl('/')}
- Correo: ${contacto.EMAIL}
- Teléfono / WhatsApp: ${contacto.TELEFONO}
- Ubicación: ${contacto.DIRECCION}

## Notas

- Idioma del sitio: español (${site.locale}).
- Sitemap: ${siteConfig.absoluteUrl('/sitemap.xml')}
- Última actualización de este archivo: ${new Date().toISOString().slice(0, 10)}
`;
}

export function buildLlmsFullTxt() {
   const { site, contacto, address } = siteConfig;

   const detailedServices = serviceCatalog
      .map((service) => {
         const features = (service.modal?.features ?? []).map((feature) => `  - ${feature.t}: ${feature.d}`).join(sep);
         const stack = (service.modal?.stack ?? service.tags ?? []).join(', ');
         const process = (service.modal?.process ?? []).map((step) => `  - ${step.l} (${step.t})`).join(sep);

         return [
            `### ${service.title}`,
            '',
            service.modal?.subtitle ?? service.description,
            '',
            features && `Qué incluye:${sep}${features}`,
            stack && `Stack: ${stack}`,
            process && `Fases:${sep}${process}`,
         ]
            .filter(Boolean)
            .join(sep);
      })
      .join(`${sep}${sep}`);

   const methodologySection = methodology
      .map((step) => `${step.number}. **${step.title}** (${step.duration}): ${step.description}`)
      .join(sep);

   return `# ${site.name} — información completa

> ${site.description}

## Identidad

- Nombre comercial: ${site.name}
- Razón social: SOFTREE, S.A. de C.V.
- Sector: desarrollo de software a medida y consultoría tecnológica
- País: México
- Domicilio: ${address.street}, ${address.locality}, ${address.region}, C.P. ${address.postalCode}
- Idioma de atención: español e inglés

## Servicios en detalle

${detailedServices}

## Metodología de trabajo

${methodologySection}

## Áreas de especialidad

${clustersSection()}

## Tecnologías

${technologies.map((tech) => tech.name).join(', ')}.

## Mapa del sitio

${pagesSection()}

## Contacto

- Correo: ${contacto.EMAIL}
- Teléfono / WhatsApp: ${contacto.TELEFONO}
- Ubicación: ${contacto.DIRECCION}
- Formulario: ${siteConfig.absoluteUrl('/contacto')}

## Alcance de este documento

Este archivo resume información ya publicada en ${siteConfig.absoluteUrl('/')}. No incluye
cifras de resultados, casos de clientes ni métricas: solo se documentará lo que pueda
verificarse públicamente.

Última actualización: ${new Date().toISOString().slice(0, 10)}
`;
}
