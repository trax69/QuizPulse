/**
 * @file db.js
 * @description IndexedDB persistence layer for QuizPulse.
 *
 * Stores
 * ──────
 *   quizzes      – catalog of imported quizzes (metadata + normalized data)
 *   quiz_history – per-quiz attempt history, keyed by content hash
 *
 * Design principles
 * ─────────────────
 * • Zero external dependencies – plain IDB wrapped in Promises.
 * • Single openDatabase() call cached per page lifetime.
 * • All public functions are async and explicitly typed via JSDoc.
 * • DB version bumps are the only place schema mutations can happen.
 */

/** @type {IDBDatabase|null} */
let _dbInstance = null;
/** @type {Promise<IDBDatabase>|null} */
let _dbOpenPromise = null;

const DB_NAME = "QuizPulseDB";
const DB_VERSION = 1;

export const STORE_QUIZZES = "quizzes";
export const STORE_HISTORY = "quiz_history";

/**
 * Close and release the cached DB connection.
 * Intended for test isolation – do not call in production code.
 * @returns {void}
 */
export function _resetDbForTesting() {
  _dbInstance?.close();
  _dbInstance = null;
  _dbOpenPromise = null;
}

// ─── Connection ──────────────────────────────────────────────────────────────

/**
 * Open (or return cached) the database, running schema migrations when needed.
 * @returns {Promise<IDBDatabase>}
 */
function openDatabase() {
  if (_dbInstance) return Promise.resolve(_dbInstance);
  // Return the in-flight promise so concurrent callers share one IDB open request
  // instead of accidentally queuing duplicate version-change transactions.
  if (_dbOpenPromise !== null) return _dbOpenPromise;

  _dbOpenPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = /** @type {IDBOpenDBRequest} */ (event.target).result;

      // ── quizzes store ──────────────────────────────────────────────────────
      if (!db.objectStoreNames.contains(STORE_QUIZZES)) {
        const quizStore = db.createObjectStore(STORE_QUIZZES, {
          keyPath: "id",
          autoIncrement: true
        });
        quizStore.createIndex("hash", "hash", { unique: true });
        quizStore.createIndex("name", "name", { unique: false });
        quizStore.createIndex("importedAt", "importedAt", { unique: false });
      }

      // ── quiz_history store ─────────────────────────────────────────────────
      if (!db.objectStoreNames.contains(STORE_HISTORY)) {
        const histStore = db.createObjectStore(STORE_HISTORY, {
          keyPath: "id",
          autoIncrement: true
        });
        histStore.createIndex("quizHash", "quizHash", { unique: true });
      }
    };

    request.onsuccess = (event) => {
      _dbInstance = /** @type {IDBOpenDBRequest} */ (event.target).result;
      _dbOpenPromise = null;

      // Handle unexpected version change from another tab
      _dbInstance.onversionchange = () => {
        _dbInstance?.close();
        _dbInstance = null;
      };

      resolve(_dbInstance);
    };

    request.onerror = (event) => {
      _dbOpenPromise = null;
      reject(/** @type {IDBOpenDBRequest} */ (event.target).error);
    };

    request.onblocked = () => {
      _dbOpenPromise = null;
      reject(new Error("IndexedDB upgrade blocked. Please close other tabs and try again."));
    };
  });

  return _dbOpenPromise;
}

// ─── Hashing ─────────────────────────────────────────────────────────────────

/**
 * Compute a deterministic 64-bit content hash of any JSON-serialisable value.
 *
 * Uses a two-pass pure-JS approach (FNV-1a + djb2) that:
 * • Never requires async I/O (resolves in the current microtask tick via
 *   Promise.resolve, compatible with both browser and Node.js test environments)
 * • Provides ~64 bits of uniqueness — far more than sufficient for deduplication
 *   of quiz files
 *
 * @param {unknown} value
 * @returns {Promise<string>} 16-char lowercase hex string
 */
export function computeContentHash(value) {
  const source = JSON.stringify(value);

  // FNV-1a 32-bit
  let fnv = 0x811c9dc5;
  // djb2 32-bit
  let djb = 5381;

  for (let i = 0; i < source.length; i += 1) {
    const c = source.codePointAt(i) ?? 0;
    fnv = Math.imul(fnv ^ c, 0x01000193) >>> 0;
    djb = (Math.imul(33, djb) ^ c) >>> 0;
  }

  const hex = `${fnv.toString(16).padStart(8, "0")}${djb.toString(16).padStart(8, "0")}`;
  return Promise.resolve(hex);
}

// ─── Quiz catalog ─────────────────────────────────────────────────────────────

/**
 * @typedef {{
 *   id?:           number,
 *   hash:          string,
 *   name:          string,
 *   normalizedData: unknown[],
 *   questionCount: number,
 *   categories:    string[],
 *   importedAt?:   string
 * }} QuizRecord
 */

/**
 * Persist a new quiz entry to the catalog.
 * Rejects if a quiz with the same hash already exists (unique index violation).
 *
 * @param {Omit<QuizRecord, "id"|"importedAt">} quiz
 * @returns {Promise<number>} Auto-generated record id
 */
export async function saveQuiz(quiz) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_QUIZZES, "readwrite");
    const store = tx.objectStore(STORE_QUIZZES);
    const record = { ...quiz, importedAt: new Date().toISOString() };
    const request = store.add(record);
    request.onsuccess = () => resolve(/** @type {number} */ (request.result));
    request.onerror = () => reject(request.error);
  });
}

/**
 * Find a quiz by its content hash.
 *
 * @param {string} hash
 * @returns {Promise<QuizRecord|undefined>}
 */
export async function getQuizByHash(hash) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_QUIZZES, "readonly");
    const index = tx.objectStore(STORE_QUIZZES).index("hash");
    const request = index.get(hash);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieve all saved quizzes sorted by importedAt descending (newest first).
 *
 * @returns {Promise<QuizRecord[]>}
 */
export async function getAllQuizzes() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_QUIZZES, "readonly");
    const request = tx.objectStore(STORE_QUIZZES).getAll();
    request.onsuccess = () => {
      const sorted = (request.result || []).sort(
        // Sort by id descending so newest imports always appear first,
        // regardless of any timestamp-resolution ties.
        (a, b) => (b.id ?? 0) - (a.id ?? 0)
      );
      resolve(sorted);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete a quiz from the catalog AND erase its associated history.
 *
 * @param {number} quizId
 * @param {string} quizHash
 * @returns {Promise<void>}
 */
export async function deleteQuiz(quizId, quizHash) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_QUIZZES, STORE_HISTORY], "readwrite");

    tx.objectStore(STORE_QUIZZES).delete(quizId);

    // Remove the associated history record (if any)
    const historyIndex = tx.objectStore(STORE_HISTORY).index("quizHash");
    const getKeyReq = historyIndex.getKey(quizHash);
    getKeyReq.onsuccess = () => {
      if (getKeyReq.result !== undefined) {
        tx.objectStore(STORE_HISTORY).delete(getKeyReq.result);
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

// ─── History ──────────────────────────────────────────────────────────────────

/**
 * @typedef {{
 *   attemptsHistory: Array<object>,
 *   questionStats:   Record<string, object>,
 *   bestAttempt:     object|null,
 *   attemptCount:    number
 * }} HistoryPayload
 */

/**
 * Load persisted history for a quiz.
 * Returns a safe empty payload when no record exists yet.
 *
 * @param {string} quizHash
 * @returns {Promise<HistoryPayload>}
 */
export async function loadHistoryFromDb(quizHash) {
  if (!quizHash) {
    return { attemptsHistory: [], questionStats: {}, bestAttempt: null, attemptCount: 0 };
  }

  const db = await openDatabase();
  const record = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_HISTORY, "readonly");
    const index = tx.objectStore(STORE_HISTORY).index("quizHash");
    const request = index.get(quizHash);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  if (!record) {
    return { attemptsHistory: [], questionStats: {}, bestAttempt: null, attemptCount: 0 };
  }

  const attemptsHistory = Array.isArray(record.attemptsHistory) ? record.attemptsHistory : [];
  return {
    attemptsHistory,
    questionStats: record.questionStats || {},
    bestAttempt: record.bestAttempt || null,
    attemptCount: attemptsHistory.length
  };
}

/**
 * Persist (create or update) the history record for a quiz.
 *
 * @param {string} quizHash
 * @param {{ attemptsHistory: Array<object>, questionStats: Record<string,object>, bestAttempt: object|null }} payload
 * @returns {Promise<void>}
 */
export async function saveHistoryToDb(quizHash, payload) {
  if (!quizHash) return;

  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_HISTORY, "readwrite");
    const store = tx.objectStore(STORE_HISTORY);
    const index = store.index("quizHash");

    const getKeyReq = index.getKey(quizHash);
    getKeyReq.onsuccess = () => {
      const existingPK = getKeyReq.result;
      const record = { quizHash, ...payload };
      // put() requires the full key to update an existing row
      const writeReq = existingPK === undefined ? store.add(record) : store.put({ id: existingPK, ...record });
      writeReq.onerror = () => reject(writeReq.error);
    };
    getKeyReq.onerror = () => reject(getKeyReq.error);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}
