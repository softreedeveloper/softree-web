// Configuración del sitio en JavaScript (en lugar de JSON)
export const siteConfigData = {
   site: {
      name: 'Softree',
      title: 'Softree | Limpieza Profesional en CDMX',
      description:
         'Softree ofrece servicios profesionales de limpieza residencial, comercial y de oficinas en Ciudad de México. Personal capacitado, productos ecológicos y resultados garantizados.',
      keywords:
         'limpieza profesional, limpieza residencial, limpieza comercial, limpieza de oficinas, limpieza CDMX, servicio de limpieza Ciudad de México, limpieza post-obra, empresa de limpieza México',
      author: 'Softree',
      locale: 'es_MX',
      language: 'es',
   },
   urls: {
      production: 'https://softree.com.mx/',
      staging: 'https://stage.softree.com.mx',
      development: 'http://localhost:7001',
   },
   social: {
      instagram: 'https://www.instagram.com/softree/',
   },
   contacto: {
      WHATSAPP: '+5215636663808',
      EMAIL: 'atencion_clientes@softree.com.mx',
      TELEFONO: '+525636663808',
      DIRECCION: 'Cuautitlán Izcalli, Estado de México, México',
   },
   footer: {
      COPYRIGHT: 'Softree © - Todos Los Derechos Reservados - 2026',
   },
   assets: {
      logo: ' /img/Logo.png',
      logoshort: ' /img/softree_logo.png', 
      defaultOgImage: '/img/default-og-image.jpg',
      favicon: '/img/softree_ico.ico',
   },
   business: {
      country: 'Mexico',
      serviceType: 'Servicios',
      availableLanguage: 'Spanish',
   },
   seo: {
      robots: {
         staging: 'noindex, nofollow',
         production: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      },
      themeColor: '#1a365d',
   },
};
