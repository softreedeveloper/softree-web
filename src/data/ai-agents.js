// Sección «Agentes de IA» de la home (`sections/AIAgents.astro`).
// Casos de uso de agentes que desplegamos y el ciclo con el que trabajan.

export const aiAgents = [
   {
      icon: 'chat',
      title: 'Agente de ventas y atención',
      channel: 'WhatsApp · Web · Instagram',
      description:
         'Responde al instante, califica el lead, cotiza con tus reglas y agenda la cita en tu calendario. Escala a una persona cuando hace falta.',
      outcomes: ['Respuesta en segundos, 24/7', 'Leads calificados directo al CRM'],
   },
   {
      icon: 'book',
      title: 'Soporte con tu conocimiento',
      channel: 'RAG sobre manuales, políticas y tickets',
      description:
         'Contesta con la información de tu empresa, cita la fuente y no inventa. Aprende de cada ticket resuelto por tu equipo.',
      outcomes: ['Menos tickets repetidos', 'Respuestas consistentes en todos los canales'],
   },
   {
      icon: 'file',
      title: 'Back-office de documentos',
      channel: 'Facturas · Contratos · Correos',
      description:
         'Lee lo que llega a tu bandeja, extrae los datos, los valida contra tus reglas y los carga en tu ERP o CRM sin captura manual.',
      outcomes: ['Cero captura manual', 'Errores detectados antes de contabilizar'],
   },
   {
      icon: 'chart',
      title: 'Analista de datos y reportes',
      channel: 'Bases de datos · Hojas de cálculo · BI',
      description:
         'Pregúntale a tus datos en lenguaje natural. Genera el reporte semanal, detecta desviaciones y se lo envía a quien corresponde.',
      outcomes: ['Reportes que se generan solos', 'Alertas cuando un indicador se sale de rango'],
   },
];

// Ciclo de un agente: lo que lo distingue de un chatbot de opciones fijas.
export const agentLoop = [
   { step: 'Percibe', description: 'Recibe el mensaje, el correo o el evento del sistema.' },
   { step: 'Razona', description: 'Consulta tu base de conocimiento y tus datos para decidir qué hacer.' },
   { step: 'Actúa', description: 'Usa herramientas reales: CRM, calendario, pagos, correo, ERP.' },
   { step: 'Supervisado', description: 'Registra cada paso y escala a una persona cuando la confianza es baja.' },
];

// Registro de ejemplo que se muestra en el panel de la sección.
export const agentLog = [
   { type: 'in', text: 'mensaje recibido · WhatsApp · "¿tienen disponible el modelo X?"' },
   { type: 'think', text: 'consulta inventario y lista de precios' },
   { type: 'act', text: 'cotización enviada · PDF con tus condiciones' },
   { type: 'act', text: 'cita agendada · jueves 10:30 · Google Calendar' },
   { type: 'ok', text: 'lead calificado y registrado en el CRM' },
];
