import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getProduct } from "@/data/products";
// import { EnergyForm } from "@/components/forms/EnergyForm";
// import { TelecomsForm } from "@/components/forms/TelecomsForm";
// import { MutuelleSanteForm } from "@/components/forms/MutuelleSanteForm";
// import { SanteAnimaleForm } from "@/components/forms/SanteAnimaleForm";
// import { EmprunteurForm } from "@/components/forms/EmprunteurForm";
// import { ENRForm } from "@/components/forms/ENRForm";
// import { MonetiqueForm } from "@/components/forms/MonetiqueForm";

export const Route = createFileRoute("/leadgeneration/product/$productId")({
  head: ({ params }) => {
    const product = params ? getProduct(params.productId) : undefined;
    const label = product?.label ?? "Produit";
    return {
      meta: [
        { name: "robots", content: "noindex, nofollow" },
        { title: `${label} — Espace commercial MERCIKI` },
        {
          name: "description",
          content: `Optimisez vos dépenses en ${label.toLowerCase()}. Qualification de lead MERCIKI.`,
        },
      ],
    };
  },
  beforeLoad: ({ params }) => {
    if (!getProduct(params.productId)) throw notFound();
  },
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId)!;
  const Icon = product.icon;

  return (
    <div className="py-12 lg:py-16">
      <Container>
        <Link
          to="/leadgeneration/dashboard"
          className="inline-flex items-center gap-2 text-small font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Retour au tableau de bord
        </Link>

        <div className="mt-6 flex items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-accent">
            <Icon className="h-7 w-7" strokeWidth={1.75} />
          </span>
          <div>
            <h1 className="text-h1 text-ink">{product.label}</h1>
            <p className="mt-1 text-body text-slate">{product.description}</p>
          </div>
        </div>

        <div className="mt-10 max-w-3xl">
          {product.id === "energie" ? (
            <div>form</div>
          ) : product.id === "telecoms" ? (
            <div>form</div>
          ) : product.id === "mutuelle-sante" ? (
            <div>form</div>
          ) : product.id === "sante-animale" ? (
            <div>form</div>
          ) : product.id === "emprunteur" ? (
            <div>form</div>
          ) : product.id === "enr" ? (
            <div>form</div>
          ) : product.id === "monetique" ? (
            <div>form</div>
          ) : (
            <div className="rounded-2xl bg-mist p-8 text-center text-slate">
              Le formulaire de qualification de lead sera disponible prochainement.
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}