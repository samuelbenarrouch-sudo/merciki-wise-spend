# MerciKi Savings Hub

Je démarre un site vitrine + espace commercial privé pour MERCIKI, une société française qui aide particuliers et professionnels à optimiser leurs dépenses (énergie, télécoms, assurances, énergies renouvelables, monétique).

Ce premier prompt sert UNIQUEMENT à poser les fondations techniques et graphiques. Ne crée AUCUNE page de contenu pour l'instant.

STACK

React + TypeScript + Tailwind CSS + shadcn/ui + react-router-dom + Lucide React.

APPROCHE OBLIGATOIRE

Mobile-first strict. Tu conçois d'abord pour un écran de 375px de large, puis tu adaptes vers le haut avec les breakpoints Tailwind. Jamais l'inverse.

POLICES

Charge depuis Google Fonts dans index.html :

Bricolage Grotesque (poids 400, 600, 700) → titres

Inter (poids 400, 500, 600, 700) → corps de texte et UI

PALETTE — à définir en variables CSS HSL dans index.css puis à mapper dans tailwind.config.ts

Ne code JAMAIS une couleur en dur dans un composant. Utilise systématiquement les tokens sémantiques.

primary : #1B6B54 (vert sauge profond) — boutons principaux, liens, titres accentués

primary-light : #D4EFE4 (vert menthe) — fonds de section, badges, hover

accent : #F5A623 (ambre chaleureux) — CTA secondaires, pictogrammes, chiffres clés

accent-soft : #FDF6EC (sable) — fonds alternés, cartes

ink : #12211D (encre) — texte principal, footer

slate : #5A6B66 (ardoise) — texte secondaire, légendes

mist : #F4F6F5 (brume) — fonds neutres, séparateurs

background : #FFFFFF

success : #2E9E6B

destructive : #D64545

TYPOGRAPHIE — définis des classes utilitaires réutilisables

h1 : Bricolage Grotesque 700 — 32px mobile / 56px desktop, line-height 1.1, letter-spacing -0.02em

h2 : Bricolage Grotesque 700 — 26px mobile / 40px desktop, line-height 1.15

h3 : Bricolage Grotesque 600 — 20px mobile / 28px desktop, line-height 1.25

body : Inter 400 — 16px mobile / 17px desktop, line-height 1.6

small : Inter 400 — 14px, line-height 1.5

label : Inter 600 — 14px, letter-spacing 0.01em

SYSTÈME

Rayons : 12px (inputs, badges), 16px (cartes), 24px (grandes sections), rounded-full (boutons)

Ombre douce : 0 2px 8px rgba(18,33,29,0.06)

Ombre moyenne : 0 8px 24px rgba(18,33,29,0.08)

Espacements : uniquement 4/8/12/16/24/32/48/64/96px

Icônes : Lucide React, strokeWidth 1.75

Cible tactile minimum : 48x48px

Container max-width : 1200px, padding latéral 20px en mobile / 32px en desktop

COMPOSANTS UI À CRÉER MAINTENANT

Button — variantes : primary (fond vert, texte blanc), accent (fond ambre, texte encre), outline (bordure verte), ghost. Tailles : sm / md / lg. Tous en rounded-full, hauteur min 48px pour md et lg.

Container — wrapper max-w-[1200px] mx-auto avec padding responsive.

Section — wrapper avec padding vertical (py-16 mobile / py-24 desktop) et prop optionnelle de fond : white | mist | primary-light | accent-soft.

Card — fond blanc, rounded-2xl, ombre douce, transition vers ombre moyenne au hover.

Badge — pilule, variantes primary-light et accent-soft.

IconTile — carré arrondi 56x56px (mobile) / 64x64px (desktop), fond primary-light, icône Lucide centrée en couleur primary.

SectionHeading — composant réutilisable avec eyebrow optionnel (petit label ambre en majuscules), titre h2, et sous-titre optionnel. Prop d'alignement left | center.

ROUTING

Installe react-router-dom et prépare la structure de routes avec une page d'accueil placeholder à "/" et une page 404. Rien d'autre pour l'instant.

RÈGLES DE QUALITÉ

Aucune valeur de couleur en dur dans le JSX

Aucun scroll horizontal possible, jamais

Tous les composants typés en TypeScript

Focus states visibles au clavier sur tous les éléments interactifs

Confirme-moi ce que tu as mis en place quand c'est terminé.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://merciki-wise-spend.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e7b9f07b-7e1e-446b-beab-ff90bdcee9f6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
