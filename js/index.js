function languageOfLesson(lesson) {
  return lesson.id.startsWith("java-") ? "Java" : "Scala";
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function conciseSummary(lesson) {
  const fallback = `${lesson.title}，重点包括${(lesson.tags || []).slice(0, 4).join("、")}。`;
  return (lesson.cardSummary || fallback)
    .replace(/老师反复强调|老师强调|课堂中提到|本节课主要|本节课/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function initStats() {
  const javaLessons = lessons.filter((lesson) => languageOfLesson(lesson) === "Java");
  const scalaLessons = lessons.filter((lesson) => languageOfLesson(lesson) === "Scala");
  setText("lessonCount", lessons.length);
  setText("javaCount", javaLessons.length);
  setText("scalaCount", scalaLessons.length);
  setText("summaryCount", (globalThis.courseSummaries || []).length || 40);
}

function renderStartLessons() {
  const grid = document.getElementById("lessonGrid");
  if (!grid) return;
  const javaStart = lessons.filter((lesson) => languageOfLesson(lesson) === "Java").slice(0, 2);
  const scalaStart = lessons.filter((lesson) => languageOfLesson(lesson) === "Scala").slice(0, 2);
  const items = [...javaStart, ...scalaStart];
  grid.innerHTML = items.map((lesson) => {
    const language = languageOfLesson(lesson);
    const tags = (lesson.tags || []).slice(0, 4).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    return `
      <article class="lesson-card ${language.toLowerCase()}-accent">
        <div class="card-meta"><span>${language}</span><span>${escapeHtml(lesson.date)}</span></div>
        <h3>${escapeHtml(lesson.title)}</h3>
        <p class="card-summary">${escapeHtml(conciseSummary(lesson))}</p>
        <div class="tag-row">${tags}</div>
        <div class="card-actions">
          <a class="btn primary" href="lesson.html?id=${encodeURIComponent(lesson.id)}">进入互动课</a>
          <a class="btn" href="${language.toLowerCase()}.html">查看路线</a>
        </div>
      </article>
    `;
  }).join("");
}

initStats();
renderStartLessons();
