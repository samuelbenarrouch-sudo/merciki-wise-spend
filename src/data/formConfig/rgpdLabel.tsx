import { Link } from "@tanstack/react-router";

export const RGPD_LABEL = (
  <>
    J'accepte que mes données soient utilisées pour cette demande.{" "}
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