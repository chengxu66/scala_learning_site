const courseLanguage = globalThis.COURSE_LANGUAGE || "Java";

const courseStages = {
  Java: [
    {
      id: "stage-basic",
      title: "基础语法与数据",
      range: "01-04",
      description: "理解变量、基本类型、数组、引用和第一个类。",
      match: (lesson) => /基础|变量|数据类型|数组/.test(lesson.chapter),
    },
    {
      id: "stage-flow",
      title: "表达式与流程控制",
      range: "05-09",
      description: "掌握运算符、if、switch、for、while 和循环嵌套。",
      match: (lesson) => /运算符|流程控制/.test(lesson.chapter) || /循环|switch|if|while/.test(lesson.title),
    },
    {
      id: "stage-object",
      title: "类、对象与封装",
      range: "10-16",
      description: "建立类、对象、方法、构造方法、访问权限和抽象类的整体认识。",
      match: (lesson) => /类与对象/.test(lesson.chapter) && !/接口/.test(lesson.chapter),
    },
    {
      id: "stage-interface",
      title: "接口、多态与回调",
      range: "17-19",
      description: "把抽象类、接口、上转型、多态和接口回调连起来。",
      match: (lesson) => /接口|回调/.test(lesson.chapter) || /接口|回调/.test(lesson.title),
    },
  ],
  Scala: [
    {
      id: "stage-expression",
      title: "表达式基础",
      range: "03-03 至 03-12",
      description: "理解 var、val、类型推导、block、函数定义、元组和项目创建。",
      match: (lesson) => /第一章|第二章|第三章/.test(lesson.chapter),
    },
    {
      id: "stage-collections",
      title: "集合与遍历",
      range: "03-19 至 03-26",
      description: "掌握数组、ArrayBuffer、Map、Set、foreach 和 for 推导式。",
      match: (lesson) => /第五章/.test(lesson.chapter) || /数组|集合|Map/.test(lesson.title),
    },
    {
      id: "stage-objects",
      title: "函数、类与对象",
      range: "03-17 至 04-09",
      description: "连接函数、递归、类、字段、构造器、单例对象和伴生对象。",
      match: (lesson) => /第四章|第六章/.test(lesson.chapter) && !/继承|特质/.test(lesson.chapter),
    },
    {
      id: "stage-traits",
      title: "模式匹配、继承与 Trait",
      range: "04-16 至 04-23",
      description: "学习模式匹配、样例类、重写、结构类型对象、特质和混入。",
      match: (lesson) => /第七章|继承|Trait|特质|模式/.test(lesson.chapter + lesson.title),
    },
  ],
};

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

function formalText(value) {
  return String(value || "")
    .replace(/老师反复强调|老师强调|课堂中提到|课堂说明了|课堂后半部分|本节课主要|本节课也|本节课/g, "")
    .replace(/同学/g, "学习者")
    .replace(/\s+/g, " ")
    .trim();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function summariesFor(lessonId) {
  return (globalThis.courseSummaries || []).filter((summary) => summary.lessonId === lessonId);
}

function getStage(lesson) {
  return courseStages[courseLanguage].find((stage) => stage.match(lesson)) || courseStages[courseLanguage][0];
}

const courseLessons = lessons.filter((lesson) => languageOfLesson(lesson) === courseLanguage);
const courseSummaries = (globalThis.courseSummaries || []).filter((summary) => summary.language === courseLanguage);

function initCourseStats() {
  const tags = [...new Set(courseLessons.flatMap((lesson) => lesson.tags || []))];
  setText("courseLessonCount", courseLessons.length);
  setText("courseSummaryCount", courseSummaries.length);
  setText("courseStageCount", courseStages[courseLanguage].length);
  setText("courseTopicCount", tags.length);
}

function renderStages() {
  const wrap = document.getElementById("stageList");
  if (!wrap) return;
  wrap.innerHTML = courseStages[courseLanguage].map((stage, index) => {
    const count = courseLessons.filter((lesson) => getStage(lesson).id === stage.id).length;
    return `
      <article class="stage-card" id="${stage.id}">
        <span>${courseLanguage.toUpperCase()} / ${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(stage.title)}</strong>
        <p>${escapeHtml(stage.description)}</p>
        <em>${escapeHtml(stage.range)} · ${count} 节互动课</em>
      </article>
    `;
  }).join("");
}

function lessonMatches(lesson, keyword) {
  if (!keyword) return true;
  const haystack = [
    lesson.title,
    lesson.chapter,
    lesson.date,
    lesson.cardSummary,
    ...(lesson.tags || []),
    ...(lesson.keywords || []),
  ].join(" ").toLowerCase();
  return haystack.includes(keyword.toLowerCase());
}

function renderLessons() {
  const grid = document.getElementById("courseLessonGrid");
  const info = document.getElementById("courseResultInfo");
  const input = document.getElementById("courseSearch");
  if (!grid || !info || !input) return;
  const keyword = input.value.trim();
  const filtered = courseLessons.filter((lesson) => lessonMatches(lesson, keyword));
  info.textContent = `共找到 ${filtered.length} 节 ${courseLanguage} 互动课程`;
  grid.innerHTML = filtered.map((lesson) => {
    const stage = getStage(lesson);
    const summaryLinks = summariesFor(lesson.id);
    const summaryLink = summaryLinks[0]
      ? `<a class="btn" href="${summaryLinks[0].url}">阅读讲义</a>`
      : "";
    const tags = (lesson.tags || []).slice(0, 5).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    const summary = formalText(lesson.cardSummary || (lesson.summary || [])[0] || lesson.title);
    return `
      <article class="lesson-card ${courseLanguage.toLowerCase()}-accent">
        <div class="card-meta">
          <span>${escapeHtml(stage.title)}</span>
          <span>${escapeHtml(lesson.date)}</span>
        </div>
        <h3>${escapeHtml(lesson.title)}</h3>
        <p class="card-summary">${escapeHtml(summary)}</p>
        <div class="tag-row">${tags}</div>
        <div class="card-actions">
          <a class="btn primary" href="lesson.html?id=${encodeURIComponent(lesson.id)}">进入互动课</a>
          ${summaryLink}
        </div>
      </article>
    `;
  }).join("");
}

function renderKnowledgeCloud() {
  const wrap = document.getElementById("knowledgeCloud");
  if (!wrap) return;
  const counts = new Map();
  for (const lesson of courseLessons) {
    for (const tag of lesson.tags || []) counts.set(tag, (counts.get(tag) || 0) + 1);
  }
  const tags = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
    .slice(0, 36);
  wrap.innerHTML = tags.map(([tag, count]) => `
    <button class="knowledge-tag" type="button" data-keyword="${escapeHtml(tag)}">
      <strong>${escapeHtml(tag)}</strong>
      <span>${count}</span>
    </button>
  `).join("");
  wrap.querySelectorAll(".knowledge-tag").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById("courseSearch");
      input.value = button.dataset.keyword;
      renderLessons();
      const target = document.getElementById("courseResultInfo");
      const top = target.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

function renderGames() {
  const grid = document.getElementById("courseGameGrid");
  if (!grid) return;
  grid.innerHTML = (globalThis.games || games).map((game) => `
    <article class="game-card">
      <h3>${escapeHtml(game.title)}</h3>
      <p class="card-summary">${escapeHtml(game.description)}</p>
      <div class="tag-row">${game.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="card-actions"><a class="btn primary" href="${game.url}">进入练习</a></div>
    </article>
  `).join("");
}

function bindCourseSearch() {
  const input = document.getElementById("courseSearch");
  const reset = document.getElementById("resetCourseSearch");
  if (!input || !reset) return;
  input.addEventListener("input", renderLessons);
  reset.addEventListener("click", () => {
    input.value = "";
    renderLessons();
    input.focus();
  });
}

initCourseStats();
renderStages();
renderLessons();
renderKnowledgeCloud();
renderGames();
bindCourseSearch();
