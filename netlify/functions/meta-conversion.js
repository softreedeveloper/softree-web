const crypto = require('crypto');

async function hashData(data) {
   if (!data || data === '') return undefined;
   return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
}

function extractFbc(cookieHeader) {
   if (!cookieHeader) return undefined;
   const match = cookieHeader.match(/_fbc=([^;]+)/);
   return match ? match[1] : undefined;
}

function extractFbp(cookieHeader) {
   if (!cookieHeader) return undefined;
   const match = cookieHeader.match(/_fbp=([^;]+)/);
   return match ? match[1] : undefined;
}

export async function handler(event, context) {
   console.log('=== META CONVERSION API CALLED ===');
   console.log('Method:', event?.httpMethod);
   console.log('Origin:', event?.headers?.origin);
   console.log('User-Agent:', event?.headers?.['user-agent']);

   // CORS preflight
   if (event.httpMethod === 'OPTIONS') {
      console.log('✅ CORS preflight handled');
      return {
         statusCode: 200,
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, User-Agent',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
         },
         body: '',
      };
   }

   if (event.httpMethod !== 'POST') {
      console.log('❌ Invalid method:', event.httpMethod);
      return {
         statusCode: 405,
         headers: { 'Access-Control-Allow-Origin': '*' },
         body: JSON.stringify({ error: 'Method not allowed' }),
      };
   }

   // Verificar variables críticas
   if (!process.env.META_PIXEL_ID) {
      return {
         statusCode: 500,
         headers: { 'Access-Control-Allow-Origin': '*' },
         body: JSON.stringify({ error: 'META_PIXEL_ID not configured' }),
      };
   }

   if (!process.env.META_ACCESS_TOKEN) {
      return {
         statusCode: 500,
         headers: { 'Access-Control-Allow-Origin': '*' },
         body: JSON.stringify({ error: 'META_ACCESS_TOKEN not configured' }),
      };
   }

   try {
      console.log('📥 Request body:', event.body);

      const { event_name, custom_data, user_data, event_id } = JSON.parse(event.body || '{}');

      if (!event_name) {
         console.log('❌ Missing event_name');
         return {
            statusCode: 400,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'event_name required' }),
         };
      }

      console.log('🎯 Processing event:', event_name, 'ID:', event_id);

      // Construir evento para Meta
      const pixelEvent = {
         event_name,
         event_time: Math.floor(Date.now() / 1000),
         action_source: 'website',
         event_source_url: event.headers?.referer || event.headers?.origin || 'https://softree.com.mx/',
         event_id: event_id || `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
         user_data: {
            client_ip_address:
               event.headers?.['x-forwarded-for'] ||
               event.headers?.['x-real-ip'] ||
               event.headers?.['client-ip'] ||
               '127.0.0.1',
            client_user_agent: event.headers?.['user-agent'] || 'Unknown',
            fbc: extractFbc(event.headers?.cookie),
            fbp: extractFbp(event.headers?.cookie),
         },
         custom_data: custom_data || {},
      };

      // Hashear TODOS los datos personales del usuario
      if (user_data) {
         console.log('🔐 Hashing all user data...');

         // Emails - ya estaba funcionando
         if (user_data.em && Array.isArray(user_data.em)) {
            pixelEvent.user_data.em = await Promise.all(
               user_data.em.filter((email) => email).map((email) => hashData(email)),
            );
         }

         // Teléfonos - ya estaba funcionando
         if (user_data.ph && Array.isArray(user_data.ph)) {
            pixelEvent.user_data.ph = await Promise.all(
               user_data.ph.filter((phone) => phone).map((phone) => hashData(phone.replace(/\D/g, ''))),
            );
         }

         // NUEVOS: Hashear nombres, apellidos, código postal y país
         if (user_data.fn && Array.isArray(user_data.fn)) {
            pixelEvent.user_data.fn = await Promise.all(
               user_data.fn.filter((name) => name).map((name) => hashData(name)),
            );
         }

         if (user_data.ln && Array.isArray(user_data.ln)) {
            pixelEvent.user_data.ln = await Promise.all(
               user_data.ln.filter((lastName) => lastName).map((lastName) => hashData(lastName)),
            );
         }

         if (user_data.zp && Array.isArray(user_data.zp)) {
            pixelEvent.user_data.zp = await Promise.all(user_data.zp.filter((zip) => zip).map((zip) => hashData(zip)));
         }

         if (user_data.country && Array.isArray(user_data.country)) {
            pixelEvent.user_data.country = await Promise.all(
               user_data.country.filter((country) => country).map((country) => hashData(country)),
            );
         }

         // Otros campos si los tienes
         if (user_data.ct && Array.isArray(user_data.ct)) {
            pixelEvent.user_data.ct = await Promise.all(
               user_data.ct.filter((city) => city).map((city) => hashData(city)),
            );
         }

         if (user_data.st && Array.isArray(user_data.st)) {
            pixelEvent.user_data.st = await Promise.all(
               user_data.st.filter((state) => state).map((state) => hashData(state)),
            );
         }
      }

      // Limpiar datos vacíos o undefined
      Object.keys(pixelEvent.user_data).forEach((key) => {
         if (
            pixelEvent.user_data[key] === undefined ||
            pixelEvent.user_data[key] === null ||
            (Array.isArray(pixelEvent.user_data[key]) && pixelEvent.user_data[key].length === 0)
         ) {
            delete pixelEvent.user_data[key];
         }
      });

      console.log('📤 Sending to Meta API...');
      console.log('🎯 Event:', pixelEvent.event_name);
      console.log('🆔 Event ID:', pixelEvent.event_id);

      // Enviar a Meta API
      const metaPayload = {
         data: [pixelEvent],
         access_token: process.env.META_ACCESS_TOKEN,
      };

      if (process.env.NODE_ENV !== 'production' && process.env.META_TEST_EVENT_CODE) {
         metaPayload.test_event_code = process.env.META_TEST_EVENT_CODE;
         console.log('🧪 Using test event code:', process.env.META_TEST_EVENT_CODE);
      }

      const metaUrl = `https://graph.facebook.com/v18.0/${process.env.META_PIXEL_ID}/events`;
      const response = await fetch(metaUrl, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(metaPayload),
      });

      const result = await response.json();
      console.log('📊 Meta API response:', response.status, result);

      if (!response.ok) {
         return {
            statusCode: 400,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
               error: 'Meta API Error',
               details: result,
            }),
         };
      }

      console.log('✅ SUCCESS - Event sent to Meta Conversions API');
      return {
         statusCode: 200,
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            success: true,
            event_id: pixelEvent.event_id,
            event_name: pixelEvent.event_name,
            events_received: result.events_received || 1,
            message: 'Event sent to server successfully',
         }),
      };
   } catch (error) {
      return {
         statusCode: 500,
         headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            error: 'Internal server error',
            message: error.message,
         }),
      };
   }
}
