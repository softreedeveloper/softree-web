import countries from '../utils/configCountries.json';

export const getCountry = async (defaultCode = 'MX') => {
   try {
      const res = await fetch(import.meta.env.PUBLIC_IPAPI_LINK);
      const data = await res.json();
      const codigo = data.country_code?.toUpperCase() || defaultCode;

      //  const codigo = defaultCode;

      return {
         country: codigo || 'MX',
         config: countries[codigo] || countries['MX'],
      };
   } catch (error) {
      console.warn('No se pudo detectar país, usando por defecto:', defaultCode);
      return {
         country: 'MX',
         config: countries['MX'],
      };
   }
};


