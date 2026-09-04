import {
  Bike,
  Building2,
  Car,
  CreditCard,
  HandCoins,
  Heart,
  Home,
  Leaf,
  PawPrint,
  ShieldCheck,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Liste exhaustive des identifiants produits. */
export const PRODUCT_IDS = [
  "energie",
  "telecoms",
  "mutuelle-sante",
  "sante-animale",
  "emprunteur",
  "enr",
  "monetique",
  "energie-pro",
  "assurances-pro",
  "auto",
  "moto",
  "habitation",
] as const;

/** Union des identifiants produits, dérivée de PRODUCT_IDS. */
export type ProductId = (typeof PRODUCT_IDS)[number];

export interface Product {
  id: ProductId;
  label: string;
  icon: LucideIcon;
  description: string;
  isNew?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "energie",
    label: "Énergie",
    icon: Zap,
    description: "Électricité & gaz — trouvez le meilleur fournisseur",
  },
  {
    id: "telecoms",
    label: "Télécoms",
    icon: Wifi,
    description: "Box & mobile — passez à une offre adaptée",
  },
  {
    id: "mutuelle-sante",
    label: "Mutuelle Santé",
    icon: Heart,
    description: "Couverture santé — une protection au juste prix",
  },
  {
    id: "sante-animale",
    label: "Santé Animale",
    icon: PawPrint,
    description: "Assurance animaux — protégez vos compagnons",
  },
  {
    id: "emprunteur",
    label: "Assurance Emprunteur",
    icon: HandCoins,
    description: "Assurance prêt — comparez votre couverture",
  },
  {
    id: "enr",
    label: "Énergies Renouvelables",
    icon: Leaf,
    description: "PAC, panneaux solaires — équipez votre logement",
  },
  {
    id: "monetique",
    label: "Monétique",
    icon: CreditCard,
    description: "Paiement & encaissement — simplifiez vos flux",
  },
  {
    id: "energie-pro",
    label: "Énergie Pro",
    icon: Building2,
    description: "Énergie professionnelle — optimisez vos dépenses",
  },
  {
    id: "assurances-pro",
    label: "Assurances Pro",
    icon: ShieldCheck,
    description: "RC Pro, RC Exploitation, Garantie Décennale",
  },
  {
    id: "auto",
    label: "Assurance Auto",
    icon: Car,
    description: "Assurance véhicule — comparez votre formule",
  },
  {
    id: "moto",
    label: "Assurance Moto",
    icon: Bike,
    description: "Deux-roues & quad — une couverture adaptée",
  },
  {
    id: "habitation",
    label: "Assurance Habitation",
    icon: Home,
    description: "Maison & appartement — protégez votre logement",
  },
];

export const getProduct = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);