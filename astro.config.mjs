import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
// import tailwindcss from "@tailwindcss/vite";
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

export default defineConfig({
   integrations: [tailwind(), react()],

   // Deben coincidir con urls.production y urls.trailingSlash de src/utils/site-config.js.
   // Con build.format 'file' el build genera contacto.html y Netlify sirve /contacto sin
   // redirigir a /contacto/ (pretty URLs): misma forma que la canónica y el sitemap.
   site: 'https://softree.com.mx',
   trailingSlash: 'never',

   vite: {
      // plugins: [tailwindcss()],
      resolve: {
         alias: {
            '@': '/src/',
            '@components': '/src/components/',
            '@layouts': '/src/layouts/',
            '@pages': '/src/pages/',
            '@styles': '/src/styles/',
            '@assets': '/src/assets/',
            '@hooks': '/src/hooks/',
            '@utils': '/src/utils/',
            '@api': '/src/api/',
            '@constants': '/src/constants/',
            '@sections': '/src/sections/',
            '@data': '/src/data/',
         },
      },
      // assetsInclude: ['**/*.json']
   },
   output: 'server',
   adapter: netlify(),
   build: {
      inlineStylesheets: 'auto',
      format: 'file',
   },
   server: {
      // host: '192.168.3.143', //'192.168.3.143', // host: true,
      port: 7002,
      headers: {
         'X-Frame-Options': 'SAMEORIGIN',
         'X-Content-Type-Options': 'nosniff',
         'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
   },
});
