import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/pages/legal-page";

export const Route = createFileRoute("/_public/politique-de-confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — MERCIKI" },
      { name: "description", content: "Politique de confidentialité de MERCIKI : données collectées, finalités et droits." },
      { property: "og:title", content: "Politique de confidentialité — MERCIKI" },
      { property: "og:description", content: "Comment MERCIKI protège et utilise vos données personnelles." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <LegalPage title="Politique de confidentialité">
      <h2>Responsable de traitement</h2>
      <p>MERCIKI, 10 rue de la Paix, 75002 Paris.</p>

      <h2>Données collectées</h2>
      <p>Nous collectons vos :</p>
      <ul>
        <li>Coordonnées (prénom, nom, email, téléphone)</li>
        <li>Données nécessaires à la qualification de votre besoin (type de produit, montant, situation personnelle ou professionnelle)</li>
        <li>Adresse IP et données de navigation (cookies)</li>
      </ul>

      <h2>Finalité du traitement</h2>
      <p>Répondre à votre demande, vous proposer une offre adaptée, vous recontacter, améliorer notre service.</p>

      <h2>Base légale</h2>
      <p>Votre consentement (formulaires explicites), notre intérêt légitime (suivi commercial).</p>

      <h2>Destinataires</h2>
      <p>
        Vos données sont transmises à nos partenaires commerciaux (fournisseurs, assureurs)
        uniquement pour exécuter votre demande. Aucune vente à un tiers.
      </p>

      <h2>Durée de conservation</h2>
      <p>3 ans à compter de votre dernière interaction, sauf obligation légale plus longue.</p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d'un droit d'accès, de rectification, de suppression, de limitation et de
        portabilité. Contactez-nous pour exercer ces droits :{" "}
        <a href="mailto:contact@merciki.online">contact@merciki.online</a>.
      </p>

      <h2>DPO</h2>
      <p>Un responsable de la protection des données est désigné. Contactez-nous pour ses coordonnées.</p>

      <h2>Cookies</h2>
      <p>
        Voir le bandeau de consentement affiché lors de votre première visite. Vous pouvez à tout
        moment nous contacter pour modifier vos préférences.
      </p>

      <p>
        <Link to="/mentions-legales">Voir également nos mentions légales</Link>.
      </p>
    </LegalPage>
  );
}