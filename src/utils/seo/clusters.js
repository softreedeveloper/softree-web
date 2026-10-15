/**
 * Topic clusters y mapa de keywords.
 *
 * Un cluster es un tema con una página pilar y contenido de apoyo que enlaza
 * hacia ella. Cada página del registro declara a qué cluster pertenece; el
 * validador comprueba que el cluster exista y que la pilar esté dada de alta.
 *
 * `pillar` puede apuntar a una ruta que todavía no existe: eso marca el
 * objetivo, y el validador lo reporta como pendiente, no como error. Las
 * landings de servicio viven en la raíz (/desarrollo-web, /apps-moviles…):
 * el antiguo hub /servicios se retiró y redirige a la home.
 *
 * Intenciones: informacional | comercial | transaccional | navegacional | local
 *
 * `difficulty` y `volume` son estimaciones **propias, sin datos de herramienta**.
 * Se marcan como tal y no deben presentarse como métricas reales hasta
 * conectar Search Console o una fuente de keywords (Fase 10).
 */

export const clusters = [
   {
      id: 'desarrollo-software',
      name: 'Desarrollo de software',
      pillar: '/desarrollo-web',
      description:
         'Software construido desde cero para una operación concreta: arquitectura, backend, integraciones y mantenimiento.',
      entities: ['software a medida', 'software empresarial', 'arquitectura de software', 'API', 'backend'],
   },
   {
      id: 'aplicaciones-moviles',
      name: 'Aplicaciones móviles',
      pillar: '/apps-moviles',
      description: 'Apps nativas y multiplataforma para iOS y Android, desde el diseño hasta la publicación en stores.',
      entities: ['React Native', 'Swift', 'Kotlin', 'App Store', 'Google Play'],
   },
   {
      id: 'automatizacion',
      name: 'Automatización empresarial',
      pillar: '/automatizacion',
      description: 'Conectar sistemas y eliminar trabajo manual repetitivo mediante workflows e integraciones.',
      entities: ['n8n', 'workflow', 'integración de sistemas', 'CRM', 'WhatsApp Business API'],
   },
   {
      id: 'inteligencia-artificial',
      name: 'Inteligencia artificial',
      pillar: '/inteligencia-artificial',
      description: 'Agentes, asistentes y chatbots conectados a los datos y procesos reales de la empresa.',
      entities: ['agente de IA', 'RAG', 'chatbot', 'OpenAI', 'Claude', 'LLM'],
   },
   {
      id: 'saas-cloud',
      name: 'SaaS y cloud',
      pillar: '/desarrollo-saas',
      description: 'Plataformas multiinquilino, dashboards y la infraestructura cloud que las sostiene.',
      entities: ['SaaS', 'multitenant', 'dashboard', 'PostgreSQL', 'Google Cloud', 'Supabase'],
   },
];

/**
 * Mapa de keywords. Una fila por keyword objetivo.
 *
 *   keyword     término tal y como se busca
 *   intent      intención de búsqueda
 *   landing     ruta que debe posicionar (puede no existir todavía)
 *   cluster     id del cluster
 *   priority    P0 (indexación) · P1 (alto impacto) · P2 (importante) · P3 (futuro)
 *   difficulty  estimación propia: alta | media | baja
 *   value       valor comercial estimado: alto | medio | bajo
 */
export const keywordMap = [
   // --- Desarrollo de software ---
   {
      keyword: 'desarrollo de software a medida',
      intent: 'transaccional',
      landing: '/',
      cluster: 'desarrollo-software',
      priority: 'P1',
      difficulty: 'alta',
      value: 'alto',
   },
   {
      keyword: 'empresa de desarrollo de software',
      intent: 'comercial',
      landing: '/',
      cluster: 'desarrollo-software',
      priority: 'P1',
      difficulty: 'alta',
      value: 'alto',
   },
   {
      keyword: 'software personalizado para empresas',
      intent: 'comercial',
      landing: '/',
      cluster: 'desarrollo-software',
      priority: 'P2',
      difficulty: 'media',
      value: 'alto',
   },
   {
      keyword: 'cuánto cuesta desarrollar software a medida',
      intent: 'informacional',
      landing: '/blog/cuanto-cuesta-desarrollar-software-a-medida/',
      cluster: 'desarrollo-software',
      priority: 'P1',
      difficulty: 'media',
      value: 'alto',
   },
   {
      keyword: 'desarrollo a medida vs software existente',
      intent: 'informacional',
      landing: '/blog/desarrollo-a-medida-vs-software-existente/',
      cluster: 'desarrollo-software',
      priority: 'P2',
      difficulty: 'baja',
      value: 'medio',
   },
   {
      keyword: 'desarrollo web',
      intent: 'transaccional',
      landing: '/desarrollo-web',
      cluster: 'desarrollo-software',
      priority: 'P1',
      difficulty: 'alta',
      value: 'alto',
   },
   {
      keyword: 'integración de APIs',
      intent: 'comercial',
      landing: '/automatizacion',
      cluster: 'desarrollo-software',
      priority: 'P2',
      difficulty: 'media',
      value: 'medio',
   },

   // --- Aplicaciones móviles ---
   {
      keyword: 'desarrollo de aplicaciones móviles',
      intent: 'transaccional',
      landing: '/apps-moviles',
      cluster: 'aplicaciones-moviles',
      priority: 'P1',
      difficulty: 'alta',
      value: 'alto',
   },
   {
      keyword: 'cuánto cuesta desarrollar una aplicación',
      intent: 'informacional',
      landing: '/blog/cuanto-cuesta-desarrollar-una-app/',
      cluster: 'aplicaciones-moviles',
      priority: 'P1',
      difficulty: 'media',
      value: 'alto',
   },
   {
      keyword: 'desarrollo de apps con React Native',
      intent: 'comercial',
      landing: '/apps-moviles',
      cluster: 'aplicaciones-moviles',
      priority: 'P2',
      difficulty: 'media',
      value: 'medio',
   },
   {
      keyword: 'publicar una app en App Store y Play Store',
      intent: 'informacional',
      landing: '/blog/publicar-app-stores/',
      cluster: 'aplicaciones-moviles',
      priority: 'P3',
      difficulty: 'baja',
      value: 'bajo',
   },

   // --- Automatización ---
   {
      keyword: 'automatización empresarial',
      intent: 'comercial',
      landing: '/automatizacion',
      cluster: 'automatizacion',
      priority: 'P1',
      difficulty: 'media',
      value: 'alto',
   },
   {
      keyword: 'cómo automatizar una empresa',
      intent: 'informacional',
      landing: '/blog/como-automatizar-una-empresa/',
      cluster: 'automatizacion',
      priority: 'P1',
      difficulty: 'media',
      value: 'alto',
   },
   {
      keyword: 'qué es n8n',
      intent: 'informacional',
      landing: '/blog/que-es-n8n/',
      cluster: 'automatizacion',
      priority: 'P2',
      difficulty: 'baja',
      value: 'medio',
   },
   {
      keyword: 'automatizar leads',
      intent: 'comercial',
      landing: '/blog/como-automatizar-leads/',
      cluster: 'automatizacion',
      priority: 'P2',
      difficulty: 'media',
      value: 'alto',
   },
   {
      keyword: 'integrar CRM con WhatsApp',
      intent: 'comercial',
      landing: '/blog/integrar-crm-con-whatsapp/',
      cluster: 'automatizacion',
      priority: 'P2',
      difficulty: 'media',
      value: 'alto',
   },
   {
      keyword: 'desarrollo CRM ERP a medida',
      intent: 'transaccional',
      landing: '/crm-erp',
      cluster: 'automatizacion',
      priority: 'P1',
      difficulty: 'alta',
      value: 'alto',
   },

   // --- Inteligencia artificial ---
   {
      keyword: 'agentes de inteligencia artificial',
      intent: 'comercial',
      landing: '/inteligencia-artificial',
      cluster: 'inteligencia-artificial',
      priority: 'P1',
      difficulty: 'media',
      value: 'alto',
   },
   {
      keyword: 'qué es un agente de IA',
      intent: 'informacional',
      landing: '/blog/que-es-un-agente-de-ia/',
      cluster: 'inteligencia-artificial',
      priority: 'P1',
      difficulty: 'media',
      value: 'medio',
   },
   {
      keyword: 'chatbot empresarial con IA',
      intent: 'comercial',
      landing: '/inteligencia-artificial',
      cluster: 'inteligencia-artificial',
      priority: 'P2',
      difficulty: 'media',
      value: 'alto',
   },
   {
      keyword: 'automatización con inteligencia artificial',
      intent: 'comercial',
      landing: '/inteligencia-artificial',
      cluster: 'inteligencia-artificial',
      priority: 'P2',
      difficulty: 'media',
      value: 'alto',
   },

   // --- SaaS y cloud ---
   {
      keyword: 'desarrollo SaaS',
      intent: 'comercial',
      landing: '/desarrollo-saas',
      cluster: 'saas-cloud',
      priority: 'P1',
      difficulty: 'media',
      value: 'alto',
   },
   {
      keyword: 'cuándo conviene desarrollar un SaaS',
      intent: 'informacional',
      landing: '/blog/cuando-conviene-desarrollar-un-saas/',
      cluster: 'saas-cloud',
      priority: 'P2',
      difficulty: 'baja',
      value: 'medio',
   },
   {
      keyword: 'servicios cloud para empresas',
      intent: 'comercial',
      landing: '/cloud',
      cluster: 'saas-cloud',
      priority: 'P2',
      difficulty: 'alta',
      value: 'medio',
   },
   {
      keyword: 'consultoría de software',
      intent: 'comercial',
      landing: '/consultoria-software',
      cluster: 'saas-cloud',
      priority: 'P3',
      difficulty: 'media',
      value: 'medio',
   },
];

export function getCluster(id) {
   return clusters.find((cluster) => cluster.id === id);
}

export function getKeywordsForCluster(id) {
   return keywordMap.filter((row) => row.cluster === id);
}

/** Keywords cuya landing todavía no existe en el registro: el backlog de contenido. */
export function getPendingLandings(existingSlugs) {
   const existing = new Set(existingSlugs.map((slug) => slug.replace(/\/+$/, '') || '/'));
   return keywordMap.filter((row) => !existing.has(row.landing.replace(/\/+$/, '') || '/'));
}
