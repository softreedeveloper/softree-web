/**
 * Datos crudos del sitio. ÚNICO archivo donde se escriben nombre, dominios,
 * contacto, dirección, redes y assets. Todo lo demás (meta tags, Schema,
 * sitemap, robots, llms.txt, footer, botones de contacto) lee de aquí.
 *
 * Sin lógica: la lógica vive en config.js. Un campo desconocido se deja ''
 * y los constructores de Schema no lo emiten. Toda ruta de `assets` debe
 * existir en public/ (el validador lo comprueba).
 */
export const siteConfigData = {
   site: {
      name: 'Softree',
      legalName: 'SOFTREE, S.A. de C.V.',
      title: 'Softree | Software a medida',
      description:
         'Softree desarrolla software a medida: aplicaciones móviles, plataformas web, CRM/ERP, soluciones cloud y consultoría técnica. Transformamos ideas en productos digitales de alto rendimiento.',
      author: 'Softree',
      locale: 'es_MX',
      language: 'es-MX',
   },
   urls: {
      // Sin barra final: las URLs absolutas se construyen con absoluteUrl() en config.js
      production: 'https://softree.com.mx',
      staging: 'https://stage.softree.com.mx',
      development: 'http://localhost:7002',
      // Política de barra final. Debe coincidir con `trailingSlash` de astro.config.mjs
      // ('never' ↔ false). La usan canonical, sitemap, breadcrumbs, Schema y el validador.
      trailingSlash: false,
   },
   social: {
      instagram: 'https://www.instagram.com/softree/',
   },
   contacto: {
      WHATSAPP: '+525654711884',
      EMAIL: 'contacto@softree.com.mx',
      TELEFONO: '+525654711884',
      DIRECCION: 'Estado de Mexico, México',
   },
   // Dirección fiscal declarada en el aviso de privacidad → PostalAddress del Organization.
   address: {
      street: '',
      locality: 'Cuautitlan Izcalli',
      region: 'Estado de México',
      postalCode: '54743',
      country: 'MX',
   },
   footer: {
      COPYRIGHT: 'Softree © - Todos Los Derechos Reservados - 2026',
   },
   assets: {
      // Logo horizontal (isotipo + wordmark sobre blanco): OG, schema y aviso
      // de privacidad. El header/footer usan el isotipo + wordmark en texto.
      // Dimensiones REALES de cada archivo (las usan el Schema y las etiquetas de imagen).
      logo: '/img/softree-logo.png',
      logoWidth: 1354,
      logoHeight: 348,
      isotipo: '/img/softree-isotipo.png',
      isotipoWidth: 465,
      isotipoHeight: 512,
      defaultOgImage: '/img/og-default.jpg',
      favicon: '/favicon.ico',
   },
   business: {
      // Tipo de Schema de la entidad: 'Organization' | 'LocalBusiness' | 'ProfessionalService'…
      schemaType: 'Organization',
      foundingDate: '',
      areaServed: 'Mexico',
      serviceType: 'Custom software development',
      contactType: 'customer support',
      availableLanguage: ['Spanish', 'English'],
   },
   seo: {
      robots: {
         staging: 'noindex, nofollow',
         production: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      },
      themeColor: '#27a317',
   },
};
