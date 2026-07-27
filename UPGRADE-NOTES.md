# 정보 인공지능 — 업그레이드 변경 내역 (교실 활용 보강)

## app.js
- 단원 안내 카드(.map-card)에 role="button" tabindex="0" aria-label 부여 + Enter·Space 키보드 조작 추가
- 탭 전환 시 aria-selected 반영(스크린리더 상태 안내)
- 존재하지 않는 탭/패널일 때 화면을 건드리지 않도록 null 방어 처리(초기 패널 포함)

## styles.css
- 키보드 포커스 표시(:focus-visible 파란 외곽선)를 탭·보기·카드·링크·요약에 추가
- 확인 문제 정답/오답을 기호(✓/✕)로도 표시하는 ::after 규칙 추가(색각 이상 배려)
