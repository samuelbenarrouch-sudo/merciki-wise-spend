import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/pages/legal-page";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/navigation";

export const Route = createFileRoute("/_public/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — MERCIKI" },
      { name: "description", content: "Mentions légales de MERCIKI : éditeur, hébergement, propriété intellectuelle." },
      { property: "og:title", content: "Mentions légales — MERCIKI" },
      { property: "og:description", content: "Mentions légales de MERCIKI." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LegalNoticePage,
});

function LegalNoticePage() {
  return (
    <LegalPage title="Mentions légales">
      <h2>Entité</h2>
      <p>
        MERCIKI<br />
        10 rue de la Paix, 75002 Paris<br />
        SIREN : 930 963 541<br />
        RCS Paris : 930 963 541<br />
        Téléphone : <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
      </p>

      <h2>Hébergement</h2>
      <p>Ce site est hébergé et construit via Lovable.</p>

      <h2>Responsable éditorial</h2>
      <p>MERCIKI, représentée par son dirigeant.</p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Tous les contenus du site (textes, images, logos) sont la propriété de MERCIKI ou de ses
        partenaires. Toute reproduction ou utilisation est strictement interdite sans accord écrit.
      </p>

      <h2>Responsabilité</h2>
      <p>
        MERCIKI décline toute responsabilité quant aux informations fournies par ses partenaires.
        Les utilisateurs accèdent à ce site à leurs risques et périls.
      </p>
    </LegalPage>
  );
}