import { Car, Bike, House, type LucideIcon } from "lucide-react";

export interface AssuranceParticuliere {
  slug: string;
  name: string;
  icon: LucideIcon;
  accroche: string;
  paragraphe: string;
  metaTitle: string;
  metaDescription: string;
  garanties: { name: string; short: string; description: string; points: string[] }[];
  profils: string[];
  etapes: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
}

export const ASSURANCES_PARTICULIERES: AssuranceParticuliere[] = [
  {
    slug: "assurance-auto",
    name: "Assurance Auto",
    icon: Car,
    accroche: "Le bon niveau de garanties, sans payer pour ce qui ne vous sert pas",
    paragraphe:
      "Votre cotisation augmente chaque année alors que votre voiture vieillit ? Nous comparons les offres du marché et vous proposons la formule qui correspond à votre usage réel.",
    metaTitle: "Assurance Auto — comparez et payez le juste prix | MERCIKI",
    metaDescription:
      "Tous risques, tiers étendu ou au tiers : nous comparons les offres et trouvons la formule adaptée à votre véhicule et à votre usage.",
    garanties: [
      {
        name: "Formule au tiers",
        short: "Responsabilité civile",
        description:
          "La garantie minimale obligatoire. Elle couvre les dommages que vous causez à autrui, jamais les vôtres.",
        points: [
          "Obligatoire pour circuler",
          "Adaptée aux véhicules anciens ou de faible valeur",
          "Souvent complétée par une protection du conducteur",
        ],
      },
      {
        name: "Formule tiers étendu",
        short: "Le bon compromis",
        description:
          "La responsabilité civile complétée des garanties qui comptent au quotidien : vol, incendie, bris de glace, catastrophes naturelles.",
        points: [
          "Protège contre les sinistres les plus fréquents",
          "Bon équilibre entre couverture et cotisation",
          "Modulable selon vos priorités",
        ],
      },
      {
        name: "Formule tous risques",
        short: "Couverture maximale",
        description:
          "Vos dommages sont couverts même lorsque vous êtes responsable, et même sans tiers identifié.",
        points: [
          "Recommandée pour un véhicule récent ou financé",
          "Franchise et plafonds expliqués clairement",
          "Options : véhicule de remplacement, valeur à neuf",
        ],
      },
    ],
    profils: [
      "Conducteurs cherchant à faire baisser une cotisation qui a dérivé",
      "Véhicules récents ou financés à la recherche d'une couverture large",
      "Jeunes conducteurs et conducteurs peu expérimentés",
      "Conducteurs ayant connu un sinistre ou une résiliation",
      "Foyers assurant plusieurs véhicules",
      "Véhicules peu utilisés, pour lesquels le kilométrage doit peser",
    ],
    etapes: [
      {
        title: "Nous partons de votre usage réel",
        desc: "Kilométrage, trajets, stationnement, conducteurs déclarés : c'est ce qui détermine le prix, bien plus que le modèle du véhicule.",
      },
      {
        title: "Nous situons votre couverture actuelle",
        desc: "Nous regardons ce que vous payez, pour quelles garanties, et ce qui manque ou ce qui est superflu.",
      },
      {
        title: "Nous comparons plusieurs assureurs",
        desc: "Notre partenaire courtage met les compagnies en concurrence sur votre profil précis.",
      },
      {
        title: "Nous gérons la bascule",
        desc: "Résiliation de l'ancien contrat, date d'effet, attestation : la transition se fait sans coupure de garantie.",
      },
    ],
    faq: [
      {
        q: "Puis-je changer d'assurance auto à tout moment ?",
        a: "Après un an de contrat, oui, à tout moment et sans frais — c'est la loi Hamon. Avant un an, il faut attendre l'échéance annuelle, sauf changement de situation.",
      },
      {
        q: "Qui résilie mon contrat actuel ?",
        a: "Le nouvel assureur s'en charge dans la plupart des cas. Nous vérifions que la date d'effet du nouveau contrat coïncide avec la résiliation, pour éviter tout jour sans garantie.",
      },
      {
        q: "Mon bonus-malus me suit-il ?",
        a: "Oui. Votre coefficient est attaché à vous, pas à votre contrat, et figure sur votre relevé d'information.",
      },
      {
        q: "J'ai été résilié par mon assureur, puis-je être assuré ?",
        a: "Oui. Certaines compagnies sont spécialisées dans ces profils. La démarche prend simplement un peu plus de temps.",
      },
      {
        q: "Comment MERCIKI est-elle rémunérée ?",
        a: "Par ses partenaires, jamais par vous. Le service est gratuit et sans engagement.",
      },
    ],
  },
  {
    slug: "assurance-moto",
    name: "Assurance Moto et 2-roues",
    icon: Bike,
    accroche: "Scooter, 125 ou grosse cylindrée : la couverture adaptée à votre pratique",
    paragraphe:
      "Trajets quotidiens ou balades du dimanche, un scooter en ville ou une routière : les besoins n'ont rien à voir, et les tarifs non plus. Nous comparons sur votre usage réel.",
    metaTitle: "Assurance Moto et 2-roues — comparez les offres | MERCIKI",
    metaDescription:
      "Scooter, 125, moto : nous comparons les assurances 2-roues et trouvons la formule adaptée à votre cylindrée et à votre usage.",
    garanties: [
      {
        name: "Formule au tiers",
        short: "Responsabilité civile",
        description:
          "La garantie obligatoire pour circuler. Elle couvre les dommages causés à autrui, jamais les vôtres ni votre machine.",
        points: [
          "Obligatoire, y compris pour un cyclomoteur",
          "Adaptée aux petites cylindrées et aux véhicules anciens",
          "Protection du conducteur vivement recommandée en complément",
        ],
      },
      {
        name: "Formule intermédiaire",
        short: "Vol et incendie",
        description:
          "La responsabilité civile complétée du vol, de l'incendie et souvent des catastrophes naturelles.",
        points: [
          "Le vol est le premier risque en 2-roues",
          "Conditions liées au dispositif antivol et au stationnement",
          "Bon compromis pour un véhicule de valeur moyenne",
        ],
      },
      {
        name: "Formule tous risques",
        short: "Couverture maximale",
        description:
          "Vos dommages sont couverts, y compris lorsque vous êtes responsable ou en cas de chute seule.",
        points: [
          "Recommandée pour une machine récente ou de valeur",
          "Garantie équipement du pilote en option",
          "Assistance et véhicule de remplacement selon les contrats",
        ],
      },
    ],
    profils: [
      "Conducteurs de scooters urbains, 50 ou 125 cm³",
      "Motards utilisant leur machine au quotidien",
      "Pratique de loisir ou saisonnière",
      "Titulaires du permis B roulant en 125 après formation",
      "Machines de valeur nécessitant une couverture étendue",
      "Conducteurs cherchant une garantie équipement du pilote",
    ],
    etapes: [
      {
        title: "Nous partons de votre pratique",
        desc: "Trajets quotidiens ou loisir, kilométrage, stationnement de nuit : c'est ce qui pèse le plus sur la cotisation.",
      },
      {
        title: "Nous tenons compte de la machine",
        desc: "Cylindrée, ancienneté, valeur, dispositif antivol : chaque élément change les conditions proposées.",
      },
      {
        title: "Nous comparons plusieurs assureurs",
        desc: "Notre partenaire courtage met les compagnies en concurrence sur votre profil précis.",
      },
      {
        title: "Nous gérons la bascule",
        desc: "Résiliation, date d'effet, attestation : la transition se fait sans coupure de garantie.",
      },
    ],
    faq: [
      {
        q: "L'assurance est-elle obligatoire pour un scooter 50 cm³ ?",
        a: "Oui. Tout véhicule terrestre à moteur doit être assuré, y compris un cyclomoteur non immatriculé et même à l'arrêt.",
      },
      {
        q: "Mon équipement est-il couvert ?",
        a: "Pas systématiquement. Casque, blouson et gants relèvent d'une garantie équipement du pilote, à demander explicitement.",
      },
      {
        q: "Puis-je assurer une 125 avec un permis B ?",
        a: "Oui, sous réserve d'avoir suivi la formation de 7 heures et de détenir le permis depuis au moins deux ans, sauf cas d'équivalence.",
      },
      {
        q: "Le stationnement change-t-il le tarif ?",
        a: "Nettement. Le vol étant le premier risque en 2-roues, un garage fermé et un antivol agréé pèsent fortement sur la cotisation.",
      },
      {
        q: "Comment MERCIKI est-elle rémunérée ?",
        a: "Par ses partenaires, jamais par vous. Le service est gratuit et sans engagement.",
      },
    ],
  },
  {
    slug: "assurance-habitation",
    name: "Assurance Habitation",
    icon: House,
    accroche: "Votre logement bien couvert, sans garanties inutiles",
    paragraphe:
      "Locataire ou propriétaire, appartement ou maison : nous comparons les offres et ajustons la couverture à ce que vous avez vraiment à protéger.",
    metaTitle: "Assurance Habitation — comparez et économisez | MERCIKI",
    metaDescription:
      "Locataire ou propriétaire, appartement ou maison : nous comparons les assurances habitation et ajustons vos garanties à vos besoins réels.",
    garanties: [
      {
        name: "Multirisque habitation",
        short: "La couverture de base",
        description:
          "Incendie, dégâts des eaux, vol, bris de glace, catastrophes naturelles : le socle qui protège votre logement et son contenu.",
        points: [
          "Obligatoire pour un locataire",
          "Vivement recommandée pour un propriétaire",
          "Modulable selon la valeur de vos biens",
        ],
      },
      {
        name: "Responsabilité civile",
        short: "Vous et votre foyer",
        description:
          "Couvre les dommages que vous, vos proches ou vos animaux causez à autrui, chez vous comme à l'extérieur.",
        points: [
          "Incluse dans la plupart des contrats habitation",
          "Couvre l'ensemble du foyer",
          "Étendue possible à la vie privée",
        ],
      },
      {
        name: "Garanties complémentaires",
        short: "Selon votre situation",
        description:
          "Objets de valeur, piscine, dépendances, panneaux solaires, protection juridique, assistance en cas de sinistre.",
        points: [
          "Ajustées à votre logement et à son équipement",
          "Franchises et plafonds expliqués clairement",
          "Utiles surtout en maison individuelle",
        ],
      },
    ],
    profils: [
      "Locataires devant justifier d'une attestation d'assurance",
      "Propriétaires occupants d'une maison ou d'un appartement",
      "Propriétaires bailleurs souhaitant protéger leur bien",
      "Résidences secondaires et logements occupés par intermittence",
      "Colocataires cherchant une couverture adaptée",
      "Foyers dont la cotisation a dérivé au fil des années",
    ],
    etapes: [
      {
        title: "Nous partons de votre logement",
        desc: "Type, surface, nombre de pièces, dépendances : la base de toute tarification.",
      },
      {
        title: "Nous évaluons ce qu'il y a à protéger",
        desc: "Mobilier, équipements, objets de valeur : c'est ce qui détermine le niveau de couverture utile.",
      },
      {
        title: "Nous comparons plusieurs assureurs",
        desc: "Notre partenaire courtage met les compagnies en concurrence sur votre situation précise.",
      },
      {
        title: "Nous gérons la bascule",
        desc: "Résiliation, date d'effet, attestation : la transition se fait sans coupure de garantie.",
      },
    ],
    faq: [
      {
        q: "L'assurance habitation est-elle obligatoire ?",
        a: "Pour un locataire, oui. Pour un propriétaire occupant, elle ne l'est qu'en copropriété, mais s'en passer revient à supporter seul un sinistre.",
      },
      {
        q: "Puis-je changer d'assurance à tout moment ?",
        a: "Après un an de contrat, oui, à tout moment et sans frais. Le nouvel assureur se charge en général de la résiliation.",
      },
      {
        q: "Comment estimer la valeur de mes biens ?",
        a: "En additionnant ce qu'il faudrait racheter après un sinistre total. Sous-évaluer expose à une indemnisation réduite.",
      },
      {
        q: "Mes objets de valeur sont-ils couverts ?",
        a: "Au-delà d'un certain montant, ils doivent être déclarés spécifiquement. Sans déclaration, l'indemnisation est plafonnée.",
      },
      {
        q: "Comment MERCIKI est-elle rémunérée ?",
        a: "Par ses partenaires, jamais par vous. Le service est gratuit et sans engagement.",
      },
    ],
  },
];

export function getAssuranceParticuliere(slug: string): AssuranceParticuliere | undefined {
  return ASSURANCES_PARTICULIERES.find((a) => a.slug === slug);
}
