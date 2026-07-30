// ⚠️ Remplacer par l'URL de déploiement du Web App Apps Script après déploiement.
const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/d/REMPLACER_PAR_TON_ID/usercontent";

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
