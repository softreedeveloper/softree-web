export function useMetaPixel(pixelId) {
   const trackPurchase = async (value, currency, contentIds, additionalData = {}) => {
      if (typeof window !== 'undefined' && window.metaPixel) {
         // Extraer información del usuario desde el formulario o contexto
         const userEmail = additionalData.email || '';
         const userPhone = additionalData.phone || '';
         const userName = additionalData.name || '';
         const userPostalCode = additionalData.postalCode || '';

         return await window.metaPixel.track(
            'Purchase',
            {
               // Parámetros básicos
               value: parseFloat(value),
               currency: currency,
               content_ids: contentIds,
               content_type: 'product',
               num_items: contentIds.length,

               // Información del producto mejorada
               content_name: additionalData.productName || contentIds[0] || 'El Hack',
               content_category: 'digital_solution',

               // Información de la transacción
               order_id: additionalData.orderId || `order-${Date.now()}`,

               // Información del contexto
               event_source_url: window.location.href,
               page_title: document.title,

               // Datos adicionales para optimización
               predicted_ltv: additionalData.predictedLtv || value * 1.5, // Valor de vida estimado
               purchase_method: additionalData.paymentMethod || 'mercadopago',
               country: additionalData.country || 'MX',

               // Custom parameters para segmentación
               customer_type: additionalData.customerType || 'new_customer',
               product_quantity: additionalData.quantity || 1,
               unit_price: additionalData.unitPrice || parseFloat(value),
            },
            {
               // Datos del usuario hasheados automáticamente por el servidor
               em: userEmail ? [userEmail] : undefined,
               ph: userPhone ? [userPhone.replace(/\D/g, '')] : undefined, // Solo números
               fn: userName ? [userName.split(' ')[0]] : undefined, // Primer nombre
               ln: userName ? [userName.split(' ').slice(1).join(' ')] : undefined, // Apellidos
               zp: userPostalCode ? [userPostalCode] : undefined,
               ct: additionalData.city ? [additionalData.city] : undefined,
               st: additionalData.state ? [additionalData.state] : undefined,
               country: additionalData.country ? [additionalData.country] : undefined,
            },
         );
      } else {
         console.warn('Meta Pixel not available');
         return null;
      }
   };

   const trackInitiateCheckout = async (value, currency, contentIds, additionalData = {}) => {
      if (typeof window !== 'undefined' && window.metaPixel) {
         return await window.metaPixel.track(
            'InitiateCheckout',
            {
               // Parámetros básicos
               value: parseFloat(value),
               currency: currency,
               content_ids: contentIds,
               content_type: 'product',
               num_items: contentIds.length,

               // Información del producto
               content_name: additionalData.productName || contentIds[0] || 'El Hack',
               content_category: 'digital_solution',

               // Información del contexto
               event_source_url: window.location.href,
               page_title: document.title,

               // Datos del checkout
               checkout_method: 'form',
               country: additionalData.country || 'MX',

               // Custom parameters
               product_quantity: additionalData.quantity || 1,
               unit_price: additionalData.unitPrice || parseFloat(value),
               funnel_step: 'checkout_initiated',
            },
            {
               // Datos del usuario (si están disponibles en este punto)
               country: additionalData.country ? [additionalData.country] : undefined,
            },
         );
      } else {
         console.warn('Meta Pixel not available');
         return null;
      }
   };

   // Evento adicional para el funnel completo
   const trackAddToCart = async (value, currency, contentIds, additionalData = {}) => {
      if (typeof window !== 'undefined' && window.metaPixel) {
         return await window.metaPixel.track(
            'AddToCart',
            {
               value: parseFloat(value),
               currency: currency,
               content_ids: contentIds,
               content_type: 'product',
               content_name: additionalData.productName || contentIds[0] || 'El Hack',
               content_category: 'digital_solution',
               num_items: contentIds.length,
               event_source_url: window.location.href,
               country: additionalData.country || 'MX',
               product_quantity: additionalData.quantity || 1,
            },
            {},
         );
      }
      return null;
   };

   // Evento para cuando el usuario ve el producto
   const trackViewContent = async (value, currency, contentIds, additionalData = {}) => {
      if (typeof window !== 'undefined' && window.metaPixel) {
         return await window.metaPixel.track(
            'ViewContent',
            {
               value: parseFloat(value),
               currency: currency,
               content_ids: contentIds,
               content_type: 'product',
               content_name: additionalData.productName || contentIds[0] || 'El Hack',
               content_category: 'digital_solution',
               event_source_url: window.location.href,
               country: additionalData.country || 'MX',
            },
            {},
         );
      }
      return null;
   };

   return {
      trackPurchase,
      trackInitiateCheckout,
      trackAddToCart,
      trackViewContent,
   };
}
