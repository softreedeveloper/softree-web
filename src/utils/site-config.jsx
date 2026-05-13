// Configuración del sitio en JavaScript (en lugar de JSON)
export const siteConfigData = {
   site: {
      name: 'Softree',
      title: 'Softree | Software a medida',
      description:
         'Softree desarrolla software a medida: aplicaciones móviles, plataformas web, CRM/ERP, soluciones cloud y consultoría técnica. Transformamos ideas en productos digitales de alto rendimiento.',
      keywords:
         'desarrollo de software a medida, aplicaciones móviles, plataformas web, CRM, ERP, cloud, consultoría técnica, UI/UX, software México, Astro, React, Flutter, Next.js',
      author: 'Softree',
      locale: 'es_MX',
      language: 'es',
   },
   urls: {
      production: 'https://softree.com.mx/',
      staging: 'https://stage.softree.com.mx',
      development: 'http://localhost:7002',
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
      serviceType: 'Custom software development',
      availableLanguage: 'Spanish',
   },
   seo: {
      robots: {
         staging: 'noindex, nofollow',
         production: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      },
      themeColor: '#1e5c80',
   },
};
