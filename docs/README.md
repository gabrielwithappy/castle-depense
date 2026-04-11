# 프로젝트 문서 지도

이 폴더는 게임 프로젝트를 쉽게 이해하고, 쉽게 고치기 위한 문서 모음입니다.

쉽게 말하면 `docs`는 프로젝트 설명 책장입니다.

## 먼저 알아두면 좋은 일반적인 개발 순서

보통 프로젝트는 이런 순서로 생각합니다.

1. 요구사항: 무엇을 만들어야 하는지 정합니다.
2. 설계: 어떻게 만들지 정합니다.
3. 구현: 실제로 코드를 만듭니다.
4. 테스트: 잘 되는지 확인합니다.
5. 배포: 인터넷에 올립니다.

이 `docs` 폴더도 이 흐름에 맞춰 읽을 수 있게 만들었습니다.

## 문서 구조

```text
docs/
├── README.md
├── requirements/
│   ├── requirements.md
│   └── rtm.md
├── design/
│   └── design.md
├── game/
│   └── game.md
├── work/
│   └── work.md
└── deploy/
    └── deploy.md
```

## 가장 중요한 것: 누가 주로 쓰나요?

| 문서 | 주로 쓰는 사람 | 이유 |
| --- | --- | --- |
| `requirements/requirements.md` | 같이 | 무엇을 만들어야 하는지 함께 확인하는 문서 |
| `requirements/rtm.md` | AI 중심, 같이 확인 | 요구사항이 구현/검증됐는지 추적하는 문서 |
| `design/design.md` | AI 중심, 사용자도 확인 | 코드 구조와 파일 역할을 설명하는 문서 |
| `game/game.md` | 사용자 중심, AI도 참고 | 게임을 쉬운 말로 설명하는 문서 |
| `work/work.md` | 같이 | 지금 할 일과 작업 순서를 정하는 문서 |
| `deploy/deploy.md` | 같이 | 배포 방법을 확인하는 문서 |

## 각 폴더는 어떤 일반 개념에 해당하나요?

| 폴더 | 쉬운 뜻 | 일반적인 개발 개념 |
| --- | --- | --- |
| `requirements` | 무엇을 만들어야 하는지 적는 곳 | 요구사항 |
| `design` | 코드와 구조를 설명하는 곳 | 설계 |
| `work` | 지금 무엇을 만들고 확인할지 적는 곳 | 구현 + 테스트 |
| `deploy` | 완성한 것을 올리는 방법을 적는 곳 | 배포 |

## 각 폴더는 무슨 뜻인가요?

### `requirements`

주 사용자: 같이

이 폴더는 "무엇을 만들어야 하는지" 적는 곳입니다.

- `requirements.md`: 게임 규칙과 필요한 기능을 적는 문서
- `rtm.md`: 요구사항이 실제로 구현되고 검증됐는지 추적하는 문서

### `design`

주 사용자: AI 중심, 사용자도 확인

코드 구조 설명이 들어 있는 폴더입니다.

- 어떤 파일이 어떤 역할인지
- 어디를 고쳐야 하는지
- 구조를 바꿔도 되는지

를 볼 때 사용합니다.

### `game`

주 사용자: 사용자 중심

게임을 쉬운 말로 설명하는 폴더입니다.

- 이 게임이 어떤 게임인지
- 이기고 지는 방법이 무엇인지
- 화면에 무엇이 보여야 하는지

를 쉽게 이해할 때 사용합니다.

### `work`

주 사용자: 같이

지금 해야 할 일과 작업 순서를 적어 둔 폴더입니다.

### `deploy`

주 사용자: 같이

게임을 인터넷에 올리는 방법을 적어 둔 폴더입니다.

## 무엇을 고치고 싶을 때 어디를 보면 될까요?

| 바꾸고 싶은 것 | 먼저 볼 문서 |
| --- | --- |
| 게임 규칙 | `requirements/requirements.md` |
| 필요한 기능 | `requirements/requirements.md` |
| 요구사항이 구현됐는지 확인 | `requirements/rtm.md` |
| 게임을 쉬운 말로 이해 | `game/game.md` |
| 코드 구조 | `design/design.md` |
| 지금 할 일 | `work/work.md` |
| 테스트 확인 | `requirements/rtm.md`, `work/work.md` |
| 배포 방법 | `deploy/deploy.md` |

## 처음 보는 사람은 이렇게 읽으면 쉬워요

1. `README.md`
2. `game/game.md`
3. `requirements/requirements.md`
4. `design/design.md`
5. `work/work.md`
6. 필요하면 `deploy/deploy.md`

## 아주 쉬운 사용 방법

1. 사용자는 `game`과 `requirements`를 먼저 봅니다.
2. AI는 `requirements`, `design`, `work`를 먼저 봅니다.
3. 같이 확인할 때는 `rtm`과 `work`를 봅니다.

## 마지막 한 줄 정리

- 게임을 쉽게 이해하려면 `game`
- 꼭 만들어야 할 것을 보려면 `requirements`
- 코드 구조를 보려면 `design`
- 지금 할 일을 보려면 `work`
- 배포 방법을 보려면 `deploy`

## 변경 이력

- 2026-04-11: 각 문서가 사용자용인지 AI용인지 바로 알 수 있도록 역할 표시 추가
