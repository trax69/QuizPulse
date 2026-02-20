/**
 * Download content as file.
 * @param {string} filename
 * @param {string} type
 * @param {string} content
 */
export function downloadBlob(filename, type, content) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/**
 * Export attempt data as JSON.
 * @param {{attemptsHistory:Array<any>, bestAttempt:any, questionStats:Record<string, any>}} input
 */
export function exportResultsJson(input) {
  downloadBlob("quiz_results.json", "application/json", JSON.stringify(input, null, 2));
}

/**
 * Export attempt data as CSV.
 * @param {{attemptsHistory:Array<any>, t:Function, getModeLabel:Function, formatDateForLanguage:Function}} input
 */
export function exportResultsCsv({ attemptsHistory, t, getModeLabel, formatDateForLanguage }) {
  const rows = [[t("csvAttempt"), t("csvMode"), t("csvScore"), t("csvTotal"), t("csvPercentage"), t("csvCompletedAt")]];

  attemptsHistory.forEach((attempt) => {
    rows.push([
      attempt.number,
      getModeLabel(attempt.mode),
      attempt.score,
      attempt.total,
      attempt.percentage,
      formatDateForLanguage(attempt.completedAt)
    ]);
  });

  const content = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  downloadBlob("quiz_results.csv", "text/csv;charset=utf-8", content);
}

/**
 * Export printable HTML to PDF via browser print dialog.
 * @param {{t:Function, scoreSummary:string, attemptSummary:string, attemptsHistory:Array<any>, escapeHtml:Function, formatDateForLanguage:Function}} input
 */
export function exportResultsPdf({ t, scoreSummary, attemptSummary, attemptsHistory, escapeHtml, formatDateForLanguage }) {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  const documentRef = printWindow.document;
  documentRef.title = escapeHtml(t("pdfTitle"));

  const heading = documentRef.createElement("h1");
  heading.textContent = t("pdfHeading");

  const scoreParagraph = documentRef.createElement("p");
  scoreParagraph.textContent = scoreSummary || "";

  const attemptParagraph = documentRef.createElement("p");
  attemptParagraph.textContent = attemptSummary || "";

  const recentHeading = documentRef.createElement("h2");
  recentHeading.textContent = t("pdfRecentAttempts");

  const list = documentRef.createElement("ul");
  attemptsHistory
    .slice(-10)
    .reverse()
    .forEach((attempt) => {
      const item = documentRef.createElement("li");
      item.textContent = `#${attempt.number} - ${attempt.score}/${attempt.total} (${Math.round(attempt.percentage)}%) - ${formatDateForLanguage(attempt.completedAt)}`;
      list.appendChild(item);
    });

  documentRef.body.innerHTML = "";
  documentRef.body.append(heading, scoreParagraph, attemptParagraph, recentHeading, list);
  printWindow.focus();
  printWindow.print();
}
