# 설계 설명

주 사용자: AI 중심, 사용자도 확인

## 이 문서는 무엇을 설명하나요?

이 문서는 코드가 어떻게 나뉘어 있는지 설명합니다.

쉽게 말하면:

- 어떤 파일이 있는지
- 각 파일이 무슨 일을 하는지
- 구조를 바꿀 때 무엇을 조심해야 하는지

일반적인 개발 말로 하면 이 문서는 `설계 문서`입니다.

이 문서는 AI가 구현할 때 특히 자주 보고,
사용자는 "어떤 파일을 고쳐야 하는지" 확인할 때 보면 좋습니다.

## 설계에서 자주 쓰는 쉬운 개념

### 진입점

프로그램이 처음 시작되는 곳입니다.

이 프로젝트에서는:

- `index.html`
- `js/main.js`

### 게임 루프

게임이 계속 움직이도록 반복해서 돌아가는 큰 흐름입니다.

이 프로젝트에서는:

- `js/Game.js`

### 엔티티

게임 안에 실제로 존재하는 것들입니다.

예:

- 성
- 몬스터
- 투사체

이 프로젝트에서는:

- `js/entities/Entity.js`
- `js/entities/Castle.js`
- `js/entities/Monster.js`
- `js/entities/Projectile.js`

### 매니저

무언가를 관리하고 도와주는 코드입니다.

예:

- 몬스터 소환 관리
- 화면 표시 관리

이 프로젝트에서는:

- `js/managers/SpawnManager.js`
- `js/managers/UIManager.js`

### 유틸리티

여러 곳에서 함께 쓰는 도우미 코드입니다.

이 프로젝트에서는:

- `js/utils.js`
- `js/constants.js`

## 현재 코드 구조

```text
castle-depense/
├── index.html
├── style.css
├── js/
│   ├── main.js
│   ├── Game.js
│   ├── constants.js
│   ├── utils.js
│   ├── entities/
│   │   ├── Entity.js
│   │   ├── Castle.js
│   │   ├── Monster.js
│   │   └── Projectile.js
│   └── managers/
│       ├── SpawnManager.js
│       └── UIManager.js
└── test/
    └── test_runner.html
```

## 중요한 파일 설명

### `index.html`

- 게임이 시작되는 입구입니다.

### `js/main.js`

- 게임을 처음 준비하고 파일들을 연결합니다.

### `js/Game.js`

- 게임 전체 흐름을 관리합니다.
- 시간, 전투, 승패 같은 중요한 일을 맡습니다.

### `js/entities`

이 폴더에는 게임 속 객체가 들어 있습니다.

- `Entity.js`: 공통 바탕
- `Castle.js`: 성
- `Monster.js`: 몬스터
- `Projectile.js`: 날아가는 공격체

### `js/managers`

이 폴더에는 도와주는 관리 코드가 들어 있습니다.

- `SpawnManager.js`: 몬스터 소환 관리
- `UIManager.js`: 화면 표시 관리

### `test/test_runner.html`

- 테스트를 실행해 보는 곳입니다.

## 이 문서를 볼 때

아래 같은 경우에 이 문서를 먼저 봅니다.

- 파일을 새로 만들고 싶을 때
- 파일 위치를 바꾸고 싶을 때
- 코드 책임을 나누고 싶을 때
- 어떤 파일을 수정해야 할지 헷갈릴 때

## 구조를 바꿀 때 기억할 것

- 새 파일을 만들면 이 문서도 같이 고칩니다.
- 파일 역할이 바뀌면 설명도 같이 바꿉니다.
- 게임 규칙이 바뀌면 `docs/game/game.md`도 함께 봅니다.
- 해야 할 일이 바뀌면 `docs/work/work.md`도 함께 봅니다.

## 한 줄 정리

게임이 어떤 게임인지는 `game`,
코드가 어떻게 생겼는지는 `design`에서 봅니다.

## 변경 이력

- 2026-04-11: 일반적인 구현 개념인 진입점, 게임 루프, 엔티티, 매니저를 추가해 다시 정리
