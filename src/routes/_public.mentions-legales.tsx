import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/pages/legal-page";
import { canonical } from "@/lib/seo";

export const Route = createFileRoute("/_public/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — MERCIKI" },
      {
        name: "description",
        content:
          "Mentions légales de MERCIKI : éditeur, hébergement, statuts par activité, partenaire de courtage ZEPPELIN, réclamations et propriété intellectuelle.",
      },
      { property: "og:title", content: "Mentions légales — MERCIKI" },
      {
        property: "og:description",
        content: "Mentions légales de MERCIKI : éditeur, hébergement, statuts et responsabilités.",
      },
    ],
    links: canonical("/mentions-legales").links,
  }),
  component: LegalNoticePage,
});

const EMAIL = "merciki.energy@gmail.com";

function LegalNoticePage() {
  return (
    <LegalPage title="Mentions légales">
      <p className="text-small text-muted-foreground">Dernière mise à jour : septembre 2026</p>

      <h2>1. Éditeur du site</h2>
      <p>
        MERCIKI
        <br />
        Société par actions simplifiée au capital de 100 €<br />
        Siège social : 10 rue de la Paix, 75002 Paris
        <br />
        SIREN : 930 963 541 — RCS Paris 930 963 541
        <br />
        Téléphone : 07 56 90 63 70
        <br />
        Email : <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </p>
      <p>Directeur de la publication : Eric MARGULIES</p>

      <h2>2. Hébergement</h2>
      <p>
        Lovable Labs Sweden AB
        <br />
        Aktiebolag (société anonyme de droit suédois)
        <br />
        Numéro d'organisation : 559506-1739
        <br />
        Regeringsgatan 25, 111 53 Stockholm, Suède
      </p>
      <p>
        Établissement européen du groupe Lovable Labs Incorporated, société de droit américain
        (État du Delaware).
      </p>

      <h2>3. Activité et statuts</h2>
      <p>
        MERCIKI accompagne les particuliers et les professionnels dans l'optimisation de leurs
        dépenses contraintes et de leur équipement. Nous comparons les offres du marché,
        sélectionnons celle qui correspond à votre situation, et vous mettons en relation avec le
        partenaire concerné.
      </p>
      <p>
        Notre service est gratuit et sans engagement pour le client. Nous sommes rémunérés par nos
        partenaires.
      </p>
      <p>
        Notre statut diffère selon l'activité concernée. Cette distinction n'est pas formelle :
        elle détermine qui fait quoi, et auprès de qui vous exercez vos droits.
      </p>
      <table>
        <thead>
          <tr>
            <th>Activité</th>
            <th>Statut de MERCIKI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Activité">Énergie, particuliers et professionnels</td>
            <td data-label="Statut de MERCIKI">Apporteur d'affaires et mandataire des fournisseurs</td>
          </tr>
          <tr>
            <td data-label="Activité">Télécommunications</td>
            <td data-label="Statut de MERCIKI">Apporteur d'affaires et distributeur</td>
          </tr>
          <tr>
            <td data-label="Activité">Énergies renouvelables</td>
            <td data-label="Statut de MERCIKI">
              Apporteur d'affaires auprès d'installateurs certifiés RGE
            </td>
          </tr>
          <tr>
            <td data-label="Activité">Monétique</td>
            <td data-label="Statut de MERCIKI">Apporteur d'affaires et distributeur</td>
          </tr>
          <tr>
            <td data-label="Activité">Assurances (santé, animaux, emprunteur, professionnelles)</td>
            <td data-label="Statut de MERCIKI">
              Apporteur d'affaires auprès de notre cabinet de courtage partenaire
            </td>
          </tr>
        </tbody>
      </table>

      <h2>4. Assurances — le rôle de notre partenaire ZEPPELIN</h2>
      <p>
        MERCIKI n'exerce aucune activité de courtage en assurance et n'est pas immatriculée à
        l'ORIAS.
      </p>
      <p>
        Sur l'ensemble des produits d'assurance présentés sur ce site — mutuelle santé, assurance
        animaux, assurance emprunteur, assurances professionnelles — MERCIKI intervient
        exclusivement en qualité d'apporteur d'affaires. Notre rôle se limite à recueillir votre
        demande et à la transmettre à notre partenaire.
      </p>
      <p>L'intégralité de l'activité de courtage est assurée par :</p>
      <p>
        ZEPPELIN
        <br />
        Société par actions simplifiée à associé unique
        <br />
        3 rue de l'Église, 92100 Boulogne-Billancourt
        <br />
        SIRET : 942 699 240 00019
        <br />
        Immatriculée à l'ORIAS sous le numéro 25004656
      </p>
      <p>
        ZEPPELIN traite les dossiers d'assurance, exerce le devoir de conseil, sélectionne les
        compagnies, présente les contrats et assure le suivi de votre souscription. C'est à ce
        titre l'interlocuteur de référence pour toute question relative à votre contrat
        d'assurance.
      </p>
      <p>
        L'immatriculation de ZEPPELIN est vérifiable sur le registre officiel des intermédiaires en
        assurance, banque et finance :{" "}
        <a href="https://www.orias.fr" target="_blank" rel="noopener">
          orias.fr
        </a>
        .
      </p>
      <p>
        L'activité d'intermédiation en assurance est soumise au contrôle de l'Autorité de contrôle
        prudentiel et de résolution (ACPR) — 4 place de Budapest, CS 92459, 75436 Paris Cedex 09.
      </p>

      <h2>5. Réclamations et médiation</h2>
      <p>
        Pour toute réclamation relative à nos services, écrivez à{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> ou par courrier au siège social. Nous accusons
        réception sous dix jours ouvrés et vous répondons dans un délai de deux mois.
      </p>
      <p>
        Pour une réclamation portant sur un contrat d'assurance, adressez-vous directement à
        ZEPPELIN, qui dispose de sa propre procédure de réclamation et de son médiateur. Nous vous
        communiquons ses coordonnées sur simple demande.
      </p>
      <p>
        Conformément à l'article L.612-1 du Code de la consommation, tout consommateur a le droit de
        recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable
        d'un litige l'opposant à un professionnel.
      </p>

      <h2>6. Partenaires et marques citées</h2>
      <p>
        Les noms, marques et logos des fournisseurs, opérateurs, assureurs, fabricants et
        prestataires cités sur ce site appartiennent à leurs titulaires respectifs. Leur mention
        indique une relation commerciale ou une offre référencée ; elle ne constitue ni une
        approbation de leur part, ni un partenariat exclusif.
      </p>

      <h2>7. Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments composant ce site — structure, textes, identité visuelle,
        photographies, code — est protégé par le droit de la propriété intellectuelle et demeure la
        propriété de MERCIKI ou de ses partenaires. Toute reproduction ou représentation, totale ou
        partielle, sans autorisation écrite préalable, est interdite.
      </p>

      <h2>8. Responsabilité</h2>
      <p>
        Les informations publiées sur ce site sont fournies à titre indicatif. Les offres, tarifs
        et conditions des partenaires évoluent : seuls les documents contractuels remis par le
        fournisseur, l'assureur ou l'intermédiaire concerné font foi.
      </p>
      <p>
        MERCIKI ne conclut aucun contrat en ligne. Aucune souscription, aucun paiement ne
        s'effectue sur ce site.
      </p>
      <p>
        Nous mettons tout en œuvre pour assurer l'exactitude des informations publiées, sans
        pouvoir garantir qu'elles soient exemptes d'erreur ou constamment à jour.
      </p>

      <h2>9. Données personnelles</h2>
      <p>
        Le traitement de vos données est décrit dans notre{" "}
        <Link to="/politique-de-confidentialite">politique de confidentialité</Link>.
      </p>
      <p>
        Ce site n'utilise aucun cookie de mesure d'audience, de publicité ou de suivi
        comportemental.
      </p>

      <h2>10. Droit applicable</h2>
      <p>
        Les présentes mentions sont soumises au droit français. En cas de litige, et à défaut de
        résolution amiable, les tribunaux français sont compétents.
      </p>
    </LegalPage>
  );
}
