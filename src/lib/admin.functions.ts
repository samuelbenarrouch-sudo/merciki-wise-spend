import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const createAccountInput = z.object({
  email: z.string().trim().email("Adresse email invalide.").max(180),
  fullName: z.string().trim().min(1, "Le nom est obligatoire.").max(120),
  managerId: z.string().uuid().nullable().optional(),
});

/**
 * Création d'un compte commercial. Seule opération nécessitant service_role.
 * L'identifiant de l'appelant provient EXCLUSIVEMENT du jeton vérifié par le
 * middleware ; le rôle administrateur est revérifié côté serveur.
 */
export const createCommercialAccountFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createAccountInput.parse(data))
  .handler(async ({ data, context }) => {
    const { assertCallerIsActiveAdmin, createCommercialAccount } = await import(
      "./admin.server"
    );

    // context.userId vient du jeton validé, jamais du corps de la requête.
    await assertCallerIsActiveAdmin(context.userId);

    return createCommercialAccount({
      email: data.email,
      fullName: data.fullName,
      managerId: data.managerId ?? null,
    });
  });
