/**
 * Dimensiones del motor PSEO.
 *
 * Una página programática nace del cruce de dos dimensiones (servicio × ciudad,
 * servicio × industria, problema × solución). Estas listas son el catálogo de
 * lo que *podría* generarse, no de lo que se genera: nada se publica sin
 * superar el quality score, y el score exige contenido escrito a mano.
 *
 * `uniqueContent` es siempre responsabilidad humana. El motor no lo inventa.
 */

export const services = [
   { id: 'desarrollo-software-medida', name: 'Desarrollo de software a medida', cluster: 'desarrollo-software' },
   { id: 'desarrollo-web', name: 'Desarrollo web', cluster: 'desarrollo-software' },
   { id: 'aplicaciones-moviles', name: 'Desarrollo de aplicaciones móviles', cluster: 'aplicaciones-moviles' },
   { id: 'desarrollo-saas', name: 'Desarrollo SaaS', cluster: 'saas-cloud' },
   { id: 'crm-erp', name: 'Desarrollo de CRM y ERP', cluster: 'automatizacion' },
   { id: 'automatizacion-empresarial', name: 'Automatización empresarial', cluster: 'automatizacion' },
   { id: 'agentes-ia', name: 'Agentes de inteligencia artificial', cluster: 'inteligencia-artificial' },
   { id: 'integraciones-api', name: 'Integración de APIs', cluster: 'desarrollo-software' },
];

export const industries = [
   { id: 'restaurantes', name: 'Restaurantes' },
   { id: 'inmobiliarias', name: 'Inmobiliarias' },
   { id: 'retail', name: 'Retail' },
   { id: 'logistica', name: 'Logística' },
   { id: 'salud', name: 'Salud' },
   { id: 'educacion', name: 'Educación' },
];

/**
 * Mercados candidatos. `strategic: false` significa que ni siquiera entra en
 * la cola de generación: son ciudades donde no hay presencia real que contar.
 */
export const cities = [
   { id: 'cdmx', name: 'Ciudad de México', region: 'Ciudad de México', strategic: true },
   { id: 'estado-de-mexico', name: 'Estado de México', region: 'Estado de México', strategic: true },
   { id: 'monterrey', name: 'Monterrey', region: 'Nuevo León', strategic: false },
   { id: 'guadalajara', name: 'Guadalajara', region: 'Jalisco', strategic: false },
   { id: 'queretaro', name: 'Querétaro', region: 'Querétaro', strategic: false },
];

export const problems = [
   { id: 'automatizar-leads', name: 'Automatizar la captación de leads', solution: 'automatizacion-empresarial' },
   { id: 'automatizar-cotizaciones', name: 'Automatizar cotizaciones', solution: 'automatizacion-empresarial' },
   { id: 'automatizar-seguimiento-clientes', name: 'Automatizar el seguimiento de clientes', solution: 'crm-erp' },
   { id: 'integrar-crm-whatsapp', name: 'Integrar el CRM con WhatsApp', solution: 'integraciones-api' },
];

/** Plantillas disponibles y cómo se construye el slug de cada una. */
export const templates = {
   'servicio-ciudad': {
      dimensions: ['service', 'city'],
      slug: ({ service, city }) => `/${service.id}-${city.id}/`,
      title: ({ service, city }) => `${service.name} en ${city.name} | Softree`,
      requires: ['marketContext', 'caseStudyRefs', 'faqs'],
   },
   'servicio-industria': {
      dimensions: ['service', 'industry'],
      slug: ({ service, industry }) => `/${service.id}-${industry.id}/`,
      title: ({ service, industry }) => `${service.name} para ${industry.name} | Softree`,
      requires: ['marketContext', 'caseStudyRefs', 'faqs'],
   },
   'problema-solucion': {
      dimensions: ['problem'],
      slug: ({ problem }) => `/${problem.id}/`,
      title: ({ problem }) => `${problem.name} | Softree`,
      requires: ['marketContext', 'faqs'],
   },
};
