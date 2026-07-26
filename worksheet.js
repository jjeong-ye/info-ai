/* 인공지능 학습지 생성 — 사이트와 동일한 data.js(window.AI_UNIT) 재사용 */
(function () {
  var U = window.AI_UNIT;
  if (!U) return;
  var subs = U.subchapters;
  var esc = function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  var sheet = document.getElementById("sheet");
  var pickers = document.getElementById("pickers");
  var ansToggle = document.getElementById("ansToggle");
  var current = "all";

  /* 선택 버튼 */
  var picks = [{ id: "all", label: "전체" }];
  subs.forEach(function (s) { picks.push({ id: s.id, label: s.num + ". " + s.title }); });
  pickers.innerHTML = picks.map(function (p, i) {
    return '<button class="pick' + (i === 0 ? " active" : "") + '" data-id="' + p.id + '">' + esc(p.label) + "</button>";
  }).join("");
  pickers.addEventListener("click", function (e) {
    var b = e.target.closest(".pick"); if (!b) return;
    current = b.getAttribute("data-id");
    pickers.querySelectorAll(".pick").forEach(function (x) { x.classList.remove("active"); });
    b.classList.add("active");
    render();
  });
  ansToggle.addEventListener("change", render);
  document.getElementById("printBtn").addEventListener("click", function () { window.print(); });

  render();

  function render() {
    var list = current === "all" ? subs : subs.filter(function (s) { return s.id === current; });
    sheet.innerHTML = list.map(buildPage).join("");
  }

  /* 밑줄 빈칸 (정답 보기 시 채워짐) */
  function blank(answer) {
    var show = ansToggle.checked && answer;
    return show
      ? '<span class="blank ans">' + esc(answer) + "</span>"
      : '<span class="blank"></span>';
  }
  function line(cls) { return '<span class="writeline' + (cls ? " " + cls : "") + '"></span>'; }

  function buildPage(s) {
    var h = '<section class="page">';

    /* 머리글 */
    h += '<div class="ws-head">' +
      '<div class="ws-kicker">인공지능 · 중단원 ' + esc(s.num) + "</div>" +
      '<div class="ws-title">' + esc(s.title) + "</div>" +
      '<div class="ws-sub">' + esc(s.subtitle || "") + "</div>" +
      '<div class="ws-name"><span>학년 반 번호 :</span><span>이름 :</span></div>' +
      "</div>";

    /* 학습 목표 */
    if (s.goals && s.goals.length) {
      h += '<div class="sec goals"><div class="sec-h">오늘의 학습 목표</div><ul class="goal-list">' +
        s.goals.map(function (g) { return '<li><span class="chkbox"></span>' + esc(g) + "</li>"; }).join("") +
        "</ul></div>";
    }

    /* 핵심 개념 채우기 (빈칸: 용어 쓰기 + 내 말로 정리) */
    h += '<div class="sec concept"><div class="sec-h">핵심 개념 정리 (빈칸 채우기)</div>';
    s.concepts.forEach(function (c) {
      h += '<div class="cblock"><h4>' + esc(c.name) + "</h4>";
      var terms = (c.terms || []).slice(0, 3);
      if (terms.length) {
        h += '<div class="fill-wrap">';
        terms.forEach(function (t) {
          h += '<div class="fill">' + blank(t.t) + '<span class="def">: ' + esc(t.d) + "</span></div>";
        });
        h += "</div>";
      }
      h += '<div class="oneline">✏️ 내 말로 한 줄 정리 :' + line() + "</div>";
      h += "</div>";
    });
    h += "</div>";

    /* 생활 속 예시 찾기 */
    var exPool = [];
    s.concepts.forEach(function (c) { if (c.examples) exPool = exPool.concat(c.examples); });
    if (exPool.length) {
      h += '<div class="sec life"><div class="sec-h">생활 속에서 찾아보기</div>' +
        '<ul class="ex-list">' + exPool.slice(0, 3).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        '<div class="find">🔎 내가 찾은 인공지능 예시와 그 이유 :' + line() + line("two") + "</div></div>";
    }

    /* 활동 기록 */
    var funs = [];
    s.concepts.forEach(function (c) { if (c.fun) funs.push(c.fun); });
    if (funs.length) {
      var names = funs.map(function (f) { return f.title; }).join(" / ");
      h += '<div class="sec act"><div class="sec-h">활동 기록</div>' +
        '<div class="act-name">오늘 한 활동 : <b>' + esc(names) + "</b></div>" +
        '<div class="rec"><div class="q">① 무엇을 해 보았나요? (한 일 · 방법)</div><div class="lines"></div></div>' +
        '<div class="rec"><div class="q">② 새롭게 알게 된 점 · 재미있었던 점</div><div class="lines"></div></div>' +
        "</div>";
    }

    /* 확인 문제 */
    if (s.quiz && s.quiz.length) {
      h += '<div class="sec quiz"><div class="sec-h">확인 문제</div>';
      s.quiz.forEach(function (q, qi) {
        h += '<div class="quiz-q"><div class="qhead"><span class="qn">' + (qi + 1) + "</span>" + esc(q.q) + "</div>" +
          '<div class="opts">' +
          q.choices.map(function (ch, idx) {
            var correct = ansToggle.checked && idx === q.answer;
            return '<div class="opt' + (correct ? " correct" : "") + '"><span class="cnum">' +
              "①②③④⑤".charAt(idx) + "</span>" + esc(ch) + "</div>";
          }).join("") + "</div>" +
          '<div class="ans-line' + (ansToggle.checked ? "" : " hidden") + '">정답: ' +
          "①②③④⑤".charAt(q.answer) + " — " + esc(q.explain) + "</div>" +
          "</div>";
      });
      h += "</div>";
    }

    /* 스스로 정리 · 자기평가 */
    h += '<div class="sec self"><div class="sec-h">스스로 평가 · 정리</div>' +
      '<div class="self-grid">' +
      '<div class="sh q">평가 내용</div><div class="sh">잘함</div><div class="sh">보통</div><div class="sh">노력</div>' +
      selfRow("핵심 개념을 이해했나요?") +
      selfRow("활동에 적극 참여했나요?") +
      selfRow("배운 것을 예시로 설명할 수 있나요?") +
      "</div>" +
      '<div class="reflect">💭 오늘 수업에서 가장 기억에 남는 것 / 더 궁금한 것 :' + line() + line("two") + "</div>" +
      "</div>";

    h += "</section>";
    return h;
  }

  function selfRow(q) {
    return '<div class="q">' + esc(q) + '</div><div class="sc">◯</div><div class="sc">◯</div><div class="sc">◯</div>';
  }
})();
