# SEO local

**No implementado. Bloqueado a propósito.**

## Por qué

Crear `/desarrollo-software-cdmx/`, `/desarrollo-software-monterrey/` y
`/desarrollo-software-guadalajara/` cambiando solo el nombre de la ciudad produce
exactamente el contenido duplicado que el propio brief prohíbe, y es el patrón que Google
penaliza con más consistencia.

Para que una página local funcione tiene que decir algo que solo aplique a ese mercado:
qué industrias predominan, qué problemas concretos se resuelven allí, y al menos un caso
real. Nada de eso existe todavía.

## Lo que sí está preparado

- `src/utils/seo/pseo/dimensions.js` marca solo **CDMX y Estado de México** como
  `strategic: true`. Monterrey, Guadalajara y Querétaro están explícitamente fuera de la
  cola: no hay presencia real que contar.
- La plantilla `servicio-ciudad` exige `marketContext`, `caseStudyRefs` y `faqs` para
  superar el quality score. Sin las tres, ninguna combinación pasa de 49 puntos.
- `site-config.js` ya tiene la dirección fiscal real (Álvaro Obregón, CDMX), que alimenta
  el `PostalAddress` del `Organization`.

## Qué hace falta para desbloquearlo

1. Al menos un caso de éxito real por mercado.
2. Contexto de mercado escrito a mano por alguien que conozca esa plaza.
3. `LocalBusiness` con dirección verificable, y un perfil de Google Business Profile
   asociado. Un `LocalBusiness` sin presencia física comprobable es una señal de riesgo,
   no una ventaja.

Mientras tanto, CDMX se trabaja desde la home y las páginas de servicio, que ya declaran
`areaServed: México`.
