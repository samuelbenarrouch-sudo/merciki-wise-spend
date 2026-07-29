export type Audience = "particuliers" | "professionnels";

export interface Partner {
  name: string;
  note?: string;
}

export interface Product {
  name: string;
  description: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Vertical {
  slug: string;
  audience: Audience;
  name: string;
  icon: string;
  tagline: string;
  shortDescription: string;
  problem: string[];
  approach: string[];
  products: Product[];
  partners: Partner[];
  faq: FaqItem[];
  isInsurance: boolean;
  leadPath: string;
}

const REMUNERATION_FAQ: FaqItem = {
  q: "Comment MERCIKI est-elle rémunérée ?",
  a: "MERCIKI est rémunérée exclusivement par ses partenaires lorsqu'un contrat est souscrit. Vous ne payez jamais rien, ni pour la comparaison, ni pour l'accompagnement. Notre service est 100 % gratuit et sans engagement.",
};

export const VERTICALS: Vertical[] = [
  {
    slug: "energie",
    audience: "particuliers",
    name: "Énergie",
    icon: "Zap",
    tagline: "Payez votre électricité et votre gaz au juste prix",
    shortDescription:
      "Nous comparons les offres d'électricité et de gaz pour trouver celle qui correspond vraiment à votre foyer.",
    problem: [
      "Les tarifs évoluent sans arrêt et il devient difficile de savoir si vous payez le bon prix.",
      "Les grilles tarifaires des fournisseurs sont opaques et compliquées à décrypter.",
      "Changer de fournisseur fait peur, alors qu'aucune coupure ni intervention technique n'est nécessaire.",
    ],
    approach: [
      "Nous analysons votre facture actuelle et vos habitudes de consommation.",
      "Nous comparons les offres de nos fournisseurs partenaires en toute transparence.",
      "Nous nous occupons des démarches de souscription à votre place, gratuitement.",
    ],
    products: [
      { name: "Électricité", description: "Contrats d'électricité résidentielle adaptés à votre profil de consommation." },
      { name: "Gaz", description: "Offres de gaz naturel pour le chauffage, l'eau chaude et la cuisson." },
    ],
    partners: [
      { name: "Octopus Energy" },
      { name: "Ilek" },
      { name: "Engie" },
      { name: "Selectra" },
      { name: "TotalEnergies" },
      { name: "OHM Énergie" },
      { name: "Gazel Énergie" },
      { name: "Eneffic" },
      { name: "Jeety" },
      { name: "Vattenfall" },
    ],
    faq: [
      { q: "Le changement de fournisseur entraîne-t-il une coupure ?", a: "Non, absolument aucune coupure. Vos compteurs restent en place, aucun technicien n'intervient et votre alimentation n'est jamais interrompue." },
      { q: "Faut-il résilier mon contrat actuel ?", a: "Non, le nouveau fournisseur s'occupe de tout, y compris de la résiliation. Vous n'avez aucune démarche à effectuer." },
      { q: "Suis-je engagé sur une durée ?", a: "Non, les contrats d'énergie des particuliers sont résiliables à tout moment, sans frais ni préavis." },
      { q: "Que se passe-t-il si les prix baissent après ma souscription ?", a: "Nous restons à vos côtés dans la durée. Si une offre plus intéressante apparaît, nous vous le signalons et vous accompagnons pour en profiter." },
      REMUNERATION_FAQ,
    ],
    isInsurance: false,
    leadPath: "/leadgeneration/energie",
  },
  {
    slug: "telecoms",
    audience: "particuliers",
    name: "Télécoms",
    icon: "Wifi",
    tagline: "Une box et un forfait mobile vraiment adaptés à vos usages",
    shortDescription:
      "Nous sélectionnons pour vous la box internet et le forfait mobile qui collent à vos besoins réels, sans options inutiles.",
    problem: [
      "Les offres évoluent en permanence et les tarifs promotionnels cachent souvent des augmentations après un an.",
      "Beaucoup de foyers paient pour du débit, des données ou des services qu'ils n'utilisent jamais.",
      "Comparer sérieusement quatre opérateurs et des dizaines de forfaits demande un temps que personne n'a.",
    ],
    approach: [
      "Nous faisons le point sur votre équipement, votre logement et vos usages réels.",
      "Nous comparons les offres box et mobile des principaux opérateurs.",
      "Nous vous guidons dans la souscription et la portabilité de votre numéro.",
    ],
    products: [
      { name: "Box internet / fibre", description: "Offres fibre, ADSL et 4G/5G box selon l'éligibilité de votre logement." },
      { name: "Forfaits mobiles", description: "Forfaits avec ou sans engagement, adaptés à votre consommation de data." },
    ],
    partners: [
      { name: "Free" },
      { name: "SFR" },
      { name: "Orange" },
      { name: "Bouygues Telecom" },
    ],
    faq: [
      { q: "Vais-je perdre mon numéro de téléphone en changeant d'opérateur ?", a: "Non. Grâce à la portabilité, votre numéro est conservé automatiquement. Nous nous chargeons de la procédure avec vous." },
      { q: "Ma ligne internet sera-t-elle coupée pendant le changement ?", a: "La coupure, si elle a lieu, est très courte et planifiée avec vous. Sur la fibre, la bascule est souvent réalisée en quelques minutes." },
      { q: "Que faire si je suis encore engagé ?", a: "Nous étudions votre contrat en cours. Certains nouveaux opérateurs remboursent tout ou partie des frais de résiliation." },
      { q: "Comment savoir si je suis éligible à la fibre ?", a: "Nous réalisons le test d'éligibilité à votre adresse pendant notre échange et vous orientons vers la meilleure technologie disponible." },
      REMUNERATION_FAQ,
    ],
    isInsurance: false,
    leadPath: "/leadgeneration/telecoms",
  },
  {
    slug: "mutuelle-sante",
    audience: "particuliers",
    name: "Mutuelle Santé",
    icon: "HeartPulse",
    tagline: "Une complémentaire santé qui vous protège vraiment",
    shortDescription:
      "Nous trouvons la complémentaire santé qui couvre ce qui compte pour vous, sans payer pour des garanties inutiles.",
    problem: [
      "Les tableaux de garanties sont incompréhensibles et il est difficile de savoir ce qui est vraiment remboursé.",
      "Les cotisations augmentent chaque année, souvent sans amélioration des garanties.",
      "Beaucoup de contrats sont trop couvrants sur certains postes et trop faibles sur d'autres.",
    ],
    approach: [
      "Nous identifions vos besoins réels : optique, dentaire, hospitalisation, médecines douces.",
      "Nous comparons plusieurs mutuelles partenaires sur les postes qui vous concernent vraiment.",
      "Nous vous accompagnons pour la souscription et la résiliation de votre contrat actuel.",
    ],
    products: [
      { name: "Santé individuelle", description: "Complémentaire adaptée à une personne seule, actif, étudiant ou senior." },
      { name: "Santé couple", description: "Formule mutualisée pour deux personnes vivant sous le même toit." },
      { name: "Santé famille", description: "Couverture pour les parents et les enfants, avec des garanties pédiatriques." },
    ],
    partners: [{ name: "April" }, { name: "Néoliane" }, { name: "SPVIE" }],
    faq: [
      { q: "Puis-je changer de mutuelle à tout moment ?", a: "Oui, grâce à la loi de résiliation infra-annuelle, vous pouvez changer de mutuelle à tout moment après la première année de contrat." },
      { q: "Qui s'occupe de résilier mon ancienne mutuelle ?", a: "La nouvelle mutuelle prend en charge la résiliation de l'ancienne, sans coupure de couverture." },
      { q: "Comment être sûr d'être bien couvert sur mes vrais besoins ?", a: "Nous prenons le temps d'échanger avec vous pour comprendre votre santé, votre famille et vos priorités avant de comparer les offres." },
      { q: "Les tarifs vont-ils augmenter chaque année ?", a: "Toutes les mutuelles procèdent à des ajustements annuels. Nous restons disponibles pour réévaluer votre contrat si nécessaire." },
      REMUNERATION_FAQ,
    ],
    isInsurance: true,
    leadPath: "/leadgeneration/mutuelle-sante",
  },
  {
    slug: "mutuelle-animale",
    audience: "particuliers",
    name: "Mutuelle Animale",
    icon: "PawPrint",
    tagline: "Faites soigner votre animal sans arbitrer avec votre budget",
    shortDescription:
      "Nous trouvons une assurance santé pour votre chien ou votre chat pour faire face sereinement aux frais vétérinaires.",
    problem: [
      "Les frais vétérinaires peuvent atteindre plusieurs milliers d'euros en cas d'accident ou de maladie.",
      "Les contrats regorgent d'exclusions et de délais de carence peu lisibles.",
      "Attendre que l'animal soit malade pour l'assurer, c'est souvent trop tard.",
    ],
    approach: [
      "Nous faisons connaissance avec votre animal : race, âge, mode de vie.",
      "Nous comparons les formules et les niveaux de remboursement de nos partenaires.",
      "Nous vous expliquons clairement les exclusions et la carence avant toute signature.",
    ],
    products: [
      { name: "Assurance santé chien", description: "Prise en charge des soins, accidents, chirurgie et prévention pour votre chien." },
      { name: "Assurance santé chat", description: "Formules adaptées aux chats d'intérieur comme aux chats ayant accès à l'extérieur." },
    ],
    partners: [{ name: "SantéVet" }, { name: "Néoliane" }],
    faq: [
      { q: "À partir de quel âge puis-je assurer mon animal ?", a: "Généralement dès deux à trois mois. Assurer votre animal jeune permet de bénéficier de meilleures conditions et d'éviter les exclusions liées à l'âge." },
      { q: "Les maladies déjà connues sont-elles couvertes ?", a: "Non, les affections antérieures à la souscription sont exclues. C'est pourquoi il est préférable d'assurer votre animal quand il est en bonne santé." },
      { q: "Comment fonctionne le remboursement ?", a: "Vous réglez le vétérinaire, puis vous transmettez la feuille de soins à l'assureur qui vous rembourse selon la formule choisie." },
      { q: "Y a-t-il un délai de carence ?", a: "Oui, un délai s'applique en général : quelques jours pour les accidents, plusieurs semaines à plusieurs mois pour la maladie et la chirurgie." },
      REMUNERATION_FAQ,
    ],
    isInsurance: true,
    leadPath: "/leadgeneration/mutuelle-animale",
  },
  {
    slug: "assurance-emprunteur",
    audience: "particuliers",
    name: "Assurance Emprunteur",
    icon: "HandCoins",
    tagline: "Allégez le coût de votre prêt immobilier grâce à la délégation",
    shortDescription:
      "Nous comparons les contrats d'assurance de prêt pour remplacer celui de votre banque et faire baisser le coût de votre crédit.",
    problem: [
      "L'assurance proposée par la banque représente une part très importante du coût total du crédit.",
      "Beaucoup d'emprunteurs pensent, à tort, ne pas pouvoir changer d'assurance.",
      "Les garanties du contrat bancaire ne sont pas toujours adaptées à votre profil.",
    ],
    approach: [
      "Nous analysons votre offre de prêt et le contrat d'assurance actuel.",
      "Nous recherchons une délégation avec un niveau de garanties équivalent ou supérieur.",
      "Nous nous chargeons du dossier de substitution auprès de votre banque.",
    ],
    products: [
      { name: "Délégation d'assurance de prêt immobilier", description: "Remplacement du contrat groupe de la banque par une assurance individuelle grâce à la loi Lemoine." },
    ],
    partners: [{ name: "Zenioo" }, { name: "iAssur" }, { name: "AFI ESCA" }],
    faq: [
      { q: "Puis-je changer d'assurance emprunteur à tout moment ?", a: "Oui, grâce à la loi Lemoine, vous pouvez changer votre assurance de prêt immobilier à tout moment, sans frais." },
      { q: "La banque peut-elle refuser mon nouveau contrat ?", a: "La banque ne peut refuser que si les garanties du nouveau contrat sont inférieures à celles exigées. Nous vérifions cette équivalence avant toute démarche." },
      { q: "Faut-il un nouveau questionnaire de santé ?", a: "Depuis la loi Lemoine, le questionnaire de santé n'est plus obligatoire pour de nombreux prêts, sous conditions de montant et de durée." },
      { q: "Combien de temps prend le changement ?", a: "Il faut compter en général quelques semaines entre la souscription et la prise d'effet du nouveau contrat auprès de la banque." },
      REMUNERATION_FAQ,
    ],
    isInsurance: true,
    leadPath: "/leadgeneration/assurance-emprunteur",
  },
  {
    slug: "energies-renouvelables",
    audience: "particuliers",
    name: "Énergies Renouvelables",
    icon: "Sun",
    tagline: "Chauffez et produisez votre énergie de façon plus durable",
    shortDescription:
      "Pompes à chaleur et panneaux photovoltaïques : nous vous orientons vers l'équipement le plus adapté à votre logement.",
    problem: [
      "Les factures d'énergie pèsent de plus en plus lourd dans le budget d'un foyer.",
      "Le marché est saturé d'installateurs peu scrupuleux et de démarchages agressifs.",
      "Difficile de savoir quelle technologie choisir entre pompe à chaleur, climatisation réversible et photovoltaïque.",
    ],
    approach: [
      "Nous étudions votre logement, votre chauffage actuel et vos besoins.",
      "Nous vous orientons vers la technologie et la marque les plus adaptées.",
      "Nous vous mettons en relation avec un installateur partenaire sérieux et certifié.",
    ],
    products: [
      { name: "Pompe à chaleur Air/Eau", description: "Remplace votre chaudière et chauffe l'eau de vos radiateurs ou de votre plancher chauffant." },
      { name: "Pompe à chaleur Air/Air réversible", description: "Chauffage en hiver, climatisation en été." },
      { name: "Panneaux photovoltaïques", description: "Produisez votre propre électricité et réduisez durablement votre facture." },
    ],
    partners: [
      { name: "Daikin", note: "Leader mondial du marché. La gamme Altherma est plébiscitée en rénovation comme en construction neuve. Rendements élevés, compresseurs très fiables et réseau de SAV parmi les plus denses de France." },
      { name: "Atlantic", note: "Le champion français, avec une fabrication vendéenne. La gamme Alféa Extensa est l'une des plus vendues du pays. Excellent rapport qualité/prix et disponibilité immédiate des pièces détachées." },
      { name: "Mitsubishi Electric", note: "Référence absolue pour les performances par grand froid grâce à la technologie brevetée Zubadan, qui maintient la puissance de chauffage jusqu'à -15 °C. Fonctionnement particulièrement silencieux." },
    ],
    faq: [
      { q: "Quelle solution choisir entre pompe à chaleur Air/Eau et Air/Air ?", a: "L'Air/Eau remplace une chaudière et alimente un circuit de chauffage central. L'Air/Air est plus adaptée à des logements sans radiateurs à eau et permet la climatisation en été." },
      { q: "Existe-t-il des aides financières ?", a: "Oui, plusieurs dispositifs existent selon votre équipement et vos revenus. Nous vous orientons vers un installateur en mesure de vous accompagner sur ces démarches." },
      { q: "Est-ce que je peux revendre l'électricité produite par mes panneaux ?", a: "Oui, vous pouvez consommer votre production, revendre le surplus ou revendre la totalité selon le contrat choisi avec le gestionnaire de réseau." },
      { q: "Les installateurs sont-ils certifiés ?", a: "Nous travaillons uniquement avec des installateurs sérieux, disposant des certifications requises pour vous permettre de bénéficier des dispositifs d'aide." },
      REMUNERATION_FAQ,
    ],
    isInsurance: false,
    leadPath: "/leadgeneration/energies-renouvelables",
  },
  {
    slug: "monetique",
    audience: "professionnels",
    name: "Monétique",
    icon: "CreditCard",
    tagline: "Encaissez vos clients simplement, en boutique comme en ligne",
    shortDescription:
      "Terminaux de paiement, encaissement e-commerce et liens de paiement : nous équipons votre activité au bon tarif.",
    problem: [
      "Les commissions bancaires sur les paiements par carte sont souvent élevées et peu lisibles.",
      "Les contrats de location de TPE incluent des frais cachés et des durées d'engagement longues.",
      "Multiplier les canaux d'encaissement (boutique, mobile, en ligne) devient vite complexe.",
    ],
    approach: [
      "Nous analysons votre volume de transactions et vos canaux d'encaissement.",
      "Nous comparons les offres de nos partenaires monétique.",
      "Nous vous accompagnons sur la mise en place et la prise en main des outils.",
    ],
    products: [
      { name: "TPE fixe", description: "Terminal de paiement pour votre point de vente, avec connexion filaire ou Wi-Fi." },
      { name: "TPE mobile", description: "Terminal autonome 4G pour encaisser partout, en déplacement ou en livraison." },
      { name: "Encaissement e-commerce", description: "Solution de paiement pour votre site marchand, avec intégrations standard." },
      { name: "Lien de paiement à distance", description: "Envoyez un lien de paiement sécurisé par SMS, email ou messagerie." },
    ],
    partners: [{ name: "myPOS" }],
    faq: [
      { q: "Combien de temps faut-il pour être équipé ?", a: "Une fois le contrat validé, la livraison du terminal et l'ouverture du compte marchand prennent en général quelques jours ouvrés." },
      { q: "Quelle est la différence entre location et achat du TPE ?", a: "L'achat évite les loyers récurrents mais demande un investissement initial. La location inclut souvent la maintenance et l'évolution du matériel." },
      { q: "Puis-je encaisser en boutique et en ligne avec le même partenaire ?", a: "Oui, nos partenaires proposent des solutions unifiées qui centralisent vos encaissements physiques et en ligne dans un seul espace." },
      { q: "Les fonds arrivent-ils rapidement sur mon compte ?", a: "Les délais de versement dépendent du partenaire et de l'offre choisie. Nous vous précisons ces conditions avant toute souscription." },
      REMUNERATION_FAQ,
    ],
    isInsurance: false,
    leadPath: "/leadgeneration/monetique",
  },
  {
    slug: "energie",
    audience: "professionnels",
    name: "Énergie",
    icon: "Factory",
    tagline: "Maîtrisez le budget énergie de votre entreprise",
    shortDescription:
      "Nous négocions vos contrats d'électricité et de gaz professionnels et optimisons vos consommations multi-sites.",
    problem: [
      "Les prix de l'énergie professionnelle sont volatils et difficiles à sécuriser dans la durée.",
      "Les factures multi-sites sont chronophages à analyser et à comparer.",
      "Les contrats d'entreprise comportent des clauses complexes qui appellent une vraie expertise.",
    ],
    approach: [
      "Nous auditons vos factures et vos points de livraison.",
      "Nous consultons nos fournisseurs partenaires pour obtenir des propositions comparables.",
      "Nous vous accompagnons dans la décision et le suivi du contrat dans la durée.",
    ],
    products: [
      { name: "Contrat électricité entreprise", description: "Offres adaptées aux TPE, PME et sites industriels." },
      { name: "Contrat gaz entreprise", description: "Contrats de gaz naturel pour vos process, votre chauffage et votre eau chaude." },
      { name: "Optimisation multi-sites", description: "Consolidation et négociation d'un contrat unique pour l'ensemble de vos sites." },
    ],
    partners: [
      { name: "Octopus Energy" },
      { name: "Ilek" },
      { name: "Engie" },
      { name: "Selectra" },
      { name: "TotalEnergies" },
      { name: "OHM Énergie" },
      { name: "Gazel Énergie" },
      { name: "Eneffic" },
      { name: "Jeety" },
      { name: "Vattenfall" },
    ],
    faq: [
      { q: "Puis-je changer de fournisseur en cours d'année ?", a: "Cela dépend de votre contrat en cours et de sa date d'échéance. Nous analysons vos conditions de sortie avant toute démarche." },
      { q: "Le changement de fournisseur entraîne-t-il une coupure ?", a: "Non, il n'y a jamais de coupure. Vos compteurs restent en place et aucune intervention technique n'est nécessaire." },
      { q: "Comment sécuriser un prix dans le temps ?", a: "Nous étudions avec vous les offres à prix fixe, indexé ou hybride afin de trouver l'équilibre entre stabilité et compétitivité." },
      { q: "Gérez-vous les entreprises multi-sites ?", a: "Oui, nous savons consolider plusieurs points de livraison dans une même consultation et négocier un contrat cadre pour l'ensemble." },
      REMUNERATION_FAQ,
    ],
    isInsurance: false,
    leadPath: "/leadgeneration/energie-pro",
  },
];

export function getVerticalsByAudience(audience: Audience): Vertical[] {
  return VERTICALS.filter((v) => v.audience === audience);
}

export function getVerticalBySlug(audience: Audience, slug: string): Vertical | undefined {
  return VERTICALS.find((v) => v.audience === audience && v.slug === slug);
}

export function getAllPartnerNames(): string[] {
  const set = new Set<string>();
  for (const v of VERTICALS) for (const p of v.partners) set.add(p.name);
  return Array.from(set);
}

export const COMPANY = {
  name: "MERCIKI",
  legalForm: "SAS",
  capital: "100 €",
  siren: "930 963 541",
  rcs: "RCS Paris 930 963 541",
  address: {
    street: "10 rue de la Paix",
    zip: "75002",
    city: "Paris",
    full: "10 rue de la Paix, 75002 Paris",
  },
  phone: {
    display: "07 56 90 63 70",
    href: "tel:+33756906370",
  },
} as const;

export const BROKER = {
  name: "ZEPPELIN",
  orias: "25004656",
  note: "MERCIKI agit en qualité d'apporteur d'affaires. Les opérations de courtage en assurance sont réalisées par notre partenaire ZEPPELIN, immatriculé à l'ORIAS sous le n° 25004656.",
} as const;

export const TRUST = {
  yearsOfExperience: 25,
  expertiseAreas: 8,
  partnersCount: getAllPartnerNames().length,
  freeService: "100 % gratuit et sans engagement",
} as const;
