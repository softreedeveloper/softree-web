/**
 * Meta Pixel (navegador) + envío al servidor (Conversions API) con eventID compartido.
 *
 * Vive en public/ → no pasa por Vite: sin import/TS, expone globales.
 *
 * API:  window.metaPixelUtils.init(pixelId, { endpoint })
 *       window.metaPixelUtils.trackEvent(name, customData, userData) → eventId | null
 *       window.metaPixelUtils.trackPageView()
 *
 * userData va CRUDO y en arrays: { em: ['correo'], ph: ['5512345678'], fn: ['Nombre'] }.
 * La función del servidor normaliza y hashea; hashear aquí = hash de hash = match 0.
 * fbp/fbc/IP/user-agent los toma la función de cookies y cabeceras: no mandarlos.
 */
(function () {
   var state = { ready: false, endpoint: '/.netlify/functions/meta-conversion' };

   function loadFbq() {
      if (window.fbq) return;
      !(function (f, b, e, v, n, t, s) {
         if (f.fbq) return;
         n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
         };
         if (!f._fbq) f._fbq = n;
         n.push = n;
         n.loaded = !0;
         n.version = '2.0';
         n.queue = [];
         t = b.createElement(e);
         t.async = !0;
         t.src = v;
         s = b.getElementsByTagName(e)[0];
         s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
   }

   function eventId() {
      return Date.now() + '-' + Math.random().toString(36).slice(2, 8);
   }

   function sendServer(name, customData, userData, id) {
      try {
         return fetch(state.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            body: JSON.stringify({
               event_name: name,
               event_id: id,
               event_source_url: location.href,
               custom_data: customData || {},
               user_data: userData || {},
            }),
         }).catch(function () {});
      } catch (e) {
         return null;
      }
   }

   function trackEvent(name, customData, userData) {
      if (!state.ready) return null; // sin pixel no se envía nada (evita 500 de la función en local)
      var id = eventId();
      try {
         window.fbq('track', name, customData || {}, { eventID: id });
      } catch (e) {}
      sendServer(name, customData, userData, id);
      return id;
   }

   function trackPageView() {
      return trackEvent('PageView', {}, {});
   }

   function init(pixelId, opts) {
      if (!pixelId || state.ready) return;
      if (opts && opts.endpoint) state.endpoint = opts.endpoint;
      loadFbq();
      window.fbq('init', pixelId);
      state.ready = true;
      trackPageView();
   }

   window.metaPixelUtils = { init: init, trackEvent: trackEvent, trackPageView: trackPageView };
})();
