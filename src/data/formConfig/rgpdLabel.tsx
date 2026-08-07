import { Link } from "@tanstack/react-router";

export const CONSENT_LABEL = (
  <>
    Le prospect a donné son accord pour être recontacté et pour le traitement de
    ses données par MERCIKI et ses partenaires.{" "}
    <Link
      to="/politique-de-confidentialite"
      className="text-primary underline hover:no-underline"
      target="_blank"
      rel="noopener"
    >
      Politique de confidentialité
    </Link>
  </>
);

export const FR_PHONE_REGEX = /^0[67](?:[\s.-]?\d{2}){4}$/;
export const PHONE_ERROR = "Numéro invalide (format FR : 06/07 + 8 chiffres)";