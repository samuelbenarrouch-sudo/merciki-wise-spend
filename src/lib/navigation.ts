import { type LucideIcon } from "lucide-react";
import { getPublicVerticals } from "@/data/public-verticals";

export const PHONE_DISPLAY = "07 64 20 19 63";
export const PHONE_HREF = "tel:+33764201963";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

/** Dérivé du catalogue unique des verticales publiques. */
const toNavItem = (v: {
  label: string;
  href: string;
  icon: LucideIcon;
  menuDescription: string;
}): NavItem => ({
  label: v.label,
  href: v.href,
  icon: v.icon,
  description: v.menuDescription,
});

export const particuliersItems: NavItem[] = getPublicVerticals("particuliers").map(toNavItem);

export const professionnelsItems: NavItem[] = getPublicVerticals("professionnels").map(toNavItem);

export const entrepriseLinks = [
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
  { label: "Nous recrutons", href: "/" },
];
