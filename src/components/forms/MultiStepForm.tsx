import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useForm, type Control, type UseFormWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  clearDraftFromLocalStorage,
  loadDraftFromLocalStorage,
  saveDraftToLocalStorage,
} from "@/lib/localStorage";
import { createLead, uploadLeadFiles } from "@/lib/leads";
import type { ProductId } from "@/data/products";

/** Un File ne se sérialise pas : on l'écarte du brouillon et du payload lead. */
function isFileValue(value: unknown): boolean {
  if (typeof File === "undefined") return false;
  if (value instanceof File) return true;
  return Array.isArray(value) && value.some((v) => v instanceof File);
}

function extractFiles(values: Record<string, unknown>): File[] {
  const files: File[] = [];
  for (const value of Object.values(values)) {
    if (typeof File === "undefined") break;
    if (value instanceof File) files.push(value);
    else if (Array.isArray(value)) {
      for (const v of value) if (v instanceof File) files.push(v);
    }
  }
  return files;
}

function withoutFiles(values: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(values).filter(([, v]) => !isFileValue(v)),
  );
}

export interface StepConfig {
  id: string;
  label: string;
  title: string;
  schema: z.ZodObject<any>;
  fields: string[];
  /** Validation conditionnelle optionnelle (dépendances entre champs). */
  validate?: (values: Record<string, any>) => Record<string, string> | null;
  render: (ctx: { control: Control<any>; watch: UseFormWatch<any> }) => ReactNode;
}

interface Props {
  productId: ProductId;
  productLabel: string;
  steps: StepConfig[];
  defaultValues: Record<string, unknown>;
  existingData?: Record<string, unknown>;
  submitLabel?: string;
}

export function MultiStepForm({
  productId,
  productLabel,
  steps,
  defaultValues,
  existingData,
  submitLabel,
}: Props) {
  const fullSchema = useMemo(() => {
    const shape = steps.reduce<Record<string, z.ZodTypeAny>>((acc, s) => {
      Object.assign(acc, s.schema.shape);
      return acc;
    }, {});
    return z.object(shape);
  }, [steps]);

  const form = useForm({
    resolver: zodResolver(fullSchema as any),
    defaultValues: { ...defaultValues, ...(existingData ?? {}) },
    mode: "onTouched",
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    reference: string;
    prospect: string;
    phone: string;
    leadId: string;
    filesTotal: number;
  } | null>(null);
  // Téléversement : uniquement après création du lead (le chemin en dépend).
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // Verrou synchrone : un double tap mobile ne peut pas lancer deux envois.
  const submitLock = useRef(false);
  const uploadLock = useRef(false);

  const current = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  // Charge le brouillon existant au montage (client uniquement).
  useEffect(() => {
    if (existingData) return;
    const draft = loadDraftFromLocalStorage(productId);
    if (draft) form.reset({ ...defaultValues, ...draft });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Sauvegarde locale à chaque modification du formulaire.
  useEffect(() => {
    const subscription = form.watch((values) => {
      saveDraftToLocalStorage(
        productId,
        withoutFiles(values as Record<string, unknown>),
      );
    });
    return () => subscription.unsubscribe();
  }, [form, productId]);

  /**
   * Envoie les fichiers restants, un par un, pour afficher une progression
   * fidèle et ne relancer que ceux qui manquent en cas de reprise.
   */
  const runUpload = async (leadId: string, files: File[], startAt: number) => {
    if (uploadLock.current) return;
    uploadLock.current = true;
    setUploading(true);
    setUploadError(null);

    let index = startAt;
    try {
      for (; index < files.length; index++) {
        const result = await uploadLeadFiles(leadId, [files[index]]);
        if (!result.ok) {
          setUploadError(result.error);
          break;
        }
        setUploadedCount(index + 1);
      }
    } catch (e) {
      setUploadError(
        `Envoi des fichiers impossible. (${
          e instanceof Error ? e.message : "erreur inattendue"
        })`,
      );
    } finally {
      setUploading(false);
      uploadLock.current = false;
    }
  };

  const submit = async () => {
    if (submitLock.current) return;
    submitLock.current = true;
    setSubmitting(true);
    setSubmitError(null);

    const data = form.getValues() as Record<string, unknown>;
    const files = extractFiles(data);
    const payload = withoutFiles(data);
    // Sauvegarde locale avant envoi (protection contre les pertes).
    saveDraftToLocalStorage(productId, payload);

    try {
      const result = await createLead(productId, payload);
      if (result.ok) {
        clearDraftFromLocalStorage(productId);
        setPendingFiles(files);
        setUploadedCount(0);
        setUploadError(null);
        setSuccess({
          reference: result.reference,
          leadId: result.id,
          filesTotal: files.length,
          prospect: [data.prospectFirstName, data.prospectLastName]
            .filter(Boolean)
            .join(" "),
          phone: String(data.prospectPhone ?? ""),
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (files.length > 0) {
          void runUpload(result.id, files, 0);
        }
      } else {
        // La saisie reste intacte : ni reset, ni effacement du brouillon.
        setSubmitError(result.error);
      }
    } catch (e) {
      setSubmitError(
        `Enregistrement impossible. Réessayez dans un instant. (${
          e instanceof Error ? e.message : "erreur inattendue"
        })`,
      );
    } finally {
      setSubmitting(false);
      submitLock.current = false;
    }
  };

  const goNext = async () => {
    if (submitting) return;
    const valid = await form.trigger(current.fields as any, {
      shouldFocus: true,
    });
    if (!valid) return;

    if (current.validate) {
      const errors = current.validate(form.getValues() as Record<string, any>);
      if (errors && Object.keys(errors).length > 0) {
        for (const [name, message] of Object.entries(errors)) {
          form.setError(name as any, { type: "manual", message });
        }
        return;
      }
    }

    if (!isLast) {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    await submit();
  };

  const goPrev = () => {
    if (stepIndex > 0 && !submitting) {
      setStepIndex((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full rounded-2xl bg-background p-8 text-center shadow-soft sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mist text-primary">
            <CheckCircle2 className="h-8 w-8" strokeWidth={1.75} />
          </div>
          <h2 className="mt-6 text-h2 text-ink">Lead enregistré</h2>
          <p className="mt-3 text-body font-medium text-ink">
            Les informations du prospect ont bien été transmises.
          </p>
          <div className="mx-auto mt-6 max-w-md rounded-xl bg-mist p-5">
            <p className="text-small uppercase tracking-wide text-slate">
              Référence
            </p>
            <p className="mt-1 text-h3 text-ink">{success.reference}</p>
          </div>

          {success.filesTotal > 0 && (
            <div className="mx-auto mt-4 max-w-md text-left">
              {uploading ? (
                <p className="flex items-center gap-2 rounded-xl bg-mist p-4 text-body text-ink">
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
                  Envoi des fichiers ({uploadedCount + 1}/{success.filesTotal})…
                </p>
              ) : uploadError ? (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl bg-mist p-4"
                >
                  <AlertTriangle
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    strokeWidth={1.75}
                  />
                  <div className="space-y-3">
                    <p className="text-body text-ink">
                      Le lead est bien enregistré, mais l'envoi des fichiers a
                      échoué ({uploadedCount}/{success.filesTotal} déposés).
                    </p>
                    <p className="text-small text-slate">{uploadError}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() =>
                        void runUpload(success.leadId, pendingFiles, uploadedCount)
                      }
                    >
                      Renvoyer les fichiers
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="rounded-xl bg-mist p-4 text-body text-ink">
                  {uploadedCount} fichier{uploadedCount > 1 ? "s" : ""} déposé
                  {uploadedCount > 1 ? "s" : ""}.
                </p>
              )}
            </div>
          )}

          <dl className="mx-auto mt-6 max-w-md space-y-2 text-left text-body">
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Prospect</dt>
              <dd className="text-ink">{success.prospect}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Téléphone</dt>
              <dd className="text-ink">{success.phone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate">Produit</dt>
              <dd className="text-ink">{productLabel}</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={uploading}
              onClick={() => {
                form.reset({ ...defaultValues });
                setStepIndex(0);
                setSuccess(null);
                setSubmitError(null);
                setPendingFiles([]);
                setUploadedCount(0);
                setUploadError(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Saisir un nouveau lead
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/leadgeneration/dashboard">Retour au tableau de bord</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((stepIndex + 1) / steps.length) * 100;

  return (
    <div className="rounded-2xl bg-background p-6 shadow-soft sm:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between text-small text-slate">
          <span className="font-medium">
            {productLabel} — {current.label}
          </span>
          <span>
            {stepIndex + 1} / {steps.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-mist">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-h3 text-ink">{current.title}</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          goNext();
        }}
        className="mt-6 space-y-5"
      >
        {current.render({ control: form.control, watch: form.watch })}

        {submitError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl bg-mist p-4 text-left"
          >
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-accent"
              strokeWidth={1.75}
            />
            <div className="space-y-3">
              <p className="text-body text-ink">{submitError}</p>
              <Button
                type="button"
                variant="outline"
                size="md"
                disabled={submitting}
                onClick={() => void submit()}
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={goPrev}
            disabled={stepIndex === 0 || submitting}
            className={cn(stepIndex === 0 && "invisible sm:invisible")}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            Précédent
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={submitting}
          >
            {submitting ? (
              <>
                Envoi en cours…
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
              </>
            ) : (
              <>
                {isLast ? (submitLabel ?? "Valider mon lead") : "Suivant"}
                <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}