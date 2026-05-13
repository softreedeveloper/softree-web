import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
// import tailwindcss from "@tailwindcss/vite";
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

export default defineConfig({
   integrations: [tailwind(), react()],

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
         },
      },
      // assetsInclude: ['**/*.json']
   },
   output: 'server',
   adapter: netlify(),
   build: {
      inlineStylesheets: 'auto',
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
