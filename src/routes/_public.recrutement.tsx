import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  Handshake,
  Smartphone,
  Users,
  Briefcase,
  Zap,
  MapPin,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconTile } from "@/components/ui/icon-tile";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { particuliersItems, professionnelsItems } from "@/lib/navigation";
import { canonical } from "@/lib/seo";
import soireeAsset from "@/assets/soiree-challenge.webp.asset.json";
import teamSudAsset from "@/assets/team-sud.webp.asset.json";

export const Route = createFileRoute("/_public/recrutement")({
  head: () => ({
    meta: [
      { title: "Rejoignez le réseau MERCIKI — Recrutement" },
      {
        name: "description",
        content:
          "Nous cherchons des profils commerciaux qui aiment le contact et veulent porter une offre large et utile. Rejoignez le réseau MERCIKI.",
      },
      { property: "og:title", content: "Rejoignez le réseau MERCIKI" },
      {
        property: "og:description",
        content:
          "Une offre large, des partenaires établis, des outils simples et un accompagnement de proximité.",
      },
      ...canonical("/recrutement").meta,
    ],
    links: canonical("/recrutement").links,
  }),
  component: RecruitmentPage,
});

const supportCards = [
  {
    icon: Package,
    title: "Une offre large et déjà structurée",
    body:
      "Pas besoin de réinventer la roue. Les 8 verticales sont documentées, les partenaires sont sélectionnés, les outils commerciaux existent.",
  },
  {
    icon: Handshake,
    title: "Des partenaires établis",
    body:
      "Tu ne négocies pas seul avec les fournisseurs. MERCIKI a déjà construit ces relations.",
  },
  {
    icon: Smartphone,
    title: "Des outils de saisie simples et mobiles",
    body:
      "Un formulaire par produit, pensé pour être rempli en trois minutes, directement sur le terrain.",
  },
  {
    icon: Users,
    title: "Un accompagnement de proximité",
    body:
      "Un référent dédié qui connaît le réseau, qui répond vite et qui t'aide vraiment.",
  },
];

const profileCards = [
  {
    icon: Briefcase,
    title: "Vous êtes indépendant ou en micro-entreprise",
    body:
      "Vous travaillez en B2C, vous avez un portefeuille clients, vous cherchez à le monétiser autrement ou à l'enrichir. MERCIKI vous offre une offre complémentaire immédiate.",
  },
  {
    icon: Zap,
    title: "Vous êtes commercial pur-sang",
    body:
      "Vous aimez vendre, vous êtes doué pour créer du rapport, et vous cherchez une offre sérieuse et rémunératrice. Ici, vous portez quelque chose qui a du sens.",
  },
  {
    icon: MapPin,
    title: "Vous êtes enraciné dans un territoire",
    body:
      "Vous connaissez les gens dans une région, une ville, ou un quartier. Vous avez de la crédibilité auprès d'eux. Vous pouvez les aider.",
  },
];

function RecruitmentPage() {
  const allVerticals = [...particuliersItems, ...professionnelsItems];

  return (
    <>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <Container className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="primary-light" className="mb-6">
              Nous recrutons
            </Badge>
            <h1 className="text-h1">Rejoignez le réseau MERCIKI.</h1>
            <p className="mt-6 text-body text-primary-foreground/85">
              Nous cherchons des profils commerciaux qui aiment le contact, qui savent écouter et
              qui veulent porter une offre large et utile. Si c'est vous, parlons-nous.
            </p>
          </div>
        </Container>
      </section>

      {/* Ce que vous portez */}
      {/* Vie d'équipe */}
      <Section background="white">
        <Container>
          <SectionHeading
            eyebrow="La vie du réseau"
            title="Challenges commerciaux, soirées, afterworks… rejoignez l'équipe !"
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <figure className="overflow-hidden rounded-3xl shadow-soft">
              <img
                src={soireeAsset.url}
                alt="Équipe commerciale MERCIKI réunie lors d'une soirée challenge"
                width={1200}
                height={900}
                loading="lazy"
                className="h-64 w-full object-cover sm:h-80"
              />
              <figcaption className="bg-mist px-5 py-4 text-small text-slate">
                Soirée challenge : on célèbre les résultats tous ensemble.
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-3xl shadow-soft">
              <img
                src={teamSudAsset.url}
                alt="Équipe MERCIKI du Sud réunie en bord de mer"
                width={1200}
                height={900}
                loading="lazy"
                className="h-64 w-full object-cover sm:h-80"
              />
              <figcaption className="bg-mist px-5 py-4 text-small text-slate">
                L'équipe Sud, entre deux rendez-vous terrain.
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* Ce que vous portez */}
      <Section background="mist">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-h3 text-ink">
              Un portefeuille complet, sur des besoins que tout le monde a.
            </h3>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {allVerticals.map((v) => (
              <span
                key={v.href}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-small font-semibold text-primary-foreground shadow-soft"
              >
                <v.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                {v.label}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      {/* Ce que nous apportons */}
      <Section background="white">
        <Container>
          <SectionHeading
            eyebrow="Ce que nous apportons"
            title="Voici ce que nous mettons en place pour vous."
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {supportCards.map((c) => (
              <Card key={c.title} className="p-6 md:p-8">
                <IconTile icon={c.icon} className="bg-accent-soft text-accent" />
                <h4 className="mt-5 text-h3 text-ink">{c.title}</h4>
                <p className="mt-3 text-body text-slate">{c.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Les profils */}
      <Section background="accent-soft">
        <Container>
          <SectionHeading
            eyebrow="Les profils que nous cherchons"
            title="On ne cherche pas un profil unique. On cherche des gens qui reconnaissent une de ces trois situations."
            align="center"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {profileCards.map((c) => (
              <Card key={c.title} className="bg-background p-6 md:p-8">
                <IconTile icon={c.icon} />
                <h4 className="mt-5 text-h3 text-ink">{c.title}</h4>
                <p className="mt-3 text-body text-slate">{c.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA finale */}
      <section className="bg-primary text-primary-foreground">
        <Container className="py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-h2">Intéressé ?</h2>
            <p className="mt-4 text-body text-primary-foreground/85">
              Écrivez-nous une première fois pour qu'on se connaisse. Pas de CV, pas de format
              imposé. Dites-nous simplement qui vous êtes.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-background text-primary hover:bg-background/90"
              >
                <Link to="/contact" search={{ subject: "reseau" } as never}>
                  Envoyer mon profil
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}