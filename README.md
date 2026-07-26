# 중학교 정보 · 인공지능 단원 수업 사이트

2022 개정 중학교 정보과 **인공지능 단원**을 8개 출판사 교과서 기준으로 통합한 교사용 수업 사이트입니다.
특정 교과서에 얽매이지 않아 어느 학교에서든 사용할 수 있습니다.

## 구성 파일
- `index.html` — 수업 사이트(개념·도식·활동·교사 가이드·확인문제·단원 마무리)
- `worksheet.html` — 인쇄용 학습지(빈칸+활동기록+확인문제, 정답지 모드)
- `styles.css`, `worksheet.css` — 디자인
- `app.js`, `data.js`, `diagrams.js`, `worksheet.js` — 콘텐츠·동작
- 학생 워크북은 별도 사이트로 연결: https://jjeong-ye.github.io/info-workbook/

## GitHub Pages로 올리는 법
1. 새 저장소를 만들고(예: `info-ai`) 이 폴더의 **모든 파일**을 올립니다.
2. 저장소 **Settings → Pages → Branch: main / (root)** 선택 후 저장.
3. 잠시 뒤 `https://<사용자명>.github.io/info-ai/` 로 접속됩니다.

## 참고
- 폰트(Pretendard 등)와 온라인 도구 버튼(엔트리·티처블 머신 등)은 인터넷 연결이 필요합니다.
- 워크북 '특정 차시 바로가기(#a01~#a08)'가 작동하려면, 워크북 저장소의 `script.js`에
  해시 열기 기능(`openFromHash`)이 포함되어 있어야 합니다. 없으면 워크북 첫 화면으로 열립니다.
