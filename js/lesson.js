const params = new URLSearchParams(window.location.search);
const lessonId = params.get("id");
const lesson = lessons.find((item) => item.id === lessonId) || lessons[0];
let flowIndex = -1;

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = formalText(value);
}

function renderTags() {
  const wrap = document.getElementById("lessonTags");
  wrap.innerHTML = lesson.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
}

function renderList(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = items.map((item) => `<li>${escapeHtml(formalText(item))}</li>`).join("");
}

function renderKeyPoints() {
  const wrap = document.getElementById("keyPointList");
  wrap.innerHTML = lesson.keyPoints
    .map(
      (point, index) => `
        <details ${index === 0 ? "open" : ""} id="${escapeHtml(point.id || `keypoint-${index + 1}`)}">
          <summary>${index + 1}. ${escapeHtml(formalText(point.title))}：${escapeHtml(formalText(point.short || ""))}</summary>
          <div class="detail-body">
            <p>${escapeHtml(formalText(point.content))}</p>
            <div class="compare-box"><strong>Java 对比：</strong>${escapeHtml(formalText(point.javaCompare || "结合两种语言的写法理解概念差异。"))}</div>
            <div class="mistake-box"><strong>易错提醒：</strong>${escapeHtml(formalText(point.mistake || "注意概念边界，再通过代码验证。"))}</div>
          </div>
        </details>
      `
    )
    .join("");
}

function renderCodeExamples() {
  const wrap = document.getElementById("codeExamples");
  wrap.innerHTML = lesson.codeExamples
    .map(
      (example, index) => `
        <article class="code-card">
          <h3>${index + 1}. ${escapeHtml(formalText(example.title))}</h3>
          <pre><code>${escapeHtml(example.code)}</code></pre>
          <button class="btn small ghost toggle-explain">查看解释</button>
          <p class="answer-box">${escapeHtml(formalText(example.explanation))}</p>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".toggle-explain").forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      answer.classList.toggle("show");
      btn.textContent = answer.classList.contains("show") ? "收起解释" : "查看解释";
    });
  });
}

function renderQuiz() {
  const wrap = document.getElementById("quizList");
  wrap.innerHTML = lesson.quiz
    .map(
      (quiz, qIndex) => `
        <article class="quiz-card" data-answer="${escapeHtml(quiz.answer)}">
          <h3>${qIndex + 1}. ${escapeHtml(formalText(quiz.question))}</h3>
          <div class="quiz-options">
            ${quiz.options
              .map(
                (option) => `<button class="option-btn" data-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`
              )
              .join("")}
          </div>
          <p class="feedback"></p>
          <p class="answer-box">解析：${escapeHtml(formalText(quiz.explanation))}</p>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".quiz-card").forEach((card) => {
    const answer = card.dataset.answer;
    const feedback = card.querySelector(".feedback");
    const explanation = card.querySelector(".answer-box");
    card.querySelectorAll(".option-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        card.querySelectorAll(".option-btn").forEach((item) => {
          item.disabled = true;
          if (item.dataset.option === answer) item.classList.add("correct");
        });
        if (btn.dataset.option === answer) {
          feedback.textContent = "回答正确！";
          feedback.className = "feedback ok";
        } else {
          btn.classList.add("wrong");
          feedback.textContent = `回答错误。正确答案是：${answer}`;
          feedback.className = "feedback bad";
        }
        explanation.classList.add("show");
      });
    });
  });
}

function renderDragMatch() {
  const leftItems = shuffle([...lesson.dragMatch]);
  const rightItems = shuffle([...lesson.dragMatch]);
  const dragItems = document.getElementById("dragItems");
  const dropZones = document.getElementById("dropZones");
  const feedback = document.getElementById("dragFeedback");

  dragItems.innerHTML = leftItems
    .map((item) => `<div class="drag-item" draggable="true" data-value="${escapeHtml(item.left)}">${escapeHtml(item.left)}</div>`)
    .join("");

  dropZones.innerHTML = rightItems
    .map(
      (item) => `
        <div class="drop-zone" data-answer="${escapeHtml(item.left)}">
          <span>${escapeHtml(formalText(item.right))}</span>
          <strong class="dropped"></strong>
        </div>
      `
    )
    .join("");

  feedback.textContent = "";
  feedback.className = "feedback";

  document.querySelectorAll(".drag-item").forEach((item) => {
    item.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", item.dataset.value);
    });
  });

  document.querySelectorAll(".drop-zone").forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("over"));
    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      zone.classList.remove("over", "correct", "wrong");
      const value = event.dataTransfer.getData("text/plain");
      zone.querySelector(".dropped").textContent = value;
      zone.dataset.choice = value;
    });
  });
}

function bindDragButtons() {
  document.getElementById("checkDrag").addEventListener("click", () => {
    let correct = 0;
    const zones = document.querySelectorAll(".drop-zone");
    zones.forEach((zone) => {
      zone.classList.remove("correct", "wrong");
      if (zone.dataset.choice && zone.dataset.choice === zone.dataset.answer) {
        zone.classList.add("correct");
        correct += 1;
      } else {
        zone.classList.add("wrong");
      }
    });
    const feedback = document.getElementById("dragFeedback");
    feedback.textContent = `你匹配对了 ${correct} / ${zones.length} 个。`;
    feedback.className = correct === zones.length ? "feedback ok" : "feedback bad";
  });

  document.getElementById("resetDrag").addEventListener("click", renderDragMatch);
}

function renderFlow() {
  setText("flowTitle", lesson.flow.title);
  setText("flowDesc", lesson.flow.description);
  flowIndex = -1;
  document.getElementById("flowBox").innerHTML = lesson.flow.steps
    .map((step, index) => `<div class="flow-step" data-index="${index}">${index + 1}. ${escapeHtml(formalText(step))}</div>`)
    .join("");
}

function showNextFlowStep() {
  const steps = document.querySelectorAll(".flow-step");
  if (flowIndex < steps.length - 1) flowIndex += 1;
  steps.forEach((step, index) => {
    step.classList.toggle("active", index <= flowIndex);
  });
}

function renderExercises() {
  const wrap = document.getElementById("exerciseList");
  wrap.innerHTML = lesson.exercises
    .map(
      (exercise, index) => `
        <article class="exercise-card">
          <h3>练习 ${index + 1}</h3>
          <p>${escapeHtml(formalText(exercise.question))}</p>
          <button class="btn small ghost toggle-answer">查看参考答案</button>
          <pre class="answer-box"><code>${escapeHtml(exercise.answer)}</code></pre>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".toggle-answer").forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      answer.classList.toggle("show");
      btn.textContent = answer.classList.contains("show") ? "收起参考答案" : "查看参考答案";
    });
  });
}

function renderFullSummaries() {
  const matches = summariesForLesson(globalThis.courseSummaries || [], lesson.id);
  if (matches.length === 0) return;
  const section = document.getElementById("full-summary");
  const tocLink = document.getElementById("summaryTocLink");
  const wrap = document.getElementById("fullSummaryLinks");
  section.hidden = false;
  tocLink.hidden = false;
  wrap.innerHTML = matches
    .map((summary) => {
      const label = summary.part ? `${summary.part}半节讲义` : "完整课程讲义";
      return `
        <a class="summary-lesson-link" href="${summary.url}">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(summary.displayTitle)}</strong>
          <span aria-hidden="true">→</span>
        </a>`;
    })
    .join("");
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formalText(text) {
  return String(text || "")
    .replace(/老师反复强调|老师强调|老师提醒|老师要求|课堂中提到|课堂说明了|课堂后半部分|本节课主要|本节课也|本节课/g, "")
    .replace(/同学/g, "学习者")
    .replace(/\s+/g, " ")
    .trim();
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function initLesson() {
  document.title = `${lesson.title} - Java / Scala 编程学习站`;
  setText("lessonMeta", `${lesson.chapter} ｜ ${lesson.date} ｜ ${lesson.duration || "课程"}`);
  setText("lessonTitle", lesson.title);
  setText("lessonAdvice", lesson.learningAdvice || "");
  renderTags();
  renderList("summaryList", lesson.summary);
  renderKeyPoints();
  renderCodeExamples();
  renderQuiz();
  renderDragMatch();
  bindDragButtons();
  renderFlow();
  renderExercises();
  renderList("conclusionList", lesson.conclusion);
  renderFullSummaries();

  document.getElementById("nextStep").addEventListener("click", showNextFlowStep);
  document.getElementById("resetFlow").addEventListener("click", renderFlow);
}

initLesson();
