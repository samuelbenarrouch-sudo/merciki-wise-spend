import { createFileRoute, notFound } from "@tanstack/react-router";
import { Container } from "@/components/ui/container";
import { VerticalPage } from "@/components/pages/vertical-page";
import { ResponsablesB2B } from "@/components/pages/responsables-b2b";
import { EnergieProCard } from "@/components/pages/energie-pro-card";
import { getVerticalBySlug } from "@/data/verticals";
import { absoluteUrl } from "@/lib/seo";

const SEO_TITLE: Record<string, string> = {
  monetique: "Monétique et encaissement pour professionnels | MERCIKI",
  energie: "Renégociation des contrats d'énergie professionnels | MERCIKI",
};

export const Route = createFileRoute("/_public/professionnels/$slug")({
  loader: ({ params }) => {
    const vertical = getVerticalBySlug("professionnels", params.slug);
    if (!vertical) throw notFound();
    return { vertical };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Page introuvable — MERCIKI" }, { name: "robots", content: "noindex" }] };
    }
    const v = loaderData.vertical;
    const title = SEO_TITLE[v.slug] ?? `${v.name} pour professionnels | MERCIKI`;
    const description = v.shortDescription;
    const url = absoluteUrl(`/professionnels/${params.slug}`);
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
  component: ProVerticalRouteComponent,
  notFoundComponent: ProVerticalNotFound,
  errorComponent: ProVerticalNotFound,
});

function ProVerticalRouteComponent() {
  const { vertical } = Route.useLoaderData();
  return (
    <>
      <VerticalPage vertical={vertical} audience="professionnels" afterHero={<ResponsablesB2B />} />
      {vertical.slug === "energie" && (
        <Container className="pb-16">
          <div className="max-w-2xl">
            <EnergieProCard />
          </div>
        </Container>
      )}
    </>
  );
}

function ProVerticalNotFound() {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-h1 text-ink">Solution introuvable</h1>
      <p className="mt-4 text-body text-slate">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
    </Container>
  );
}