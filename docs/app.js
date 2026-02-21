import { tForLanguage } from "./i18n.js";
import {
  collectCategories,
  createShuffledSession as buildShuffledSession,
  getFilteredQuestions as filterQuestions,
  normalizeQuestions as normalizeQuizQuestions
} from "./quiz-engine.js";
import {
  downloadBlob,
  exportResultsCsv as exportCsvFile,
  exportResultsJson as exportJsonFile,
  exportResultsPdf as exportPdfFile
} from "./exporters.js";
import {
  getFailedQuestionKeySet as getFailedQuestionKeys,
  loadUiSettings,
  saveUiSettings
} from "./storage.js";
import {
  computeContentHash,
  deleteQuiz as dbDeleteQuiz,
  getAllQuizzes,
  getQuizByHash,
  loadHistoryFromDb,
  saveHistoryToDb,
  saveQuiz as dbSaveQuiz
} from "./db.js";
import {
  applyContrastUi,
  applyMotionUi,
  applyReadingModeUi,
  applyScaleUi,
  applyThemeUi,
  escapeHtml,
  setImportMessageUi
} from "./ui.js";

const state = {
  pendingFile: null,
  originalQuizData: null,
  quizHash: null,
  questions: [],
  currentIndex: 0,
  answeredCurrent: false,
  score: 0,
  attemptCount: 0,
  quizMode: "full",
  currentAttemptIncorrect: new Set(),
  attemptsHistory: [],
  questionStats: {},
  bestAttempt: null,
  timerHandle: null,
  timerSecondsLeft: 0,
  language: "en",
  categoryFilter: "all",
  studyMode: false,
  timerEnabled: false,
  timerSeconds: 20,
  importMessageState: null
};

const elements = {
  importPanel: document.getElementById("importPanel"),
  quizPanel: document.getElementById("quizPanel"),
  resultPanel: document.getElementById("resultPanel"),
  dropZone: document.getElementById("dropZone"),
  fileInput: document.getElementById("fileInput"),
  startFromUpload: document.getElementById("startFromUpload"),
  downloadTemplateBtn: document.getElementById("downloadTemplateBtn"),
  schemaExample: document.getElementById("schemaExample"),
  importMessage: document.getElementById("importMessage"),
  progressLabel: document.getElementById("progressLabel"),
  modeBadge: document.getElementById("modeBadge"),
  scoreLabel: document.getElementById("scoreLabel"),
  attemptBadge: document.getElementById("attemptBadge"),
  questionText: document.getElementById("questionText"),
  optionsList: document.getElementById("optionsList"),
  feedbackBox: document.getElementById("feedbackBox"),
  abortQuizBtn: document.getElementById("abortQuizBtn"),
  nextBtn: document.getElementById("nextBtn"),
  scoreSummary: document.getElementById("scoreSummary"),
  attemptSummary: document.getElementById("attemptSummary"),
  scoreDonutWrap: document.getElementById("scoreDonutWrap"),
  scoreDonutArc: document.getElementById("scoreDonutArc"),
  scoreDonutPercent: document.getElementById("scoreDonutPercent"),
  scoreDonutLegend: document.getElementById("scoreDonutLegend"),
  bestScoreSummary: document.getElementById("bestScoreSummary"),
  attemptsCountSummary: document.getElementById("attemptsCountSummary"),
  mostFailedList: document.getElementById("mostFailedList"),
  attemptHistoryList: document.getElementById("attemptHistoryList"),
  retakeBtn: document.getElementById("retakeBtn"),
  failedOnlyBtn: document.getElementById("failedOnlyBtn"),
  importAnotherBtn: document.getElementById("importAnotherBtn"),
  exportJsonBtn: document.getElementById("exportJsonBtn"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  exportPdfBtn: document.getElementById("exportPdfBtn"),
  helpJsonItem: document.getElementById("helpJsonItem"),
  helpIdItem: document.getElementById("helpIdItem"),
  shortcutItemOpen: document.getElementById("shortcutItemOpen"),
  shortcutItemEsc: document.getElementById("shortcutItemEsc"),
  shortcutItemTab: document.getElementById("shortcutItemTab"),
  shortcutItemAnswer: document.getElementById("shortcutItemAnswer"),
  fontScaleGroup: document.getElementById("fontScaleGroup"),
  optionsLegend: document.getElementById("optionsLegend"),
  themeToggle: document.getElementById("themeToggle"),
  languageToggle: document.getElementById("languageToggle"),
  motionToggle: document.getElementById("motionToggle"),
  readingModeToggle: document.getElementById("readingModeToggle"),
  contrastToggle: document.getElementById("contrastToggle"),
  timerLabel: document.getElementById("timerLabel"),
  categoryFilter: document.getElementById("categoryFilter"),
  allCategoriesOption: document.getElementById("allCategoriesOption"),
  studyModeInput: document.getElementById("studyModeInput"),
  timerEnabledInput: document.getElementById("timerEnabledInput"),
  timerSecondsInput: document.getElementById("timerSecondsInput"),
  confirmDialog: document.getElementById("confirmDialog"),
  confirmDialogTitle: document.getElementById("confirmDialogTitle"),
  confirmDialogMessage: document.getElementById("confirmDialogMessage"),
  confirmCancelBtn: document.getElementById("confirmCancelBtn"),
  confirmAcceptBtn: document.getElementById("confirmAcceptBtn"),
  shortcutDialog: document.getElementById("shortcutDialog"),
  shortcutCloseBtn: document.getElementById("shortcutCloseBtn"),
  savedQuizzesSection: document.getElementById("savedQuizzesSection"),
  savedQuizzesList: document.getElementById("savedQuizzesList"),
  savedQuizzesEmpty: document.getElementById("savedQuizzesEmpty"),
  nameQuizDialog: document.getElementById("nameQuizDialog"),
  nameQuizInput: document.getElementById("nameQuizInput"),
  nameQuizError: document.getElementById("nameQuizError"),
  nameQuizConfirmBtn: document.getElementById("nameQuizConfirmBtn"),
  nameQuizCancelBtn: document.getElementById("nameQuizCancelBtn")
};

const KEYS = {
  theme: "pulse-theme",
  scale: "pulse-scale",
  motion: "pulse-motion",
  reading: "pulse-reading",
  contrast: "pulse-contrast",
  language: "pulse-language",
  settings: "pulse-settings"
};

function t(key, params = {}) {
  return tForLanguage(state.language, key, params);
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  document.title = t("appTitle");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  elements.languageToggle.setAttribute(
    "aria-label",
    state.language === "en" ? t("switchToSpanishAria") : t("switchToEnglishAria")
  );
  elements.themeToggle.setAttribute("aria-label", t("toggleThemeAria"));
  elements.fontScaleGroup?.setAttribute("aria-label", t("fontSizeControlsAria"));
  if (elements.optionsLegend) {
    elements.optionsLegend.textContent = t("answerOptions");
  }
  if (elements.schemaExample) {
    elements.schemaExample.textContent = t("schemaExample");
  }
  if (state.originalQuizData) {
    const currentValue = elements.categoryFilter.value;
    buildCategories();
    elements.categoryFilter.value = [...elements.categoryFilter.options].some((option) => option.value === currentValue)
      ? currentValue
      : "all";
  } else if (elements.allCategoriesOption) {
    elements.allCategoriesOption.textContent = t("allCategories");
  }
  renderHelpGlossary();
  renderShortcutGlossary();
  elements.languageToggle.textContent = state.language === "en" ? t("switchToSpanish") : t("switchToEnglish");
  applyMotion(document.documentElement.classList.contains("reduce-motion") ? "reduce" : "standard");
  applyReadingMode(document.body.classList.contains("reading-mode"));
  applyContrast(document.body.classList.contains("high-contrast") ? "high" : "standard");
  renderDynamicLabels();
  refreshResultPanelText();
  updateTimerLabel({ timedOut: Boolean(state.lastFeedback?.timedOut && state.answeredCurrent) });
  if (state.lastFeedback) {
    showFeedback({ ...state.lastFeedback, refocus: false });
  }
  reapplyImportMessageTranslation();
  if (elements.nameQuizInput) {
    elements.nameQuizInput.placeholder = t("nameQuizPlaceholder");
  }
  renderSavedQuizzes().catch(() => {});
}

function renderHelpGlossary() {
  if (elements.helpJsonItem) {
    elements.helpJsonItem.innerHTML = t("helpJsonItem");
  }
  if (elements.helpIdItem) {
    elements.helpIdItem.innerHTML = t("helpIdItem");
  }
}

function renderShortcutGlossary() {
  if (elements.shortcutItemOpen) {
    elements.shortcutItemOpen.innerHTML = t("shortcutItemOpen");
  }
  if (elements.shortcutItemEsc) {
    elements.shortcutItemEsc.innerHTML = t("shortcutItemEsc");
  }
  if (elements.shortcutItemTab) {
    elements.shortcutItemTab.innerHTML = t("shortcutItemTab");
  }
  if (elements.shortcutItemAnswer) {
    elements.shortcutItemAnswer.innerHTML = t("shortcutItemAnswer");
  }
}

function renderDynamicLabels() {
  elements.modeBadge.textContent = state.quizMode === "failed_only" ? t("modeFailed") : t("modeFull");
  elements.progressLabel.textContent = `${t("questionPrefix")} ${Math.max(1, state.currentIndex + 1)}/${Math.max(1, state.questions.length || 1)}`;
}

function getLocaleForLanguage() {
  return state.language === "es" ? "es-ES" : "en-US";
}

function formatDateForLanguage(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value || "");
  return parsed.toLocaleString(getLocaleForLanguage());
}

function getModeLabel(mode) {
  return mode === "failed_only" ? t("modeFailedShort") : t("modeFullShort");
}

function setImportMessage(message, type = "info") {
  state.importMessageState = { message, type };
  setImportMessageUi({ element: elements.importMessage, message, type });
}

function setImportMessageByKey(key, type = "info", params = {}) {
  state.importMessageState = { key, type, params };
  setImportMessageUi({ element: elements.importMessage, message: t(key, params), type });
}

function reapplyImportMessageTranslation() {
  if (!state.importMessageState) return;

  if (state.importMessageState.key) {
    const { key, type, params = {} } = state.importMessageState;
    setImportMessageUi({ element: elements.importMessage, message: t(key, params), type });
    return;
  }

  const { message = "", type = "info" } = state.importMessageState;
  setImportMessageUi({ element: elements.importMessage, message, type });
}

function setSelectedFile(file) {
  state.pendingFile = file;
  const valid = file?.name?.toLowerCase().endsWith(".json") || false;
  elements.startFromUpload.disabled = !valid;
  if (!file) return setImportMessageByKey("noFile");
  if (!valid) return setImportMessageByKey("invalidFile", "error");
  return setImportMessageByKey("selectedFile", "success", { name: file.name });
}

function normalizeQuestions(payload) {
  return normalizeQuizQuestions(payload, t);
}

function buildCategories() {
  const categories = collectCategories(state.originalQuizData);
  elements.categoryFilter.innerHTML = `<option value="all">${t("allCategories")}</option>`;
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    elements.categoryFilter.appendChild(option);
  });
}

function getFilteredQuestions() {
  return filterQuestions(state.originalQuizData, state.categoryFilter);
}

function createShuffledSession(questions) {
  return buildShuffledSession(questions);
}

function clearTimer() {
  if (state.timerHandle) {
    clearInterval(state.timerHandle);
    state.timerHandle = null;
  }
}

function updateTimerLabel({ timedOut = false } = {}) {
  if (!state.timerEnabled) {
    elements.timerLabel.textContent = `${t("timer")}: ${t("timerOff")}`;
    return;
  }

  if (timedOut) {
    elements.timerLabel.textContent = `${t("timer")}: ${t("timeout")}`;
    return;
  }

  elements.timerLabel.textContent = `${t("timer")}: ${Math.max(0, state.timerSecondsLeft)}s`;
}

function startTimer() {
  clearTimer();
  if (!state.timerEnabled) {
    updateTimerLabel();
    return;
  }

  state.timerSecondsLeft = state.timerSeconds;
  updateTimerLabel();

  state.timerHandle = setInterval(() => {
    state.timerSecondsLeft -= 1;
    updateTimerLabel();
    if (state.timerSecondsLeft <= 0) {
      clearTimer();
      if (!state.answeredCurrent) {
        onOptionSelected(state.questions[state.currentIndex].id, null, { timedOut: true });
      }
    }
  }, 1000);
}

function renderCurrentQuestion() {
  const question = state.questions[state.currentIndex];
  if (!question) return;

  elements.progressLabel.textContent = `${t("questionPrefix")} ${state.currentIndex + 1}/${state.questions.length}`;
  elements.questionText.textContent = question.question;
  elements.optionsList.querySelectorAll(".option-item").forEach((node) => node.remove());
  elements.feedbackBox.classList.add("hidden");
  elements.nextBtn.classList.add("hidden");
  state.lastFeedback = null;
  state.answeredCurrent = false;

  question.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "option-item";
    label.dataset.optionId = option.id;
    label.tabIndex = 0;
    label.setAttribute("role", "button");
    label.setAttribute("aria-disabled", "false");
    label.setAttribute("aria-pressed", "false");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = `question-${question.id}`;
    input.value = option.id;
    input.className = "sr-only";
    input.tabIndex = -1;
    input.setAttribute("aria-hidden", "true");
    input.id = `opt-${question.id}-${index + 1}`;

    const activateOption = () => {
      if (state.answeredCurrent) return;
      input.checked = true;
      onOptionSelected(question.id, option.id);
    };

    label.addEventListener("click", (event) => {
      event.preventDefault();
      activateOption();
    });

    label.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateOption();
      }
    });

    const text = document.createElement("span");
    text.className =
      "block min-h-11 w-full rounded-xl border-2 border-slate-600 bg-white px-4 py-3 text-left text-base font-medium text-slate-900 dark:border-slate-300 dark:bg-slate-900 dark:text-slate-100";
    text.textContent = option.text;

    label.append(input, text);
    elements.optionsList.appendChild(label);
  });

  elements.questionText.focus();
  startTimer();
}

function toggleOptionsDisabled(disabled) {
  [...elements.optionsList.querySelectorAll(".option-item")].forEach((item) => {
    const input = item.querySelector("input[type='radio']");
    const text = item.querySelector("span");
    if (!input || !text) return;
    item.tabIndex = disabled ? -1 : 0;
    item.setAttribute("aria-disabled", String(disabled));
    input.disabled = disabled;
    text.classList.toggle("opacity-70", disabled);
  });
}

function showFeedback({ isCorrect, explanation, timedOut = false, correctOption = null, refocus = true }) {
  elements.feedbackBox.classList.remove("hidden");
  elements.feedbackBox.className = "feedback-box mt-4";

  let prefix = t("incorrect");
  if (timedOut) {
    prefix = t("timeout");
  } else if (isCorrect) {
    prefix = t("correct");
  }
  let message = explanation;

  if (!isCorrect && state.studyMode && correctOption) {
    message = `${message} ${t("correctAnswerPrefix")} ${correctOption.text}.`;
  }

  if (isCorrect) {
    elements.feedbackBox.classList.add("feedback-box--success");
  } else {
    elements.feedbackBox.classList.add("feedback-box--error");
  }

  elements.feedbackBox.innerHTML = `<div class="feedback-box__title">${prefix}</div><div class="feedback-box__body">${escapeHtml(message)}</div>`;
  if (refocus) {
    elements.feedbackBox.focus();
  }
}

function onOptionSelected(questionId, optionId, { timedOut = false } = {}) {
  if (state.answeredCurrent) return;
  const question = state.questions[state.currentIndex];
  if (!question || question.id !== questionId) return;

  clearTimer();
  if (state.timerEnabled) {
    updateTimerLabel({ timedOut });
  }
  state.answeredCurrent = true;
  toggleOptionsDisabled(true);

  const selectedOption = optionId ? question.options.find((option) => option.id === optionId) : null;
  const correctOption = question.options.find((option) => option.correct);
  const isCorrect = selectedOption ? Boolean(selectedOption.correct) : false;

  if (isCorrect) {
    state.score += 1;
  } else {
    state.currentAttemptIncorrect.add(String(questionId));
  }

  elements.scoreLabel.textContent = String(state.score);

  const optionItems = [...elements.optionsList.querySelectorAll(".option-item")];
  const selectedText = optionId
    ? optionItems.find((item) => item.dataset.optionId === optionId)?.querySelector("span")
    : null;
  const correctText = optionItems.find((item) => item.dataset.optionId === correctOption.id)?.querySelector("span");

  optionItems.forEach((item) => {
    item.setAttribute("aria-pressed", String(Boolean(optionId) && item.dataset.optionId === optionId));
  });

  if (correctText) {
    correctText.classList.add(
      "border-emerald-700",
      "bg-emerald-100",
      "text-emerald-900",
      "dark:border-emerald-300",
      "dark:bg-emerald-950",
      "dark:text-emerald-100"
    );
  }

  if (!isCorrect && selectedText) {
    selectedText.classList.add(
      "border-red-700",
      "bg-red-100",
      "text-red-900",
      "dark:border-red-300",
      "dark:bg-red-950",
      "dark:text-red-100"
    );
  }

  const explanation = timedOut
    ? correctOption?.explanation || question.explanation || t("timeout")
    : selectedOption?.explanation || question.explanation || correctOption?.explanation || t("noExplanation");

  state.lastFeedback = {
    isCorrect,
    explanation,
    timedOut,
    correctOption
  };

  showFeedback({
    isCorrect,
    explanation,
    timedOut,
    correctOption
  });

  elements.nextBtn.classList.remove("hidden");
  elements.nextBtn.textContent = state.currentIndex >= state.questions.length - 1 ? t("finishQuiz") : t("nextQuestion");
  elements.nextBtn.focus();
}

async function loadHistory() {
  const loaded = await loadHistoryFromDb(state.quizHash);
  state.attemptsHistory = loaded.attemptsHistory;
  state.questionStats = loaded.questionStats;
  state.bestAttempt = loaded.bestAttempt;
  state.attemptCount = loaded.attemptCount;
}

function saveHistory() {
  saveHistoryToDb(state.quizHash, {
    attemptsHistory: state.attemptsHistory,
    questionStats: state.questionStats,
    bestAttempt: state.bestAttempt
  }).catch((error) => {
    console.error("[QuizPulse] Failed to persist history:", error);
  });
}

function registerAttempt(resultData) {
  const attempt = {
    number: state.attemptCount,
    mode: state.quizMode,
    score: resultData.score,
    total: resultData.total,
    percentage: resultData.percentage,
    completedAt: new Date().toISOString()
  };

  state.attemptsHistory.push(attempt);

  if (!state.bestAttempt || attempt.percentage > state.bestAttempt.percentage) {
    state.bestAttempt = attempt;
  }

  state.questions.forEach((question) => {
    const key = String(question.id);
    const stat = state.questionStats[key] || { id: question.id, question: question.question, attempts: 0, failures: 0 };
    stat.attempts += 1;
    if (state.currentAttemptIncorrect.has(key)) stat.failures += 1;
    state.questionStats[key] = stat;
  });

  saveHistory();
}

function renderHistoryInsights() {
  elements.attemptsCountSummary.textContent = t("attemptsCompleted", { count: state.attemptsHistory.length });

  if (state.bestAttempt) {
    elements.bestScoreSummary.textContent = t("bestScore", {
      score: state.bestAttempt.score,
      total: state.bestAttempt.total,
      percentage: Math.round(state.bestAttempt.percentage)
    });
  } else {
    elements.bestScoreSummary.textContent = t("bestScore", { score: "--", total: "--", percentage: "--" });
  }

  elements.mostFailedList.innerHTML = "";
  const mostFailed = Object.values(state.questionStats)
    .filter((item) => item.failures > 0)
    .sort((a, b) => b.failures - a.failures)
    .slice(0, 5);

  if (mostFailed.length > 0) {
    mostFailed.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.question} — ${item.failures}/${item.attempts}`;
      elements.mostFailedList.appendChild(li);
    });
  } else {
    elements.mostFailedList.innerHTML = `<li>${t("noFailed")}</li>`;
  }

  elements.attemptHistoryList.innerHTML = "";
  const recent = state.attemptsHistory.slice(-8).reverse();
  if (recent.length > 0) {
    recent.forEach((attempt) => {
      const li = document.createElement("li");
      li.textContent = `#${attempt.number} · ${getModeLabel(attempt.mode)} · ${attempt.score}/${attempt.total} (${Math.round(attempt.percentage)}%) · ${formatDateForLanguage(attempt.completedAt)}`;
      elements.attemptHistoryList.appendChild(li);
    });
  } else {
    elements.attemptHistoryList.innerHTML = `<li>${t("noAttempts")}</li>`;
  }
}

function getFailedQuestionKeySet() {
  return getFailedQuestionKeys(state.questionStats);
}

function updateFailedOnlyButtonState() {
  const enabled = getFailedQuestionKeySet().size > 0;
  elements.failedOnlyBtn.disabled = !enabled;
  elements.failedOnlyBtn.classList.toggle("opacity-50", !enabled);
}

function parseSettingsFromUi() {
  state.categoryFilter = elements.categoryFilter.value;
  state.studyMode = elements.studyModeInput.checked;
  state.timerEnabled = elements.timerEnabledInput.checked;
  state.timerSeconds = Math.max(5, Math.min(300, Number(elements.timerSecondsInput.value) || 20));
  saveUiSettings(KEYS.settings, {
    categoryFilter: state.categoryFilter,
    studyMode: state.studyMode,
    timerEnabled: state.timerEnabled,
    timerSeconds: state.timerSeconds
  });
}

function loadSettingsToUi() {
  const loaded = loadUiSettings(KEYS.settings);
  state.categoryFilter = loaded.categoryFilter;
  state.studyMode = loaded.studyMode;
  state.timerEnabled = loaded.timerEnabled;
  state.timerSeconds = loaded.timerSeconds;

  elements.studyModeInput.checked = state.studyMode;
  elements.timerEnabledInput.checked = state.timerEnabled;
  elements.timerSecondsInput.value = String(state.timerSeconds);
}

async function showConfirmDialog({
  title,
  message,
  confirmText = t("confirmContinue"),
  cancelText = t("confirmCancel"),
  destructive = false
}) {
  if (!elements.confirmDialog?.showModal) return false;

  const previousFocus = document.activeElement;
  elements.confirmDialogTitle.textContent = title;
  elements.confirmDialogMessage.textContent = message;
  elements.confirmAcceptBtn.textContent = confirmText;
  elements.confirmCancelBtn.textContent = cancelText;

  elements.confirmAcceptBtn.className = destructive
    ? "touch-target rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white dark:bg-red-600"
    : "touch-target rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900";

  return new Promise((resolve) => {
    let settled = false;

    const finalize = (accepted) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (elements.confirmDialog.open) {
        elements.confirmDialog.close(accepted ? "confirm" : "cancel");
      }
      if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
      resolve(accepted);
    };

    const onCancel = () => finalize(false);
    const onAccept = () => finalize(true);
    const onDialogCancel = (event) => {
      event.preventDefault();
      finalize(false);
    };

    function cleanup() {
      elements.confirmCancelBtn.removeEventListener("click", onCancel);
      elements.confirmAcceptBtn.removeEventListener("click", onAccept);
      elements.confirmDialog.removeEventListener("cancel", onDialogCancel);
    }

    elements.confirmCancelBtn.addEventListener("click", onCancel);
    elements.confirmAcceptBtn.addEventListener("click", onAccept);
    elements.confirmDialog.addEventListener("cancel", onDialogCancel);

    elements.confirmDialog.showModal();
    elements.confirmCancelBtn.focus();
  });
}

async function startQuizWithPayload(questions, { mode = "full" } = {}) {
  const session = createShuffledSession(questions);
  if (!session.length) {
    setImportMessageByKey("noQuestionsForCategory", "error");
    return;
  }

  state.quizMode = mode;
  state.questions = session;
  state.currentIndex = 0;
  state.score = 0;
  state.currentAttemptIncorrect = new Set();
  state.answeredCurrent = false;
  state.attemptCount += 1;

  elements.attemptBadge.textContent = `#${state.attemptCount}`;
  elements.scoreLabel.textContent = "0";
  renderDynamicLabels();

  elements.importPanel.classList.add("hidden");
  elements.resultPanel.classList.add("hidden");
  elements.quizPanel.classList.remove("hidden");

  renderCurrentQuestion();
}

async function parseSelectedFileAsJson() {
  if (!state.pendingFile) {
    throw new Error(t("noFile"));
  }
  const raw = await state.pendingFile.text();
  if (!raw.trim()) throw new Error(t("emptyFile"));

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(t("parsingError"));
  }
}

async function uploadQuizModel() {
  setImportMessageByKey("uploading");
  elements.startFromUpload.disabled = true;

  try {
    parseSettingsFromUi();
    const payload = await parseSelectedFileAsJson();
    const normalized = normalizeQuestions(payload);

    // ── Deduplication: compute SHA-256 of normalised content ──────────────
    const hash = await computeContentHash(normalized);
    const existing = await getQuizByHash(hash);

    if (existing) {
      // Same content already in library → notify and offer to load it
      const loadIt = await showConfirmDialog({
        title: t("duplicateQuizTitle"),
        message: t("duplicateQuizMessage", { name: existing.name }),
        confirmText: t("loadQuiz"),
        cancelText: t("confirmCancel")
      });

      if (!loadIt) {
        setImportMessageByKey("startCanceled", "info");
        elements.startFromUpload.disabled = false;
        return;
      }

      await loadQuizFromLibrary(existing, { skipProgressCheck: true });
      return;
    }

    // ── New quiz → ask for a friendly name ────────────────────────────────
    const friendlyName = await showNameQuizDialog(state.pendingFile?.name ?? "");
    if (!friendlyName) {
      setImportMessageByKey("startCanceled", "info");
      elements.startFromUpload.disabled = !state.pendingFile;
      return;
    }

    // ── Confirm start ──────────────────────────────────────────────────────
    const confirmed = await showConfirmDialog({
      title: t("confirm"),
      message: t("startQuizConfirm", { count: normalized.length }),
      confirmText: t("startQuiz"),
      cancelText: t("confirmCancel")
    });

    if (!confirmed) {
      setImportMessageByKey("startCanceled", "info");
      elements.startFromUpload.disabled = !state.pendingFile;
      return;
    }

    // ── Persist to IndexedDB ───────────────────────────────────────────────
    await dbSaveQuiz({
      hash,
      name: friendlyName,
      normalizedData: normalized,
      questionCount: normalized.length,
      categories: collectCategories(normalized)
    });

    // ── Bootstrap app state ────────────────────────────────────────────────
    state.originalQuizData = normalized;
    state.quizHash = hash;
    await loadHistory();
    buildCategories();
    elements.categoryFilter.value = state.categoryFilter;

    renderSavedQuizzes().catch(() => {});

    const filtered = getFilteredQuestions();
    await startQuizWithPayload(filtered, { mode: "full" });
  } catch (error) {
    setImportMessage(error.message || t("parsingError"), "error");
    elements.startFromUpload.disabled = !state.pendingFile;
  }
}

// ─── Name-quiz dialog ─────────────────────────────────────────────────────────

/**
 * Show the name-quiz dialog and resolve with the entered name (or null on cancel).
 * @param {string} [fileName] Pre-fills the input from the raw filename.
 * @returns {Promise<string|null>}
 */
function showNameQuizDialog(fileName = "") {
  if (!elements.nameQuizDialog?.showModal) {
    // Fallback for environments without <dialog> support
    const name = (fileName.replace(/\.json$/i, "").replaceAll(/[_-]/g, " ").trim()) || "Quiz";
    return Promise.resolve(name);
  }

  const previousFocus = document.activeElement;

  // Pre-fill with a cleaned-up version of the filename
  const suggestion = fileName.replace(/\.json$/i, "").replaceAll(/[_-]/g, " ").trim();
  elements.nameQuizInput.value = suggestion;
  elements.nameQuizInput.placeholder = t("nameQuizPlaceholder");
  elements.nameQuizError.textContent = "";
  elements.nameQuizError.classList.add("hidden");

  return new Promise((resolve) => {
    let settled = false;

    const finalize = (name) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (elements.nameQuizDialog.open) elements.nameQuizDialog.close();
      if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
      resolve(name);
    };

    const onConfirm = () => {
      const name = elements.nameQuizInput.value.trim();
      if (!name) {
        elements.nameQuizError.textContent = t("nameQuizEmpty");
        elements.nameQuizError.classList.remove("hidden");
        elements.nameQuizInput.focus();
        return;
      }
      finalize(name);
    };

    const onCancel = () => finalize(null);
    const onDialogCancel = (event) => {
      event.preventDefault();
      finalize(null);
    };
    const onKeydown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onConfirm();
      }
    };

    function cleanup() {
      elements.nameQuizConfirmBtn.removeEventListener("click", onConfirm);
      elements.nameQuizCancelBtn.removeEventListener("click", onCancel);
      elements.nameQuizDialog.removeEventListener("cancel", onDialogCancel);
      elements.nameQuizInput.removeEventListener("keydown", onKeydown);
    }

    elements.nameQuizConfirmBtn.addEventListener("click", onConfirm);
    elements.nameQuizCancelBtn.addEventListener("click", onCancel);
    elements.nameQuizDialog.addEventListener("cancel", onDialogCancel);
    elements.nameQuizInput.addEventListener("keydown", onKeydown);

    elements.nameQuizDialog.showModal();
    elements.nameQuizInput.select();
    elements.nameQuizInput.focus();
  });
}

// ─── Library ──────────────────────────────────────────────────────────────────

/**
 * Load a quiz from the saved library and start a session.
 * @param {import("./db.js").QuizRecord} quiz
 * @param {{ skipProgressCheck?: boolean }} [options]
 */
async function loadQuizFromLibrary(quiz, { skipProgressCheck = false } = {}) {
  const hasProgress = !skipProgressCheck && state.attemptCount > 0;

  if (hasProgress) {
    const confirmed = await showConfirmDialog({
      title: t("confirm"),
      message: t("importAnotherConfirm"),
      confirmText: t("loadQuiz"),
      cancelText: t("confirmCancel"),
      destructive: true
    });
    if (!confirmed) return;
  }

  parseSettingsFromUi();

  // Reset file-upload UI – not needed for library loads
  state.pendingFile = null;
  elements.fileInput.value = "";
  elements.startFromUpload.disabled = true;
  setImportMessageByKey("importReady");

  state.originalQuizData = quiz.normalizedData;
  state.quizHash = quiz.hash;
  await loadHistory();
  buildCategories();
  elements.categoryFilter.value = state.categoryFilter;

  const filtered = getFilteredQuestions();
  if (!filtered.length) {
    setImportMessageByKey("noQuestionsForCategory", "error");
    return;
  }

  const confirmed = await showConfirmDialog({
    title: t("confirm"),
    message: t("startQuizConfirm", { count: filtered.length }),
    confirmText: t("startQuiz"),
    cancelText: t("confirmCancel")
  });

  if (!confirmed) {
    setImportMessageByKey("startCanceled", "info");
    return;
  }

  await startQuizWithPayload(filtered, { mode: "full" });
}

/**
 * Build a single library list item element.
 * @param {import("./db.js").QuizRecord} quiz
 * @returns {HTMLLIElement}
 */
/**
 * Build a single library list item element.
 * @param {import("./db.js").QuizRecord} quiz
 * @param {{ attemptCount: number, bestAttempt: object|null }} [history]
 */
function renderQuizLibraryItem(quiz, history) {
  const li = document.createElement("li");
  li.className =
    "flex items-start justify-between gap-3 rounded-xl border border-slate-300 bg-white/70 px-4 py-3 dark:border-slate-600 dark:bg-slate-800/50";

  // Info block
  const info = document.createElement("div");
  info.className = "min-w-0 flex-1";

  const name = document.createElement("p");
  name.className = "truncate text-sm font-semibold";
  name.textContent = quiz.name;

  const meta = document.createElement("p");
  meta.className = "mt-0.5 text-xs text-slate-600 dark:text-slate-400";
  meta.textContent = `${t("questions", { count: quiz.questionCount })} · ${t("importedAtLabel")}: ${formatDateForLanguage(quiz.importedAt)}`;

  const stats = document.createElement("p");
  stats.className = "mt-0.5 text-xs text-slate-500 dark:text-slate-500";
  if (history && history.attemptCount > 0) {
    const pct = history.bestAttempt ? Math.round(history.bestAttempt.percentage) : 0;
    stats.textContent = `${t("libraryAttempts", { count: history.attemptCount })} · ${t("libraryBestScore", { percentage: pct })}`;
  } else {
    stats.textContent = t("libraryNoAttempts");
  }

  info.append(name, meta, stats);

  // Actions block
  const actions = document.createElement("div");
  actions.className = "flex flex-shrink-0 gap-2";

  const loadBtn = document.createElement("button");
  loadBtn.type = "button";
  loadBtn.className =
    "touch-target rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900";
  loadBtn.textContent = t("loadQuiz");
  loadBtn.setAttribute("aria-label", `${t("loadQuiz")}: ${quiz.name}`);
  loadBtn.addEventListener("click", () => loadQuizFromLibrary(quiz));

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className =
    "touch-target rounded-xl border-2 border-red-700 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 dark:border-red-400 dark:bg-slate-900 dark:text-red-400";
  deleteBtn.textContent = t("deleteQuiz");
  deleteBtn.setAttribute("aria-label", `${t("deleteQuiz")}: ${quiz.name}`);
  deleteBtn.addEventListener("click", () => confirmDeleteQuiz(quiz));

  actions.append(loadBtn, deleteBtn);
  li.append(info, actions);
  return li;
}

/**
 * Fetch all saved quizzes and render the library panel.
 * Safe to call at any time – handles its own errors silently.
 * @returns {Promise<void>}
 */
let _renderSavedQuizzesSeq = 0;
async function renderSavedQuizzes() {
  if (!elements.savedQuizzesList || !elements.savedQuizzesEmpty) return;

  const seq = ++_renderSavedQuizzesSeq;

  try {
    const quizzes = await getAllQuizzes();
    if (seq !== _renderSavedQuizzesSeq) return;

    elements.savedQuizzesList.innerHTML = "";

    if (quizzes.length === 0) {
      elements.savedQuizzesEmpty.classList.remove("hidden");
      return;
    }

    elements.savedQuizzesEmpty.classList.add("hidden");
    const histories = await Promise.all(quizzes.map((q) => loadHistoryFromDb(q.hash)));
    if (seq !== _renderSavedQuizzesSeq) return;

    quizzes.forEach((quiz, i) => {
      elements.savedQuizzesList.appendChild(renderQuizLibraryItem(quiz, histories[i]));
    });
  } catch (err) {
    console.error("[QuizPulse] Could not render saved quizzes:", err);
  }
}

/**
 * Ask for confirmation, then delete a quiz from the library.
 * @param {import("./db.js").QuizRecord} quiz
 */
async function confirmDeleteQuiz(quiz) {
  const confirmed = await showConfirmDialog({
    title: t("confirm"),
    message: t("deleteQuizConfirm", { name: quiz.name }),
    confirmText: t("deleteQuiz"),
    cancelText: t("confirmCancel"),
    destructive: true
  });
  if (!confirmed) return;

  await dbDeleteQuiz(/** @type {number} */ (quiz.id), quiz.hash);

  // If the deleted quiz was the active one, reset related state
  if (state.quizHash === quiz.hash) {
    state.originalQuizData = null;
    state.quizHash = null;
    state.attemptsHistory = [];
    state.questionStats = {};
    state.bestAttempt = null;
    state.attemptCount = 0;
    renderHistoryInsights();
    updateFailedOnlyButtonState();
  }

  await renderSavedQuizzes();
}

// ─── Results ───────────────────────────────────────────────────────────────────

function renderResults() {
  clearTimer();

  elements.quizPanel.classList.add("hidden");
  elements.resultPanel.classList.remove("hidden");

  const total = state.questions.length;
  const score = state.score;
  const percentage = total ? Number(((score / total) * 100).toFixed(2)) : 0;

  registerAttempt({ score, total, percentage });
  refreshResultPanelText();
  renderHistoryInsights();
  updateFailedOnlyButtonState();
  document.getElementById("resultsHeading")?.focus();
}

function renderScoreDonut({ score, total, percentage }) {
  if (!elements.scoreDonutArc || !elements.scoreDonutPercent || !elements.scoreDonutLegend || !elements.scoreDonutWrap)
    return;

  const ratio = total ? Math.max(0, Math.min(1, score / total)) : 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const filled = ratio * circumference;
  const incorrect = Math.max(0, total - score);

  elements.scoreDonutArc.style.strokeDasharray = `${filled} ${circumference}`;
  elements.scoreDonutPercent.textContent = `${Math.round(percentage)}%`;
  elements.scoreDonutLegend.textContent = t("scoreChartLegend", { correct: score, incorrect });
  elements.scoreDonutWrap.setAttribute(
    "aria-label",
    t("scoreChartAria", {
      percentage: Math.round(percentage),
      correct: score,
      incorrect
    })
  );
}

function refreshResultPanelText() {
  if (elements.resultPanel.classList.contains("hidden")) return;

  const total = state.questions.length;
  const score = state.score;
  const percentage = total ? Number(((score / total) * 100).toFixed(2)) : 0;

  elements.scoreSummary.textContent = t("scoreSummary", { score, total });
  elements.attemptSummary.textContent = t("attemptSummary", { attempt: state.attemptCount });
  renderScoreDonut({ score, total, percentage });
}

function nextQuestionOrResults() {
  if (state.currentIndex < state.questions.length - 1) {
    state.currentIndex += 1;
    renderCurrentQuestion();
  } else {
    renderResults();
  }
}

async function retakeSameQuiz() {
  if (!state.originalQuizData) return;
  const confirmed = await showConfirmDialog({
    title: t("confirm"),
    message: t("retakeConfirm"),
    confirmText: t("retake"),
    cancelText: t("confirmCancel")
  });
  if (!confirmed) return;

  parseSettingsFromUi();
  const filtered = getFilteredQuestions();
  await startQuizWithPayload(filtered, { mode: "full" });
}

async function practiceFailedQuestions() {
  if (!state.originalQuizData) return;
  const failedSet = getFailedQuestionKeySet();
  const subset = state.originalQuizData.filter((question) => failedSet.has(String(question.id)));

  if (!subset.length) {
    elements.scoreSummary.textContent = t("noFailed");
    return;
  }

  const confirmed = await showConfirmDialog({
    title: t("confirm"),
    message: t("failedConfirm", { count: subset.length }),
    confirmText: t("failedPractice"),
    cancelText: t("confirmCancel")
  });
  if (!confirmed) return;

  await startQuizWithPayload(subset, { mode: "failed_only" });
}

function createTemplateDownload() {
  const data = [
    {
      id: 1,
      category: t("defaultCategory"),
      question: t("templateQuestionText"),
      options: [
        { text: t("templateOptionA"), correct: true, explanation: t("templateExplanationRight") },
        { text: t("templateOptionB"), correct: false, explanation: t("templateExplanationWrong") }
      ]
    }
  ];

  downloadBlob("quiz_template.json", "application/json", JSON.stringify(data, null, 2));
}

function exportResultsJson() {
  exportJsonFile({
    attempts: state.attemptsHistory,
    bestAttempt: state.bestAttempt,
    questionStats: state.questionStats
  });
}

function exportResultsCsv() {
  exportCsvFile({
    attemptsHistory: state.attemptsHistory,
    t,
    getModeLabel,
    formatDateForLanguage
  });
}

function exportResultsPdf() {
  exportPdfFile({
    t,
    scoreSummary: elements.scoreSummary.textContent || "",
    attemptSummary: elements.attemptSummary.textContent || "",
    attemptsHistory: state.attemptsHistory,
    escapeHtml,
    formatDateForLanguage
  });
}

function restartFlow() {
  clearTimer();
  state.questions = [];
  state.currentIndex = 0;
  state.answeredCurrent = false;
  state.score = 0;

  elements.fileInput.value = "";
  elements.startFromUpload.disabled = !state.pendingFile;
  elements.importPanel.classList.remove("hidden");
  elements.quizPanel.classList.add("hidden");
  elements.resultPanel.classList.add("hidden");

  renderHistoryInsights();
  updateFailedOnlyButtonState();
  setImportMessageByKey("importReady");
  renderSavedQuizzes().catch(() => {});
}

async function confirmRestartFlow() {
  const hasProgress = state.attemptCount > 0 || state.pendingFile;
  if (hasProgress) {
    const confirmed = await showConfirmDialog({
      title: t("confirm"),
      message: t("importAnotherConfirm"),
      confirmText: t("importAnother"),
      cancelText: t("confirmCancel"),
      destructive: true
    });
    if (!confirmed) return;
  }
  state.pendingFile = null;
  restartFlow();
}

async function abortCurrentQuiz() {
  const confirmed = await showConfirmDialog({
    title: t("confirm"),
    message: t("abortConfirm"),
    confirmText: t("cancelImport"),
    cancelText: t("confirmCancel"),
    destructive: true
  });
  if (!confirmed) return;
  restartFlow();
}

function applyTheme(theme) {
  applyThemeUi({
    theme,
    themeToggle: elements.themeToggle,
    key: KEYS.theme,
    t,
    createIcons: () => lucide.createIcons()
  });
}

function applyScale(scale) {
  applyScaleUi({ scale, key: KEYS.scale, buttons: document.querySelectorAll(".font-scale-btn") });
}

function applyMotion(mode) {
  applyMotionUi({ mode, key: KEYS.motion, button: elements.motionToggle, t });
}

function applyReadingMode(enabled) {
  applyReadingModeUi({ enabled, key: KEYS.reading, button: elements.readingModeToggle, t });
}

function applyContrast(mode) {
  applyContrastUi({ mode, key: KEYS.contrast, button: elements.contrastToggle, t });
}

function applyLanguage(language) {
  state.language = language === "es" ? "es" : "en";
  localStorage.setItem(KEYS.language, state.language);
  applyTranslations();
  renderHistoryInsights();
}

function handleDragEvents() {
  ["dragenter", "dragover"].forEach((eventName) => {
    elements.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropZone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    elements.dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropZone.classList.remove("dragover");
    });
  });

  elements.dropZone.addEventListener("drop", (event) => {
    const file = event.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  });

  elements.dropZone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      elements.fileInput.click();
    }
  });
}

function bindEvents() {
  elements.fileInput.addEventListener("change", (event) => {
    setSelectedFile(event.target.files?.[0] || null);
  });

  elements.startFromUpload.addEventListener("click", uploadQuizModel);
  elements.downloadTemplateBtn.addEventListener("click", createTemplateDownload);
  elements.abortQuizBtn.addEventListener("click", abortCurrentQuiz);
  elements.nextBtn.addEventListener("click", nextQuestionOrResults);
  elements.retakeBtn.addEventListener("click", retakeSameQuiz);
  elements.failedOnlyBtn.addEventListener("click", practiceFailedQuestions);
  elements.importAnotherBtn.addEventListener("click", confirmRestartFlow);

  elements.exportJsonBtn.addEventListener("click", exportResultsJson);
  elements.exportCsvBtn.addEventListener("click", exportResultsCsv);
  elements.exportPdfBtn.addEventListener("click", exportResultsPdf);

  elements.languageToggle.addEventListener("click", () => {
    applyLanguage(state.language === "en" ? "es" : "en");
  });

  elements.themeToggle.addEventListener("click", () => {
    const dark = document.documentElement.classList.contains("dark");
    applyTheme(dark ? "light" : "dark");
  });

  elements.contrastToggle.addEventListener("click", () => {
    const high = document.body.classList.contains("high-contrast");
    applyContrast(high ? "standard" : "high");
  });

  elements.motionToggle.addEventListener("click", () => {
    const reduced = document.documentElement.classList.contains("reduce-motion");
    applyMotion(reduced ? "standard" : "reduce");
  });

  elements.readingModeToggle.addEventListener("click", () => {
    const enabled = document.body.classList.contains("reading-mode");
    applyReadingMode(!enabled);
  });

  document.querySelectorAll(".font-scale-btn").forEach((button) => {
    button.addEventListener("click", () => applyScale(button.dataset.scale));
  });

  elements.categoryFilter.addEventListener("change", parseSettingsFromUi);
  elements.studyModeInput.addEventListener("change", parseSettingsFromUi);
  elements.timerEnabledInput.addEventListener("change", parseSettingsFromUi);
  elements.timerSecondsInput.addEventListener("change", parseSettingsFromUi);

  elements.shortcutCloseBtn.addEventListener("click", () => elements.shortcutDialog.close());

  document.addEventListener("keydown", (event) => {
    if (event.key === "?" && !elements.shortcutDialog.open) {
      event.preventDefault();
      elements.shortcutDialog.showModal();
      elements.shortcutCloseBtn.focus();
    }
  });
}

function initPreferences() {
  const storedTheme = localStorage.getItem(KEYS.theme);
  const preferredDark = globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(storedTheme || (preferredDark ? "dark" : "light"));

  applyScale(localStorage.getItem(KEYS.scale) || "1.25");

  const storedMotion = localStorage.getItem(KEYS.motion);
  const preferredReduced = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
  applyMotion(storedMotion || (preferredReduced ? "reduce" : "standard"));

  applyReadingMode(localStorage.getItem(KEYS.reading) === "on");
  applyContrast(localStorage.getItem(KEYS.contrast) || "standard");
  applyLanguage(localStorage.getItem(KEYS.language) || "en");
}

function init() {
  lucide.createIcons();
  initPreferences();
  loadSettingsToUi();
  bindEvents();
  handleDragEvents();
  restartFlow();
}

export const __test = {
  state,
  elements,
  applyTranslations,
  formatDateForLanguage,
  getModeLabel,
  renderCurrentQuestion,
  toggleOptionsDisabled,
  onOptionSelected,
  parseSettingsFromUi,
  showConfirmDialog,
  uploadQuizModel,
  renderResults,
  renderScoreDonut,
  refreshResultPanelText,
  practiceFailedQuestions,
  confirmRestartFlow,
  showNameQuizDialog,
  loadQuizFromLibrary,
  renderSavedQuizzes,
  confirmDeleteQuiz
};

init();
