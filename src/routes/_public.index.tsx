import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck, User, Building2, Check, Phone, Users, ArrowRight,
  Zap, Wifi, HeartPulse, PawPrint, HandCoins, Sun, CreditCard, Factory,
  PhoneCall, Search, Scale, PartyPopper,
  BadgeEuro, LayoutGrid, Handshake, HeartHandshake,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionHeading } from "@/components/ui/section-heading";
import { PartnerLogo } from "@/components/partners/partner-logo";
import { PartnerCarousel } from "@/components/partners/partner-carousel";
import {
  VERTICALS, COMPANY, TRUST,
  getVerticalsByAudience, getAllPartners,
  type Vertical, type Partner,
} from "@/data/verticals";
import heroImg from "@/assets/hero-conseil.jpg.asset.json";

const ICONS: Record<string, LucideIcon> = {
  Zap, Wifi, HeartPulse, PawPrint, HandCoins, Sun, CreditCard, Factory,
};

export const Route = createFileRoute("/_public/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "MERCIKI — Économisez sur l'énergie, les télécoms, la mutuelle et l'assurance" },
      {
        name: "description",
        content:
          "MERCIKI compare et négocie pour vous vos contrats d'énergie, télécoms, mutuelle santé et assurance de prêt. Service 100 % gratuit pour les particuliers et les professionnels.",
      },
      { property: "og:title", content: "MERCIKI — Optimisation & économies" },
      {
        property: "og:description",
        content:
          "Nous comparons, négocions et sélectionnons les meilleures offres du marché pour vous. Gratuitement.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function HomePage() {
  const particuliers = getVerticalsByAudience("particuliers");
  const professionnels = getVerticalsByAudience("professionnels");
  const allPartners = getAllPartners();

  return (
    <>
      <HeroSection />
      <TwoDoorsSection particuliers={particuliers} professionnels={professionnels} />
      <AllVerticalsSection particuliers={particuliers} professionnels={professionnels} />
      <HowItWorksSection />
      <WhySection />
      <StatsSection />
      <PartnersSection partners={allPartners} />
      <FinalCtaSection />
    </>
  );
}

/* ---------------- HERO ---------------- */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary-light">
      <Container className="py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[55fr_45fr] lg:items-center lg:gap-16">
          <div className="flex flex-col gap-6">
            <Badge variant="accent-soft" className="w-fit gap-2 px-4 py-2 text-xs">
              <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
              Service 100 % gratuit et sans engagement
            </Badge>
            <h1 className="text-h1 text-ink">
              Payez moins, sans y passer vos journées.
            </h1>
            <p className="text-body text-slate max-w-xl">
              Énergie, télécoms, mutuelle, assurance de prêt, pompes à chaleur, encaissement…
              Nous comparons le marché, négocions à votre place et vous orientons vers l'offre
              la plus juste. Vous n'avez rien à gérer.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="primary" size="lg" className="w-full sm:w-auto">
                <Link to="/particuliers">
                  <User className="h-5 w-5" strokeWidth={1.75} />
                  Je suis un particulier
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/professionnels">
                  <Building2 className="h-5 w-5" strokeWidth={1.75} />
                  Je suis un professionnel
                </Link>
              </Button>
            </div>
            <ul className="flex flex-col gap-2 pt-2 text-small text-slate sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
              {[
                `Plus de ${TRUST.yearsOfExperience} ans d'expérience`,
                `${TRUST.expertiseAreas} domaines d'expertise`,
                "Sans aucun frais pour vous",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2.25} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <img
              src={heroImg.url}
              alt="Conseillère MERCIKI accompagnant un client dans l'analyse de ses contrats"
              width={1200}
              height={1400}
              className="w-full rounded-3xl object-cover shadow-medium aspect-[4/5]"
            />
            <div className="absolute -bottom-4 -left-2 sm:-left-6 flex items-center gap-3 rounded-2xl bg-background p-4 shadow-medium max-w-[calc(100%-1rem)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Phone className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <div className="text-small text-slate">Un conseiller vous rappelle</div>
                <div className="text-ink font-bold" style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}>
                  {COMPANY.phone.display}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ---------------- TWO DOORS ---------------- */

function TwoDoorsSection({
  particuliers, professionnels,
}: { particuliers: Vertical[]; professionnels: Vertical[] }) {
  return (
    <Section background="white">
      <Container>
        <SectionHeading
          align="center"
          title="Par où souhaitez-vous commencer ?"
          subtitle="Choisissez votre profil, nous vous montrons les solutions adaptées."
          className="mb-12"
        />
        <div className="grid gap-6 md:grid-cols-2">
          <DoorCard
            to="/particuliers"
            icon={Users}
            title="Particuliers"
            description="Vos dépenses du quotidien, optimisées une bonne fois pour toutes."
            verticals={particuliers}
            linkLabel="Découvrir nos solutions particuliers"
          />
          <DoorCard
            to="/professionnels"
            icon={Building2}
            title="Professionnels"
            description="Réduisez vos charges et encaissez au meilleur tarif."
            verticals={professionnels}
            linkLabel="Découvrir nos solutions professionnels"
          />
        </div>
      </Container>
    </Section>
  );
}

function DoorCard({
  to, icon: Icon, title, description, verticals, linkLabel,
}: {
  to: string; icon: LucideIcon; title: string; description: string;
  verticals: Vertical[]; linkLabel: string;
}) {
  return (
    <Link
      to={to}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="flex h-full flex-col gap-6 p-8 transition-transform duration-200 group-hover:-translate-y-1">
        <IconTile icon={Icon} className="h-16 w-16 md:h-20 md:w-20" />
        <div>
          <h3 className="text-h3 text-ink">{title}</h3>
          <p className="text-body text-slate mt-2">{description}</p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {verticals.map((v) => {
            const VIcon = ICONS[v.icon];
            return (
              <li
                key={`${v.audience}-${v.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-mist px-3 py-2 text-small text-ink"
              >
                {VIcon ? <VIcon className="h-4 w-4 text-primary" strokeWidth={1.75} /> : null}
                {v.name}
              </li>
            );
          })}
        </ul>
        <span className="mt-auto inline-flex items-center gap-2 text-primary font-semibold">
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </span>
      </Card>
    </Link>
  );
}

/* ---------------- ALL VERTICALS ---------------- */

function AllVerticalsSection({
  particuliers, professionnels,
}: { particuliers: Vertical[]; professionnels: Vertical[] }) {
  return (
    <Section background="mist">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="NOS EXPERTISES"
          title="8 domaines, une seule interlocutrice"
          subtitle="Un accompagnement complet et transparent, pour chaque dépense du foyer comme de l'entreprise."
          className="mb-12"
        />

        <div className="mb-4">
          <span className="text-label uppercase text-slate tracking-wider">Pour les particuliers</span>
        </div>
        <VerticalGrid verticals={particuliers} audiencePath="/particuliers" />

        <div className="mt-16 mb-4">
          <span className="text-label uppercase text-slate tracking-wider">Pour les professionnels</span>
        </div>
        <VerticalGrid verticals={professionnels} audiencePath="/professionnels" />
      </Container>
    </Section>
  );
}

function VerticalGrid({
  verticals, audiencePath,
}: { verticals: Vertical[]; audiencePath: "/particuliers" | "/professionnels" }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {verticals.map((v) => (
        <VerticalCard key={`${v.audience}-${v.slug}`} v={v} audiencePath={audiencePath} />
      ))}
    </div>
  );
}

function VerticalCard({
  v, audiencePath,
}: { v: Vertical; audiencePath: "/particuliers" | "/professionnels" }) {
  const Icon = ICONS[v.icon];
  const visiblePartners = v.partners.slice(0, 5);
  const remaining = v.partners.length - visiblePartners.length;
  const href = `${audiencePath}/${v.slug}`;

  return (
    <Link
      to={href}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="flex h-full flex-col gap-4 p-6 transition-transform duration-200 group-hover:-translate-y-1">
        {Icon ? <IconTile icon={Icon} /> : null}
        <h3 className="text-h3 text-ink">{v.name}</h3>
        <p className="text-body text-slate">{v.shortDescription}</p>
        <ul className="flex flex-col gap-2">
          {v.products.map((p) => (
            <li key={p.name} className="flex items-start gap-2 text-small text-ink">
              <Check className="h-4 w-4 shrink-0 text-primary mt-1" strokeWidth={2.25} />
              <span>{p.name}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-mist my-2" />
        <div className="flex flex-col gap-2">
          <span className="text-slate" style={{ fontSize: 12, letterSpacing: "0.05em" }}>
            NOS PARTENAIRES
          </span>
          <div className="flex flex-wrap gap-2">
            {visiblePartners.map((p) => (
              <PartnerLogo
                key={p.name}
                name={p.name}
                domain={p.domain}
                showName
                className="px-3 py-2 shadow-none"
              />
            ))}
            {remaining > 0 ? (
              <span className="inline-flex items-center rounded-xl border border-mist bg-background px-3 py-1.5 text-xs font-semibold text-slate">
                +{remaining} autres
              </span>
            ) : null}
          </div>
        </div>
        <span className="mt-auto inline-flex items-center gap-2 pt-2 text-primary font-semibold">
          En savoir plus
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </span>
      </Card>
    </Link>
  );
}

/* ---------------- HOW IT WORKS ---------------- */

const STEPS = [
  { n: "01", icon: PhoneCall, title: "Vous nous contactez", desc: "Un appel, un formulaire, et c'est parti. Vous nous dites ce que vous payez aujourd'hui." },
  { n: "02", icon: Search, title: "Nous analysons", desc: "Nous étudions vos contrats en cours et identifions précisément ce qui peut être amélioré." },
  { n: "03", icon: Scale, title: "Nous comparons", desc: "Nous consultons nos partenaires et mettons les offres en concurrence pour vous." },
  { n: "04", icon: PartyPopper, title: "Vous décidez", desc: "Nous vous présentons la meilleure solution. Vous restez libre de dire oui ou non." },
];

function HowItWorksSection() {
  return (
    <Section background="white">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="SIMPLE ET RAPIDE"
          title="Comment ça se passe ?"
          className="mb-12"
        />
        <div className="relative">
          {/* Connecteur horizontal desktop */}
          <div
            className="absolute left-0 right-0 top-8 hidden lg:block border-t-2 border-dashed border-primary-light"
            aria-hidden="true"
          />
          <ol className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.n} className="relative flex gap-4 lg:flex-col lg:gap-3">
                  {/* Connecteur vertical mobile */}
                  <div className="flex flex-col items-center lg:items-start">
                    <div
                      className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-background shadow-soft"
                      style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 700 }}
                    >
                      <span className="text-2xl text-accent">{s.n}</span>
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-h3 text-ink">{s.title}</h3>
                    <p className="text-body text-slate mt-2">{s.desc}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

/* ---------------- WHY ---------------- */

const WHY = [
  { icon: BadgeEuro, title: "Gratuit, vraiment", desc: "Nous sommes rémunérés par nos partenaires, jamais par vous. Pas de frais de dossier, pas d'honoraires." },
  { icon: LayoutGrid, title: "Tout au même endroit", desc: "Une seule interlocutrice pour l'énergie, les télécoms, la mutuelle, l'assurance de prêt et vos travaux de rénovation." },
  { icon: Handshake, title: "Des partenaires reconnus", desc: "Nous travaillons uniquement avec des acteurs établis du marché français." },
  { icon: HeartHandshake, title: "Un accompagnement humain", desc: "Quelqu'un vous répond, vous explique et vous suit. Pas un robot, pas un formulaire perdu." },
];

function WhySection() {
  return (
    <Section background="accent-soft">
      <Container>
        <SectionHeading
          align="center"
          title="Pourquoi passer par nous ?"
          className="mb-12"
        />
        <div className="grid gap-6 md:grid-cols-2">
          {WHY.map((w) => {
            const Icon = w.icon;
            return (
              <Card key={w.title} className="flex gap-4 p-6">
                <IconTile icon={Icon} className="shrink-0" />
                <div>
                  <h3 className="text-h3 text-ink">{w.title}</h3>
                  <p className="text-body text-slate mt-2">{w.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

/* ---------------- STATS ---------------- */

function StatsSection() {
  const stats = [
    { value: `${TRUST.yearsOfExperience}+`, label: "ans d'expérience" },
    { value: `${TRUST.expertiseAreas}`, label: "domaines d'expertise" },
    { value: `${Math.floor(TRUST.partnersCount / 5) * 5}+`, label: "partenaires référencés" },
    { value: "100 %", label: "gratuit pour vous" },
  ];
  return (
    <section className="bg-primary py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-accent"
                style={{
                  fontFamily: "Bricolage Grotesque, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(2.75rem, 8vw, 4.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </div>
              <div className="mt-3 text-small text-primary-foreground/80">{s.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------- PARTNERS ---------------- */

function PartnersSection({ partners }: { partners: Partner[] }) {
  return (
    <Section background="white">
      <Container>
        <SectionHeading
          align="center"
          title="Ils nous font confiance"
          subtitle="Nous travaillons avec les principaux acteurs du marché français."
          className="mb-12"
        />
        <PartnerCarousel partners={partners} autoPlay />
      </Container>
    </Section>
  );
}

/* ---------------- FINAL CTA ---------------- */

function FinalCtaSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="rounded-3xl bg-ink px-6 py-12 text-primary-foreground sm:px-12 md:py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h2 className="text-h2 text-primary-foreground">
              Et si on regardait vos contrats ensemble ?
            </h2>
            <p className="text-body text-primary-foreground/80">
              Un échange de quelques minutes suffit pour savoir ce que vous pourriez économiser.
              C'est gratuit et sans engagement.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
                <a href={COMPANY.phone.href}>
                  <Phone className="h-5 w-5" strokeWidth={1.75} />
                  Appeler le {COMPANY.phone.display}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-2 border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
              >
                <Link to="/contact">Être rappelé</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

// Ensure VERTICALS import isn't tree-shaken accidentally
void VERTICALS;
