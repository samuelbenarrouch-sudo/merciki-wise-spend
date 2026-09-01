import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Download, Loader2, Mail, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  openLeadAttachment,
  updateLeadStatus,
  type LeadAttachment,
  type LeadWithRelations,
} from "@/lib/backoffice";
import { buildMailto, buildTransmitRecap } from "@/lib/transmit-recap";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/** Téléchargement d'un blob via un élément <a> détaché. */
function triggerDownload(objectUrl: string, fileName: string) {
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

interface LeadTransmitDialogProps {
  lead: LeadWithRelations;
  attachments: LeadAttachment[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadTransmitDialog({
  lead,
  attachments,
  open,
  onOpenChange,
}: LeadTransmitDialogProps) {
  const queryClient = useQueryClient();
  const recap = useMemo(() => buildTransmitRecap(lead), [lead]);
  const mailto = useMemo(() => buildMailto(lead), [lead]);

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [markTransmitted, setMarkTransmitted] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  const totalSize = attachments.reduce((sum, f) => sum + (f.size_bytes ?? 0), 0);

  const handleCopy = async () => {
    setCopyError(null);
    setCopied(false);
    const text = `Objet : ${recap.subject}\n\n${recap.body}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopyError("Copie impossible : sélectionnez le texte et copiez-le manuellement.");
    }
  };

  const handleDownloadAll = async () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadError(null);
    for (const file of attachments) {
      const res = await openLeadAttachment(file.storage_path);
      if (!res.ok) {
        setDownloadError(`${file.file_name} : ${res.error}`);
        break;
      }
      const objectUrl = URL.createObjectURL(res.data);
      triggerDownload(objectUrl, file.file_name);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 5_000);
    }
    setDownloading(false);
  };

  /**
   * Fermeture : si la case est cochée, on déclare le lead transmis au
   * fournisseur via le mécanisme existant. Le refus éventuel de la base
   * (mandat ACD non signé, par exemple) est affiché tel quel et la boîte
   * reste ouverte.
   */
  const handleOpenChange = async (nextOpen: boolean) => {
    if (nextOpen || closing) {
      onOpenChange(nextOpen);
      return;
    }
    if (markTransmitted) {
      setClosing(true);
      setStatusError(null);
      const res = await updateLeadStatus(lead.id, "transmis_fournisseur");
      setClosing(false);
      if (!res.ok) {
        setStatusError(res.error);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-lead", lead.id] });
      await queryClient.invalidateQueries({ queryKey: ["admin-lead-events", lead.id] });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => void handleOpenChange(v)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transmettre le dossier</DialogTitle>
          <DialogDescription>
            Aucun envoi automatique : l'email part de votre messagerie.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-small font-medium text-ink">Objet</p>
            <p className="mt-1 rounded-lg border border-mist bg-muted/40 px-3 py-2 text-small text-ink">
              {recap.subject}
            </p>
          </div>

          <div>
            <p className="text-small font-medium text-ink">Aperçu du récapitulatif</p>
            <pre className="mt-1 max-h-[40vh] overflow-auto whitespace-pre-wrap rounded-lg border border-mist bg-muted/40 px-3 py-2 font-sans text-small text-ink">
              {recap.body}
            </pre>
          </div>

          {mailto.truncated ? (
            <p className="rounded-lg border border-accent/40 bg-accent/10 p-3 text-small text-ink">
              Le récapitulatif est trop long pour un lien d'email : certaines messageries le
              tronqueraient sans avertir. La version ouverte dans votre messagerie ne contient
              que l'identité du prospect — utilisez « Copier le récapitulatif » et collez le
              texte intégral dans le message.
            </p>
          ) : null}

          {statusError ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-small text-destructive">
              {statusError}
            </p>
          ) : null}
          {downloadError ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-small text-destructive">
              {downloadError}
            </p>
          ) : null}
          {copyError ? <p className="text-small text-destructive">{copyError}</p> : null}

          <label className="flex items-start gap-3 rounded-lg border border-mist px-3 py-2">
            <Checkbox
              checked={markTransmitted}
              onCheckedChange={(v) => setMarkTransmitted(v === true)}
              className="mt-0.5"
            />
            <span className="text-small text-ink">
              Je déclare avoir transmis ce dossier au fournisseur — marquer le lead comme
              « Transmis fournisseur » à la fermeture.
            </span>
          </label>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col sm:items-stretch">
          <div className="flex flex-wrap gap-2">
            <Button type="button" asChild>
              <a href={mailto.href}>
                <Mail className="h-4 w-4" strokeWidth={1.75} />
                Ouvrir dans ma messagerie
              </a>
            </Button>
            <Button type="button" variant="outline" onClick={() => void handleCopy()}>
              {copied ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={1.75} />
                  Récapitulatif copié
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" strokeWidth={1.75} />
                  Copier le récapitulatif
                </>
              )}
            </Button>
            {attachments.length > 0 ? (
              <Button
                type="button"
                variant="outline"
                disabled={downloading}
                onClick={() => void handleDownloadAll()}
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                ) : (
                  <Download className="h-4 w-4" strokeWidth={1.75} />
                )}
                Télécharger les pièces jointes ({attachments.length} · {formatSize(totalSize)})
              </Button>
            ) : null}
          </div>
          {closing ? (
            <p className="inline-flex items-center gap-2 text-small text-slate">
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
              Enregistrement du statut…
            </p>
          ) : null}
          <p className="inline-flex items-center gap-2 text-xs text-slate">
            <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
            L'envoi reste sous votre responsabilité : saisissez le destinataire dans votre
            messagerie.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
