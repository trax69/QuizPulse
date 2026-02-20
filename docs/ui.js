/**
 * Escape untrusted text before injecting HTML.
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  let normalized;

  if (value === null || value === undefined) {
    normalized = "";
  } else if (typeof value === "string") {
    normalized = value;
  } else if (typeof value === "number" || typeof value === "boolean") {
    normalized = String(value);
  } else {
    try {
      normalized = JSON.stringify(value) || "";
    } catch {
      normalized = "";
    }
  }

  return normalized
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * Apply theme and icon state.
 * @param {{theme:"light"|"dark", themeToggle:HTMLElement, key:string, t:Function, createIcons:Function}} input
 */
export function applyThemeUi({ theme, themeToggle, key, t, createIcons }) {
  const dark = theme === "dark";
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem(key, theme);
  themeToggle.setAttribute("aria-pressed", String(dark));
  themeToggle.setAttribute("aria-label", t("toggleThemeAria"));
  themeToggle.innerHTML = dark
    ? '<i data-lucide="sun" class="h-4 w-4" aria-hidden="true"></i>'
    : '<i data-lucide="moon-star" class="h-4 w-4" aria-hidden="true"></i>';
  createIcons();
}

/**
 * Apply global font scale preference.
 * @param {{scale:string, key:string, buttons:NodeListOf<HTMLButtonElement>}} input
 */
export function applyScaleUi({ scale, key, buttons }) {
  const numericScale = Number(scale);
  if (![1, 1.25, 1.5].includes(numericScale)) return;

  document.documentElement.style.fontSize = `${numericScale * 100}%`;
  localStorage.setItem(key, String(numericScale));

  buttons.forEach((button) => {
    const selected = Number(button.dataset.scale) === numericScale;
    button.setAttribute("aria-pressed", String(selected));
    button.classList.toggle("bg-slate-200", selected);
    button.classList.toggle("dark:bg-slate-700", selected);
  });
}

/**
 * Apply reduced motion preference.
 * @param {{mode:"standard"|"reduce", key:string, button:HTMLElement, t:Function}} input
 */
export function applyMotionUi({ mode, key, button, t }) {
  const reduced = mode === "reduce";
  document.documentElement.classList.toggle("reduce-motion", reduced);
  localStorage.setItem(key, reduced ? "reduce" : "standard");
  button.setAttribute("aria-pressed", String(reduced));
  button.textContent = reduced ? t("motionReduced") : t("motionStandard");
}

/**
 * Apply reading mode preference.
 * @param {{enabled:boolean, key:string, button:HTMLElement, t:Function}} input
 */
export function applyReadingModeUi({ enabled, key, button, t }) {
  document.body.classList.toggle("reading-mode", enabled);
  localStorage.setItem(key, enabled ? "on" : "off");
  button.setAttribute("aria-pressed", String(enabled));
  button.textContent = enabled ? t("readingOn") : t("readingOff");
}

/**
 * Apply high contrast preference.
 * @param {{mode:"standard"|"high", key:string, button:HTMLElement, t:Function}} input
 */
export function applyContrastUi({ mode, key, button, t }) {
  const high = mode === "high";
  document.body.classList.toggle("high-contrast", high);
  localStorage.setItem(key, high ? "high" : "standard");
  button.setAttribute("aria-pressed", String(high));
  button.textContent = high ? t("contrastHigh") : t("contrastStandard");
}

/**
 * Set import status message class and text.
 * @param {{element:HTMLElement, message:string, type:"info"|"error"|"success"}} input
 */
export function setImportMessageUi({ element, message, type = "info" }) {
  const classes = {
    info: "text-slate-800 dark:text-slate-100",
    error: "text-red-800 dark:text-red-300",
    success: "text-emerald-800 dark:text-emerald-300"
  };

  element.className = `mt-3 text-base ${classes[type] || classes.info}`;
  element.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
  element.textContent = message;
}
