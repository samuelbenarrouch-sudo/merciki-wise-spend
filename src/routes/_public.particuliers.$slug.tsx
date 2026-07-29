import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container } from "@/components/ui/container";
import { VerticalPage } from "@/components/pages/vertical-page";
import { getVerticalBySlug } from "@/data/verticals";

const SEO_BENEFIT: Record<string, string> = {
  energie: "faites baisser vos factures d'électricité et de gaz",
  telecoms: "trouvez la box et le forfait mobile adaptés",
  "mutuelle-sante": "trouvez la complémentaire santé qui vous protège vraiment",
  "mutuelle-animale": "assurez votre chien ou votre chat sereinement",
  "assurance-emprunteur": "allégez le coût de votre prêt immobilier",
  "energies-renouvelables": "pompes à chaleur et photovoltaïque bien conseillés",
};

export const Route = createFileRoute("/_public/particuliers/$slug")({
  loader: ({ params }) => {
    const vertical = getVerticalBySlug("particuliers", params.slug);
    if (!vertical) throw notFound();
    return { vertical };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Page introuvable — MERCIKI" }, { name: "robots", content: "noindex" }] };
    }
    const v = loaderData.vertical;
    const benefit = SEO_BENEFIT[v.slug] ?? v.tagline;
    const title = `${v.name} — ${benefit} | MERCIKI`;
    const description = v.shortDescription;
    const url = `/particuliers/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: VerticalRouteComponent,
  notFoundComponent: VerticalNotFound,
  errorComponent: VerticalNotFound,
});

function VerticalRouteComponent() {
  const { vertical } = Route.useLoaderData();
  return <VerticalPage vertical={vertical} />;
}

function VerticalNotFound() {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-h1 text-ink">Solution introuvable</h1>
      <p className="mt-4 text-body text-slate">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
    </Container>
  );
}