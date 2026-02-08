# 성 디펜스 게임 구현 계획 (AI 병렬 처리 최적화)

## 목표 설명
웹 기반의 성 디펜스 게임을 제작합니다. **모듈화된 아키텍처**를 도입하여 각 게임 요소를 독립적으로 구현할 수 있도록 설계합니다. 이를 통해 AI가 여러 파일을 병렬적으로 생성하고 수정하기 용이하게 만듭니다.

## 사용자 검토 필요
> [!NOTE]
> **AI 최적화 설계**: 각 클래스(성, 몬스터, 투사체)는 상호 의존성을 최소화하고 `Game` 클래스에서 이를 조율하는 방식으로 구현합니다. 이를 통해 각 모듈을 동시에 개발할 수 있습니다.

## 변경 제안

### 아키텍처 전략: 컴포넌트 기반 및 이벤트 주도
서로 직접 참조하기보다 이벤트나 상위 매니저를 통해 통신하여 결합도를 낮춥니다.

### [1단계: 공통 모듈 (기반)]
가장 먼저 정의되어야 하는 상수와 유틸리티입니다.
#### [NEW] [js/constants.js](file:///d:/01_PRJ/castle-depense/js/constants.js)
- 게임 밸런스 데이터 (유닛 스탯, 비용, 성 체력 등)
- 이벤트 타입 정의
#### [NEW] [js/utils.js](file:///d:/01_PRJ/castle-depense/js/utils.js)
- 충돌 감지 함수, 난수 생성기 등 헬퍼 함수

### [2단계: 독립 엔티티 (병렬 구현 가능)]
공통 모듈에만 의존하며, 서로 의존하지 않는 독립 객체들입니다. **이 단계의 파일들은 동시에 생성할 수 있습니다.**
#### [NEW] [js/entities/Entity.js](file:///d:/01_PRJ/castle-depense/js/entities/Entity.js)
- 모든 게임 객체의 부모 클래스 (위치, 그리기 메서드 기본형)
#### [NEW] [js/entities/Castle.js](file:///d:/01_PRJ/castle-depense/js/entities/Castle.js)
- 성의 체력 표시, `Entity` 상속. `takeDamage` 메서드 구현.
#### [NEW] [js/entities/Monster.js](file:///d:/01_PRJ/castle-depense/js/entities/Monster.js)
- 몬스터 이동, 공격 상태 머신. `Entity` 상속.
#### [NEW] [js/entities/Projectile.js](file:///d:/01_PRJ/castle-depense/js/entities/Projectile.js)
- 성의 크리스탈이나 유닛이 발사하는 투사체.

### [3단계: 시스템 및 매니저 (조율)]
독립 엔티티들을 관리하고 게임 루프를 돌리는 시스템입니다.
#### [NEW] [js/managers/SpawnManager.js](file:///d:/01_PRJ/castle-depense/js/managers/SpawnManager.js)
- AI 및 플레이어의 유닛 소환 관리 (쿨타임, 자원 체크).
#### [NEW] [js/managers/UIManager.js](file:///d:/01_PRJ/castle-depense/js/managers/UIManager.js)
- DOM 요소 업데이트 (체력바, 자원 텍스트).
#### [NEW] [js/Game.js](file:///d:/01_PRJ/castle-depense/js/Game.js)
- 메인 게임 루프 (`update`, `draw`).
- 엔티티 리스트 관리 및 충돌 체크 루프 실행.

### [4단계: 진입점]
#### [NEW] [index.html](file:///d:/01_PRJ/castle-depense/index.html)
- 모듈 타입 스크립트 로드 (`<script type="module" src="js/main.js"></script>`)
#### [NEW] [style.css](file:///d:/01_PRJ/castle-depense/style.css)
#### [NEW] [js/main.js](file:///d:/01_PRJ/castle-depense/js/main.js)
- 게임 인스턴스 생성 및 시작.

### [테스트 인프라 (병렬 검증)]
브라우저에서 직접 실행 가능한 경량 테스트 러너를 구축합니다.
#### [NEW] [test/test_runner.html](file:///d:/01_PRJ/castle-depense/test/test_runner.html)
- 브라우저 기반 테스트 러너. 각 모듈의 테스트 파일을 동적으로 로드하여 실행.
#### [NEW] [test/simple_test.js](file:///d:/01_PRJ/castle-depense/test/simple_test.js)
- `describe`, `it`, `expect` 등을 구현한 초경량 테스트 프레임워크.
#### [NEW] [test/entities/Monster.test.js](file:///d:/01_PRJ/castle-depense/test/entities/Monster.test.js)
- 몬스터 생성 및 상태 변화 테스트 예시.

## 검증 계획
### 수동 검증 및 브라우저 테스트
1. **단위 테스트 (Unit Test)**: `test_runner.html`을 브라우저로 열어 각 모듈의 로직(이동, 데미지 계산)이 정상 작동하는지 확인. 이를 통해 UI 없이도 로직 검증 가능.
2. **시각적 검증**: 메인 게임 화면에서 실제 움직임 확인.
