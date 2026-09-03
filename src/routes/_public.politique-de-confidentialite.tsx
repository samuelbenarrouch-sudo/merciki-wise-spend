import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/pages/legal-page";
import { canonical } from "@/lib/seo";

export const Route = createFileRoute("/_public/politique-de-confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — MERCIKI" },
      {
        name: "description",
        content:
          "Politique de confidentialité de MERCIKI : données collectées, finalités, destinataires, durées de conservation, sécurité et vos droits.",
      },
      { property: "og:title", content: "Politique de confidentialité — MERCIKI" },
      {
        property: "og:description",
        content: "Comment MERCIKI collecte, protège et utilise vos données personnelles.",
      },
    ],
    links: canonical("/politique-de-confidentialite").links,
  }),
  component: PrivacyPolicyPage,
});

const EMAIL = "merciki.energy@gmail.com";

function PrivacyPolicyPage() {
  return (
    <LegalPage title="Politique de confidentialité">
      <p className="text-small text-muted-foreground">Dernière mise à jour : septembre 2026</p>

      <h2>1. Qui traite vos données</h2>
      <p>
        MERCIKI, société par actions simplifiée au capital de 100 €, immatriculée au RCS de Paris
        sous le numéro 930 963 541, dont le siège social est situé 10 rue de la Paix, 75002 Paris,
        est responsable des traitements décrits ci-dessous.
      </p>
      <p>
        Contact : <a href={`mailto:${EMAIL}`}>{EMAIL}</a> — ou par courrier à l'adresse du siège.
      </p>

      <h2>2. Les données que nous traitons, et pourquoi</h2>

      <h3>2.1 Demandes de particuliers et de professionnels</h3>
      <p>
        Lorsque vous nous confiez une demande d'optimisation — directement ou par l'intermédiaire
        d'un commercial de notre réseau — nous collectons :
      </p>
      <ul>
        <li>votre identité : nom, prénom</li>
        <li>vos coordonnées : téléphone, et email si vous nous le communiquez</li>
        <li>votre localisation : code postal</li>
        <li>
          pour les professionnels : raison sociale, numéro SIREN, adresse de l'établissement
        </li>
        <li>
          les informations nécessaires à l'étude de votre demande, variables selon le produit :
          fournisseur actuel, montant de vos dépenses, caractéristiques de votre logement ou de
          votre activité, échéance de vos contrats
        </li>
      </ul>
      <p>
        Finalité : étudier votre demande, comparer les offres disponibles et transmettre votre
        dossier au partenaire le mieux placé pour y répondre.
      </p>
      <p>
        Base légale : votre consentement, recueilli avant toute collecte, horodaté et conservé.
      </p>
      <p>
        Nous ne collectons aucune donnée de santé. Les questionnaires médicaux, lorsqu'ils sont
        nécessaires, relèvent exclusivement de l'assureur et ne transitent jamais par nous.
      </p>

      <h3>2.2 Candidatures au réseau commercial</h3>
      <p>Lorsque vous postulez pour rejoindre notre réseau :</p>
      <ul>
        <li>identité et coordonnées : nom, prénom, email, téléphone</li>
        <li>départements sur lesquels vous pouvez intervenir</li>
        <li>produits qui vous intéressent</li>
        <li>expérience en vente terrain, situation actuelle, disponibilité</li>
        <li>lien professionnel et message libre, si vous en fournissez</li>
      </ul>
      <p>Finalité : étudier votre candidature et vous recontacter.</p>
      <p>
        Base légale : votre consentement, et les démarches préalables à une éventuelle relation
        contractuelle.
      </p>

      <h3>2.3 Comptes des commerciaux du réseau</h3>
      <p>
        Pour les membres de notre réseau disposant d'un accès à nos outils : email, nom, rôle,
        rattachement hiérarchique, état d'activité, et l'historique de leurs actions dans l'outil.
      </p>
      <p>Finalité : authentification, attribution des dossiers, traçabilité.</p>
      <p>Base légale : l'exécution du contrat qui nous lie.</p>

      <h3>2.4 Demandes de contact</h3>
      <p>
        Les informations que vous nous transmettez via le formulaire de contact, pour répondre à
        votre demande, sur la base de votre consentement.
      </p>

      <h2>3. À qui vos données sont transmises</h2>

      <h3>3.1 En interne</h3>
      <p>
        Le commercial qui a recueilli votre demande, son responsable hiérarchique le cas échéant,
        et l'administration de MERCIKI. Nos outils cloisonnent techniquement ces accès : un
        commercial ne peut pas consulter les dossiers d'un autre.
      </p>

      <h3>3.2 Nos partenaires</h3>
      <p>
        Selon le produit concerné, votre dossier est transmis au fournisseur ou au partenaire
        susceptible de vous faire une proposition : fournisseurs d'énergie, opérateurs de
        télécommunications, assureurs, installateurs certifiés, prestataires monétiques.
      </p>
      <p>
        Pour les produits d'assurance, votre dossier est transmis à ZEPPELIN, société par actions
        simplifiée à associé unique, 3 rue de l'Église, 92100 Boulogne-Billancourt, SIRET 942 699
        240 00019, immatriculée à l'ORIAS sous le n° 25004656.
      </p>
      <p>
        ZEPPELIN traite les dossiers d'assurance, exerce le devoir de conseil et intervient en
        qualité d'intermédiaire auprès des compagnies. MERCIKI n'exerce aucune activité de courtage
        en assurance.
      </p>
      <p>
        Ces partenaires deviennent responsables du traitement des données qu'ils reçoivent, pour
        leurs propres finalités.
      </p>

      <h3>3.3 Nos prestataires techniques</h3>
      <table>
        <thead>
          <tr>
            <th>Prestataire</th>
            <th>Rôle</th>
            <th>Localisation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Prestataire">Supabase</td>
            <td data-label="Rôle">Base de données, fichiers, authentification</td>
            <td data-label="Localisation">Union européenne, Paris</td>
          </tr>
          <tr>
            <td data-label="Prestataire">Lovable Labs Sweden AB</td>
            <td data-label="Rôle">Hébergement de l'application</td>
            <td data-label="Localisation">Voir 3.4</td>
          </tr>
          <tr>
            <td data-label="Prestataire">Resend</td>
            <td data-label="Rôle">Envoi des emails de notification</td>
            <td data-label="Localisation">Union européenne</td>
          </tr>
        </tbody>
      </table>
      <p>
        Ces prestataires agissent sur nos instructions, dans le cadre d'accords de traitement des
        données.
      </p>
      <p>Nous ne vendons ni ne louons vos données à quiconque.</p>

      <h3>3.4 Transferts hors de l'Union européenne</h3>
      <p>Vos données de dossier sont stockées en France, sur des serveurs situés à Paris.</p>
      <p>
        L'hébergement de l'application est assuré par Lovable Labs Sweden AB, établissement
        européen du groupe Lovable Labs Incorporated, société de droit américain. Les conditions de
        ce prestataire ne garantissent pas que les données transitant par la plateforme soient
        traitées ou stockées dans un pays déterminé. Un transfert hors de l'Union européenne ne
        peut donc pas être exclu pour cette partie du service.
      </p>
      <p>
        Ces transferts, lorsqu'ils ont lieu, sont encadrés par les clauses contractuelles types
        adoptées par la Commission européenne.
      </p>
      <p>
        Nous préférons vous l'indiquer clairement plutôt que d'affirmer une localisation que notre
        prestataire ne garantit pas.
      </p>

      <h2>4. Combien de temps nous les conservons</h2>
      <table>
        <thead>
          <tr>
            <th>Donnée</th>
            <th>Durée</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Donnée">Demande sans suite</td>
            <td data-label="Durée">3 ans à compter du dernier contact</td>
          </tr>
          <tr>
            <td data-label="Donnée">Demande ayant abouti à un contrat</td>
            <td data-label="Durée">
              Durée du contrat, puis les délais légaux applicables
            </td>
          </tr>
          <tr>
            <td data-label="Donnée">Candidature non retenue</td>
            <td data-label="Durée">2 ans à compter du dernier contact</td>
          </tr>
          <tr>
            <td data-label="Donnée">Compte d'un commercial</td>
            <td data-label="Durée">Durée de la relation, puis 3 ans</td>
          </tr>
          <tr>
            <td data-label="Donnée">Preuve du consentement</td>
            <td data-label="Durée">
              Aussi longtemps que la donnée à laquelle elle se rapporte
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        La suppression des demandes sans suite est automatisée : une procédure s'exécute chaque
        mois et supprime les dossiers ayant dépassé la durée de conservation.
      </p>

      <h2>5. Comment vos données sont protégées</h2>
      <ul>
        <li>Base de données hébergée en Union européenne, chiffrement en transit et au repos</li>
        <li>
          Authentification individuelle pour chaque membre du réseau, aucun accès partagé
        </li>
        <li>
          Cloisonnement appliqué au niveau de la base de données elle-même : chacun ne peut lire
          que ce qui le concerne
        </li>
        <li>Journal des accès et des modifications</li>
        <li>Refus des mots de passe figurant dans des fuites connues</li>
      </ul>

      <h2>6. Vos droits</h2>
      <p>
        Vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition, de
        limitation et de portabilité de vos données. Vous pouvez retirer votre consentement à tout
        moment, sans que cela remette en cause les traitements déjà effectués.
      </p>
      <p>
        Pour les exercer : écrivez à <a href={`mailto:${EMAIL}`}>{EMAIL}</a>, ou par courrier à
        MERCIKI, 10 rue de la Paix, 75002 Paris. Nous vous répondons dans un délai d'un mois.
      </p>
      <p>
        Nous pouvons vous demander une preuve d'identité si un doute existe sur l'origine de la
        demande.
      </p>
      <p>
        Si votre dossier a déjà été transmis à un partenaire, nous vous indiquerons lequel afin que
        vous puissiez également exercer vos droits auprès de lui.
      </p>
      <p>
        Certaines données rattachées à un contrat conclu peuvent devoir être conservées malgré une
        demande d'effacement, au titre de nos obligations comptables et contractuelles. Nous vous
        l'expliquerons alors précisément.
      </p>
      <p>
        Réclamation : vous pouvez saisir la CNIL — 3 place de Fontenoy, TSA 80715, 75334 Paris
        Cedex 07, ou sur{" "}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener">
          cnil.fr
        </a>
        .
      </p>

      <h2>7. Cookies</h2>
      <p>
        Ce site n'utilise aucun cookie de mesure d'audience, de publicité ou de suivi
        comportemental.
      </p>
      <p>
        Seuls sont utilisés les cookies et éléments de stockage strictement nécessaires à son
        fonctionnement, notamment au maintien de la session des membres du réseau connectés à leur
        espace. Ces éléments ne nécessitent pas votre consentement et ne servent à aucune autre
        finalité.
      </p>

      <h2>8. Modifications</h2>
      <p>
        Cette politique peut évoluer. La date de dernière mise à jour figure en tête de page. En cas
        de changement substantiel, nous en informons les personnes concernées.
      </p>

      <p>
        <Link to="/mentions-legales">Voir également nos mentions légales</Link>.
      </p>
    </LegalPage>
  );
}
