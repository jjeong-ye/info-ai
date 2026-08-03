/* 개념 도식 (인라인 SVG) — 다운로드 없이 어디서든 표시, 인쇄에도 선명 */
window.AI_DIAGRAMS = {
  /* 인공지능의 5가지 특성 흐름 */
  traits:
    '<svg viewBox="0 0 590 78" role="img" aria-label="인공지능 특성 흐름">' +
    dgBox(6, "#3f86bd", "#fff", "인식") +
    dgArrow(114) +
    dgBox(126, "#4a9d5b", "#fff", "학습") +
    dgArrow(234) +
    dgBox(246, "#ffc72c", "#33302b", "추론") +
    dgArrow(354) +
    dgBox(366, "#6a54a8", "#fff", "판단") +
    dgArrow(474) +
    dgBox(486, "#e8483a", "#fff", "생성") +
    "</svg>",

  /* 데이터로 배우는 흐름: 데이터 → 학습 → 모델 → 예측 */
  learn:
    '<svg viewBox="0 0 578 78" role="img" aria-label="데이터 학습 흐름">' +
    dgBoxW(6, 118, "#ffc72c", "#33302b", "📊 데이터") +
    dgArrow(137) +
    dgBoxW(150, 118, "#3f86bd", "#fff", "⚙ 학습") +
    dgArrow(281) +
    dgBoxW(294, 118, "#4a9d5b", "#fff", "🧠 모델") +
    dgArrow(425) +
    dgBoxW(438, 118, "#e8483a", "#fff", "✅ 예측") +
    "</svg>",

  /* 문제 해결 5단계 (+ 반복) */
  steps5:
    '<svg viewBox="0 0 600 132" role="img" aria-label="인공지능 문제 해결 5단계">' +
    dgStep(6, "#e8483a", "1 문제정의") +
    dgArrow2(114, 38) +
    dgStep(126, "#ffc72c", "2 데이터", "#33302b") +
    dgArrow2(234, 38) +
    dgStep(246, "#3f86bd", "3 학습") +
    dgArrow2(354, 38) +
    dgStep(366, "#6a54a8", "4 평가") +
    dgArrow2(474, 38) +
    dgStep(486, "#4a9d5b", "5 활용") +
    /* 반복 화살표: 평가(4) → 데이터(2) */
    '<path d="M418,62 C418,104 178,104 178,64" fill="none" stroke="#c8392c" stroke-width="2.4" stroke-dasharray="6 5"/>' +
    '<polygon points="178,58 172,70 184,70" fill="#c8392c"/>' +
    '<text x="298" y="122" text-anchor="middle" font-family="Pretendard,sans-serif" font-size="13" fill="#c8392c">성능이 낮으면 데이터를 보태 다시 학습!</text>' +
    "</svg>",

  /* 데이터 편향 */
  bias:
    '<svg viewBox="0 0 560 150" role="img" aria-label="데이터 편향 비교">' +
    /* 윗줄: 치우친 데이터 → 편향된 결과 */
    dgTag(6, 14, 150, "#fdecea", "#c8392c", "🔴🔴🔴 치우친 데이터") +
    dgArrowY(166, 36) +
    dgTag(196, 14, 74, "#eaf1f8", "#2c6690", "학습") +
    dgArrowY(282, 36) +
    dgTag(300, 14, 168, "#fdecea", "#c8392c", "😕 치우친 결과") +
    /* 아랫줄: 골고루 데이터 → 공정한 결과 */
    dgTag(6, 92, 150, "#eef8ee", "#2f7d3c", "🔴🟡🟢 골고루 데이터") +
    dgArrowY(166, 114) +
    dgTag(196, 92, 74, "#eaf1f8", "#2c6690", "학습") +
    dgArrowY(282, 114) +
    dgTag(300, 92, 168, "#eef8ee", "#2f7d3c", "🙂 공정한 결과") +
    "</svg>"
};

/* ---- SVG 조각 도우미 ---- */
function dgBox(x, fill, tc, label) { return dgBoxW(x, 96, fill, tc, label); }
function dgBoxW(x, w, fill, tc, label) {
  return '<rect x="' + x + '" y="17" width="' + w + '" height="44" rx="11" fill="' + fill + '"/>' +
    '<text x="' + (x + w / 2) + '" y="45" text-anchor="middle" font-family="Jua,Pretendard,sans-serif" font-size="17" fill="' + tc + '">' + label + "</text>";
}
function dgArrow(cx) {
  return '<text x="' + cx + '" y="46" text-anchor="middle" font-size="20" fill="#8a7f6a">&#8594;</text>';
}
function dgStep(x, fill, label, tc) {
  tc = tc || "#fff";
  return '<rect x="' + x + '" y="16" width="108" height="42" rx="10" fill="' + fill + '"/>' +
    '<text x="' + (x + 54) + '" y="43" text-anchor="middle" font-family="Jua,Pretendard,sans-serif" font-size="15" fill="' + tc + '">' + label + "</text>";
}
function dgArrow2(cx, y) {
  return '<text x="' + cx + '" y="' + (y + 7) + '" text-anchor="middle" font-size="19" fill="#8a7f6a">&#8594;</text>';
}
function dgTag(x, y, w, fill, tc, label) {
  return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="42" rx="10" fill="' + fill + '" stroke="' + tc + '" stroke-width="1.6"/>' +
    '<text x="' + (x + w / 2) + '" y="' + (y + 27) + '" text-anchor="middle" font-family="Pretendard,sans-serif" font-weight="700" font-size="14" fill="' + tc + '">' + label + "</text>";
}
function dgArrowY(cx, y) {
  return '<text x="' + cx + '" y="' + (y + 7) + '" text-anchor="middle" font-size="19" fill="#8a7f6a">&#8594;</text>';
}
