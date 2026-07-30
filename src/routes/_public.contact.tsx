import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  CheckCircle2,
  Send,
  Phone,
  MapPin,
  Check,
  Loader2,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/navigation";
import { submitContactForm } from "@/lib/submitContactForm";
import { canonical } from "@/lib/seo";

type SubjectShort = "produit" | "reseau" | "autre";

const SUBJECT_LABELS: Record<SubjectShort, string> = {
  produit: "J'ai une question sur un produit",
  reseau: "Je veux rejoindre le réseau MERCIKI",
  autre: "Autre",
};

const schema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "Prénom requis (2 caractères minimum)." })
    .max(60),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "Nom requis (2 caractères minimum)." })
    .max(60),
  email: z
    .string()
    .trim()
    .email({ message: "Adresse email invalide." })
    .max(200),
  phone: z
    .string()
    .trim()
    .regex(/^0[67](?:[\s.-]?\d{2}){4}$/, {
      message: "Numéro invalide. Format attendu : 06 ou 07 suivi de 8 chiffres.",
    }),
  subject: z.enum(["produit", "reseau", "autre"], {
    errorMap: () => ({ message: "Sélectionnez un sujet." }),
  }),
  audiences: z
    .array(z.enum(["particuliers", "professionnels"]))
    .min(1, { message: "Sélectionnez au moins un profil." }),
  message: z.string().trim().max(1000).optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "Votre consentement est requis." }),
});

type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/_public/contact")({
  validateSearch: (search: Record<string, unknown>) => ({
    subject:
      search.subject === "produit" ||
      search.subject === "reseau" ||
      search.subject === "autre"
        ? (search.subject as SubjectShort)
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Contact — MERCIKI" },
      {
        name: "description",
        content:
          "Contactez MERCIKI par téléphone au 07 56 90 63 70 ou via notre formulaire. Réponse sous 24 heures ouvrées.",
      },
      { property: "og:title", content: "Contact — MERCIKI" },
      {
        property: "og:description",
        content:
          "Une question, un projet ? Un conseiller MERCIKI vous répond sous 24 heures ouvrées.",
      },
      ...canonical("/contact").meta,
    ],
    links: canonical("/contact").links,
  }),
  component: ContactPage,
});

function ContactPage() {
  const { subject: prefilledSubject } = Route.useSearch();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: prefilledSubject ?? undefined,
      audiences: [],
      message: "",
      consent: false,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const audiences = watch("audiences");
  const subject = watch("subject");
  const consent = watch("consent");

  useEffect(() => {
    if (prefilledSubject && !subject) {
      setValue("subject", prefilledSubject);
    }
  }, [prefilledSubject, subject, setValue]);

  function toggleAudience(value: "particuliers" | "professionnels") {
    const next = audiences.includes(value)
      ? audiences.filter((a) => a !== value)
      : [...audiences, value];
    setValue("audiences", next, { shouldValidate: true });
  }

  async function onSubmit(values: FormValues) {
    // NOTE: submitContactForm est un stub — brancher plus tard sur un vrai endpoint.
    const res = await submitContactForm(values);
    if (res.success) {
      toast.success("Votre demande a bien été envoyée.");
      setSubmitted(true);
    } else {
      toast.error("Une erreur est survenue. Merci de réessayer.");
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-background">
        <Container className="py-14 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="primary-light" className="mb-6">
              Nous contacter
            </Badge>
            <h1 className="text-h1 text-ink">Vous avez une question ? Parlons-nous.</h1>
            <p className="mt-6 text-body text-slate">
              Remplissez le formulaire ci-dessous ou appelez-nous directement. Un conseiller
              vous répondra sous 24 heures ouvrées.
            </p>
          </div>
        </Container>
      </section>

      <Section background="mist" className="pt-0 md:pt-0">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            {/* Formulaire */}
            <Card className="p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle2
                    className="mx-auto h-16 w-16 text-success"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <h2 className="mt-6 text-h2 text-ink">
                    Merci, votre demande est bien reçue.
                  </h2>
                  <p className="mt-4 text-body text-slate">
                    Un conseiller vous rappelle sous 24 heures ouvrées au numéro que vous nous
                    avez indiqué.
                  </p>
                  <div className="mt-8">
                    <Button asChild size="lg">
                      <Link to="/">Retour à l'accueil</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldWrapper label="Prénom" htmlFor="firstName" error={errors.firstName?.message}>
                      <Input id="firstName" autoComplete="given-name" {...register("firstName")} />
                    </FieldWrapper>
                    <FieldWrapper label="Nom" htmlFor="lastName" error={errors.lastName?.message}>
                      <Input id="lastName" autoComplete="family-name" {...register("lastName")} />
                    </FieldWrapper>
                  </div>

                  <FieldWrapper label="Email" htmlFor="email" error={errors.email?.message}>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      {...register("email")}
                    />
                  </FieldWrapper>

                  <FieldWrapper
                    label="Téléphone"
                    htmlFor="phone"
                    error={errors.phone?.message}
                    hint="Format : 06 ou 07 suivi de 8 chiffres"
                  >
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="06 12 34 56 78"
                      {...register("phone")}
                    />
                  </FieldWrapper>

                  <FieldWrapper label="Sujet" htmlFor="subject" error={errors.subject?.message}>
                    <Select
                      value={subject ?? ""}
                      onValueChange={(v) =>
                        setValue("subject", v as SubjectShort, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger id="subject" className="h-12">
                        <SelectValue placeholder="Choisir un sujet" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(SUBJECT_LABELS) as SubjectShort[]).map((k) => (
                          <SelectItem key={k} value={k}>
                            {SUBJECT_LABELS[k]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldWrapper>

                  <div>
                    <Label className="text-label text-ink">Vous êtes</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(["particuliers", "professionnels"] as const).map((a) => {
                        const active = audiences.includes(a);
                        return (
                          <button
                            key={a}
                            type="button"
                            onClick={() => toggleAudience(a)}
                            aria-pressed={active}
                            className={cn(
                              "inline-flex min-h-12 items-center rounded-full border-2 px-5 text-sm font-semibold transition-colors",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-mist bg-background text-ink hover:bg-mist",
                            )}
                          >
                            {a === "particuliers" ? "Particuliers" : "Professionnels"}
                          </button>
                        );
                      })}
                    </div>
                    {errors.audiences && (
                      <p className="mt-2 text-small text-destructive">
                        {errors.audiences.message as string}
                      </p>
                    )}
                  </div>

                  <FieldWrapper
                    label="Votre message"
                    htmlFor="message"
                    error={errors.message?.message}
                    optional
                  >
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Dites-nous ce que vous payez aujourd'hui, ou posez-nous simplement votre question."
                      {...register("message")}
                    />
                  </FieldWrapper>

                  <div className="flex items-start gap-3 rounded-2xl bg-mist p-4">
                    <Checkbox
                      id="consent"
                      checked={consent}
                      onCheckedChange={(v) =>
                        setValue("consent", Boolean(v), { shouldValidate: true })
                      }
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="consent" className="text-small text-slate leading-relaxed">
                        J'accepte que MERCIKI utilise mes coordonnées pour me recontacter au
                        sujet de ma demande.{" "}
                        <Link
                          to="/politique-de-confidentialite"
                          className="text-primary underline underline-offset-2"
                        >
                          Consulter la politique de confidentialité
                        </Link>
                        .
                      </Label>
                      {errors.consent && (
                        <p className="mt-2 text-small text-destructive">
                          {errors.consent.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" strokeWidth={1.75} />
                    ) : (
                      <Send strokeWidth={1.75} />
                    )}
                    Envoyer ma demande
                  </Button>
                </form>
              )}
            </Card>

            {/* Coordonnées */}
            <div className="lg:sticky lg:top-24">
              <Card className="p-6 md:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-accent">
                    <Phone className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    <span className="text-label uppercase tracking-wider">Appelez-nous</span>
                  </div>
                  <a
                    href={PHONE_HREF}
                    className="mt-3 block font-display font-bold text-3xl md:text-4xl text-ink hover:text-primary transition-colors"
                  >
                    {PHONE_DISPLAY}
                  </a>
                  <p className="mt-2 text-small text-slate">Du lundi au vendredi</p>
                </div>

                <div className="border-t border-mist pt-6">
                  <div className="flex items-start gap-3">
                    <MapPin
                      className="mt-1 h-5 w-5 shrink-0 text-primary"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <address className="not-italic text-body text-slate">
                      MERCIKI
                      <br />
                      10 rue de la Paix
                      <br />
                      75002 Paris
                    </address>
                  </div>
                </div>

                <ul className="border-t border-mist pt-6 space-y-3">
                  {[
                    "Service 100 % gratuit",
                    "Sans engagement",
                    "Réponse sous 24h ouvrées",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-3 text-body text-ink">
                      <Check className="h-5 w-5 text-success" strokeWidth={2} aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </Card>

              <p className="mt-4 rounded-2xl bg-accent-soft p-4 text-small text-ink">
                Nous sommes rémunérés par nos partenaires, jamais par vous.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function FieldWrapper({
  label,
  htmlFor,
  error,
  hint,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="text-label text-ink">
        {label}
        {optional && <span className="ml-1 text-slate font-normal">(facultatif)</span>}
      </Label>
      <div className="mt-2">{children}</div>
      {hint && !error && <p className="mt-1 text-xs text-slate">{hint}</p>}
      {error && <p className="mt-2 text-small text-destructive">{error}</p>}
    </div>
  );
}