import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, Loader2, UserPlus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  listTeam,
  updateProfile,
  type TeamMember,
  type UserRole,
} from "@/lib/backoffice";
import { createCommercialAccountFn } from "@/lib/admin.functions";

export const Route = createFileRoute("/leadgeneration/admin/equipe")({
  component: AdminTeamPage,
});

const selectClass =
  "h-10 w-full rounded-lg border border-mist bg-background px-2 text-sm text-ink";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrateur" },
  { value: "manager", label: "Manager" },
  { value: "commercial", label: "Commercial" },
];

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("fr-FR");
}

function AdminTeamPage() {
  const queryClient = useQueryClient();
  const teamQuery = useQuery({ queryKey: ["admin-team"], queryFn: () => listTeam() });
  const [rowError, setRowError] = useState<string | null>(null);

  const members: TeamMember[] = teamQuery.data?.ok ? teamQuery.data.data : [];
  const managers = members.filter((m) => m.role === "admin" || m.role === "manager");

  const patch = async (
    userId: string,
    values: Parameters<typeof updateProfile>[1],
  ) => {
    setRowError(null);
    const res = await updateProfile(userId, values);
    if (!res.ok) {
      setRowError(res.error);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["admin-team"] });
  };

  return (
    <div className="py-8 lg:py-10">
      <Container>
        <h1 className="text-h2 text-ink">Équipe</h1>

        <CreateAccountCard
          managers={managers}
          onCreated={() =>
            queryClient.invalidateQueries({ queryKey: ["admin-team"] })
          }
        />

        {rowError ? (
          <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-small text-destructive">
            {rowError}
          </p>
        ) : null}

        {teamQuery.isLoading ? (
          <div className="flex items-center gap-2 py-16 text-slate">
            <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.75} />
            <span className="text-small">Chargement…</span>
          </div>
        ) : !teamQuery.data?.ok ? (
          <p className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-small text-destructive">
            {teamQuery.data?.error}
          </p>
        ) : (
          <>
            <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-mist md:block">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-mist/60 text-label uppercase text-slate">
                  <tr>
                    <th className="px-4 py-3">Nom</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Rôle</th>
                    <th className="px-4 py-3">Manager</th>
                    <th className="px-4 py-3">Actif</th>
                    <th className="px-4 py-3">Créé le</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-t border-mist align-middle">
                      <td className="px-4 py-2">
                        <Input
                          defaultValue={member.full_name}
                          onBlur={(e) => {
                            const value = e.target.value.trim();
                            if (value && value !== member.full_name) {
                              void patch(member.id, { full_name: value });
                            }
                          }}
                          className="h-10 rounded-lg"
                        />
                      </td>
                      <td className="px-4 py-2 text-slate">{member.email}</td>
                      <td className="px-4 py-2">
                        <select
                          className={selectClass}
                          value={member.role}
                          onChange={(e) =>
                            void patch(member.id, { role: e.target.value as UserRole })
                          }
                          aria-label={`Rôle de ${member.full_name}`}
                        >
                          {ROLES.map((r) => (
                            <option key={r.value} value={r.value}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          className={selectClass}
                          value={member.manager_id ?? ""}
                          onChange={(e) =>
                            void patch(member.id, {
                              manager_id: e.target.value || null,
                            })
                          }
                          aria-label={`Manager de ${member.full_name}`}
                        >
                          <option value="">Aucun</option>
                          {managers
                            .filter((m) => m.id !== member.id)
                            .map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.full_name}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          type="button"
                          variant={member.is_active ? "outline" : "default"}
                          size="sm"
                          onClick={() =>
                            void patch(member.id, { is_active: !member.is_active })
                          }
                        >
                          {member.is_active ? "Désactiver" : "Activer"}
                        </Button>
                      </td>
                      <td className="px-4 py-2 text-slate">
                        {formatDate(member.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="mt-6 space-y-3 md:hidden">
              {members.map((member) => (
                <li
                  key={member.id}
                  className="rounded-2xl border border-mist bg-background p-4"
                >
                  <p className="text-body font-medium text-ink">{member.full_name}</p>
                  <p className="text-small text-slate">{member.email}</p>
                  <p className="mt-1 text-small text-slate">
                    {ROLES.find((r) => r.value === member.role)?.label} ·{" "}
                    {member.manager?.full_name ?? "sans manager"} ·{" "}
                    {member.is_active ? "actif" : "inactif"}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </Container>
    </div>
  );
}

function CreateAccountCard({
  managers,
  onCreated,
}: {
  managers: TeamMember[];
  onCreated: () => void;
}) {
  const createAccount = useServerFn(createCommercialAccountFn);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [managerId, setManagerId] = useState("");
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: async () =>
      createAccount({
        data: {
          email: email.trim(),
          fullName: fullName.trim(),
          managerId: managerId || null,
        },
      }),
    onSuccess: () => {
      setEmail("");
      setFullName("");
      setManagerId("");
      onCreated();
    },
  });

  const created = mutation.data;

  return (
    <div className="mt-6 rounded-2xl border border-mist bg-background p-5">
      <h2 className="flex items-center gap-2 text-label uppercase tracking-wider text-slate">
        <UserPlus className="h-4 w-4" strokeWidth={1.75} />
        Créer un compte commercial
      </h2>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="h-11 rounded-lg"
        />
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nom complet"
          className="h-11 rounded-lg"
        />
        <select
          className="h-11 w-full rounded-lg border border-mist bg-background px-3 text-sm text-ink"
          value={managerId}
          onChange={(e) => setManagerId(e.target.value)}
          aria-label="Manager"
        >
          <option value="">Manager (facultatif)</option>
          {managers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name}
            </option>
          ))}
        </select>
        <Button
          type="button"
          disabled={mutation.isPending || !email.trim() || !fullName.trim()}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
              Création…
            </>
          ) : (
            "Créer le compte"
          )}
        </Button>
      </div>

      {mutation.isError ? (
        <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-small text-destructive">
          {(mutation.error as Error).message}
        </p>
      ) : null}

      {created ? (
        <div className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-4">
          <p className="text-small font-medium text-ink">
            Compte créé pour {created.email}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="rounded-lg bg-background px-3 py-2 text-sm text-ink">
              {created.password}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                void navigator.clipboard.writeText(created.password);
                setCopied(true);
              }}
            >
              {copied ? (
                <Check className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Copy className="h-4 w-4" strokeWidth={1.75} />
              )}
              {copied ? "Copié" : "Copier"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-slate">
            Ce mot de passe ne sera plus jamais affiché. Transmettez-le maintenant
            au commercial, qui pourra le changer ensuite.
          </p>
        </div>
      ) : null}
    </div>
  );
}
