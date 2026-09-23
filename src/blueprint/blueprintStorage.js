/* ============================================
   Vitta Financial Blueprint — draft persistence
   Saves wizard progress to localStorage so a refresh
   or an accidental tab close doesn't lose everything
   the user typed in. Stays on-device, same "nothing
   leaves your browser" posture as the rest of the site
   — this is just a local save, never sent anywhere.
   ============================================ */

const STORAGE_KEY = 'vitta-blueprint-draft-v1';

export function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.profile) return null;
    return parsed;
  } catch {
    // Corrupted JSON, storage disabled (private browsing), quota exceeded, etc.
    // — treat it the same as "no draft" rather than breaking the page.
    return null;
  }
}

export function saveDraft(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Fail silently — a draft that can't be saved just means no resume later,
    // not a broken wizard right now.
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do if storage isn't available.
  }
}
