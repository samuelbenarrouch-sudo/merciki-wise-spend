import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { LeadStatusPill } from "@/components/leads/lead-status-pill";
import {
  MANDATE_LABELS,
  fetchMyLeadFile,
  getMyLead,
  listMyLeadAttachments,
  myLossReasonLabel,
  type MyLeadAttachment,
} from "@/lib/myLeads";
import { formatDetailValue, resolveFieldLabel } from "@/lib/fieldLabels";

export const Route = createFileRoute("/leadgeneration/lead/$leadId")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Fiche lead — Espace commercial MERCIKI" },
    ],
  }),
  component: MyLeadDetailPage,
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

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-mist bg-background p-5">
      <h2 className="text-label uppercase tracking-wider text-slate">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-mist py-2 last:border-0 sm:grid-cols-[240px_1fr] sm:gap-4">
      <dt className="text-small text-slate">{label}</dt>
      <dd className="text-small text-ink">{children}</dd>
    </div>
  );
}

/** Téléchargement via un <a download> détaché : window.open est bloqué par les extensions. */
function triggerDownload(objectUrl: string, fileName: string) {
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function MyLeadDetailPage() {
  const { leadId } = Route.useParams();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const leadQuery = useQuery({
    queryKey: ["my-lead", leadId],
    queryFn: () => getMyLead(leadId),
  });
  const filesQuery = useQuery({
    queryKey: ["my-lead-files", leadId],
    queryFn: () => listMyLeadAttachments(leadId),
  });

  const handleDownload = async (file: MyLeadAttachment) => {
    setFileError(null);
    setDownloading(file.id);
    const res = await fetchMyLeadFile(file.storage_path);
    setDownloading(null);
    if (!res.ok) {
      setFileError(res.error);
      return;
    }
    const objectUrl = URL.createObjectURL(res.data);
    triggerDownload(objectUrl, file.file_name);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
  };

  if (leadQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate">
        <Loader2 className="h-6 w-6 animate-spin" strokeWidth={1.75} />
      </div>
    );
  }

  const result = leadQuery.data;
  if (!result || !result.ok) {
    return (
      <div className="py-12">
        <Container>
          <p className="text-h3 text-ink">Lead introuvable</p>
          <p className="mt-2 text-small text-slate">
            Ce dossier n'existe pas ou n'est pas accessible depuis votre compte.
          </p>
          <Link
            to="/leadgeneration/mes-leads"
            className="mt-6 inline-flex items-center gap-2 text-small font-medium text-primary underline underline-offset-4"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Retour à mes leads
          </Link>
        </Container>
      </div>
    );
  }

  const lead = result.data;
  const productCode = lead.product_code;
  const details = lead.details ?? {};
  const detailKeys = Object.keys(details);
  const files = filesQuery.data?.ok ? filesQuery.data.data : [];

  return (
    <div className="py-8 lg:py-12">
      <Container>
        <Link
          to="/leadgeneration/mes-leads"
          className="inline-flex items-center gap-2 text-small text-slate hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> Retour
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-h2 text-ink">{lead.reference}</h1>
          <LeadStatusPill status={lead.status} />
        </div>
        <p className="mt-2 text-small text-slate">
          {lead.products?.label ?? productCode} · saisi le {formatDateTime(lead.created_at)}
        </p>

        <div className="mt-6 grid gap-4">
          <Section title="Prospect">
            <dl>
              <Row label="Nom">{lead.prospect_last_name}</Row>
              <Row label="Prénom">{lead.prospect_first_name}</Row>
              <Row label="Téléphone">
                <a
                  href={`tel:${lead.prospect_phone.replace(/\s/g, "")}`}
                  className="font-medium text-primary underline underline-offset-4"
                >
                  {lead.prospect_phone}
                </a>
              </Row>
              <Row label="Email">
                {lead.prospect_email ? (
                  <a
                    href={`mailto:${lead.prospect_email}`}
                    className="font-medium text-primary underline underline-offset-4"
                  >
                    {lead.prospect_email}
                  </a>
                ) : (
                  "—"
                )}
              </Row>
              <Row label="Code postal">{lead.postal_code}</Row>
              {lead.company_name && <Row label="Société">{lead.company_name}</Row>}
              {lead.siren && <Row label="SIREN">{lead.siren}</Row>}
            </dl>
          </Section>

          <Section title="Qualification">
            {detailKeys.length === 0 ? (
              <p className="text-small text-slate">Aucune information complémentaire.</p>
            ) : (
              <dl>
                {detailKeys.map((key) => (
                  <Row key={key} label={resolveFieldLabel(productCode, key)}>
                    {formatDetailValue(productCode, key, details[key]).join(", ")}
                  </Row>
                ))}
              </dl>
            )}
          </Section>

          {lead.products?.requires_mandate && (
            <Section title="Mandat ACD">
              <dl>
                <Row label="État">{MANDATE_LABELS[lead.mandate_status]}</Row>
                <Row label="Envoyé le">{formatDateTime(lead.mandate_sent_at)}</Row>
                <Row label="Signé le">{formatDateTime(lead.mandate_signed_at)}</Row>
              </dl>
            </Section>
          )}

          {lead.status === "perdu" && (
            <Section title="Dossier perdu">
              <dl>
                <Row label="Statut">Perdu</Row>
                <Row label="Motif">
                  {lead.loss_reason ? myLossReasonLabel(lead.loss_reason) : "—"}
                </Row>
                {lead.loss_comment && <Row label="Précision">{lead.loss_comment}</Row>}
              </dl>
            </Section>
          )}

          <Section title="Pièces jointes">
            {filesQuery.isLoading ? (
              <p className="text-small text-slate">Chargement…</p>
            ) : files.length === 0 ? (
              <p className="text-small text-slate">Aucune pièce jointe.</p>
            ) : (
              <ul className="grid gap-2">
                {files.map((file) => (
                  <li
                    key={file.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-mist p-3"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-small text-ink">
                        {file.file_name}
                      </span>
                      <span className="block text-xs text-slate">
                        {formatSize(file.size_bytes)}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleDownload(file)}
                      disabled={downloading === file.id}
                      className="inline-flex h-10 items-center gap-2 rounded-lg border border-mist px-3 text-small text-ink disabled:opacity-50"
                    >
                      {downloading === file.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                      ) : (
                        <Download className="h-4 w-4" strokeWidth={1.75} />
                      )}
                      Télécharger
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {fileError && (
              <p className="mt-3 text-small text-destructive">{fileError}</p>
            )}
          </Section>
        </div>
      </Container>
    </div>
  );
}
