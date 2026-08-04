import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useForm, type Control, type UseFormWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  loadDraftFromLocalStorage,
  saveDraftToLocalStorage,
} from "@/lib/localStorage";

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

export interface SubmissionPayload {
  productId: string;
  commercialName: string;
  commercialPhone: string;
  timestamp: string;
  data: Record<string, unknown>;
}

interface Props {
  productId: string;
  productLabel: string;
  steps: StepConfig[];
  defaultValues: Record<string, unknown>;
  onSubmit?: (payload: SubmissionPayload) => void | Promise<void>;
  existingData?: Record<string, unknown>;
  submitLabel?: string;
  renderSuccess?: (ctx: {
    data: Record<string, unknown>;
    reset: () => void;
  }) => ReactNode;
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
  const [unavailable, setUnavailable] = useState(false);

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
      saveDraftToLocalStorage(productId, values as Record<string, unknown>);
    });
    return () => subscription.unsubscribe();
  }, [form, productId]);

  const goNext = async () => {
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

    setSubmitting(true);
    const data = form.getValues();
    // Sauvegarde locale avant envoi (protection contre les pertes).
    saveDraftToLocalStorage(productId, data);
    const payload: SubmissionPayload = {
      productId,
      commercialName: String(data.commercialName ?? ""),
      commercialPhone: String(data.commercialPhone ?? ""),
      timestamp: new Date().toISOString(),
      data,
    };
    // TODO(lot-5) : branchement Supabase — voir src/lib/leads.ts
    console.warn("Soumission désactivée : backend en cours de reconstruction", payload);
    setUnavailable(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSubmitting(false);
  };

  const goPrev = () => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (unavailable) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full rounded-2xl bg-background p-8 text-center shadow-soft sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mist text-accent">
            <AlertTriangle className="h-8 w-8" strokeWidth={1.75} />
          </div>
          <h2 className="mt-6 text-h2 text-ink">Soumission indisponible</h2>
          <p className="mt-3 text-body font-medium text-ink">
            L'envoi des leads est temporairement désactivé.
          </p>
          <p className="mx-auto mt-4 max-w-md text-body text-slate">
            Le backend est en cours de reconstruction : vos réponses ont été
            conservées localement sur cet appareil, mais rien n'a été transmis.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setUnavailable(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Revenir au formulaire
            </Button>
            <Button asChild variant="primary" size="lg">
              <Link to="/leadgeneration/dashboard">Retour à l'accueil</Link>
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

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={goPrev}
            disabled={stepIndex === 0}
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
            {isLast ? (submitLabel ?? "Valider mon lead") : "Suivant"}
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        </div>
      </form>
    </div>
  );
}