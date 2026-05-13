import { siteConfigData } from './site-config.jsx';

// Configuración centralizada
export const siteConfig = {
   // Datos de la configuración
   ...siteConfigData,

   // Asumimos que el entorno es producción por defecto
   environment: 'production',
   isDev: false,
   isStaging: false,
   isProduction: true,
   debugMode: false,

   // URLs dinámicas
   get siteUrl() {
      return this.urls.production;
   },

   // URL canónica (siempre producción para SEO)
   get canonicalUrl() {
      return this.urls.production;
   },

   // Control de indexación
   get noIndex() {
      return this.isStaging || this.isDev;
   },

   get robotsContent() {
      return this.seo.robots.production;
   },

   // URLs de assets
   get logoUrl() {
      return `${this.siteUrl}${this.assets.logo}`;
   },

   get defaultImage() {
      return `${this.siteUrl}${this.assets.defaultOgImage}`;
   },
};
