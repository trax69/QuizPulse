/**
 * Translation matrix by key.
 * Each entry is [english, spanish].
 */
const TRANSLATIONS = {
  skipLink: ["Skip to main content", "Saltar al contenido principal"],
  appTitle: ["Pulse Quiz", "Pulse Quiz"],
  appSubtitle: [
    "Upload your JSON model, practice instantly, and get feedback in real-time.",
    "Sube tu modelo JSON, practica al instante y recibe retroalimentación en tiempo real."
  ],
  toggleLanguageAria: ["Switch language", "Cambiar idioma"],
  switchToEnglish: ["English", "English"],
  switchToSpanish: ["Español", "Español"],
  switchToEnglishAria: ["Switch language to English", "Cambiar idioma a inglés"],
  switchToSpanishAria: ["Switch language to Spanish", "Cambiar idioma a español"],
  toggleThemeAria: ["Toggle dark mode", "Cambiar modo oscuro"],
  fontSizeControlsAria: ["Font size controls", "Controles de tamaño de fuente"],
  importHeading: ["Import Wizard", "Asistente de importación"],
  importInstructions: [
    "Upload a JSON file with questions. Use template if needed.",
    "Sube un archivo JSON con preguntas. Usa la plantilla si lo necesitas."
  ],
  schemaHeading: ["Required JSON schema", "Esquema JSON requerido"],
  schemaExample: [
    "[\n  {\n    \"id\": 1,\n    \"category\": \"General\",\n    \"question\": \"Sample Question Text\",\n    \"options\": [\n      {\"text\": \"Option A\", \"correct\": true, \"explanation\": \"Why this is right\"},\n      {\"text\": \"Option B\", \"correct\": false, \"explanation\": \"Why this is wrong\"}\n    ]\n  }\n]",
    "[\n  {\n    \"id\": 1,\n    \"category\": \"General\",\n    \"question\": \"Texto de pregunta de ejemplo\",\n    \"options\": [\n      {\"text\": \"Opción A\", \"correct\": true, \"explanation\": \"Por qué esta es correcta\"},\n      {\"text\": \"Opción B\", \"correct\": false, \"explanation\": \"Por qué esta es incorrecta\"}\n    ]\n  }\n]"
  ],
  dropTitle: ["Drag & drop a JSON file here", "Arrastra y suelta un archivo JSON aquí"],
  dropHint: ["or use the file picker below", "o usa el selector de archivos"],
  categoryFilter: ["Category filter", "Filtro por categoría"],
  studyMode: ["Study mode", "Modo estudio"],
  timer: ["Timer", "Temporizador"],
  secondsPerQuestion: ["Seconds", "Segundos"],
  chooseJson: ["Choose JSON", "Elegir JSON"],
  startQuiz: ["Start Quiz", "Iniciar Quiz"],
  downloadTemplate: ["Download Template", "Descargar plantilla"],
  attempt: ["Attempt", "Intento"],
  score: ["Score", "Puntaje"],
  questionHelp: ["Use Tab and Space/Enter to answer.", "Usa Tab y Espacio/Enter para responder."],
  currentQuestion: ["Current question", "Pregunta actual"],
  answerOptions: ["Answer options", "Opciones de respuesta"],
  cancelImport: ["Cancel and Import Another", "Cancelar e importar otro"],
  nextQuestion: ["Next Question", "Siguiente pregunta"],
  results: ["Results", "Resultados"],
  retake: ["Retake Same Quiz", "Reintentar el mismo quiz"],
  failedPractice: ["Practice Failed Questions", "Practicar preguntas falladas"],
  importAnother: ["Import Another Quiz", "Importar otro quiz"],
  exportJson: ["Export JSON", "Exportar JSON"],
  exportCsv: ["Export CSV", "Exportar CSV"],
  exportPdf: ["Export PDF", "Exportar PDF"],
  history: ["Performance History", "Historial de rendimiento"],
  mostFailed: ["Most failed questions", "Preguntas más falladas"],
  recentAttempts: ["Recent attempts", "Intentos recientes"],
  help: ["Help and glossary", "Ayuda y glosario"],
  helpShortcut: ["Tip: press ? to open keyboard shortcuts.", "Tip: presiona ? para abrir atajos de teclado."],
  noQuestionsForCategory: ["No questions for current category.", "No hay preguntas para la categoría actual."],
  confirmCancel: ["Cancel", "Cancelar"],
  confirmContinue: ["Continue", "Continuar"],
  allCategories: ["All", "Todas"],
  correctAnswerPrefix: ["Correct answer:", "Respuesta correcta:"],
  noExplanation: ["No explanation provided.", "No se proporcionó explicación."],
  motionStandard: ["Motion: Standard", "Movimiento: Estándar"],
  motionReduced: ["Motion: Reduced", "Movimiento: Reducido"],
  readingOn: ["Reading: On", "Lectura: Activado"],
  readingOff: ["Reading: Off", "Lectura: Desactivado"],
  contrastStandard: ["Contrast: Standard", "Contraste: Estándar"],
  contrastHigh: ["Contrast: High", "Contraste: Alto"],
  rootArrayError: ["Root JSON must be a non-empty array.", "El JSON raíz debe ser un arreglo no vacío."],
  questionObjectError: ["Question {index} must be an object.", "La pregunta {index} debe ser un objeto."],
  duplicateIdError: ["Duplicate id {id}", "Id duplicado {id}"],
  invalidQuestionTextError: ["Invalid question text at {index}", "Texto de pregunta inválido en {index}"],
  emptyQuestionTextError: ["Question {index} text cannot be empty.", "El texto de la pregunta {index} no puede estar vacío."],
  minOptionsError: ["Question {id} must include at least two options.", "La pregunta {id} debe incluir al menos dos opciones."],
  invalidOptionError: ["Invalid option {index} in question {id}", "Opción inválida {index} en la pregunta {id}"],
  emptyOptionTextError: ["Option {index} in question {id} must include text.", "La opción {index} de la pregunta {id} debe incluir texto."],
  optionBooleanError: ["Option {index} in question {id} must include boolean correct.", "La opción {index} de la pregunta {id} debe incluir booleano correct."],
  oneCorrectError: ["Question {id} must have exactly one correct option.", "La pregunta {id} debe tener exactamente una opción correcta."],
  csvAttempt: ["Attempt", "Intento"],
  csvMode: ["Mode", "Modo"],
  csvScore: ["Score", "Puntaje"],
  csvTotal: ["Total", "Total"],
  csvPercentage: ["Percentage", "Porcentaje"],
  csvCompletedAt: ["Completed at", "Completado"],
  modeFullShort: ["Full", "Completo"],
  modeFailedShort: ["Failed", "Falladas"],
  pdfTitle: ["Quiz Results", "Resultados del Quiz"],
  pdfHeading: ["Quiz Results", "Resultados del Quiz"],
  pdfRecentAttempts: ["Recent attempts", "Intentos recientes"],
  defaultCategory: ["General", "General"],
  templateQuestionText: ["Sample Question Text", "Texto de pregunta de ejemplo"],
  templateOptionA: ["Option A", "Opción A"],
  templateOptionB: ["Option B", "Opción B"],
  templateExplanationRight: ["Why this is right", "Por qué esta es correcta"],
  templateExplanationWrong: ["Why this is wrong", "Por qué esta es incorrecta"],
  shortcutTitle: ["Keyboard shortcuts", "Atajos de teclado"],
  shortcutClose: ["Close", "Cerrar"],
  shortcutItemOpen: ["<strong>?</strong>: open shortcuts", "<strong>?</strong>: abrir atajos"],
  shortcutItemEsc: ["<strong>Esc</strong>: close dialogs", "<strong>Esc</strong>: cerrar diálogos"],
  shortcutItemTab: ["<strong>Tab</strong>: navigate controls", "<strong>Tab</strong>: navegar controles"],
  shortcutItemAnswer: ["<strong>Space / Enter</strong>: answer options", "<strong>Espacio / Enter</strong>: responder opciones"],
  helpJsonItem: [
    '<abbr title="JavaScript Object Notation">JSON</abbr> is a lightweight data format.',
    '<abbr title="JavaScript Object Notation">JSON</abbr> es un formato de datos liviano.'
  ],
  helpIdItem: [
    '<abbr title="Identifier">ID</abbr> means unique question identifier.',
    '<abbr title="Identificador">ID</abbr> significa identificador único de pregunta.'
  ],
  selectedFile: ["Selected file: {name}", "Archivo seleccionado: {name}"],
  noFile: ["No file selected.", "No hay archivo seleccionado."],
  invalidFile: ["Please select a .json file.", "Por favor selecciona un archivo .json."],
  importReady: ["Import a JSON model to begin.", "Importa un modelo JSON para comenzar."],
  uploading: ["Uploading and validating your quiz...", "Subiendo y validando tu quiz..."],
  startCanceled: ["Upload validated. Start cancelled by user.", "Carga validada. Inicio cancelado por el usuario."],
  parsingError: ["Invalid JSON format. Please check your file structure or use template.", "Formato JSON inválido. Revisa el archivo o usa la plantilla."],
  emptyFile: ["Uploaded file is empty.", "El archivo subido está vacío."],
  questionPrefix: ["Question", "Pregunta"],
  modeFull: ["Mode: Full Quiz", "Modo: Quiz completo"],
  modeFailed: ["Mode: Failed Questions", "Modo: Preguntas falladas"],
  correct: ["Correct", "Correcto"],
  incorrect: ["Incorrect", "Incorrecto"],
  timeout: ["Time is up.", "Tiempo agotado."],
  timerOff: ["Off", "Desactivado"],
  finishQuiz: ["Finish Quiz", "Finalizar Quiz"],
  scoreChartAria: [
    "Score chart: {percentage}% correct. {correct} correct and {incorrect} incorrect.",
    "Gráfico de puntaje: {percentage}% correcto. {correct} correctas y {incorrect} incorrectas."
  ],
  scoreChartLegend: ["Correct: {correct} · Incorrect: {incorrect}", "Correctas: {correct} · Incorrectas: {incorrect}"],
  scoreSummary: ["Final Score: {score}/{total}", "Puntaje final: {score}/{total}"],
  attemptSummary: ["Attempt number: #{attempt}", "Número de intento: #{attempt}"],
  bestScore: ["Best score: {score}/{total} ({percentage}%)", "Mejor puntaje: {score}/{total} ({percentage}%)"],
  attemptsCompleted: ["Attempts completed: {count}", "Intentos completados: {count}"],
  noFailed: ["No failed questions yet.", "Aún no hay preguntas falladas."],
  noAttempts: ["No attempts recorded yet.", "Aún no hay intentos registrados."],
  confirm: ["Please confirm", "Confirmar"],
  startQuizConfirm: ["Start quiz with {count} question(s)?", "¿Iniciar quiz con {count} pregunta(s)?"],
  retakeConfirm: [
    "Start a new attempt with the same quiz and keep history?",
    "¿Iniciar un nuevo intento y mantener el historial?"
  ],
  failedConfirm: [
    "Start failed-questions practice with {count} question(s)?",
    "¿Practicar {count} pregunta(s) fallada(s)?"
  ],
  importAnotherConfirm: [
    "Importing another quiz will clear your current progress. Continue?",
    "Importar otro quiz borrará tu progreso actual. ¿Continuar?"
  ],
  abortConfirm: [
    "Leave this quiz attempt and load another model?",
    "¿Salir del intento actual y cargar otro modelo?"
  ],

  // ── Saved-quiz library ─────────────────────────────────────────────────────
  savedQuizzesHeading: ["Saved Quizzes", "Cuestionarios guardados"],
  savedQuizzesEmpty: ["No saved quizzes yet. Import a JSON file to get started.", "Aún no hay cuestionarios guardados. Importa un archivo JSON para comenzar."],
  loadQuiz: ["Load", "Cargar"],
  deleteQuiz: ["Delete", "Eliminar"],
  deleteQuizConfirm: [
    "Delete \"{name}\" and all its history? This cannot be undone.",
    "¿Eliminar \"{name}\" y todo su historial? Esto no se puede deshacer."
  ],
  questions: ["{count} questions", "{count} preguntas"],
  importedAtLabel: ["Imported", "Importado"],

  // ── Name-quiz dialog ───────────────────────────────────────────────────────
  nameQuizTitle: ["Name your quiz", "Nombra tu cuestionario"],
  nameQuizInstructions: [
    "Give this quiz a short, descriptive name so you can find it easily later.",
    "Dale un nombre corto y descriptivo para encontrarlo fácilmente después."
  ],
  nameQuizLabel: ["Quiz name", "Nombre del cuestionario"],
  nameQuizPlaceholder: ["e.g. AWS Cloud Practitioner", "ej. Fundamentos de AWS"],
  nameQuizSave: ["Save & Start", "Guardar e iniciar"],
  nameQuizEmpty: ["Please enter a name for the quiz.", "Por favor ingresa un nombre para el cuestionario."],

  // ── Duplicate-detection ────────────────────────────────────────────────────
  duplicateQuizTitle: ["Quiz already in library", "Cuestionario ya guardado"],
  duplicateQuizMessage: [
    "A quiz named \"{name}\" with identical content is already in your library. Load it now?",
    "Un cuestionario llamado \"{name}\" con contenido idéntico ya está en tu biblioteca. ¿Cargarlo ahora?"
  ],

  // ── Library performance stats ─────────────────────────────────────────────
  libraryAttempts: ["{count} attempt(s)", "{count} intento(s)"],
  libraryBestScore: ["Best: {percentage}%", "Mejor: {percentage}%"],
  libraryNoAttempts: ["No attempts yet", "Sin intentos aún"]
};

function buildLanguageTables() {
  const en = {};
  const es = {};

  Object.entries(TRANSLATIONS).forEach(([key, [english, spanish]]) => {
    en[key] = english;
    es[key] = spanish;
  });

  return { en, es };
}

/**
 * UI translations by language code.
 * Keep all user-facing text centralized here.
 */
export const I18N = buildLanguageTables();

/**
 * Resolve a localized string.
 * @param {"en"|"es"} language
 * @param {string} key
 * @param {Record<string, string|number>} [params]
 * @returns {string}
 */
export function tForLanguage(language, key, params = {}) {
  const table = I18N[language] || I18N.en;
  let value = table[key] || I18N.en[key] || key;
  for (const [param, content] of Object.entries(params)) {
    value = value.replace(`{${param}}`, String(content));
  }
  return value;
}
