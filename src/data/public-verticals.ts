/**
 * CATALOGUE UNIQUE DES VERTICALES PUBLIQUES.
 *
 * Source de vérité unique pour toutes les listes de verticales affichées sur le
 * site public : menus, pied de page, pages hub, page à propos, blocs
 * « Nos autres solutions », page recrutement, compteurs.
 *
 * Aucun contenu n'est inventé ici : tout est repris des modules existants
 * (src/data/verticals.ts et src/data/assurances-particulieres.ts) ou de la page
 * /assurances-professionnelles.
 */
import {
  Zap,
  Smartphone,
  HeartPulse,
  PawPrint,
  ShieldCheck,
  Leaf,
  CreditCard,
  Building2,
  Car,
  Bike,
  House,
  type LucideIcon,
} from "lucide-react";
import { VERTICALS, type Partner, type Product, type Vertical } from "@/data/verticals";
import {
  ASSURANCES_PARTICULIERES,
  type AssuranceParticuliere,
} from "@/data/assurances-particulieres";

export type Tunnel = "particuliers" | "professionnels";

export interface PublicVertical {
  /** Identifiant stable (slug de la page). */
  id: string;
  label: string;
  tunnel: Tunnel;
  /** URL réelle servie par le site. */
  href: string;
  icon: LucideIcon;
  /** Accroche courte (titre secondaire de carte). */
  accroche: string;
  /** Description longue d'une phrase ou deux. */
  description: string;
  /** Description courte utilisée dans les menus déroulants. */
  menuDescription: string;
  /** Sous-produits / garanties. */
  products: Product[];
  /** Partenaires nommés publiquement (peut être vide). */
  partners: Partner[];
  /** Donnée complète de la verticale historique, si elle existe. */
  vertical?: Vertical;
  /** Donnée complète de la page assurance particulier, si elle existe. */
  assurance?: AssuranceParticuliere;
}

function fromVertical(
  v: Vertical,
  icon: LucideIcon,
  menuDescription: string,
): PublicVertical {
  return {
    id: v.slug,
    label: v.name,
    tunnel: v.audience,
    href: `/${v.audience}/${v.slug}`,
    icon,
    accroche: v.tagline,
    description: v.shortDescription,
    menuDescription,
    products: v.products,
    partners: v.partners,
    vertical: v,
  };
}

function fromAssurance(
  a: AssuranceParticuliere,
  menuDescription: string,
): PublicVertical {
  return {
    id: a.slug,
    label: a.name,
    tunnel: "particuliers",
    href: `/particuliers/${a.slug}`,
    icon: a.icon,
    accroche: a.accroche,
    description: a.paragraphe,
    menuDescription,
    products: a.garanties.map((g) => ({ name: g.name, description: g.description })),
    // Décision assumée : aucune compagnie n'est nommée sur ces verticales.
    partners: [],
    assurance: a,
  };
}

function requireVertical(audience: Tunnel, slug: string): Vertical {
  const v = VERTICALS.find((x) => x.audience === audience && x.slug === slug);
  if (!v) throw new Error(`Verticale introuvable : ${audience}/${slug}`);
  return v;
}

function requireAssurance(slug: string): AssuranceParticuliere {
  const a = ASSURANCES_PARTICULIERES.find((x) => x.slug === slug);
  if (!a) throw new Error(`Assurance particulier introuvable : ${slug}`);
  return a;
}

/** Assurances professionnelles : servie depuis la racine, pas sous /professionnels. */
const ASSURANCES_PRO: PublicVertical = {
  id: "assurances-professionnelles",
  label: "Assurances Professionnelles",
  tunnel: "professionnels",
  href: "/assurances-professionnelles",
  icon: ShieldCheck,
  accroche:
    "Responsabilité civile, garantie décennale : protégez votre activité avec les bonnes garanties, au bon prix.",
  description:
    "MERCIKI compare pour vous les offres des principaux assureurs du marché et vous accompagne de la souscription à la gestion de vos sinistres.",
  menuDescription: "RC Pro, RC Exploitation et garantie décennale.",
  products: [
    {
      name: "Responsabilité Civile Professionnelle",
      description:
        "Couvre les dommages causés à vos clients ou à des tiers dans le cadre de votre activité : erreur, omission, conseil inadapté, dommage matériel ou immatériel.",
    },
    {
      name: "Responsabilité Civile Exploitation",
      description:
        "Couvre les dommages survenus dans le cadre du fonctionnement quotidien de votre entreprise : locaux, matériel, personnel, déplacements.",
    },
    {
      name: "Garantie Décennale",
      description:
        "Obligation légale pour tous les professionnels du bâtiment. Couvre pendant 10 ans les dommages compromettant la solidité de l'ouvrage ou le rendant inhabitable.",
    },
  ],
  partners: [],
};

export const PUBLIC_VERTICALS: PublicVertical[] = [
  fromVertical(requireVertical("particuliers", "energie"), Zap, "Électricité et gaz au meilleur tarif."),
  fromVertical(requireVertical("particuliers", "telecoms"), Smartphone, "Box, mobile et fibre optimisés."),
  fromVertical(requireVertical("particuliers", "mutuelle-sante"), HeartPulse, "Une couverture santé adaptée."),
  fromVertical(requireVertical("particuliers", "mutuelle-animale"), PawPrint, "Protégez vos compagnons à 4 pattes."),
  fromVertical(requireVertical("particuliers", "assurance-emprunteur"), ShieldCheck, "Économisez sur votre prêt immobilier."),
  fromVertical(requireVertical("particuliers", "energies-renouvelables"), Leaf, "Panneaux solaires et solutions vertes."),
  fromAssurance(requireAssurance("assurance-auto"), "Le bon niveau de garanties au juste prix."),
  fromAssurance(requireAssurance("assurance-moto"), "La couverture adaptée à votre pratique."),
  fromAssurance(requireAssurance("assurance-habitation"), "Votre logement bien couvert."),
  fromVertical(requireVertical("professionnels", "monetique"), CreditCard, "Terminaux et frais de paiement réduits."),
  fromVertical(requireVertical("professionnels", "energie"), Building2, "Contrats énergie pour votre entreprise."),
  ASSURANCES_PRO,
];

export function getPublicVerticals(tunnel: Tunnel): PublicVertical[] {
  return PUBLIC_VERTICALS.filter((v) => v.tunnel === tunnel);
}

/** Toutes les verticales du même tunnel, sauf la page courante. */
export function getOtherPublicVerticals(tunnel: Tunnel, id: string): PublicVertical[] {
  return PUBLIC_VERTICALS.filter((v) => v.tunnel === tunnel && v.id !== id);
}

export function countPublicVerticals(tunnel?: Tunnel): number {
  return tunnel ? getPublicVerticals(tunnel).length : PUBLIC_VERTICALS.length;
}
