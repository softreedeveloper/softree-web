/** @type {import('tailwindcss').Config} */
export default {
   theme: {
      extend: {
         // fontFamily: {
         //    montserrat: ['Montserrat', 'sans-serif'],
         // },

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
         },
         animation: {
            slideUp: 'slideUp 0.3s ease-out forwards',
            slideDown: 'slideDown 0.3s ease-in forwards',
         },
      },
   },
   content: [
      './src/**/*.{astro,html,js,jsx,ts,tsx}',
      './components/**/*.{astro,js,jsx,ts,tsx}',
      './layouts/**/*.{astro,js,jsx,ts,tsx}',
      './sections/**/*.{astro,js,jsx,ts,tsx}',
   ],
   plugins: [],
};
