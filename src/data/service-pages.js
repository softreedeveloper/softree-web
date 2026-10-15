/**
 * Contenido de las landings de servicio: /desarrollo-web, /apps-moviles,
 * /automatizacion e /inteligencia-artificial.
 *
 * Cada entrada alimenta `sections/ServiceLanding.astro`. El title, la
 * description y el H1 viven en `utils/seo/registry.js`; aquí solo va lo que
 * se ve en el cuerpo de la página. `h1.lead` + `h1.highlight` debe coincidir
 * con el `h1` declarado en el registro para esa ruta.
 *
 * `snippet` usa el mismo formato de tokens que el resto de `src/data`:
 * `{ type: 'com', text }` para comentarios y `{ type: 'line', parts: [{k},{s},{v}] }`
 * para clave / separador / valor.
 *
 * Las FAQs se renderizan visibles y, solo por eso, se emiten como FAQPage.
 */

export const servicePages = [
   {
      slug: '/desarrollo-web',
      eyebrow: 'Desarrollo web',
      h1: { lead: 'Plataformas web que escalan', highlight: 'con tu negocio' },
      intro: 'Portales de cliente, dashboards administrativos, sitios corporativos y productos SaaS. Construidos con Next.js, React y Astro sobre una arquitectura pensada para crecer desde el primer día.',
      icon: 'monitor',
      fileName: 'plataforma-web.config.ts',
      snippet: [
         { type: 'com', text: '// Arquitectura de la plataforma' },
         { type: 'line', parts: [{ k: 'framework' }, { s: ':' }, { v: '"next.js"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'rendering' }, { s: ':' }, { v: '"ssr+static"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'realtime' }, { s: ':' }, { v: 'true' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'tenancy' }, { s: ':' }, { v: '"multi"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'lighthouse' }, { s: ':' }, { v: '"90+"' }] },
      ],
      features: [
         {
            t: 'Portales de cliente y dashboards',
            d: 'Cada usuario ve solo su información: proyectos, contratos, pagos, documentos y KPIs con gráficos interactivos y exportación a PDF.',
         },
         {
            t: 'Productos SaaS multiinquilino',
            d: 'Planes, suscripciones y facturación con Stripe o Mercado Pago. Aislamiento de datos por cliente y panel de administración.',
         },
         {
            t: 'Sitios corporativos rápidos y posicionables',
            d: 'Astro y Next.js con renderizado estático o híbrido, Core Web Vitals en verde y SEO técnico resuelto desde la base.',
         },
         {
            t: 'Integrado con lo que ya usas',
            d: 'APIs REST y GraphQL, autenticación, pasarelas de pago, correo transaccional y sincronización con tu CRM o ERP.',
         },
      ],
      stack: ['Next.js', 'React', 'Astro', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL', 'Firebase', 'Vercel'],
      process: [
         { n: '01', l: 'Descubrimiento y wireframes', t: '1–2 semanas' },
         { n: '02', l: 'Diseño de interfaz', t: '2–3 semanas' },
         { n: '03', l: 'Desarrollo por sprints', t: '2–4 meses' },
         { n: '04', l: 'QA, deploy y soporte', t: 'continuo' },
      ],
      faqs: [
         {
            question: '¿Qué diferencia una plataforma web a medida de un sitio en WordPress?',
            answer:
               'Un CMS genérico sirve para publicar contenido. Una plataforma a medida modela tu operación: usuarios con roles, datos propios, reglas de negocio e integraciones. El código es tuyo y no dependes de plugins de terceros.',
         },
         {
            question: '¿Cuánto tarda el desarrollo de una plataforma web?',
            answer:
               'Un portal de cliente o un dashboard suele estar en producción entre dos y cuatro meses. Trabajamos en sprints de dos semanas con entregas visibles, así que el alcance se ajusta sobre la marcha.',
         },
         {
            question: '¿Puedo empezar con algo pequeño y ampliarlo después?',
            answer:
               'Sí. Diseñamos la arquitectura para que la primera versión salga rápido y las siguientes fases no obliguen a reescribir. Es el enfoque habitual en los SaaS que construimos.',
         },
      ],
      schema: {
         name: 'Desarrollo web a medida',
         description:
            'Desarrollo de plataformas web, portales de cliente, dashboards y productos SaaS con Next.js, React y Astro.',
         serviceType: 'Desarrollo web',
      },
   },
   {
      slug: '/apps-moviles',
      eyebrow: 'Aplicaciones móviles',
      h1: { lead: 'Apps móviles listas', highlight: 'para las tiendas' },
      intro: 'Aplicaciones para iOS y Android con React Native: una sola base de código, rendimiento nativo y publicación en App Store y Google Play incluida. Del prototipo en Figma a la app en manos de tus clientes.',
      icon: 'smartphone',
      fileName: 'app-movil.config.ts',
      snippet: [
         { type: 'com', text: '// Plataformas y publicación' },
         { type: 'line', parts: [{ k: 'platforms' }, { s: ':' }, { v: '["iOS", "Android"]' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'framework' }, { s: ':' }, { v: '"react-native"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'push' }, { s: ':' }, { v: 'true' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'payments' }, { s: ':' }, { v: '"in-app"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'storeRelease' }, { s: ':' }, { v: '"included"' }] },
      ],
      features: [
         {
            t: 'Una base de código, dos plataformas',
            d: 'React Native con TypeScript y Expo: la app corre de forma nativa en iOS y Android sin mantener dos equipos ni dos proyectos.',
         },
         {
            t: 'Publicación completa en las tiendas',
            d: 'Cuentas de desarrollador, perfiles de firma, capturas, fichas optimizadas (ASO) y envío a revisión en App Store y Google Play.',
         },
         {
            t: 'Notificaciones, chat y pagos',
            d: 'Push segmentado, mensajería en tiempo real, compras dentro de la app y suscripciones con pasarelas locales e internacionales.',
         },
         {
            t: 'Backend y panel de administración',
            d: 'La app no vive sola: API, base de datos, autenticación y un panel web para operar el negocio desde el escritorio.',
         },
      ],
      stack: [
         'React Native',
         'Expo',
         'TypeScript',
         'Swift',
         'Kotlin',
         'Firebase',
         'Push Notifications',
         'In-App Purchases',
      ],
      process: [
         { n: '01', l: 'Descubrimiento', t: '1–2 semanas' },
         { n: '02', l: 'Diseño UI/UX en Figma', t: '3–4 semanas' },
         { n: '03', l: 'Desarrollo por sprints', t: '3–6 meses' },
         { n: '04', l: 'Testing y publicación', t: '2–3 semanas' },
      ],
      faqs: [
         {
            question: '¿React Native o desarrollo nativo puro?',
            answer:
               'Para la mayoría de apps de negocio React Native da rendimiento nativo con la mitad del esfuerzo. Recurrimos a Swift o Kotlin cuando la app exige hardware específico, gráficos intensivos o SDKs sin soporte multiplataforma.',
         },
         {
            question: '¿Se encargan de publicar la app en App Store y Google Play?',
            answer:
               'Sí. Creamos o configuramos las cuentas de desarrollador a nombre de tu empresa, preparamos las fichas y gestionamos la revisión hasta que la app está publicada.',
         },
         {
            question: '¿Qué pasa después del lanzamiento?',
            answer:
               'Doce meses de soporte incluidos: actualizaciones por cambios de iOS y Android, corrección de errores y monitoreo. Las nuevas funcionalidades se planifican como fases adicionales.',
         },
      ],
      schema: {
         name: 'Desarrollo de aplicaciones móviles',
         description:
            'Desarrollo de apps para iOS y Android con React Native, incluida la publicación en App Store y Google Play y el soporte posterior.',
         serviceType: 'Desarrollo de aplicaciones móviles',
      },
   },
   {
      slug: '/automatizacion',
      eyebrow: 'Automatización',
      h1: { lead: 'Procesos que se', highlight: 'ejecutan solos' },
      intro: 'Conectamos tus sistemas y eliminamos el trabajo manual repetitivo: formularios que crean registros en el CRM, pagos que se concilian, reportes que se generan y avisos que salen a tiempo. Con n8n, APIs y webhooks.',
      icon: 'cloud',
      fileName: 'workflow.config.ts',
      snippet: [
         { type: 'com', text: '// Flujo: lead → CRM → WhatsApp' },
         { type: 'line', parts: [{ k: 'trigger' }, { s: ':' }, { v: '"form.submitted"' }, { s: ',' }] },
         {
            type: 'line',
            parts: [{ k: 'steps' }, { s: ':' }, { v: '["crm.create", "score", "whatsapp.send"]' }, { s: ',' }],
         },
         { type: 'line', parts: [{ k: 'engine' }, { s: ':' }, { v: '"n8n"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'retries' }, { s: ':' }, { v: '3' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'alerts' }, { s: ':' }, { v: '"slack"' }] },
      ],
      features: [
         {
            t: 'Integración entre sistemas',
            d: 'CRM, ERP, hojas de cálculo, formularios, pasarelas de pago y bases de datos hablando entre sí mediante APIs y webhooks.',
         },
         {
            t: 'Flujos con n8n o Make',
            d: 'Automatizaciones visuales, versionadas y monitorizadas. Cuando un paso falla, reintenta y avisa; nadie se entera por un cliente.',
         },
         {
            t: 'Cobros, avisos y conciliación',
            d: 'Recordatorios de pago, cálculo de mora, confirmaciones por WhatsApp o correo y conciliación automática contra la pasarela.',
         },
         {
            t: 'Reportes que se generan solos',
            d: 'Extracción y consolidación periódica de datos, PDFs y paneles actualizados sin que nadie exporte nada a mano.',
         },
      ],
      stack: [
         'n8n',
         'Make',
         'Node.js',
         'Python',
         'Webhooks',
         'REST APIs',
         'Cloud Functions',
         'WhatsApp Business API',
         'Stripe',
      ],
      process: [
         { n: '01', l: 'Mapeo del proceso actual', t: '1–2 semanas' },
         { n: '02', l: 'Diseño del flujo', t: '1 semana' },
         { n: '03', l: 'Integración y pruebas', t: '2–6 semanas' },
         { n: '04', l: 'Monitoreo y ajustes', t: 'continuo' },
      ],
      faqs: [
         {
            question: '¿Qué procesos conviene automatizar primero?',
            answer:
               'Los que se repiten a diario, dependen de copiar datos entre herramientas y fallan cuando alguien se olvida: captura de leads, seguimiento comercial, cobros y reportes. Empezamos por el de mayor impacto y menor riesgo.',
         },
         {
            question: '¿Necesito cambiar mis herramientas actuales?',
            answer:
               'No. La automatización se construye sobre lo que ya usas. Si una herramienta no tiene API, buscamos la vía de integración disponible antes de proponer un cambio.',
         },
         {
            question: '¿Qué pasa si un flujo falla?',
            answer:
               'Cada flujo lleva reintentos, registro de ejecuciones y alertas. Sabes qué falló, con qué dato y cuándo, y puedes relanzarlo sin perder información.',
         },
      ],
      schema: {
         name: 'Automatización empresarial e integraciones',
         description:
            'Automatización de procesos e integración de sistemas con n8n, APIs y webhooks: CRM, pagos, mensajería y reportes.',
         serviceType: 'Automatización de procesos',
      },
   },
   {
      slug: '/inteligencia-artificial',
      eyebrow: 'Inteligencia artificial',
      h1: { lead: 'IA conectada a', highlight: 'tu operación real' },
      intro: 'Agentes, asistentes y chatbots que consultan tus datos, usan tus herramientas y ejecutan tareas de verdad. Con GPT-4o, Claude, Gemini o modelos abiertos, desplegados en producción y bajo control.',
      icon: 'bot',
      fileName: 'agente.config.ts',
      snippet: [
         { type: 'com', text: '// Agente con memoria y herramientas' },
         { type: 'line', parts: [{ k: 'model' }, { s: ':' }, { v: '"claude-sonnet"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'knowledge' }, { s: ':' }, { v: '"rag:docs+faq"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'tools' }, { s: ':' }, { v: '["crm", "calendar", "email"]' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'memory' }, { s: ':' }, { v: 'true' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'guardrails' }, { s: ':' }, { v: '"strict"' }] },
      ],
      features: [
         {
            t: 'Agentes con herramientas',
            d: 'Consultan el CRM, agendan citas, envían correos o crean tickets. Razonan sobre el contexto y ejecutan, no solo responden.',
         },
         {
            t: 'Chatbots con RAG sobre tus documentos',
            d: 'Respuestas precisas a partir de tus manuales, FAQs y tickets históricos, con citas a la fuente y sin inventar.',
         },
         {
            t: 'Procesamiento de datos con IA',
            d: 'Clasificación de correos, extracción de datos de facturas y contratos, resúmenes y reportes generados automáticamente.',
         },
         {
            t: 'Evaluación, costos y control',
            d: 'Pruebas de calidad antes de salir a producción, límites de gasto por modelo, registro de conversaciones y supervisión humana donde toca.',
         },
      ],
      stack: ['OpenAI', 'Claude', 'Gemini', 'DeepSeek', 'LangChain', 'Python', 'Pinecone', 'Supabase', 'n8n'],
      process: [
         { n: '01', l: 'Caso de uso y datos', t: '1–2 semanas' },
         { n: '02', l: 'Prototipo evaluable', t: '1–2 semanas' },
         { n: '03', l: 'Integración y guardrails', t: '2–6 semanas' },
         { n: '04', l: 'Producción y monitoreo', t: 'continuo' },
      ],
      faqs: [
         {
            question: '¿Qué diferencia un agente de IA de un chatbot tradicional?',
            answer:
               'Un chatbot sigue un árbol de opciones fijo. Un agente entiende lenguaje natural, consulta información actualizada y puede ejecutar acciones en tus sistemas: crear un pedido, agendar, escalar a una persona.',
         },
         {
            question: '¿Mis datos se usan para entrenar modelos de terceros?',
            answer:
               'No. Trabajamos con las APIs empresariales de los proveedores, que no entrenan con tus datos, y cuando el caso lo exige desplegamos modelos abiertos en tu propia infraestructura.',
         },
         {
            question: '¿Cómo evitan que la IA responda cosas incorrectas?',
            answer:
               'Con RAG sobre fuentes controladas, instrucciones y límites explícitos, evaluaciones automáticas antes de cada despliegue y derivación a una persona cuando la confianza es baja.',
         },
      ],
      schema: {
         name: 'Agentes de inteligencia artificial para empresas',
         description:
            'Agentes de IA, chatbots con RAG y asistentes conectados a los datos y sistemas de la empresa, desplegados en producción.',
         serviceType: 'Inteligencia artificial aplicada',
      },
   },
];

export function getServicePage(slug) {
   const normalized = String(slug || '/').replace(/\/+$/, '') || '/';
   return servicePages.find((page) => page.slug === normalized);
}
