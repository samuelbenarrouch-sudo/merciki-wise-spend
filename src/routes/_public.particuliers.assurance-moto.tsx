import { createFileRoute } from "@tanstack/react-router";
import { AssuranceParticulierePage } from "@/components/pages/assurance-particuliere-page";
import { getAssuranceParticuliere } from "@/data/assurances-particulieres";
import { absoluteUrl } from "@/lib/seo";

const data = getAssuranceParticuliere("assurance-moto")!;

export const Route = createFileRoute("/_public/particuliers/assurance-moto")({
  head: () => {
    const url = absoluteUrl("/particuliers/assurance-moto");
    return {
      meta: [
        { title: data.metaTitle },
        { name: "description", content: data.metaDescription },
        { property: "og:title", content: data.metaTitle },
        { property: "og:description", content: data.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: () => <AssuranceParticulierePage data={data} />,
});
