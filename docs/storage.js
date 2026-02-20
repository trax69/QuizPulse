/**
 * Load persisted history payload.
 * @param {string} historyKey
 * @returns {{attemptsHistory:Array<any>, questionStats:Record<string, any>, bestAttempt:any, attemptCount:number}}
 */
export function loadHistoryState(historyKey) {
  if (!historyKey) {
    return { attemptsHistory: [], questionStats: {}, bestAttempt: null, attemptCount: 0 };
  }

  const data = localStorage.getItem(historyKey);
  if (!data) {
    return { attemptsHistory: [], questionStats: {}, bestAttempt: null, attemptCount: 0 };
  }

  try {
    const parsed = JSON.parse(data);
    const attemptsHistory = parsed.attemptsHistory || [];
    return {
      attemptsHistory,
      questionStats: parsed.questionStats || {},
      bestAttempt: parsed.bestAttempt || null,
      attemptCount: attemptsHistory.length
    };
  } catch {
    return { attemptsHistory: [], questionStats: {}, bestAttempt: null, attemptCount: 0 };
  }
}

/**
 * Persist history payload.
 * @param {string} historyKey
 * @param {{attemptsHistory:Array<any>, questionStats:Record<string, any>, bestAttempt:any}} payload
 */
export function saveHistoryState(historyKey, payload) {
  if (!historyKey) return;
  localStorage.setItem(historyKey, JSON.stringify(payload));
}

/**
 * Compute set of failed question keys.
 * @param {Record<string, {id:string|number, failures:number}>} questionStats
 * @returns {Set<string>}
 */
export function getFailedQuestionKeySet(questionStats) {
  return new Set(Object.values(questionStats).filter((item) => item.failures > 0).map((item) => String(item.id)));
}

/**
 * Load user settings from storage.
 * @param {string} settingsKey
 * @returns {{categoryFilter:string, studyMode:boolean, timerEnabled:boolean, timerSeconds:number}}
 */
export function loadUiSettings(settingsKey) {
  try {
    const raw = localStorage.getItem(settingsKey);
    if (!raw) {
      return { categoryFilter: "all", studyMode: false, timerEnabled: false, timerSeconds: 20 };
    }

    const parsed = JSON.parse(raw);
    return {
      categoryFilter: parsed.categoryFilter || "all",
      studyMode: Boolean(parsed.studyMode),
      timerEnabled: Boolean(parsed.timerEnabled),
      timerSeconds: Number(parsed.timerSeconds) || 20
    };
  } catch {
    return { categoryFilter: "all", studyMode: false, timerEnabled: false, timerSeconds: 20 };
  }
}

/**
 * Save user settings to storage.
 * @param {string} settingsKey
 * @param {{categoryFilter:string, studyMode:boolean, timerEnabled:boolean, timerSeconds:number}} settings
 */
export function saveUiSettings(settingsKey, settings) {
  localStorage.setItem(settingsKey, JSON.stringify(settings));
}
