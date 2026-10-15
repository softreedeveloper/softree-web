# Enlazado interno

Motor en `src/utils/seo/linking.js`.

## Modelo

El grafo se construye desde dos fuentes:

1. **`linksTo`** de cada entrada del registro: enlaces contextuales declarados.
2. **`GLOBAL_NAV`**: rutas enlazadas desde el chrome (Header, MenuMobile, Footer), que por
   definición son alcanzables desde cualquier página.

Sin la segunda, el grafo daría por huérfanas páginas que sí reciben enlaces. El validador
comprueba que cada ruta de `GLOBAL_NAV` aparezca de verdad en esos tres componentes: si
alguien la quita del menú, salta un `CRITICAL`.

## Detección

| Función | Qué encuentra |
|---------|---------------|
| `findOrphans()` | Páginas indexables sin enlaces entrantes |
| `findDanglingLinks()` | Enlaces declarados hacia rutas que no existen |
| `suggestRelated(slug)` | Candidatos a enlazar, ordenados por cercanía temática |
| `anchorFor(page, seed)` | Texto del enlace, rotando entre variantes de forma determinista |

## Reglas

- Las páginas legales (`priority < 0.5`) no se sugieren como contenido relacionado: viven
  en el footer y enlazarlas ahí no reparte autoridad útil.
- Máximo 4 sugerencias por página. El objetivo es repartir autoridad, no llenar la página
  de enlaces.
- El anchor rota pero es determinista: la misma página produce siempre el mismo texto, así
  que el HTML no cambia entre builds.

## Estado

0 huérfanas, 0 enlaces colgantes. Con 4 páginas el grafo es trivial; el valor de este
motor aparece en la Fase 4, cuando haya 15 URLs y las decisiones dejen de ser obvias.
