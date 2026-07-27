/* 인공지능 단원 수업 사이트 렌더링 */
(function () {
  var U = window.AI_UNIT;
  if (!U) return;

  var esc = function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  /* ---------- 탭 만들기 (0 = 단원 안내) ---------- */
  var tabsEl = document.getElementById("tabs");
  var mainEl = document.getElementById("main");

  var tabs = [{ id: "intro", label: "단원 안내", num: "★" }];
  U.subchapters.forEach(function (s) {
    tabs.push({ id: s.id, label: s.title, num: s.num });
  });
  if (U.final) tabs.push({ id: "final", label: "단원 마무리", num: "✓" });

  tabsEl.innerHTML = tabs.map(function (t, i) {
    return '<button class="tab-btn' + (i === 0 ? " active" : "") + '" data-target="' + t.id + '">' +
      '<span class="num">' + esc(t.num) + "</span>" + esc(t.label) + "</button>";
  }).join("");

  /* ---------- 패널 렌더링 ---------- */
  var panels = [];
  panels.push(renderIntro());
  U.subchapters.forEach(function (s) { panels.push(renderSub(s)); });
  if (U.final) panels.push(renderFinal());
  mainEl.innerHTML = panels.join("");
  var firstPanel = document.querySelector(".panel");
  if (firstPanel) firstPanel.classList.add("active");

  /* ---------- 탭 전환 ---------- */
  tabsEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".tab-btn");
    if (!btn) return;
    var target = btn.getAttribute("data-target");
    var panel = document.getElementById("panel-" + target);
    if (!panel) return; // 존재하지 않는 탭이면 화면을 건드리지 않는다
    document.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    document.querySelectorAll(".panel").forEach(function (p) { p.classList.remove("active"); });
    panel.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 안내 카드·탭 키보드 조작 (Enter·Space) ---------- */
  mainEl.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
    var mc = e.target.closest && e.target.closest(".map-card");
    if (!mc) return;
    e.preventDefault();
    mc.click();
  });

  /* ---------- 퀴즈 상호작용 ---------- */
  mainEl.addEventListener("click", function (e) {
    var c = e.target.closest(".choice");
    if (!c) return;
    var wrap = c.closest(".quiz-item");
    if (wrap.getAttribute("data-done") === "1") return;
    wrap.setAttribute("data-done", "1");
    var correct = parseInt(wrap.getAttribute("data-answer"), 10);
    var picked = parseInt(c.getAttribute("data-idx"), 10);
    var choices = wrap.querySelectorAll(".choice");
    choices.forEach(function (ch, idx) {
      ch.disabled = true;
      if (idx === correct) ch.classList.add("correct");
      if (idx === picked && picked !== correct) ch.classList.add("wrong");
    });
    wrap.querySelector(".explain").classList.add("show");
  });

  /* ---------- 안내 패널 ---------- */
  function renderIntro() {
    var m = U.intro.map.map(function (x) {
      return '<div class="map-card" data-goto="' + goId(x.num) + '" role="button" tabindex="0" aria-label="' + esc(x.title) + '">' +
        '<span class="mnum">' + esc(x.num) + "</span>" +
        "<h4>" + esc(x.title) + "</h4><p>" + esc(x.desc) + "</p></div>";
    }).join("");
    var use = (U.intro.howToUse || []).map(function (x) {
      return '<div class="how-step"><span class="hnum">' + esc(x.n) + "</span><div><b>" +
        esc(x.t) + "</b><span>" + esc(x.d) + "</span></div></div>";
    }).join("");
    return '<section class="panel" id="panel-intro">' +
      '<div class="sub-head"><span class="eyebrow">단원 안내</span>' +
      "<h2>" + esc(U.unitTitle) + "</h2>" +
      '<div class="sub">' + esc(U.unitSubtitle) + "</div></div>" +
      '<div class="hero-quote">' + esc(U.intro.hook) +
      '<div class="big">' + esc(U.intro.bigQuestion) + "</div></div>" +
      (use ? '<details class="card usecard teacher-fold">' +
        '<summary class="fold-bar"><span class="t-badge">교사용</span>' +
        '<span class="fold-label">이 사이트로 수업하는 방법</span>' +
        '<span class="fold-hint">처음이신가요? 눌러서 펼쳐 보세요</span>' +
        '<span class="fold-arrow" aria-hidden="true">▾</span></summary>' +
        '<div class="fold-inner">' +
        '<p class="use-lead">각 중단원 탭을 열면 아래 순서가 그대로 한 차시 수업이 됩니다. 화면을 학생에게 보여 주며 진행해도 좋아요.</p>' +
        '<div class="how-steps">' + use + "</div></div></details>" : "") +
      '<div class="section-label">이 단원의 중단원 (누르면 이동)</div>' +
      '<div class="map-grid">' + m + "</div>" +
      renderNeutral() +
      "</section>";
  }

  /* 어느 학교에서든 — 교과서별 용어 대응 */
  function renderNeutral() {
    var nu = U.intro.neutral;
    if (!nu) return "";
    var rows = nu.rows.map(function (r) {
      return '<div class="xt-row"><b>' + esc(r.concept) + "</b><span>" + esc(r.variants) + "</span></div>";
    }).join("");
    return '<details class="card teacher-fold" style="margin-top:18px">' +
      '<summary class="fold-bar"><span class="t-badge">공통</span>' +
      '<span class="fold-label">어느 학교에서든 쓸 수 있어요 — 교과서별 용어 대응</span>' +
      '<span class="fold-hint">눌러서 펼치기</span>' +
      '<span class="fold-arrow" aria-hidden="true">▾</span></summary>' +
      '<div class="fold-inner"><p class="use-lead">' + esc(nu.note) + "</p>" +
      '<div class="xt">' + rows + "</div></div></details>";
  }
  function goId(num) {
    var found = U.subchapters.filter(function (s) { return s.num === num; })[0];
    return found ? found.id : "intro";
  }

  /* 안내 카드 클릭 → 해당 탭으로 */
  mainEl.addEventListener("click", function (e) {
    var mc = e.target.closest(".map-card");
    if (!mc) return;
    var id = mc.getAttribute("data-goto");
    var btn = document.querySelector('.tab-btn[data-target="' + id + '"]');
    if (btn) btn.click();
  });

  /* ---------- 단원 마무리(종합) ---------- */
  function renderFinal() {
    var f = U.final;
    var summary = U.subchapters.map(function (s) {
      return '<div class="fin-sum"><span class="fs-num">' + esc(s.num) + "</span>" +
        "<div><b>" + esc(s.title) + "</b><span>" + esc(s.bigIdea || "") + "</span></div></div>";
    }).join("");

    var seen = {}, terms = [];
    U.subchapters.forEach(function (s) {
      s.concepts.forEach(function (c) {
        (c.terms || []).forEach(function (t) { if (!seen[t.t]) { seen[t.t] = 1; terms.push(t); } });
      });
    });
    var glos = terms.map(function (t) {
      return '<div class="term"><b>' + esc(t.t) + "</b><span>" + esc(t.d) + "</span></div>";
    }).join("");

    var quiz = f.quiz.map(function (q, qi) {
      return '<div class="quiz-item" data-answer="' + q.answer + '">' +
        '<div class="quiz-q"><span class="qn">' + (qi + 1) + "</span>" + esc(q.q) + "</div>" +
        '<div class="choices">' +
        q.choices.map(function (ch, idx) {
          return '<button class="choice" data-idx="' + idx + '">' +
            "①②③④⑤".charAt(idx) + " " + esc(ch) + "</button>";
        }).join("") + "</div>" +
        '<div class="explain"><b>정답 풀이</b> — ' + esc(q.explain) + "</div></div>";
    }).join("");

    return '<section class="panel" id="panel-final">' +
      '<div class="sub-head"><span class="eyebrow">단원 마무리</span>' +
      "<h2>인공지능 단원 총정리</h2>" +
      '<div class="sub">' + esc(f.intro) + "</div></div>" +
      '<div class="card"><h3><span class="ico">🧩</span>한눈에 정리</h3>' + summary + "</div>" +
      '<div class="card"><h3><span class="ico">📚</span>핵심 용어 사전</h3><div class="terms">' + glos + "</div></div>" +
      '<div class="card"><h3><span class="ico">📝</span>종합 확인 문제 <span style="font-size:13px;font-weight:600;color:var(--ink-soft)">(보기를 눌러 정답 확인)</span></h3>' + quiz + "</div>" +
      "</section>";
  }

  /* ---------- 교사용 수업 가이드 ---------- */
  function renderTeachGuide(g) {
    var h = '<details class="card guide teacher-fold">' +
      '<summary class="fold-bar"><span class="t-badge">교사용</span>' +
      '<span class="fold-label">수업 가이드 열기</span>' +
      '<span class="fold-hint">수업 흐름 · 발문 · 판서 · 예상 질문 · 준비물</span>' +
      '<span class="fold-arrow" aria-hidden="true">▾</span></summary>' +
      '<div class="fold-inner">';
    if (g.periods) h += '<div class="guide-meta"><span class="gm">🗓 ' + esc(g.periods) + "</span></div>";
    if (g.summary) h += '<p class="guide-summary">' + esc(g.summary) + "</p>";

    if (g.flow && g.flow.length) {
      h += '<div class="guide-block"><div class="gb-title">⏱ 45분 수업 흐름</div>' +
        '<div class="flow-table"><div class="ft-head"><span>단계</span><span>시간</span><span>교사 활동</span><span>학생 활동</span></div>';
      g.flow.forEach(function (f) {
        h += '<div class="ft-row"><span class="ph">' + esc(f.phase) + "</span><span class=\"tm\">" +
          esc(f.time) + "</span><span>" + esc(f.teacher) + "</span><span>" + esc(f.student) + "</span></div>";
      });
      h += "</div></div>";
    }
    if (g.ask && g.ask.length) {
      h += '<div class="guide-block"><div class="gb-title">💬 이렇게 질문하세요 (교사 발문)</div><ul class="glist">' +
        g.ask.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
    }
    if (g.board && g.board.length) {
      h += '<div class="guide-block board-block"><div class="gb-title">🧑‍🏫 칠판에 이렇게 정리해요 (판서)</div><ul class="board-list">' +
        g.board.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
    }
    if (g.faq && g.faq.length) {
      h += '<div class="guide-block"><div class="gb-title">🙋 학생이 자주 묻는 질문</div><div class="faq">' +
        g.faq.map(function (x) {
          return '<div class="faq-item"><div class="fq">Q. ' + esc(x.q) + "</div><div class=\"fa\">A. " + esc(x.a) + "</div></div>";
        }).join("") + "</div></div>";
    }
    if (g.prep && g.prep.length) {
      h += '<div class="guide-block"><div class="gb-title">🎒 준비물 · 사전 점검</div><ul class="glist check">' +
        g.prep.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
    }
    if (g.tip) {
      h += '<div class="guide-tip">✨ <b>처음 가르치는 선생님께</b> — ' + esc(g.tip) + "</div>";
    }
    h += "</div></details>";
    return h;
  }

  /* ---------- 온라인 도구 바로가기 버튼 ---------- */
  function toolLinks(keys) {
    if (!keys || !keys.length) return "";
    var map = U.tools || {};
    var btns = keys.map(function (k) {
      var t = map[k];
      if (!t) return "";
      return '<a class="tl-btn" href="' + esc(t.url) + '" target="_blank" rel="noopener">' +
        esc(t.name) + " 바로 열기 ↗</a>";
    }).join("");
    if (!btns) return "";
    return '<div class="tool-links"><span class="tl-label">🔗 바로 가기</span>' + btns + "</div>";
  }

  /* ---------- 관련 실습 워크북 링크 ---------- */
  function renderWorkbook(s) {
    if (!s.workbook || !s.workbook.length) return "";
    var base = U.workbookBase || "#";
    var items = s.workbook.map(function (w) {
      var href = base + "#" + w.id;
      return '<a class="wb-item" href="' + esc(href) + '" target="_blank" rel="noopener">' +
        '<span class="wb-no">' + esc(w.no) + "</span>" +
        '<span class="wb-text"><b>' + esc(w.title) + "</b><span>" + esc(w.why) + "</span></span>" +
        '<span class="wb-go">실습하러 가기 →</span></a>';
    }).join("");
    return '<div class="card wb-card"><h3><span class="ico">🧭</span>배운 내용, 워크북에서 직접 해봐요</h3>' +
      '<p class="wb-lead">이 중단원을 배운 뒤 아래 실습 워크북으로 이어서 해 보면 이해가 훨씬 깊어져요.</p>' +
      items + "</div>";
  }

  /* ---------- 중단원 패널 ---------- */
  function renderSub(s) {
    var html = '<section class="panel" id="panel-' + s.id + '">';
    html += '<div class="sub-head"><span class="eyebrow">중단원 ' + esc(s.num) + "</span>" +
      "<h2>" + esc(s.title) + "</h2>" +
      '<div class="sub">' + esc(s.subtitle) + "</div></div>";

    /* 핵심 한 문장 */
    if (s.bigIdea) {
      html += '<div class="bigidea"><span class="bi-label">한눈에!</span>' + esc(s.bigIdea) + "</div>";
    }

    /* 개념 도식 */
    if (s.diagram && window.AI_DIAGRAMS && window.AI_DIAGRAMS[s.diagram]) {
      html += '<div class="card diagram-card"><div class="dg-cap">🖼️ 그림으로 이해하기</div>' +
        '<div class="dg">' + window.AI_DIAGRAMS[s.diagram] + "</div></div>";
    }

    /* 교사용 수업 가이드 */
    if (s.teachGuide) html += renderTeachGuide(s.teachGuide);

    /* 학습 목표 */
    html += '<div class="card"><h3><span class="ico">🎯</span>학습 목표</h3><ul class="goals">' +
      s.goals.map(function (g) { return "<li>" + esc(g) + "</li>"; }).join("") + "</ul></div>";

    /* 개념 */
    html += '<div class="card"><h3><span class="ico">📖</span>핵심 개념 쉽게 배우기</h3>';
    s.concepts.forEach(function (c) {
      html += '<div class="concept"><h4>' + esc(c.name) + "</h4>";
      html += '<div class="easy-box"><strong>쉽게 말하면?</strong> ' + esc(c.easy) + "</div>";

      html += '<div class="meta-row two">';
      html += '<div class="mini exact"><div class="label">정확한 정의</div>' + esc(c.exact) + "</div>";
      html += '<div class="mini analogy"><div class="label">🔎 쉬운 비유</div>' + esc(c.analogy) + "</div>";
      html += "</div>";

      if (c.deep && c.deep.length) {
        html += '<div class="detail deep"><div class="label">📚 자세히 알아보기</div>' +
          c.deep.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>";
      }
      if (c.examples && c.examples.length) {
        html += '<div class="mini"><div class="label">🌟 생활 속 예시</div><ul class="list-tight">' +
          c.examples.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
      }
      if (c.detail && c.detail.length) {
        html += '<div class="detail" style="margin-top:12px">' +
          c.detail.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>";
      }
      if (c.fun) {
        var f = c.fun;
        html += '<div class="fun-box">' +
          '<div class="fun-title">🎉 이해를 돕는 재미있는 활동 &middot; ' + esc(f.title) + "</div>" +
          '<div class="fun-tags">' +
            '<span class="tag tool">🛠 ' + esc(f.tool) + "</span>" +
            '<span class="tag time">⏱ ' + esc(f.time) + "</span></div>" +
          toolLinks(f.tools) +
          "<ol>" + f.steps.map(function (st) { return "<li>" + esc(st) + "</li>"; }).join("") + "</ol>" +
          '<div class="fun-learn">💬 <b>이걸 배워요</b> — ' + esc(f.learn) + "</div>" +
          "</div>";
      }
      if (c.misconceptions && c.misconceptions.length) {
        html += '<div class="warn-box"><div class="label">⚠️ 학생들이 자주 헷갈리는 부분</div><ul>' +
          c.misconceptions.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
      }
      if (c.terms && c.terms.length) {
        html += '<div class="terms">' + c.terms.map(function (t) {
          return '<div class="term"><b>' + esc(t.t) + "</b><span>" + esc(t.d) + "</span></div>";
        }).join("") + "</div>";
      }
      html += "</div>";
    });
    html += "</div>";

    /* 관련 실습 워크북 연계 */
    html += renderWorkbook(s);

    /* 실습·활동 */
    if (s.activities && s.activities.length) {
      html += '<div class="card"><h3><span class="ico">🧪</span>재미있고 이해를 돕는 교과서 실습·활동 <span style="font-size:13px;font-weight:600;color:var(--muted)">(출처 표시)</span></h3>';
      s.activities.forEach(function (a) {
        html += '<div class="act"><div class="act-head"><h4>' + esc(a.title) + "</h4>" +
          (a.fun ? '<span class="tag funtag">🎉 재미있어요</span>' : "") +
          '<span class="tag src">📚 ' + esc(a.source) + " · " + esc(a.page) + "</span>" +
          '<span class="tag tool">🛠 ' + esc(a.tool) + "</span>" +
          '<span class="tag time">⏱ ' + esc(a.time) + "</span>" +
          '<span class="tag level">📈 ' + esc(a.level) + "</span></div>";
        html += toolLinks(a.tools);
        html += '<div class="summary">' + esc(a.summary) + "</div>";
        html += "<ol>" + a.steps.map(function (st) { return "<li>" + esc(st) + "</li>"; }).join("") + "</ol>";
        if (a.tip) html += '<div class="tip"><b>수업 팁</b> — ' + esc(a.tip) + "</div>";
        html += "</div>";
      });
      html += "</div>";
    }

    /* 확인 문제 */
    if (s.quiz && s.quiz.length) {
      html += '<div class="card"><h3><span class="ico">✅</span>확인 문제 <span style="font-size:13px;font-weight:600;color:var(--muted)">(보기를 눌러 정답을 확인하세요)</span></h3>';
      s.quiz.forEach(function (q, qi) {
        html += '<div class="quiz-item" data-answer="' + q.answer + '">' +
          '<div class="quiz-q"><span class="qn">' + (qi + 1) + "</span>" + esc(q.q) + "</div>" +
          '<div class="choices">' +
          q.choices.map(function (ch, idx) {
            return '<button class="choice" data-idx="' + idx + '">' +
              "①②③④⑤".charAt(idx) + " " + esc(ch) + "</button>";
          }).join("") +
          "</div>" +
          '<div class="explain"><b>정답 풀이</b> — ' + esc(q.explain) + "</div>" +
          "</div>";
      });
      html += "</div>";
    }

    html += "</section>";
    return html;
  }
})();
