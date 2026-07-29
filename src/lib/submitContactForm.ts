/**
 * Contact form submission stub.
 * TODO: Brancher ultérieurement sur un endpoint réel (edge function, CRM, service email).
 */
export interface ContactFormPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  audiences: Array<"particuliers" | "professionnels">;
  message?: string;
  consent: boolean;
}

export async function submitContactForm(
  data: ContactFormPayload,
): Promise<{ success: boolean }> {
  // Stub — remplacer par un vrai appel API (server function ou service tiers).
  console.log("[submitContactForm] payload", data);
  await new Promise((r) => setTimeout(r, 300));
  return { success: true };
}