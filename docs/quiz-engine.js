/**
 * @typedef {{id:string, text:string, correct:boolean, explanation:string}} QuizOption
 * @typedef {{id:string|number, category:string, question:string, explanation:string, options:QuizOption[]}} QuizQuestion
 */

/**
 * Shuffle array in-place using Fisher-Yates.
 * @template T
 * @param {T[]} array
 */
export function shuffleInPlace(array) {
  for (let index = array.length - 1; index > 0; index -= 1) {
    const randomIndex = getSecureRandomInt(index + 1);
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }
}

/**
 * Generate a secure random integer in [0, maxExclusive).
 * @param {number} maxExclusive
 * @returns {number}
 */
function getSecureRandomInt(maxExclusive) {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new RangeError("maxExclusive must be a positive integer");
  }

  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.getRandomValues) {
    throw new Error("Secure random generator is not available in this environment");
  }

  const maxUint32 = 0x100000000;
  const cutoff = maxUint32 - (maxUint32 % maxExclusive);
  const buffer = new Uint32Array(1);

  let value;
  do {
    cryptoApi.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= cutoff);

  return value % maxExclusive;
}

/**
 * Compute a stable quiz hash key.
 * @param {unknown} payload
 * @returns {string}
 */
export function hashQuiz(payload) {
  const source = JSON.stringify(payload);
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    const codePoint = source.codePointAt(index) || 0;
    hash = Math.trunc((hash * 31 + codePoint) % 2147483647);
  }
  return `quiz-${Math.abs(hash)}`;
}

/**
 * Validate and normalize raw quiz JSON payload.
 * @param {unknown} payload
 * @param {(key:string, params?:Record<string,string|number>) => string} t
 * @returns {QuizQuestion[]}
 */
export function normalizeQuestions(payload, t) {
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error(t("rootArrayError"));
  }

  const ids = new Set();
  return payload.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new TypeError(t("questionObjectError", { index: index + 1 }));
    }

    const id = item.id ?? `q-${index + 1}`;
    if (ids.has(id)) throw new Error(t("duplicateIdError", { id }));
    ids.add(id);

    if (!item.question || typeof item.question !== "string") {
      throw new TypeError(t("invalidQuestionTextError", { index: index + 1 }));
    }
    if (!item.question.trim()) {
      throw new Error(t("emptyQuestionTextError", { index: index + 1 }));
    }

    if (!Array.isArray(item.options) || item.options.length < 2) {
      throw new Error(t("minOptionsError", { id }));
    }

    let correctCount = 0;
    const options = item.options.map((option, optionIndex) => {
      if (!option || typeof option !== "object") {
        throw new TypeError(t("invalidOptionError", { index: optionIndex + 1, id }));
      }

      const optionText = String(option.text || "").trim();
      if (!optionText) {
        throw new Error(t("emptyOptionTextError", { index: optionIndex + 1, id }));
      }

      if (typeof option.correct !== "boolean") {
        throw new TypeError(t("optionBooleanError", { index: optionIndex + 1, id }));
      }
      if (option.correct) correctCount += 1;

      return {
        id: `${id}-opt-${optionIndex + 1}`,
        text: optionText,
        correct: option.correct,
        explanation: String(option.explanation || "").trim() || t("noExplanation")
      };
    });

    if (correctCount !== 1) {
      throw new Error(t("oneCorrectError", { id }));
    }

    return {
      id,
      category: String(item.category || t("defaultCategory")),
      question: item.question.trim(),
      explanation: typeof item.explanation === "string" ? item.explanation.trim() : "",
      options
    };
  });
}

/**
 * Filter and deep-clone questions by selected category.
 * @param {QuizQuestion[]|null} originalQuizData
 * @param {string} categoryFilter
 * @returns {QuizQuestion[]}
 */
export function getFilteredQuestions(originalQuizData, categoryFilter) {
  if (!originalQuizData) return [];
  if (categoryFilter === "all") {
    return originalQuizData.map((item) => ({
      ...item,
      options: item.options.map((option) => ({ ...option }))
    }));
  }

  return originalQuizData
    .filter((question) => question.category === categoryFilter)
    .map((item) => ({
      ...item,
      options: item.options.map((option) => ({ ...option }))
    }));
}

/**
 * Build a shuffled session from normalized questions.
 * @param {QuizQuestion[]} questions
 * @returns {QuizQuestion[]}
 */
export function createShuffledSession(questions) {
  const list = questions.map((question) => {
    const options = question.options.map((option) => ({ ...option }));
    shuffleInPlace(options);
    return { ...question, options };
  });

  shuffleInPlace(list);
  return list;
}

/**
 * Build sorted category labels.
 * @param {QuizQuestion[]|null} originalQuizData
 * @returns {string[]}
 */
export function collectCategories(originalQuizData) {
  return [...new Set((originalQuizData || []).map((question) => question.category))].sort((left, right) => left.localeCompare(right));
}
