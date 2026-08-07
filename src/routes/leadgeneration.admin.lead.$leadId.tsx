import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  LEAD_STATUSES,
  LOSS_REASONS,
  MANDATE_STATUS_LABELS,
  getLead,
  listAttachments,
  listLeadEvents,
  lossReasonLabel,
  statusLabel,
  updateLeadStatus,
  type LeadStatus,
  type LossReason,
} from "@/lib/backoffice";
import { formatDetailValue, resolveFieldLabel } from "@/lib/fieldLabels";

export const Route = createFileRoute("/leadgeneration/admin/lead/$leadId")({
  component: AdminLeadPage,
});

const selectClass =
  "h-11 w-full rounded-lg border border-mist bg-background px-3 text-sm text-ink";

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

function AdminLeadPage() {
  const { leadId } = Route.useParams();
  const queryClient = useQueryClient();

  const leadQuery = useQuery({
    queryKey: ["admin-lead", leadId],
    queryFn: () => getLead(leadId),
  });
  const eventsQuery = useQuery({
    queryKey: ["admin-lead-events", leadId],
    queryFn: () => listLeadEvents(leadId),
  });
  const filesQuery = useQuery({
    queryKey: ["admin-lead-files", leadId],
    queryFn: () => listAttachments(leadId),
  });

  const [nextStatus, setNextStatus] = useState<LeadStatus | "">("");
  const [lossReason, setLossReason] = useState<LossReason | "">("");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

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
          <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-small text-destructive">
            {result?.error ?? "Lead introuvable."}
          </p>
        </Container>
      </div>
    );
  }

  const lead = result.data;
  const details = (lead.details ?? {}) as Record<string, unknown>;
  const detailKeys = Object.keys(details);
  const requiresMandate = lead.products?.requires_mandate === true;

  const handleSubmit = async () => {
    if (!nextStatus || saving) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    const res = await updateLeadStatus(
      leadId,
      nextStatus,
      nextStatus === "perdu" ? (lossReason || null) : null,
      comment,
    );
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSaved(true);
    setNextStatus("");
    setLossReason("");
    setComment("");
    await queryClient.invalidateQueries({ queryKey: ["admin-lead", leadId] });
    await queryClient.invalidateQueries({ queryKey: ["admin-lead-events", leadId] });
  };

  return (
    <div className="py-8 lg:py-10">
      <Container>
        <Link
          to="/leadgeneration/admin"
          className="inline-flex items-center gap-2 text-small font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Retour à la liste
        </Link>

        {/* En-tête */}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h1 className="text-h2 text-ink">{lead.reference}</h1>
          <StatusBadge status={lead.status} />
          <span className="text-small text-slate">
            {lead.products?.label ?? lead.product_code} · créé le{" "}
            {formatDateTime(lead.created_at)} · {lead.profiles?.full_name ?? "—"}
          </span>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <Section title="Prospect">
              <dl>
                <Row label="Nom">{lead.prospect_last_name}</Row>
                <Row label="Prénom">{lead.prospect_first_name}</Row>
                <Row label="Téléphone">
                  <a href={`tel:${lead.prospect_phone}`} className="text-primary hover:underline">
                    {lead.prospect_phone}
                  </a>
                </Row>
                <Row label="Email">
                  {lead.prospect_email ? (
                    <a
                      href={`mailto:${lead.prospect_email}`}
                      className="text-primary hover:underline"
                    >
                      {lead.prospect_email}
                    </a>
                  ) : (
                    "—"
                  )}
                </Row>
                <Row label="Code postal">{lead.postal_code}</Row>
                {lead.company_name ? <Row label="Société">{lead.company_name}</Row> : null}
                {lead.siren ? <Row label="SIREN">{lead.siren}</Row> : null}
              </dl>
            </Section>

            <Section title="Qualification">
              {detailKeys.length === 0 ? (
                <p className="text-small text-slate">Aucune information complémentaire.</p>
              ) : (
                <dl>
                  {detailKeys.map((key) => {
                    const values = formatDetailValue(lead.product_code, key, details[key]);
                    return (
                      <Row key={key} label={resolveFieldLabel(lead.product_code, key)}>
                        {values.length > 1 ? (
                          <ul className="list-inside list-disc">
                            {values.map((v) => (
                              <li key={v}>{v}</li>
                            ))}
                          </ul>
                        ) : (
                          values[0]
                        )}
                      </Row>
                    );
                  })}
                </dl>
              )}
            </Section>

            {requiresMandate ? (
              <Section title="Mandat ACD">
                <dl>
                  <Row label="État">{MANDATE_STATUS_LABELS[lead.mandate_status]}</Row>
                  <Row label="Envoyé le">{formatDateTime(lead.mandate_sent_at)}</Row>
                  <Row label="Signé le">{formatDateTime(lead.mandate_signed_at)}</Row>
                  {lead.mandate_comment ? (
                    <Row label="Commentaire">{lead.mandate_comment}</Row>
                  ) : null}
                </dl>
              </Section>
            ) : null}

            <Section title="Pièces jointes">
              {filesQuery.isLoading ? (
                <p className="text-small text-slate">Chargement…</p>
              ) : !filesQuery.data?.ok ? (
                <p className="text-small text-destructive">{filesQuery.data?.error}</p>
              ) : filesQuery.data.data.length === 0 ? (
                <p className="text-small text-slate">Aucune pièce jointe.</p>
              ) : (
                <ul className="space-y-2">
                  {filesQuery.data.data.map((file) => (
                    <li
                      key={file.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-mist px-3 py-2"
                    >
                      <span className="min-w-0 flex-1 truncate text-small text-ink">
                        {file.file_name}
                      </span>
                      <span className="text-small text-slate">
                        {formatSize(file.size_bytes)}
                      </span>
                      {file.signedUrl ? (
                        <a
                          href={file.signedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-small font-medium text-primary hover:underline"
                        >
                          <Download className="h-4 w-4" strokeWidth={1.75} />
                          Télécharger
                        </a>
                      ) : (
                        <span className="text-small text-slate">Lien indisponible</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Historique">
              {eventsQuery.isLoading ? (
                <p className="text-small text-slate">Chargement…</p>
              ) : !eventsQuery.data?.ok ? (
                <p className="text-small text-destructive">{eventsQuery.data?.error}</p>
              ) : eventsQuery.data.data.length === 0 ? (
                <p className="text-small text-slate">Aucun événement.</p>
              ) : (
                <ol className="space-y-3">
                  {eventsQuery.data.data.map((event) => (
                    <li key={event.id} className="border-l-2 border-mist pl-3">
                      <p className="text-small text-ink">
                        {event.event_type === "status_changed"
                          ? `Statut : ${event.from_status ? statusLabel(event.from_status) : "—"} → ${
                              event.to_status ? statusLabel(event.to_status) : "—"
                            }`
                          : event.event_type === "created"
                            ? "Lead créé"
                            : "Mise à jour"}
                      </p>
                      <p className="text-xs text-slate">
                        {formatDateTime(event.created_at)} ·{" "}
                        {event.profiles?.full_name ?? "Système"}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </Section>

            <p className="text-xs text-slate">
              Consentement recueilli le {formatDateTime(lead.consent_at)} — version{" "}
              {lead.consent_version}
            </p>
          </div>

          {/* Actions */}
          <aside className="space-y-5">
            <Section title="Changer le statut">
              <div className="space-y-3">
                <select
                  className={selectClass}
                  value={nextStatus}
                  onChange={(e) => setNextStatus(e.target.value as LeadStatus | "")}
                  aria-label="Nouveau statut"
                >
                  <option value="">Choisir un statut…</option>
                  {LEAD_STATUSES.filter((s) => s.value !== lead.status).map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>

                {nextStatus === "perdu" ? (
                  <select
                    className={selectClass}
                    value={lossReason}
                    onChange={(e) => setLossReason(e.target.value as LossReason | "")}
                    aria-label="Motif de perte"
                  >
                    <option value="">Motif de perte (obligatoire)…</option>
                    {LOSS_REASONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                ) : null}

                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Commentaire (facultatif)"
                  className="min-h-20 rounded-lg"
                />

                <Button
                  type="button"
                  className="w-full"
                  disabled={!nextStatus || saving || (nextStatus === "perdu" && !lossReason)}
                  onClick={() => void handleSubmit()}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                      Enregistrement…
                    </>
                  ) : (
                    "Enregistrer le statut"
                  )}
                </Button>

                {error ? (
                  <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-small text-destructive">
                    {error}
                  </p>
                ) : null}
                {saved ? (
                  <p className="text-small text-primary">Statut mis à jour.</p>
                ) : null}
              </div>
            </Section>

            {lead.loss_reason ? (
              <Section title="Motif de perte">
                <p className="text-small text-ink">{lossReasonLabel(lead.loss_reason)}</p>
                {lead.loss_comment ? (
                  <p className="mt-1 text-small text-slate">{lead.loss_comment}</p>
                ) : null}
              </Section>
            ) : null}
          </aside>
        </div>
      </Container>
    </div>
  );
}
