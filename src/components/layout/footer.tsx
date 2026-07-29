import { Link } from "@tanstack/react-router";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import {
  PHONE_DISPLAY,
  PHONE_HREF,
  particuliersItems,
  professionnelsItems,
  entrepriseLinks,
} from "@/lib/navigation";

const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-confidentialite" },
  { label: "Cookies", href: "/cookies" },
];

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-label uppercase tracking-wider text-background mb-4">{children}</h3>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-small text-background/70 hover:text-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background rounded"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-background">
      <Container className="py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo size="md" showBaseline variant="light" />
            <p className="mt-6 text-small text-background/70 max-w-xs">
              Nous comparons, négocions et sélectionnons les meilleures offres du marché pour
              vous. Gratuitement.
            </p>
          </div>

          <div>
            <ColumnTitle>Particuliers</ColumnTitle>
            <ul className="flex flex-col gap-3">
              {particuliersItems.map((item) => (
                <li key={item.href}>
                  <FooterLink to={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnTitle>Professionnels</ColumnTitle>
            <ul className="flex flex-col gap-3">
              {professionnelsItems.map((item) => (
                <li key={item.href}>
                  <FooterLink to={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ColumnTitle>Entreprise</ColumnTitle>
              <ul className="flex flex-col gap-3">
                {entrepriseLinks.map((link) => (
                  <li key={link.href}>
                    <FooterLink to={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <ColumnTitle>Contact</ColumnTitle>
            <a
              href={PHONE_HREF}
              className="font-display font-bold text-2xl md:text-3xl text-background hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background rounded"
            >
              {PHONE_DISPLAY}
            </a>
            <address className="mt-4 text-small text-background/70 not-italic">
              MERCIKI
              <br />
              10 rue de la Paix
              <br />
              75002 Paris
            </address>
          </div>
        </div>
      </Container>

      <div className="bg-background/[0.04] border-t border-background/10">
        <Container className="py-6">
          <p
            className="text-background/60"
            style={{ fontSize: "12px", lineHeight: 1.6 }}
          >
            MERCIKI — SAS au capital de 100 € — SIREN 930 963 541 — RCS Paris 930 963 541 —
            Siège social : 10 rue de la Paix, 75002 Paris. MERCIKI agit en qualité d'apporteur
            d'affaires. Les opérations de courtage en assurance sont réalisées par notre
            partenaire ZEPPELIN, immatriculé à l'ORIAS sous le n° 25004656.
          </p>
        </Container>
      </div>

      <div className="border-t border-background/10">
        <Container className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-small text-background/70">
            © 2026 MERCIKI. Tous droits réservés.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <FooterLink to={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
            Service 100 % gratuit et sans engagement
          </span>
        </Container>
      </div>
    </footer>
  );
}