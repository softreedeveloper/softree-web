/**
 * Registro central de páginas — única fuente de verdad para SEO.
 *
 * De aquí leen: sitemap.xml, robots.txt, breadcrumbs, internal linking,
 * llms.txt y el validador de build. Ningún dato SEO debe duplicarse fuera
 * de este archivo.
 *
 * Campos:
 *   slug             ruta absoluta, tal y como se sirve (con barra inicial)
 *   title            <title> de la página (≤ 60 caracteres recomendado)
 *   description      meta description (120–158 caracteres recomendado)
 *   h1               encabezado principal visible; debe diferir del title
 *   primaryKeyword   keyword objetivo, única en todo el registro
 *   secondaryKeywords variaciones semánticas
 *   intent           informacional | comercial | transaccional | navegacional | local
 *   cluster          topic cluster al que pertenece (null si aún no aplica)
 *   schemaTypes      tipos de Schema.org que emite la página
 *   pageType         subtipo de WebPage a emitir (ContactPage, AboutPage…); por defecto WebPage
 *   breadcrumb       ruta de migas; la home no lleva
 *   linksTo          enlaces internos salientes obligatorios
 *   changefreq       pista para el sitemap
 *   priority         prioridad relativa dentro del sitio (0–1)
 *   lastmod          fecha ISO de la última revisión de contenido, a mano
 *   noindex          excluye de sitemap y fuerza noindex en la página
 *   source           static | collection | pseo
 *
 * Las landings de servicio (/desarrollo-web, /apps-moviles, /automatizacion,
 * /inteligencia-artificial) son las páginas pilar de sus clusters. Su `h1`
 * debe coincidir con `h1.lead + ' ' + h1.highlight` en `data/service-pages.js`.
 */

export const SERVICE_ROUTES = ['/desarrollo-web', '/apps-moviles', '/automatizacion', '/inteligencia-artificial'];

/** Las demás landings de servicio, para el enlazado cruzado entre hermanas. */
const otherServices = (slug) => SERVICE_ROUTES.filter((route) => route !== slug);

export const seoPages = [
   {
      slug: '/',
      title: 'Softree | Software a medida y agentes de IA para empresas',
      description:
         'Software a medida con agentes de inteligencia artificial integrados: apps, plataformas web, CRM, automatización y chatbots con RAG, listos para producción.',
      h1: 'Software y agentes de IA a tu medida',
      primaryKeyword: 'desarrollo de software a medida',
      secondaryKeywords: ['empresa de desarrollo de software', 'software empresarial México'],
      intent: 'comercial',
      cluster: 'desarrollo-software',
      schemaTypes: ['WebSite', 'Organization', 'WebPage', 'Service'],
      breadcrumb: [],
      linksTo: [...SERVICE_ROUTES, '/contacto'],
      changefreq: 'weekly',
      priority: 1.0,
      lastmod: '2026-09-05',
      source: 'static',
   },
   {
      slug: '/desarrollo-web',
      title: 'Desarrollo web a medida | Softree',
      description:
         'Desarrollo web a medida: plataformas, portales de cliente, dashboards y SaaS con Next.js, React y Astro. Arquitectura escalable y entregas semanales.',
      h1: 'Plataformas web que escalan con tu negocio',
      primaryKeyword: 'desarrollo web',
      secondaryKeywords: ['desarrollo de plataformas web', 'desarrollo SaaS', 'portales de cliente'],
      intent: 'transaccional',
      cluster: 'desarrollo-software',
      schemaTypes: ['WebPage', 'Service', 'FAQPage', 'BreadcrumbList'],
      breadcrumb: [{ label: 'Desarrollo web', href: '/desarrollo-web' }],
      linksTo: [...otherServices('/desarrollo-web'), '/contacto'],
      changefreq: 'monthly',
      priority: 0.9,
      lastmod: '2026-09-05',
      source: 'static',
   },
   {
      slug: '/apps-moviles',
      title: 'Desarrollo de aplicaciones móviles | Softree',
      description:
         'Desarrollo de aplicaciones móviles para iOS y Android con React Native. Diseño, publicación en App Store y Google Play y soporte post-lanzamiento incluido.',
      h1: 'Apps móviles listas para las tiendas',
      primaryKeyword: 'desarrollo de aplicaciones móviles',
      secondaryKeywords: ['desarrollo de apps con React Native', 'apps iOS y Android', 'publicar app en App Store'],
      intent: 'transaccional',
      cluster: 'aplicaciones-moviles',
      schemaTypes: ['WebPage', 'Service', 'FAQPage', 'BreadcrumbList'],
      breadcrumb: [{ label: 'Aplicaciones móviles', href: '/apps-moviles' }],
      linksTo: [...otherServices('/apps-moviles'), '/contacto'],
      changefreq: 'monthly',
      priority: 0.9,
      lastmod: '2026-09-05',
      source: 'static',
   },
   {
      slug: '/automatizacion',
      title: 'Automatización empresarial e integraciones | Softree',
      description:
         'Automatización empresarial con n8n, APIs y webhooks: conectamos tu CRM, formularios, pagos y bases de datos para eliminar el trabajo manual repetitivo.',
      h1: 'Procesos que se ejecutan solos',
      primaryKeyword: 'automatización empresarial',
      secondaryKeywords: ['automatización de procesos con n8n', 'integración de sistemas', 'integrar CRM con WhatsApp'],
      intent: 'comercial',
      cluster: 'automatizacion',
      schemaTypes: ['WebPage', 'Service', 'FAQPage', 'BreadcrumbList'],
      breadcrumb: [{ label: 'Automatización', href: '/automatizacion' }],
      linksTo: [...otherServices('/automatizacion'), '/contacto'],
      changefreq: 'monthly',
      priority: 0.9,
      lastmod: '2026-09-05',
      source: 'static',
   },
   {
      slug: '/inteligencia-artificial',
      title: 'Agentes de inteligencia artificial para empresas | Softree',
      description:
         'Agentes de inteligencia artificial, chatbots con RAG y asistentes conectados a tus datos y procesos reales. GPT-4o, Claude y modelos abiertos, en producción.',
      h1: 'IA conectada a tu operación real',
      primaryKeyword: 'agentes de inteligencia artificial',
      secondaryKeywords: ['chatbot empresarial con IA', 'automatización con inteligencia artificial', 'RAG'],
      intent: 'comercial',
      cluster: 'inteligencia-artificial',
      schemaTypes: ['WebPage', 'Service', 'FAQPage', 'BreadcrumbList'],
      breadcrumb: [{ label: 'Inteligencia artificial', href: '/inteligencia-artificial' }],
      linksTo: [...otherServices('/inteligencia-artificial'), '/contacto'],
      changefreq: 'monthly',
      priority: 0.9,
      lastmod: '2026-09-05',
      source: 'static',
   },
   {
      slug: '/contacto',
      title: 'Softree | Contacto — Cotiza tu proyecto de software',
      description:
         'Cuéntanos tu idea y te respondemos en menos de 24 horas con un plan concreto: alcance, tecnologías, plazos y presupuesto de tu proyecto.',
      h1: 'Cuéntanos sobre tu proyecto',
      primaryKeyword: 'cotizar desarrollo de software',
      secondaryKeywords: ['contacto empresa de software', 'presupuesto desarrollo a medida'],
      intent: 'transaccional',
      cluster: null,
      schemaTypes: ['ContactPage', 'BreadcrumbList'],
      pageType: 'ContactPage',
      breadcrumb: [{ label: 'Contacto', href: '/contacto' }],
      linksTo: ['/desarrollo-web'],
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: '2026-09-05',
      source: 'static',
   },
   {
      slug: '/aviso-de-privacidad',
      title: 'Aviso de Privacidad | Softree',
      description:
         'Aviso de privacidad de Softree conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.',
      h1: 'Aviso de Privacidad',
      primaryKeyword: 'aviso de privacidad Softree',
      secondaryKeywords: [],
      intent: 'navegacional',
      cluster: null,
      schemaTypes: ['WebPage', 'BreadcrumbList'],
      breadcrumb: [{ label: 'Aviso de privacidad', href: '/aviso-de-privacidad' }],
      linksTo: [],
      changefreq: 'yearly',
      priority: 0.3,
      lastmod: '2026-09-03',
      source: 'static',
   },
   {
      // Utilitaria: existe pero nunca entra en el índice ni en el sitemap.
      slug: '/404',
      title: 'Página no encontrada | Softree',
      description:
         'La página que buscas no existe o fue movida. Vuelve al inicio o revisa nuestros servicios de desarrollo de software.',
      h1: 'Esta ruta no existe',
      primaryKeyword: null,
      secondaryKeywords: [],
      intent: 'navegacional',
      cluster: null,
      schemaTypes: ['WebPage'],
      breadcrumb: [],
      linksTo: [],
      noindex: true,
      source: 'static',
   },
];

/** Devuelve la entrada del registro que corresponde a una ruta servida. */
export function getPage(slug) {
   const normalized = normalizeSlug(slug);
   return seoPages.find((page) => normalizeSlug(page.slug) === normalized);
}

/** Solo lo que debe entrar en el sitemap: público, indexable y canónico. */
export function getIndexablePages() {
   return seoPages.filter((page) => !page.noindex);
}

/** '/contacto/' y '/contacto' son la misma página; '/' se conserva. */
export function normalizeSlug(slug) {
   const trimmed = String(slug || '/').replace(/\/+$/, '');
   return trimmed === '' ? '/' : trimmed;
}
