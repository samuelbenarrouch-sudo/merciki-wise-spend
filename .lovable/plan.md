# Fondations techniques & graphiques MERCIKI

Objectif : poser design system + composants UI de base. Aucune page de contenu.

Note stack : le projet utilise **TanStack Router** (fichiers `src/routes/`), pas `react-router-dom`. Tu as validé. Tout le reste du brief est respecté à l'identique.

## 1. Polices

Charger Bricolage Grotesque (400/600/700) + Inter (400/500/600/700) via `<link>` dans le `head()` de `src/routes/__root.tsx` (preconnect + stylesheet Google Fonts). Pas d'`@import` d'URL dans `styles.css` (contrainte Tailwind v4 / Lightning CSS).

## 2. Tokens couleurs — `src/styles.css`

Remplacer la palette shadcn par les tokens MERCIKI, en **HSL** dans `:root` (conversion depuis les hex fournis) et mappage dans `@theme inline` pour générer les classes Tailwind (`bg-primary`, `text-ink`, etc.).

Tokens ajoutés : `background`, `foreground` (=ink), `primary`, `primary-foreground`, `primary-light`, `accent`, `accent-foreground` (=ink), `accent-soft`, `ink`, `slate`, `mist`, `success`, `destructive`, `border`, `input`, `ring`, `card`, `muted`, plus les variants `-foreground` requis par shadcn.

Ajouter aussi :
- `--radius-card: 16px`, `--radius-section: 24px`, `--radius-input: 12px` (rounded-full via Tailwind)
- `--shadow-soft: 0 2px 8px hsl(162 27% 9% / 0.06)`
- `--shadow-medium: 0 8px 24px hsl(162 27% 9% / 0.08)`
- Mappage `--color-*` dans `@theme inline` pour `primary-light`, `accent-soft`, `ink`, `slate`, `mist`, `success` + shadows via `--shadow-soft/medium` → utilitaires `shadow-soft` / `shadow-medium`.

## 3. Typographie

Dans `@theme inline` : `--font-display: "Bricolage Grotesque", sans-serif`, `--font-sans: "Inter", sans-serif`. Body applique `font-sans` via `@layer base`.

Utilitaires `@utility` dans `styles.css` :
- `.text-h1` / `.text-h2` / `.text-h3` (Bricolage, tailles + line-height + tracking mobile→desktop via `@media`)
- `.text-body` / `.text-small` / `.text-label` (Inter)

## 4. Système

- Container : composant React `max-w-[1200px] mx-auto px-5 md:px-8`
- Cible tactile min 48×48 : appliqué dans variantes Button md/lg
- Icônes Lucide : conventionner `strokeWidth={1.75}` dans les composants IconTile / usages internes
- Pas de scroll horizontal : `overflow-x-hidden` sur `body` + audit des composants

## 5. Composants UI — `src/components/ui/`

Créer (ou étendre le shadcn Button déjà présent) :

| Fichier | Contenu |
|---|---|
| `button.tsx` | Étendre variants : `primary` (bg-primary, text-primary-foreground), `accent` (bg-accent, text-ink), `outline` (border-primary, text-primary), `ghost`. Tailles `sm` (h-10), `md` (h-12), `lg` (h-14). Tous `rounded-full`. Focus-visible ring. |
| `container.tsx` | Wrapper responsive |
| `section.tsx` | `py-16 md:py-24`, prop `background: 'white' \| 'mist' \| 'primary-light' \| 'accent-soft'` |
| `card.tsx` | bg-card, rounded-2xl, shadow-soft, hover:shadow-medium, transition |
| `badge.tsx` | Étendre : variants `primary-light`, `accent-soft`, forme pilule |
| `icon-tile.tsx` | 56×56 mobile / 64×64 desktop, rounded-2xl, bg-primary-light, icône Lucide primary centrée. Prop `icon: LucideIcon` |
| `section-heading.tsx` | Props `eyebrow?`, `title`, `subtitle?`, `align?: 'left' \| 'center'`. Eyebrow = label uppercase accent |

Tous typés TypeScript strict, `forwardRef` où pertinent, focus-visible visible.

## 6. Routing

Rien à installer (TanStack Router déjà en place).
- Remplacer le placeholder `src/routes/index.tsx` par une page d'accueil minimale (juste un titre "MERCIKI" utilisant `.text-h1` + tokens) — juste pour retirer le placeholder blank-page.
- La 404 existe déjà dans `__root.tsx` (`notFoundComponent`) → la restyler avec les tokens MERCIKI.
- Ré-styler l'ErrorComponent avec les mêmes tokens.
- Mettre à jour le `head()` : title "MERCIKI — Optimisez vos dépenses", description FR, og:title/og:description alignés.

## 7. Règles qualité appliquées

- Zéro couleur hex/rgb dans les composants → uniquement classes tokens
- `overflow-x-hidden` global
- Focus states via `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- TypeScript strict sur tous les composants
- Mobile-first : classes de base = mobile, `md:` / `lg:` pour desktop

## Fichiers touchés / créés

```
src/styles.css                        (réécriture tokens + typo utilities)
src/routes/__root.tsx                 (fonts head, restyle 404/error, meta MERCIKI)
src/routes/index.tsx                  (placeholder MERCIKI simple)
src/components/ui/button.tsx          (extension variants)
src/components/ui/badge.tsx           (extension variants)
src/components/ui/container.tsx       (nouveau)
src/components/ui/section.tsx         (nouveau)
src/components/ui/card.tsx            (existe déjà shadcn — vérifier/ajuster)
src/components/ui/icon-tile.tsx       (nouveau)
src/components/ui/section-heading.tsx (nouveau)
```

À la fin je te confirme ce qui a été mis en place, sans aucune page de contenu créée.
