const draftKey = (productId: string) => `merciki_draft_${productId}`;

export function saveDraftToLocalStorage(
  productId: string,
  data: Record<string, any>,
) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(draftKey(productId), JSON.stringify(data));
  } catch (e) {
    console.error("Error saving draft:", e);
  }
}

export function loadDraftFromLocalStorage(
  productId: string,
): Record<string, any> | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(draftKey(productId));
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Error loading draft:", e);
    return null;
  }
}

export function clearDraftFromLocalStorage(productId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(draftKey(productId));
}
