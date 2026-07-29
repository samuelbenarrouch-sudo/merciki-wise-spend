import {
  Zap,
  Smartphone,
  HeartPulse,
  PawPrint,
  ShieldCheck,
  Leaf,
  CreditCard,
  Building2,
  type LucideIcon,
} from "lucide-react";

export const PHONE_DISPLAY = "07 56 90 63 70";
export const PHONE_HREF = "tel:+33756906370";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export const particuliersItems: NavItem[] = [
  {
    label: "Énergie",
    href: "/particuliers/energie",
    icon: Zap,
    description: "Électricité et gaz au meilleur tarif.",
  },
  {
    label: "Télécoms",
    href: "/particuliers/telecoms",
    icon: Smartphone,
    description: "Box, mobile et fibre optimisés.",
  },
  {
    label: "Mutuelle Santé",
    href: "/particuliers/mutuelle-sante",
    icon: HeartPulse,
    description: "Une couverture santé adaptée.",
  },
  {
    label: "Mutuelle Animale",
    href: "/particuliers/mutuelle-animale",
    icon: PawPrint,
    description: "Protégez vos compagnons à 4 pattes.",
  },
  {
    label: "Assurance Emprunteur",
    href: "/particuliers/assurance-emprunteur",
    icon: ShieldCheck,
    description: "Économisez sur votre prêt immobilier.",
  },
  {
    label: "Énergies Renouvelables",
    href: "/particuliers/energies-renouvelables",
    icon: Leaf,
    description: "Panneaux solaires et solutions vertes.",
  },
];

export const professionnelsItems: NavItem[] = [
  {
    label: "Monétique",
    href: "/professionnels/monetique",
    icon: CreditCard,
    description: "Terminaux et frais de paiement réduits.",
  },
  {
    label: "Énergie",
    href: "/professionnels/energie",
    icon: Building2,
    description: "Contrats énergie pour votre entreprise.",
  },
];

export const entrepriseLinks = [
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
  { label: "Nous rejoindre", href: "/recrutement" },
];