import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getProduct } from "@/data/products";
import { listPotentialDuplicates } from "@/lib/backoffice";

export const Route = createFileRoute("/leadgeneration/admin/doublons")({
  component: AdminDuplicatesPage,
});

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LeadCard({
  reference,
  createdAt,
  leadId,
  tone,
}: {
  reference: string | null;
  createdAt: string | null;
  leadId: string | null;
  tone: "current" | "earlier";
}) {
  return (
    <div className="flex-1 rounded-xl border border-mist bg-mist/30 p-4">
      <p className="text-label uppercase tracking-wider text-slate">
        {tone === "current" ? "Lead récent" : "Lead antérieur"}
      </p>
      <p className="mt-1 text-body font-medium text-ink">{reference ?? "—"}</p>
      <p className="mt-1 text-small text-slate">{formatDateTime(createdAt)}</p>
      {leadId ? (
        <Link
          to="/leadgeneration/admin/lead/$leadId"
          params={{ leadId }}
          className="mt-2 inline-block text-small font-medium text-primary hover:underline"
        >
          Ouvrir la fiche
        </Link>
      ) : null}
    </div>
  );
}

function AdminDuplicatesPage() {
  const query = useQuery({
    queryKey: ["admin-duplicates"],
    queryFn: () => listPotentialDuplicates(),
  });

  return (
    <div className="py-8 lg:py-10">
      <Container>
        <h1 className="text-h2 text-ink">Doublons potentiels</h1>
        <p className="mt-2 max-w-2xl text-small text-slate">
          Même téléphone, même produit, moins de 90 jours d'écart. Ces
          rapprochements ne sont visibles que par un administrateur.
        </p>

        {query.isLoading ? (
          <div className="flex items-center gap-2 py-16 text-slate">
            <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.75} />
            <span className="text-small">Chargement…</span>
          </div>
        ) : !query.data?.ok ? (
          <p className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-small text-destructive">
            {query.data?.error}
          </p>
        ) : query.data.data.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-mist bg-mist/40 p-10 text-center">
            <p className="text-body font-medium text-ink">Aucun doublon détecté</p>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {query.data.data.map((dup) => (
              <li
                key={`${dup.lead_id}-${dup.earlier_lead_id}`}
                className="rounded-2xl border border-mist bg-background p-5"
              >
                <p className="text-small text-slate">
                  {getProduct(dup.product_code ?? "")?.label ?? dup.product_code} ·{" "}
                  {dup.phone_digits}
                </p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <LeadCard
                    tone="current"
                    reference={dup.lead_reference}
                    createdAt={dup.created_at}
                    leadId={dup.lead_id}
                  />
                  <LeadCard
                    tone="earlier"
                    reference={dup.earlier_lead_reference}
                    createdAt={dup.earlier_created_at}
                    leadId={dup.earlier_lead_id}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
}
