/** @type {import('tailwindcss').Config} */
export default {
   darkMode: 'class',
   theme: {
      extend: {
         fontFamily: {
            mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
         },

         colors: {
            debug: '#00ffff',
            background_top: '#fffffff',
            background_bottom: '#fffffff',
            text_banner: '#fffffff',
            line_cards: '#ffffff',

            // Softree accent – escala verde derivada del tono base #27a317 (= accent-500)
            accent: {
               50: '#f1fbef',
               100: '#ddf5d8',
               200: '#bdeab4',
               300: '#8ed87f',
               400: '#5bbf48',
               500: '#27a317',
               600: '#1f8512',
               700: '#1a6911',
               800: '#185313',
               900: '#164514',
               950: '#062605',
            },
            ink: {
               DEFAULT: '#0A0A0A',
               muted: '#52525B',
            },
            cream: '#f0f8fd',
            dark: '#081b27',
         },
         keyframes: {
            slideUp: {
               '0%': { transform: 'translateY(100%)' },
               '100%': { transform: 'translateY(0)' },
            },
            slideDown: {
               '0%': { transform: 'translateY(0)' },
               '100%': { transform: 'translateY(100%)' },
            },
            marquee: {
               '0%': { transform: 'translateX(0)' },
               '100%': { transform: 'translateX(-50%)' },
            },
            fadeInUp: {
               '0%': { opacity: '0', transform: 'translateY(20px)' },
               '100%': { opacity: '1', transform: 'translateY(0)' },
            },
         },
         animation: {
            slideUp: 'slideUp 0.3s ease-out forwards',
            slideDown: 'slideDown 0.3s ease-in forwards',
            marquee: 'marquee 30s linear infinite',
            'marquee-slow': 'marquee 50s linear infinite',
            fadeInUp: 'fadeInUp 0.7s ease-out forwards',
         },
      },
   },
   content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
   plugins: [],
};
