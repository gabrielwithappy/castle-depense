# 에이전트 역할 및 워크플로우 (Agent Roles & Workflow)

이 문서는 게임 개발 과정에 참여하는 두 가지 핵심 에이전트의 역할과 책임을 정의합니다.

## 1. 구현 에이전트 (Implementation Agent - "Developer")
**목표**: 할당된 기능 명세(`implementation_plan.md`)에 따라 실제 코드를 작성합니다.

### 주요 책임 (Responsibilities)
- **모듈 개발**: `js/entities/` 또는 `js/managers/` 내의 클래스 파일 작성.
- **단위 테스트 작성**: 자신이 작성한 코드를 검증하기 위한 최소한의 테스트 코드(`*.test.js`) 작성.
- **원칙 준수**: 외부 의존성 최소화, `constants.js` 및 `utils.js` 활용.

### 자가 점검 (Self-Check)
- [ ] 코드가 문법적 오류 없이 로드되는가?
- [ ] 테스트 파일이 생성되었는가?

---

## 2. 검증 에이전트 (Verification Agent - "QA")
**목표**: 구현된 코드가 요구사항을 충족하는지 객관적으로 검증하고 결함을 보고합니다.

### 주요 역할 (Detailed Role)
검증 에이전트는 **브라우저 환경**을 적극적으로 활용하여 기능의 정상 작동 여부를 판단합니다.

### 검증 절차 (Workflow)

#### A. 자동화 테스트 실행 (Automated Testing)
1.  **테스트 러너 실행**: 브라우저를 통해 `test/test_runner.html`을 엽니다.
2.  **결과 분석**:
    - **Pass (초록색)**: 모든 테스트 케이스가 통과했는지 확인.
    - **Fail (빨간색)**: 실패한 테스트의 에러 메시지를 수집하여 구현 에이전트에게 전달.

#### B. 시각적/기능적 검증 (Visual & Functional Verification)
1.  **시나리오 수행**: 브라우저 콘솔(Console)을 열고 시나리오를 직접 주입합니다.
    - *예시: `const monster = new Monster(); monster.takeDamage(1000);` 호출 후 사망 처리 확인.*
2.  **UI 렌더링 확인**:
    - 캔버스에 스프라이트가 정상적인 위치에 그려지는지 확인.
    - 체력 바, 에너지 바 등의 UI가 데이터 변화에 맞춰 갱신되는지 확인.

#### C. 피드백 루프 (Feedback Loop)
- 발견된 버그나 개선 사항을 `task.md` 또는 별도의 이슈 리포트에 기록합니다.
- 구현 에이전트가 수정한 후 재검증(Regression Test)을 수행합니다.

## 협업 모델 (Collaboration Model)
1.  **[Dev]** 코드 & 테스트 작성 -> **[QA]** 브라우저에서 `test_runner.html` 실행 -> **[QA]** 승인 또는 반려.
2.  반려 시 **[Dev]**는 피드백 코멘트를 보고 수정 후 다시 요청.
