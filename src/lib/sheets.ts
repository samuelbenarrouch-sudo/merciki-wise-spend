// URL du Web App Apps Script.
// Renseigner VITE_GOOGLE_APPS_SCRIPT_URL dans les variables d'environnement,
// ou remplacer la valeur de repli ci-dessous par l'URL de déploiement.
const GOOGLE_APPS_SCRIPT_URL =
  import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL ?? "";

export async function submitToSheet(
  sheetName: string,
  data: Record<string, any>,
): Promise<{ success: boolean }> {
  const payload = {
    sheetName,
    data: {
      timestamp: new Date().toISOString(),
      ...data,
    },
  };

  try {
    if (!GOOGLE_APPS_SCRIPT_URL) {
      console.warn(
        "[sheets] VITE_GOOGLE_APPS_SCRIPT_URL non configurée — lead non envoyé vers Google Sheets.",
        payload,
      );
      return { success: false };
    }
    await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("Lead submitted to sheet:", sheetName);
    return { success: true };
  } catch (error) {
    console.error("Error submitting to sheet:", error);
    return { success: false };
  }
}
