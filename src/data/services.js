export const services = [
   {
      number: '01',
      title: 'Aplicaciones a la medida',
      description: 'Desarrollamos software desde cero en el lenguaje y framework que tu proyecto necesite. Sin atajos, sin templates genéricos.',
      stack: ['Python', 'TypeScript', 'Dart', 'Swift', 'Kotlin', 'React', 'Next.js', 'Flutter', 'Node.js'],
      snippet: [
         { type: 'com', text: '// Stack a la medida' },
         { type: 'line', parts: [{ k: 'stack' }, { s: ':' }, { v: '"any"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'delivery' }, { s: ':' }, { v: '"weeks"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'quality' }, { s: ':' }, { v: '"production"' }] },
      ],
   },
   {
      number: '02',
      title: 'Aplicaciones Móviles',
      description: 'Apps nativas para iOS y Android. Publicación en App Store / Play Store y soporte post-lanzamiento incluido.',
      stack: ['Flutter', 'Swift', 'Kotlin', 'React Native'],
      snippet: [
         { type: 'com', text: '// Plataformas soportadas' },
         { type: 'line', parts: [{ k: 'platforms' }, { s: ':' }, { v: '["iOS","Android"]' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'store' }, { s: ':' }, { v: 'true' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'support' }, { s: ':' }, { v: '"12m"' }] },
      ],
   },
   {
      number: '03',
      title: 'Sistemas CRM / ERP',
      description: 'Contratos digitales, cobros automáticos, control de mora, reportes PDF y permisos por rol. Todo bajo tu marca.',
      stack: ['PostgreSQL', 'Node.js', 'Next.js', 'Stripe'],
      snippet: [
         { type: 'com', text: '// Capacidades core' },
         { type: 'line', parts: [{ k: 'roles' }, { s: ':' }, { v: '["admin","ops","cliente"]' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'payments' }, { s: ':' }, { v: '"automated"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'reports' }, { s: ':' }, { v: '"pdf+csv"' }] },
      ],
   },
   {
      number: '04',
      title: 'Plataformas Web & SaaS',
      description: 'Dashboards de cliente, portales corporativos y plataformas escalables con datos en tiempo real.',
      stack: ['Next.js', 'React', 'GraphQL', 'PostgreSQL'],
      snippet: [
         { type: 'com', text: '// Arquitectura SaaS' },
         { type: 'line', parts: [{ k: 'realtime' }, { s: ':' }, { v: 'true' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'tenancy' }, { s: ':' }, { v: '"multi"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'scale' }, { s: ':' }, { v: '"horizontal"' }] },
      ],
   },
   {
      number: '05',
      title: 'Cloud e Integraciones',
      description: 'Firebase, AWS, Cloud Functions, pasarelas de pago, emails transaccionales y APIs robustas.',
      stack: ['Firebase', 'AWS', 'GCP', 'Stripe', 'SendGrid'],
      snippet: [
         { type: 'com', text: '// Infraestructura' },
         { type: 'line', parts: [{ k: 'region' }, { s: ':' }, { v: '"us-central1"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'autoScale' }, { s: ':' }, { v: 'true' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'uptime' }, { s: ':' }, { v: '"99.9%"' }] },
      ],
   },
   {
      number: '06',
      title: 'Diseño UI/UX',
      description: 'Prototipos interactivos en Figma, testing con usuarios reales y sistemas de diseño consistentes.',
      stack: ['Figma', 'Framer', 'Storybook'],
      snippet: [
         { type: 'com', text: '// Proceso de diseño' },
         { type: 'line', parts: [{ k: 'discovery' }, { s: ':' }, { v: '"workshops"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'prototype' }, { s: ':' }, { v: '"figma+code"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'testing' }, { s: ':' }, { v: '"users+metrics"' }] },
      ],
   },
   {
      number: '07',
      title: 'Consultoría Técnica',
      description: 'Auditoría de código, arquitectura, optimización de performance y mentoring de equipos técnicos.',
      stack: ['SonarQube', 'Lighthouse', 'OpenTelemetry'],
      snippet: [
         { type: 'com', text: '// Áreas de auditoría' },
         { type: 'line', parts: [{ k: 'code' }, { s: ':' }, { v: '"review+refactor"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'arch' }, { s: ':' }, { v: '"scalability"' }, { s: ',' }] },
         { type: 'line', parts: [{ k: 'team' }, { s: ':' }, { v: '"mentoring"' }] },
      ],
   },
];

export const servicesValueProps = [
   'Resultados visibles semanalmente con sprints cortos.',
   'Comunicación directa con desarrolladores (sin intermediarios).',
   'Código fuente 100% del cliente, documentado.',
   'Soporte post-entrega de 12 meses incluido.',
];
