import { Link } from "@tanstack/react-router";
import {
  Check, Phone, Mail, ChevronRight, AlertCircle,
  Zap, Wifi, HeartPulse, PawPrint, HandCoins, Sun, CreditCard, Factory,
  PhoneCall, Search, Scale, PartyPopper, ArrowRight, ShieldCheck,
  Store, Building2, Landmark,
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
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import {
  COMPANY, getVerticalsByAudience, type Audience, type Vertical,
} from "@/data/verticals";
import { ASSURANCES_PARTICULIERES } from "@/data/assurances-particulieres";
import myposSolutionAsset from "@/assets/mypos-solution.webp.asset.json";


const ICONS: Record<string, LucideIcon> = {
  Zap, Wifi, HeartPulse, PawPrint, HandCoins, Sun, CreditCard, Factory,
};

type Step = { title: string; desc: string };

const HOW_STEPS: Record<string, Step[]> = {
  energie: [
    { title: "Vous nous transmettez une facture récente", desc: "Un simple PDF ou une photo de votre dernière facture d'électricité ou de gaz suffit à démarrer." },
    { title: "Nous analysons votre profil de consommation", desc: "Puissance souscrite, option base ou heures creuses, saisonnalité : nous étudions ce qui compte vraiment." },
    { title: "Nous comparons les offres de nos partenaires", desc: "Nous mettons les fournisseurs en concurrence pour identifier l'offre la plus juste pour votre foyer." },
    { title: "Nous gérons la bascule sans coupure", desc: "Aucune intervention chez vous, aucune interruption d'alimentation. Nous nous occupons de tout." },
  ],
  telecoms: [
    { title: "Nous faisons le point sur votre équipement", desc: "Box actuelle, forfait mobile, éligibilité fibre à votre adresse : nous partons de votre situation réelle." },
    { title: "Nous identifions les usages du foyer", desc: "Streaming, télétravail, jeu, data mobile : nous ajustons l'offre à ce que vous consommez vraiment." },
    { title: "Nous comparons les offres disponibles chez vous", desc: "Nous sélectionnons les meilleures offres box et mobile parmi les opérateurs référencés à votre adresse." },
    { title: "Nous vous accompagnons pour la portabilité", desc: "Résiliation, conservation du numéro, activation : nous vous guidons pas à pas jusqu'à la mise en service." },
  ],
  "mutuelle-sante": [
    { title: "Vous nous parlez de votre situation", desc: "Famille, âge, priorités de soins : nous prenons le temps de comprendre vos vrais besoins." },
    { title: "Nous ciblons les postes qui comptent pour vous", desc: "Dentaire, optique, hospitalisation, médecines douces : nous concentrons la comparaison sur l'essentiel." },
    { title: "Nous comparons plusieurs mutuelles partenaires", desc: "Nous mettons en regard les niveaux de remboursement et le coût réel, poste par poste." },
    { title: "Nous gérons la bascule d'un contrat à l'autre", desc: "La nouvelle mutuelle prend en charge la résiliation de l'ancienne, sans coupure de couverture." },
  ],
  "mutuelle-animale": [
    { title: "Vous nous présentez votre animal", desc: "Chien ou chat, race, âge, mode de vie : nous partons de son profil pour bien l'assurer." },
    { title: "Nous étudions les formules adaptées", desc: "Nous sélectionnons les niveaux de garanties cohérents avec son âge et vos priorités." },
    { title: "Nous vous expliquons les exclusions et la carence", desc: "Aucune mauvaise surprise : tout est posé clairement avant la signature." },
    { title: "Vous souscrivez en toute connaissance de cause", desc: "Nous restons disponibles pour toute question, y compris après la mise en place du contrat." },
  ],
  "assurance-emprunteur": [
    { title: "Vous nous transmettez votre offre de prêt", desc: "Contrat en cours, tableau d'amortissement, garanties exigées par la banque : nous partons du concret." },
    { title: "Nous recherchons une délégation équivalente", desc: "Nous ciblons un contrat avec un niveau de garanties équivalent ou supérieur à celui de la banque." },
    { title: "Nous préparons le dossier de substitution", desc: "Nous constituons le dossier et le déposons auprès de votre banque grâce à la loi Lemoine." },
    { title: "Nous suivons jusqu'à la prise d'effet", desc: "Nous suivons l'acceptation par la banque jusqu'à la bascule effective sur votre nouveau contrat." },
  ],
  "energies-renouvelables": [
    { title: "Vous nous décrivez votre logement", desc: "Surface, isolation, chauffage actuel, exposition : nous partons des caractéristiques concrètes de votre habitat." },
    { title: "Nous vous orientons vers la bonne technologie", desc: "Pompe à chaleur Air/Eau, Air/Air ou photovoltaïque : nous vous conseillons ce qui a du sens chez vous." },
    { title: "Nous vous mettons en relation avec un installateur", desc: "Vous êtes mis en relation avec nos installateurs partenaires certifiés RGE, sélectionnés pour leur sérieux." },
    { title: "Vous recevez un devis clair et personnalisé", desc: "Étude technique, prix, aides mobilisables : tout est présenté sans pression pour que vous décidiez sereinement." },
  ],
  monetique: [
    { title: "Nous étudions vos flux d'encaissement", desc: "Volume mensuel, panier moyen, canaux utilisés : nous partons de votre activité réelle." },
    { title: "Nous ciblons la bonne combinaison de solutions", desc: "TPE fixe, TPE mobile, e-commerce, lien de paiement : nous adaptons l'outillage à vos usages." },
    { title: "Nous consultons nos partenaires monétique", desc: "Nous comparons les commissions, les frais fixes et les délais de versement pour votre profil." },
    { title: "Nous vous accompagnons jusqu'à la mise en service", desc: "Ouverture du compte marchand, livraison, prise en main : votre encaissement est opérationnel rapidement." },
  ],
  "energie-pro": [
    { title: "Nous auditons vos factures et vos points de livraison", desc: "Contrats en cours, puissance souscrite, historique de consommation : nous décryptons l'existant." },
    { title: "Nous consultons les fournisseurs partenaires", desc: "Nous mettons le marché en concurrence pour obtenir des propositions comparables et à jour." },
    { title: "Nous vous remettons un comparatif structuré", desc: "Postes d'économies, avantages, points de vigilance : la décision se prend sur des faits, pas sur un discours." },
    { title: "Nous orchestrons la bascule sans coupure", desc: "Aucune interruption d'activité. Nous restons votre interlocuteur pour les renouvellements à venir." },
  ],
};

const ENR_BENEFITS: Record<string, string[]> = {
  "Pompe à chaleur Air/Eau": [
    "Compatible avec vos radiateurs ou votre plancher chauffant existants.",
    "Rendement élevé même en rénovation, y compris par temps froid.",
    "Éligible aux principaux dispositifs d'aide à la rénovation énergétique.",
  ],
  "Pompe à chaleur Air/Air réversible": [
    "Installation rapide, sans gros travaux ni circuit d'eau à modifier.",
    "Chauffage confortable l'hiver, climatisation en été.",
    "Pilotage pièce par pièce pour maîtriser la consommation.",
  ],
  "Panneaux photovoltaïques": [
    "Autoconsommation immédiate de l'électricité produite chez vous.",
    "Revente possible du surplus injecté sur le réseau.",
    "Rentabilité renforcée à mesure que les tarifs de l'électricité progressent.",
  ],
};

type PartnerRich = { name: string; note?: string; country?: string };

const MYPOS_PARTNERS: PartnerRich[] = [
  {
    name: "myPOS",
    country: "Europe",
    note:
      "Solution européenne conçue pour les professionnels. Terminaux autonomes avec carte SIM intégrée, compte de paiement inclus avec IBAN dédié, fonds disponibles instantanément après la transaction et tarification transparente sans abonnement obligatoire.",
  },
];

const MONETIQUE_ROWS: { solution: string; usage: string; ideal: string }[] = [
  { solution: "TPE fixe", usage: "Encaissement au comptoir", ideal: "Commerces sédentaires" },
  { solution: "TPE mobile", usage: "Encaissement en déplacement", ideal: "Artisans, marchés, livraison" },
  { solution: "E-commerce", usage: "Paiement en ligne", ideal: "Boutiques web" },
  { solution: "Lien de paiement", usage: "Paiement à distance par SMS ou email", ideal: "Devis, acomptes, prestations" },
];

function MonetiqueTable() {
  return (
    <Section background="mist">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="COMPARATIF"
          title="Quelle solution d'encaissement pour votre activité ?"
          className="mb-10"
        />
        {/* Desktop : tableau */}
        <div className="hidden overflow-hidden rounded-2xl border border-mist bg-background shadow-soft md:block">
          <table className="w-full border-collapse text-left">
            <thead className="bg-primary-light text-ink">
              <tr>
                <th className="px-6 py-4 text-label uppercase tracking-wider">Solution</th>
                <th className="px-6 py-4 text-label uppercase tracking-wider">Usage typique</th>
                <th className="px-6 py-4 text-label uppercase tracking-wider">Idéal pour</th>
              </tr>
            </thead>
            <tbody>
              {MONETIQUE_ROWS.map((row, i) => (
                <tr key={row.solution} className={i % 2 === 1 ? "bg-mist/50" : ""}>
                  <td className="px-6 py-4 text-body font-semibold text-ink">{row.solution}</td>
                  <td className="px-6 py-4 text-body text-slate">{row.usage}</td>
                  <td className="px-6 py-4 text-body text-slate">{row.ideal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile : cartes empilées */}
        <div className="flex flex-col gap-4 md:hidden">
          {MONETIQUE_ROWS.map((row) => (
            <Card key={row.solution} className="flex flex-col gap-3 p-5">
              <h3 className="text-h3 text-ink">{row.solution}</h3>
              <div>
                <p className="text-label uppercase tracking-wider text-slate">Usage typique</p>
                <p className="text-body text-ink">{row.usage}</p>
              </div>
              <div>
                <p className="text-label uppercase tracking-wider text-slate">Idéal pour</p>
                <p className="text-body text-ink">{row.ideal}</p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function MonetiqueSolutionShowcase() {
  return (
    <Section background="white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="order-1">
            <SectionHeading
              align="left"
              eyebrow="SOLUTION PARTENAIRE"
              title="myPOS : la solution TPE simple, rapide et sécurisée"
              subtitle="Terminaux de paiement, encaissement en ligne et liens de paiement à distance pour professionnels."
              className="mb-8"
            />
            <ul className="flex flex-col gap-4">
              {[
                "Tous les moyens de paiement : carte, sans contact, Apple Pay, Google Pay",
                "Transactions rapides en quelques secondes",
                "TPE autonome et mobile avec batterie longue durée",
                "Normes de sécurité les plus strictes et données protégées",
                "Livraison en moins de 48 heures et installation simple",
                "Suivi des transactions, tableau de bord en temps réel et service client dédié",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                  <span className="text-body text-ink">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
                <a href={COMPANY.phone.href}>
                  <Phone className="h-5 w-5" strokeWidth={1.75} />
                  Appeler le {COMPANY.phone.display}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/contact">
                  <Mail className="h-5 w-5" strokeWidth={1.75} />
                  Être rappelé
                </Link>
              </Button>
            </div>
          </div>
          <div className="order-2">
            <div className="overflow-hidden rounded-3xl bg-accent-soft shadow-soft">
              <img
                src={myposSolutionAsset.url}
                alt="Présentation de la solution myPOS : terminal de paiement, moyens de paiement, livraison rapide et tableau de bord"
                className="h-auto w-full object-cover"
                width={800}
                height={1200}
              />
            </div>
            <p className="mt-3 text-center text-small text-slate">
              Solution myPOS proposée par MERCIKI : encaissez partout, tout le temps.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}



const ENERGIE_PRO_SEGMENTS: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Store,
    title: "TPE et commerces",
    desc: "Un ou deux points de livraison, un contrat souvent jamais renégocié depuis l'ouverture. Un gain de temps immédiat et une facture allégée.",
  },
  {
    icon: Building2,
    title: "PME multi-sites",
    desc: "Plusieurs compteurs, des puissances souscrites parfois mal calibrées, une gestion administrative dispersée : nous consolidons et rationalisons.",
  },
  {
    icon: Landmark,
    title: "Industrie et gros consommateurs",
    desc: "Des volumes qui justifient une mise en concurrence structurée, avec des offres à prix fixe, indexé ou hybride selon votre exposition au marché.",
  },
];

function EnergieProSegments() {
  return (
    <Section background="mist">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="POUR TOUTES LES ENTREPRISES"
          title="Nous intervenons quelle que soit votre taille"
          subtitle="Notre méthode s'adapte au nombre de sites, au volume consommé et à votre organisation."
          className="mb-12"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {ENERGIE_PRO_SEGMENTS.map((seg) => {
            const SegIcon = seg.icon;
            return (
              <Card key={seg.title} className="flex h-full flex-col gap-4 p-6">
                <IconTile icon={SegIcon} />
                <h3 className="text-h3 text-ink">{seg.title}</h3>
                <p className="text-body text-slate">{seg.desc}</p>
              </Card>
            );
          })}
        </div>
        <div className="mt-10 rounded-2xl bg-background p-6 shadow-soft">
          <p className="text-label uppercase tracking-wider text-accent">Nos leviers d'optimisation</p>
          <p className="mt-2 text-body text-ink">
            Mise en concurrence des fournisseurs, ajustement de la puissance souscrite, choix
            du moment de contractualisation et regroupement des sites : autant de leviers
            que nous actionnons pour peser sur votre budget énergie.
          </p>
        </div>
      </Container>
    </Section>
  );
}

export function VerticalPage({
  vertical,
  audience = "particuliers",
  afterHero,
}: {
  vertical: Vertical;
  audience?: Audience;
  afterHero?: React.ReactNode;
}) {
  const Icon = ICONS[vertical.icon];
  const stepsKey =
    audience === "professionnels" && vertical.slug === "energie"
      ? "energie-pro"
      : vertical.slug;
  const steps = HOW_STEPS[stepsKey] ?? [];
  const others = getOtherPublicVerticals(audience, vertical.slug);
  const partnersHaveNotes = vertical.partners.some((p) => p.note);
  const isEnR = audience === "particuliers" && vertical.slug === "energies-renouvelables";
  const isPro = audience === "professionnels";
  const audiencePath = isPro ? "/professionnels" : "/particuliers";
  const audienceLabel = isPro ? "Professionnels" : "Particuliers";
  const audienceLabelLower = isPro ? "professionnels" : "particuliers";
  const showMonetiqueTable = isPro && vertical.slug === "monetique";
  const showEnergieProSegments = isPro && vertical.slug === "energie";

  return (
    <>
      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background to-primary-light">
        <Container className="py-12 md:py-20">
          <nav aria-label="Fil d'Ariane" className="mb-6 flex flex-wrap items-center gap-1.5 text-small text-slate">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            {isPro ? (
              <Link to="/professionnels" className="hover:text-primary">Professionnels</Link>
            ) : (
              <Link to="/particuliers" className="hover:text-primary">Particuliers</Link>
            )}
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-ink font-medium">{vertical.name}</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="flex flex-col gap-6">
              {Icon ? <IconTile icon={Icon} className="h-16 w-16 md:h-20 md:w-20" /> : null}
              <div>
                <Badge variant="primary-light" className="mb-4 w-fit px-4 py-2 text-xs">
                  {audienceLabel}
                </Badge>
                <h1 className="text-h1 text-ink">{vertical.name}</h1>
                <p className="mt-3 text-h3 text-primary">{vertical.tagline}</p>
              </div>
              <p className="text-body text-slate">{vertical.shortDescription}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="accent" size="lg" className="w-full sm:w-auto">
                  <a href={COMPANY.phone.href}>
                    <Phone className="h-5 w-5" strokeWidth={1.75} />
                    Appeler le {COMPANY.phone.display}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link to="/contact">
                    <Mail className="h-5 w-5" strokeWidth={1.75} />
                    Être rappelé
                  </Link>
                </Button>
              </div>
            </div>
            <Card className="hidden lg:flex flex-col gap-5 p-8">
              <span className="text-label uppercase text-accent tracking-wider">Ce que nous proposons</span>
              <ul className="flex flex-col gap-3">
                {vertical.products.map((p) => (
                  <li key={p.name} className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-primary" strokeWidth={2.25} />
                    <span className="text-body text-ink font-medium">{p.name}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-mist" />
              <span className="text-label uppercase text-slate tracking-wider">Nos partenaires</span>
              <div className="flex flex-wrap gap-2">
                {vertical.partners.map((p) => (
                  <PartnerLogo key={p.name} name={p.name} domain={p.domain} showName className="px-3 py-2 shadow-none" />
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {afterHero}

      {/* 2. LE CONSTAT */}
      <Section background="white">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="LE CONSTAT"
            title="Ce que nous observons le plus souvent"
            className="mb-12"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {vertical.problem.map((text, i) => (
              <Card key={i} className="flex h-full flex-col gap-4 p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                  <AlertCircle className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <p className="text-body text-ink">{text}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. NOTRE APPROCHE */}
      <Section background="mist">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="NOTRE APPROCHE"
            title="Comment nous intervenons"
            className="mb-12"
          />
          <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-primary-light md:hidden" aria-hidden="true" />
            {vertical.approach.map((text, i) => (
              <li key={i} className="relative flex gap-4 md:flex-col md:gap-4">
                <div
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background shadow-soft md:h-16 md:w-16"
                  style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 700 }}
                >
                  <span className="text-lg text-accent md:text-3xl">0{i + 1}</span>
                </div>
                <p className="flex-1 pt-2 text-body text-ink md:pt-0">{text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 4. NOS PRODUITS */}
      <Section background="white">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="NOS SOLUTIONS"
            title="Ce que nous proposons"
            className="mb-12"
          />
          {isEnR ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {vertical.products.map((p) => {
                const benefits = ENR_BENEFITS[p.name] ?? [];
                return (
                  <Card key={p.name} className="flex h-full flex-col gap-5 p-8">
                    {Icon ? <IconTile icon={Icon} /> : null}
                    <div>
                      <h3 className="text-h3 text-ink">{p.name}</h3>
                      <p className="mt-2 text-body text-slate">{p.description}</p>
                    </div>
                    <ul className="mt-auto flex flex-col gap-2 border-t border-mist pt-5">
                      {benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-small text-ink">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={2.25} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vertical.products.map((p) => (
                <Card key={p.name} className="flex h-full flex-col gap-4 p-6">
                  {Icon ? <IconTile icon={Icon} /> : null}
                  <h3 className="text-h3 text-ink">{p.name}</h3>
                  <p className="text-body text-slate">{p.description}</p>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {showMonetiqueTable ? <MonetiqueSolutionShowcase /> : null}
      {showMonetiqueTable ? <MonetiqueTable /> : null}
      {showEnergieProSegments ? <EnergieProSegments /> : null}


      {/* 5. NOS PARTENAIRES */}
      <Section background="accent-soft">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="NOS PARTENAIRES"
            title="Avec qui nous travaillons"
            className="mb-10"
          />
          {partnersHaveNotes || showMonetiqueTable ? (
            <div className="grid gap-6 md:grid-cols-3">
              {((showMonetiqueTable ? MYPOS_PARTNERS : vertical.partners) as PartnerRich[]).map((p) => (
                <Card key={p.name} className="flex h-full flex-col gap-3 p-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-h3 text-ink">{p.name}</h3>
                    {p.country ? (
                      <Badge variant="accent-soft" className="text-xs">{p.country}</Badge>
                    ) : null}
                  </div>
                  {p.note ? <p className="text-body text-slate">{p.note}</p> : null}
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <p className="mx-auto max-w-2xl text-center text-body text-slate">
                Nous avons sélectionné des partenaires reconnus pour la qualité de leurs offres
                et la fiabilité de leur service dans l'univers {vertical.name.toLowerCase()}.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {vertical.partners.map((p) => (
                  <PartnerLogo key={p.name} name={p.name} domain={p.domain} showName />
                ))}
              </div>
            </div>
          )}
          <p className="mt-8 text-center text-small text-slate">
            Nous mettons systématiquement plusieurs partenaires en concurrence pour identifier
            l'offre la plus adaptée à votre situation.
          </p>
        </Container>
      </Section>

      {/* 6. COMMENT ÇA MARCHE */}
      <Section background="white">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="COMMENT ÇA MARCHE"
            title="Notre accompagnement, étape par étape"
            className="mb-12"
          />
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={i}>
                <Card className="flex h-full flex-col gap-3 p-6">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary"
                    style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 700 }}
                  >
                    <span className="text-xl">{i + 1}</span>
                  </div>
                  <h3 className="text-h3 text-ink">{s.title}</h3>
                  <p className="text-body text-slate">{s.desc}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 7. FAQ */}
      <Section background="mist">
        <Container>
          <SectionHeading
            align="center"
            title="Vos questions"
            className="mb-10"
          />
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="flex flex-col gap-2">
              {vertical.faq.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="rounded-2xl border border-mist bg-background px-5"
                >
                  <AccordionTrigger className="min-h-14 py-4 text-left text-body font-semibold text-ink no-underline hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-body text-slate">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </Section>

      {/* 8bis. NAV CROISÉE */}
      <section className="py-12 md:py-16 bg-background">
        <Container>
          <p className="mb-5 text-label uppercase tracking-wider text-slate">
            Nos autres solutions pour les {audienceLabelLower}
          </p>
          <div className="flex flex-wrap gap-3">
            {others.map((v) => {
              const OtherIcon = ICONS[v.icon];
              return (
                <Link
                  key={v.slug}
                  to={isPro ? "/professionnels/$slug" : "/particuliers/$slug"}
                  params={{ slug: v.slug }}
                  className="inline-flex items-center gap-2 rounded-full border border-mist bg-background px-4 py-2 text-small text-ink shadow-soft transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {OtherIcon ? <OtherIcon className="h-4 w-4 text-primary" strokeWidth={1.75} /> : null}
                  <span>{v.name}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </Link>
              );
            })}
            {isPro
              ? null
              : ASSURANCES_PARTICULIERES.map((a) => {
                  const AIcon = a.icon;
                  return (
                    <Link
                      key={a.slug}
                      to="/particuliers/$slug"
                      params={{ slug: a.slug }}
                      className="inline-flex items-center gap-2 rounded-full border border-mist bg-background px-4 py-2 text-small text-ink shadow-soft transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <AIcon className="h-4 w-4 text-primary" strokeWidth={1.75} />
                      <span>{a.name}</span>
                      <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                    </Link>
                  );
                })}
          </div>
        </Container>
      </section>

      {/* 8. CTA FINAL */}
      <section className="pb-16 md:pb-24">
        <Container>
          <div className="rounded-3xl bg-ink px-6 py-12 text-primary-foreground sm:px-12 md:py-16">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
              <h2 className="text-h2 text-primary-foreground">
                Parlons de votre {vertical.name.toLowerCase()} ensemble
              </h2>
              <p className="text-body text-primary-foreground/80">
                Un échange de quelques minutes suffit pour savoir ce que nous pouvons faire pour vous.
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

      {/* 9. COMPLIANCE (assurance uniquement) */}
      {vertical.isInsurance ? (
        <section className="pb-16 md:pb-24">
          <Container>
            <div
              className="rounded-xl bg-mist p-5 text-slate"
              style={{ borderLeft: "3px solid hsl(var(--primary))", fontSize: 13, lineHeight: 1.6 }}
            >
              <div className="mb-2 flex items-center gap-2 text-ink">
                <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={1.75} />
                <span className="text-label uppercase tracking-wider">Mention légale</span>
              </div>
              MERCIKI intervient en qualité d'apporteur d'affaires. Les opérations de courtage
              en assurance sont réalisées par notre partenaire ZEPPELIN, société de courtage
              immatriculée à l'ORIAS sous le numéro 25004656 (www.orias.fr). MERCIKI n'exerce
              aucune activité de courtage en assurance et ne délivre aucun conseil en assurance.
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}