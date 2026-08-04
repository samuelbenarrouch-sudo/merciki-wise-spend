import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/pages/legal-page";

export const Route = createFileRoute("/_public/conditions-generales")({
  head: () => ({
    meta: [
      { title: "Conditions générales — MERCIKI" },
      { name: "description", content: "Conditions générales d'utilisation du site MERCIKI." },
      { property: "og:title", content: "Conditions générales — MERCIKI" },
      { property: "og:description", content: "Conditions générales d'utilisation du site MERCIKI." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage title="Conditions générales">
      <h2>Champ d'application</h2>
      <p>
        Ces conditions régissent l'utilisation du site merciki.online par tout visiteur, particulier
        ou professionnel.
      </p>

      <h2>Nature du service</h2>
      <p>
        MERCIKI est un apporteur d'affaires. Nous mettons en relation les utilisateurs avec des
        fournisseurs et assureurs partenaires. Nous n'exécutons pas les contrats.
      </p>

      <h2>Responsabilité de l'utilisateur</h2>
      <p>
        L'utilisateur garantit que les informations qu'il fournit sont exactes et à jour. Toute
        fausse déclaration engage sa responsabilité.
      </p>

      <h2>Responsabilité de MERCIKI</h2>
      <p>
        MERCIKI s'efforce de fournir des informations exactes, mais ne garantit pas l'exhaustivité
        ou la mise à jour des données. Les partenaires assument leur responsabilité propre.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Tous les contenus sont protégés. Aucune reproduction, adaptation ou exploitation sans
        accord écrit.
      </p>

      <h2>Liens externes</h2>
      <p>
        MERCIKI ne maîtrise pas les contenus externes. Les liens vers des sites tiers sont
        fournis à titre informatif.
      </p>

      <h2>Modification des conditions</h2>
      <p>
        MERCIKI se réserve le droit de modifier ces conditions. L'utilisation continue du site
        vaut acceptation.
      </p>

      <h2>Droit applicable</h2>
      <p>Les présentes conditions sont régies par la loi française.</p>

      <h2>Litiges</h2>
      <p>Les litiges relèvent de la compétence des tribunaux français.</p>
    </LegalPage>
  );
}