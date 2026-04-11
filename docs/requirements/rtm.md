# RTM

주 사용자: AI 중심, 같이 확인

## 이 문서는 무엇인가요?

RTM은 `Requirements Traceability Matrix`의 줄임말입니다.

이 문서는 요구사항이

- 어디에 구현되었는지
- 어떻게 확인할 수 있는지
- 지금 상태가 어떤지

를 한눈에 보는 표입니다.

쉽게 말하면 "약속한 기능이 진짜 만들어졌는지 확인하는 표"입니다.

이 문서는 특히 AI가 구현 상태를 정리할 때 많이 쓰고,
사용자는 검증 상태를 확인할 때 같이 보면 좋습니다.

## 상태는 이렇게 적습니다

- `Planned`: 아직 만들기 전
- `In Progress`: 만드는 중
- `Implemented`: 만들었음
- `Verified`: 확인까지 끝남

## 요구사항 추적 표

| 요구사항 ID | 요구사항 요약 | 관련 코드/문서 | 확인 방법 | 상태 |
| --- | --- | --- | --- | --- |
| `REQ-001` | 성 디펜스 게임 | `index.html`, `js/Game.js`, `docs/game/game.md` | 직접 실행 | `Planned` |
| `REQ-002` | AI 성 파괴 시 승리 | `js/Game.js` | 직접 실행 | `Planned` |
| `REQ-003` | 플레이어 성 파괴 시 패배 | `js/Game.js` | 직접 실행 | `Planned` |
| `REQ-004` | 시간 종료 시 HP 비교 | `js/Game.js` | 직접 실행 | `Planned` |
| `REQ-005` | 플레이어 성과 AI 성 존재 | `js/entities/Castle.js` | 직접 실행 | `Planned` |
| `REQ-006` | 성의 자동 공격 | `js/entities/Castle.js`, `js/entities/Projectile.js` | 직접 실행 | `Planned` |
| `REQ-007` | 크리스탈 1회 1타겟 | `js/entities/Castle.js` | 직접 실행 | `Planned` |
| `REQ-008` | 몬스터 등급 | `js/entities/Monster.js`, `js/constants.js` | 코드 확인 | `Planned` |
| `REQ-009` | 몬스터 종류 | `js/entities/Monster.js`, `js/constants.js` | 코드 확인 | `Planned` |
| `REQ-010` | 에너지 소모 소환 | `js/managers/SpawnManager.js`, `js/Game.js` | 직접 실행 | `Planned` |
| `REQ-011` | 전투 시 밀려남 표현 | `js/entities/Monster.js`, `js/Game.js` | 직접 실행 | `Planned` |
| `REQ-012` | 필드 몬스터 수 제한 | `js/managers/SpawnManager.js`, `js/managers/UIManager.js` | 직접 실행 | `Planned` |
| `REQ-013` | 덱 카드 10개 구성 | `js/managers/UIManager.js`, `js/managers/SpawnManager.js` | 화면 확인 | `Planned` |
| `REQ-014` | 덱 카드 등급 순 정렬 | `js/managers/SpawnManager.js`, `js/managers/UIManager.js` | 화면 확인 | `Planned` |
| `REQ-015` | 덱 카드 등급 표시 | `js/managers/UIManager.js` | 화면 확인 | `Planned` |
| `REQ-016` | 초당 1 에너지 회복 | `js/Game.js`, `js/constants.js` | 직접 실행 | `Planned` |
| `REQ-017` | 마지막 30초 초당 2 에너지 | `js/Game.js`, `js/constants.js` | 직접 실행 | `Planned` |
| `REQ-018` | 난이도별 최대 에너지 | `js/constants.js`, `js/Game.js` | 코드 확인 | `Planned` |
| `REQ-019` | 남은 시간 존재 | `js/Game.js`, `js/managers/UIManager.js` | 화면 확인 | `Planned` |
| `REQ-020` | 다양한 맵 | 해당 구현 파일 없음 | 직접 실행 | `Planned` |
| `REQ-021` | 맵별 다른 배틀 시간 | 해당 구현 파일 없음 | 직접 실행 | `Planned` |
| `REQ-022` | AI 난이도 선택 | `index.html`, `js/managers/UIManager.js`, `js/managers/SpawnManager.js` | 직접 실행 | `Planned` |
| `REQ-023` | 초급 AI 몬스터 제한 | `js/managers/SpawnManager.js` | 직접 실행 | `Planned` |
| `REQ-024` | 중급 AI 몬스터 제한 | `js/managers/SpawnManager.js` | 직접 실행 | `Planned` |
| `REQ-025` | 고급 AI 몬스터 범위 | `js/managers/SpawnManager.js` | 직접 실행 | `Planned` |
| `REQ-026` | 아이템 종류 | 해당 구현 파일 없음 | 직접 실행 | `Planned` |
| `REQ-027` | 사용형 아이템 효과 | 해당 구현 파일 없음 | 직접 실행 | `Planned` |
| `REQ-028` | 장착형 아이템 효과 | 해당 구현 파일 없음 | 직접 실행 | `Planned` |
| `REQ-029` | 플레이어 HP/에너지 표시 | `js/managers/UIManager.js` | 화면 확인 | `Planned` |
| `REQ-030` | 몬스터 수 표시 | `js/managers/UIManager.js` | 화면 확인 | `Planned` |
| `REQ-031` | 몬스터 수 색상 표시 | `js/managers/UIManager.js` | 화면 확인 | `Planned` |
| `REQ-032` | 중앙 상단 시간 표시 | `js/managers/UIManager.js` | 화면 확인 | `Planned` |
| `REQ-033` | 우측 상단 AI HP 표시 | `js/managers/UIManager.js` | 화면 확인 | `Planned` |
| `REQ-034` | 몬스터 종류별 시각 구분 | `js/entities/Monster.js`, `style.css` | 화면 확인 | `Planned` |
| `REQ-035` | 반응형 캔버스 | `style.css`, `index.html`, `js/Game.js` | 모바일 확인 | `Planned` |
| `REQ-036` | 터치 지원 | `index.html`, `js/main.js`, `js/managers/UIManager.js` | 모바일 확인 | `Planned` |
| `REQ-037` | 모바일 버튼 크기 | `style.css`, `js/managers/UIManager.js` | 모바일 확인 | `Planned` |
| `REQ-038` | 세로 모드 대응 | `style.css` | 모바일 확인 | `Planned` |
| `REQ-039` | 가로 모드 대응 | `style.css` | 모바일 확인 | `Planned` |

## 이 문서를 어떻게 쓰나요?

### 새 요구사항이 생기면

1. `requirements.md`에 요구사항 번호를 추가합니다.
2. 이 문서에도 같은 번호를 추가합니다.

### 구현을 시작하면

- 상태를 `In Progress`로 바꿉니다.

### 구현이 끝나면

- 상태를 `Implemented`로 바꿉니다.

### 확인까지 끝나면

- 상태를 `Verified`로 바꿉니다.

## 이 문서를 언제 보나요?

- 요구사항이 정말 구현됐는지 확인하고 싶을 때
- 어떤 코드가 어떤 요구사항과 연결되는지 보고 싶을 때
- 테스트해야 할 항목을 빠르게 찾고 싶을 때

## 같이 보면 좋은 문서

- 요구사항 내용: `docs/requirements/requirements.md`
- 쉬운 게임 설명: `docs/game/game.md`
- 코드 구조: `docs/design/design.md`
- 작업 순서: `docs/work/work.md`

## 변경 이력

- 2026-04-11: 기존 요구사항과 UI/구현 계획 문서를 참고해 RTM을 확장
