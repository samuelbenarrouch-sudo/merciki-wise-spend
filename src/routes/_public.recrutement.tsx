import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { CheckCircle2, Loader2, Search, Send, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { canonical } from "@/lib/seo";
import { PRODUCTS } from "@/data/products";
import { listDepartments, submitApplication } from "@/lib/applications";

const EXPERIENCE_OPTIONS = [
  { value: "aucune", label: "Aucune" },
  { value: "moins_1_an", label: "Moins d'un an" },
  { value: "1_3_ans", label: "1 à 3 ans" },
  { value: "plus_3_ans", label: "Plus de 3 ans" },
] as const;

const SITUATION_OPTIONS = [
  { value: "independant", label: "Indépendant ou micro-entreprise" },
  { value: "salarie", label: "Commercial salarié" },
  { value: "recherche", label: "En recherche" },
  { value: "autre", label: "Autre" },
] as const;

const AVAILABILITY_OPTIONS = [
  { value: "immediate", label: "Immédiate" },
  { value: "sous_1_mois", label: "Sous 1 mois" },
  { value: "sous_3_mois", label: "Sous 3 mois" },
  { value: "a_discuter", label: "À discuter" },
] as const;

const MESSAGE_MAX = 3000;

const schema = z.object({
  firstName: z.string().trim().min(2, { message: "Prénom requis (2 caractères minimum)." }).max(80),
  lastName: z.string().trim().min(2, { message: "Nom requis (2 caractères minimum)." }).max(80),
  email: z.string().trim().email({ message: "Adresse email invalide." }).max(200),
  phone: z
    .string()
    .trim()
    .regex(/^0[67](?:[\s.-]?\d{2}){4}$/, {
      message: "Numéro invalide. Format attendu : 06 ou 07 suivi de 8 chiffres.",
    }),
  departments: z.array(z.string()).min(1, { message: "Sélectionnez au moins un département." }),
  productCodes: z.array(z.string()).min(1, { message: "Sélectionnez au moins un produit." }),
  experience: z.enum(["aucune", "moins_1_an", "1_3_ans", "plus_3_ans"], {
    errorMap: () => ({ message: "Indiquez votre niveau d'expérience." }),
  }),
  situation: z.enum(["independant", "salarie", "recherche", "autre"]).optional(),
  availability: z.enum(["immediate", "sous_1_mois", "sous_3_mois", "a_discuter"]).optional(),
  link: z
    .string()
    .trim()
    .max(300)
    .url({ message: "Adresse invalide (commencez par https://)." })
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(MESSAGE_MAX).optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: "Votre consentement est requis." }),
  // Champ leurre anti-robot.
  website: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const TITLE = "Recrutement commercial — Rejoignez le réseau MERCIKI";
const DESCRIPTION =
  "Candidatez en quelques minutes pour rejoindre le réseau de commerciaux MERCIKI : énergie, télécoms, santé, monétique. Pas de CV, pas de format imposé.";

export const Route = createFileRoute("/_public/recrutement")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...canonical("/recrutement").meta,
    ],
    links: canonical("/recrutement").links,
  }),
  component: RecrutementPage,
});

function RecrutementPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [deptQuery, setDeptQuery] = useState("");
  const submitting = useRef(false);

  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: listDepartments,
    staleTime: 1000 * 60 * 60,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      departments: [],
      productCodes: [],
      situation: undefined,
      availability: undefined,
      link: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const selectedDepartments = watch("departments");
  const selectedProducts = watch("productCodes");
  const experience = watch("experience");
  const situation = watch("situation");
  const availability = watch("availability");
  const consent = watch("consent");
  const message = watch("message") ?? "";

  const allDepartments = departmentsQuery.data ?? [];

  const filteredDepartments = useMemo(() => {
    const q = deptQuery.trim().toLowerCase();
    if (q === "") return allDepartments;
    return allDepartments.filter(
      (d) => d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q),
    );
  }, [allDepartments, deptQuery]);

  function toggleDepartment(code: string) {
    const next = selectedDepartments.includes(code)
      ? selectedDepartments.filter((c) => c !== code)
      : [...selectedDepartments, code];
    setValue("departments", next, { shouldValidate: true });
  }

  function toggleProduct(id: string) {
    const next = selectedProducts.includes(id)
      ? selectedProducts.filter((p) => p !== id)
      : [...selectedProducts, id];
    setValue("productCodes", next, { shouldValidate: true });
  }

  async function onSubmit(values: FormValues) {
    // Verrou synchrone : protège de la double soumission.
    if (submitting.current) return;
    submitting.current = true;
    setServerError(null);

    try {
      // Champ leurre rempli : on simule le succès sans rien enregistrer.
      if (values.website && values.website.trim() !== "") {
        setSubmitted(true);
        return;
      }

      const res = await submitApplication({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        departments: values.departments,
        productCodes: values.productCodes,
        experience: values.experience,
        situation: values.situation,
        availability: values.availability,
        link: values.link,
        message: values.message,
        consent: values.consent,
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setServerError(res.error);
      }
    } finally {
      submitting.current = false;
    }
  }

  if (submitted) {
    return (
      <Section background="mist">
        <Container>
          <Card className="mx-auto max-w-xl p-6 text-center md:p-10">
            <CheckCircle2
              className="mx-auto h-16 w-16 text-success"
              strokeWidth={1.75}
              aria-hidden
            />
            <h1 className="mt-6 text-h2 text-ink">Merci, votre candidature est bien reçue.</h1>
            <p className="mt-4 text-body text-slate">
              Nous lisons chaque candidature. Elle sera étudiée avec attention et une réponse vous
              sera apportée dans les meilleurs délais.
            </p>
            <p className="mt-6 text-small text-slate">
              Un membre de l'équipe vous recontacte rapidement pour faire connaissance.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link to="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <section className="bg-background">
        <Container className="py-14 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="primary-light" className="mb-6">
              Nous recrutons
            </Badge>
            <h1 className="text-h1 text-ink">Rejoignez le réseau MERCIKI.</h1>
            <p className="mt-6 text-body text-slate">
              Pas de CV, pas de format imposé. Dites-nous simplement qui vous êtes, où vous
              travaillez et ce qui vous intéresse. On revient vers vous.
            </p>
          </div>
        </Container>
      </section>

      <Section background="mist" className="pt-0 md:pt-0">
        <Container>
          <Card className="mx-auto max-w-2xl p-6 md:p-8">
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
                  inputMode="email"
                  autoComplete="email"
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
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="06 12 34 56 78"
                  {...register("phone")}
                />
              </FieldWrapper>

              {/* Départements */}
              <div>
                <Label className="text-label text-ink">
                  Départements où vous pouvez travailler
                </Label>
                {selectedDepartments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedDepartments.map((code) => {
                      const dept = allDepartments.find((d) => d.code === code);
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => toggleDepartment(code)}
                          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                          aria-label={`Retirer ${dept ? `${dept.code} — ${dept.name}` : code}`}
                        >
                          {dept ? `${dept.code} — ${dept.name}` : code}
                          <X className="h-4 w-4" strokeWidth={2} aria-hidden />
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="relative mt-3">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <Input
                    id="department-search"
                    value={deptQuery}
                    onChange={(e) => setDeptQuery(e.target.value)}
                    placeholder="Rechercher un département (34, Hérault…)"
                    className="pl-9"
                    autoComplete="off"
                    aria-label="Rechercher un département"
                  />
                </div>

                <div className="mt-3 max-h-64 overflow-y-auto rounded-2xl border border-mist bg-background p-2">
                  {departmentsQuery.isLoading ? (
                    <p className="p-3 text-small text-slate">Chargement des départements…</p>
                  ) : departmentsQuery.isError ? (
                    <p className="p-3 text-small text-destructive">
                      Chargement des départements impossible. Réessayez dans un instant.
                    </p>
                  ) : filteredDepartments.length === 0 ? (
                    <p className="p-3 text-small text-slate">Aucun département trouvé.</p>
                  ) : (
                    <ul className="space-y-1">
                      {filteredDepartments.map((d) => {
                        const active = selectedDepartments.includes(d.code);
                        return (
                          <li key={d.code}>
                            <button
                              type="button"
                              onClick={() => toggleDepartment(d.code)}
                              aria-pressed={active}
                              className={cn(
                                "flex min-h-11 w-full items-center rounded-lg px-3 text-left text-body transition-colors",
                                active
                                  ? "bg-primary-light font-semibold text-primary"
                                  : "text-ink hover:bg-mist",
                              )}
                            >
                              {d.code} — {d.name}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                {errors.departments && (
                  <p className="mt-2 text-small text-destructive">
                    {errors.departments.message as string}
                  </p>
                )}
              </div>

              {/* Produits */}
              <div>
                <Label className="text-label text-ink">Produits qui vous intéressent</Label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {PRODUCTS.map((p) => {
                    const active = selectedProducts.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleProduct(p.id)}
                        aria-pressed={active}
                        className={cn(
                          "inline-flex min-h-12 items-center justify-center rounded-full border-2 px-4 text-sm font-semibold transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-mist bg-background text-ink hover:bg-mist",
                        )}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
                {errors.productCodes && (
                  <p className="mt-2 text-small text-destructive">
                    {errors.productCodes.message as string}
                  </p>
                )}
              </div>

              <ChoiceGroup
                label="Expérience en vente terrain"
                options={EXPERIENCE_OPTIONS}
                value={experience}
                onChange={(v) =>
                  setValue("experience", v as FormValues["experience"], { shouldValidate: true })
                }
                error={errors.experience?.message as string | undefined}
              />

              <ChoiceGroup
                label="Situation actuelle"
                optional
                options={SITUATION_OPTIONS}
                value={situation}
                onChange={(v) =>
                  setValue("situation", v as FormValues["situation"], { shouldValidate: true })
                }
              />

              <ChoiceGroup
                label="Disponibilité"
                optional
                options={AVAILABILITY_OPTIONS}
                value={availability}
                onChange={(v) =>
                  setValue("availability", v as FormValues["availability"], {
                    shouldValidate: true,
                  })
                }
              />

              <FieldWrapper
                label="LinkedIn ou site"
                htmlFor="link"
                optional
                error={errors.link?.message}
              >
                <Input
                  id="link"
                  type="url"
                  inputMode="url"
                  placeholder="https://www.linkedin.com/in/…"
                  {...register("link")}
                />
              </FieldWrapper>

              <FieldWrapper
                label="Message"
                htmlFor="message"
                optional
                error={errors.message?.message}
                hint="Pas de CV, pas de format imposé. Dites-nous simplement qui vous êtes."
              >
                <Textarea id="message" rows={5} maxLength={MESSAGE_MAX} {...register("message")} />
                <p className="mt-1 text-right text-xs text-slate">
                  {message.length} / {MESSAGE_MAX}
                </p>
              </FieldWrapper>

              {/* Champ leurre anti-robot : invisible pour les humains. */}
              <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Ne remplissez pas ce champ</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-mist p-4">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(v) => setValue("consent", Boolean(v), { shouldValidate: true })}
                  className="mt-1"
                />
                <div>
                  <Label htmlFor="consent" className="text-small leading-relaxed text-slate">
                    J'accepte que mes données soient utilisées par MERCIKI dans le cadre de ma
                    candidature.{" "}
                    <Link
                      to="/politique-de-confidentialite"
                      className="text-primary underline underline-offset-2"
                    >
                      Politique de confidentialité
                    </Link>
                  </Label>
                  {errors.consent && (
                    <p className="mt-2 text-small text-destructive">
                      {errors.consent.message as string}
                    </p>
                  )}
                </div>
              </div>

              {serverError && (
                <div
                  role="alert"
                  className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-small text-destructive"
                >
                  {serverError}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin" strokeWidth={1.75} />
                ) : (
                  <Send strokeWidth={1.75} />
                )}
                {isSubmitting
                  ? "Envoi en cours…"
                  : serverError
                    ? "Réessayer"
                    : "Envoyer ma candidature"}
              </Button>
            </form>
          </Card>
        </Container>
      </Section>
    </>
  );
}

function ChoiceGroup({
  label,
  options,
  value,
  onChange,
  error,
  optional,
}: {
  label: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <Label className="text-label text-ink">
        {label}
        {optional && <span className="ml-1 font-normal text-slate">(facultatif)</span>}
      </Label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              className={cn(
                "inline-flex min-h-12 items-center rounded-full border-2 px-5 text-sm font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-mist bg-background text-ink hover:bg-mist",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-small text-destructive">{error}</p>}
    </div>
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
        {optional && <span className="ml-1 font-normal text-slate">(facultatif)</span>}
      </Label>
      <div className="mt-2">{children}</div>
      {hint && !error && <p className="mt-1 text-xs text-slate">{hint}</p>}
      {error && <p className="mt-2 text-small text-destructive">{error}</p>}
    </div>
  );
}
