import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Logique privilégiée de création de compte. Ce module n'est jamais livré au
 * navigateur (suffixe .server.ts) : il est le seul à importer supabaseAdmin.
 */

export class ForbiddenError extends Error {
  readonly statusCode = 403;
  constructor(message = "Accès refusé : réservé aux administrateurs.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Vérifie que l'identifiant issu du jeton correspond à un profil
 * administrateur ACTIF. Lève une erreur 403 sinon.
 */
export async function assertCallerIsActiveAdmin(callerId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("role, is_active")
    .eq("id", callerId)
    .maybeSingle();

  if (error) {
    console.error("[assertCallerIsActiveAdmin]", error);
    throw new ForbiddenError("Vérification des droits impossible.");
  }
  if (!data || data.role !== "admin" || data.is_active !== true) {
    throw new ForbiddenError();
  }
}

const PASSWORD_ALPHABET =
  "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%*-_";

/** Mot de passe aléatoire de 24 caractères, tiré d'une source cryptographique. */
export function generatePassword(length = 24): string {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += PASSWORD_ALPHABET[bytes[i]! % PASSWORD_ALPHABET.length];
  }
  return out;
}

export interface CreatedAccount {
  email: string;
  password: string;
  userId: string;
}

export async function createCommercialAccount(input: {
  email: string;
  fullName: string;
  managerId: string | null;
}): Promise<CreatedAccount> {
  const password = generatePassword();

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: input.email,
    password,
    email_confirm: true,
    user_metadata: { full_name: input.fullName },
  });

  if (error || !data?.user) {
    console.error("[createCommercialAccount] createUser", error);
    throw new Error(
      error?.message ?? "Création du compte impossible. Réessayez dans un instant.",
    );
  }

  const userId = data.user.id;

  // Le profil est créé par le trigger on_auth_user_created ; on complète
  // ensuite le nom et le rattachement. Le rôle reste TOUJOURS « commercial ».
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      full_name: input.fullName,
      manager_id: input.managerId,
      role: "commercial",
      is_active: true,
    })
    .eq("id", userId);

  if (profileError) {
    console.error("[createCommercialAccount] profile", profileError);
    throw new Error(
      `Compte créé, mais le profil n'a pas pu être complété : ${profileError.message}`,
    );
  }

  return { email: input.email, password, userId };
}
