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

            // Softree brand colors – steel blue palette (anchor: #64afd5)
            brand: {
               50: '#f0f8fd',
               100: '#d9eef8',
               200: '#b0dbf1',
               300: '#7fc3e8',
               400: '#64afd5',
               500: '#3a94c2',
               600: '#2878a4',
               700: '#1e5c80',
               800: '#154360',
               900: '#0e2d40',
               950: '#081b27',
            },
            accent: {
               50: '#ECFDF5',
               100: '#D1FAE5',
               200: '#A7F3D0',
               300: '#6EE7B7',
               400: '#34D399',
               500: '#10B981',
               600: '#059669',
               700: '#047857',
               800: '#065F46',
               900: '#064E3B',
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
