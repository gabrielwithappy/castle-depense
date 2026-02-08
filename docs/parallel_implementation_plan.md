# 성 디펜스 게임 병렬 구현 계획 (Parallel Implementation Plan)

## 개요
이 문서는 성 디펜스 게임을 **병렬로 구현**하기 위한 상세 설계 및 검증 계획입니다. 각 세션(또는 에이전트)이 독립적으로 작업할 수 있도록 모듈별 명세와 브라우저 기반 검증 방법을 정의합니다.

---

## 📋 현재 상태 (Current Status)
| 항목                                   | 상태   |
| -------------------------------------- | ------ |
| 프로젝트 구조                          | ✅ 완료 |
| 공통 모듈 (`constants.js`, `utils.js`) | ✅ 완료 |
| 테스트 인프라 (`test_runner.html`)     | ✅ 완료 |
| 기본 클래스 (`Entity.js`)              | ✅ 완료 |
| `Castle.js`                            | ⏳ 대기 |
| `Monster.js`                           | ⏳ 대기 |
| `Projectile.js`                        | ✅ 완료 |

---

## 🔀 병렬 구현 가능 모듈 (Parallel Workstreams)

아래 3개 모듈은 **동시에** 구현 가능합니다. 각 모듈은 `Entity.js`만 상속하며 서로 의존하지 않습니다.

### 모듈 A: Castle (성)
- **파일**: `js/entities/Castle.js`
- **테스트**: `test/entities/Castle.test.js`
- **기능**:
  - `hp`, `maxHp` 속성
  - `takeDamage(amount)` 메서드
  - `isDestroyed()` 상태 체크
  - `draw(ctx)` 오버라이드 (체력바 표시)
- **검증 시나리오**:
  ```javascript
  const castle = new Castle('player', 0, 300);
  castle.takeDamage(500);
  expect(castle.hp).toBe(500);
  castle.takeDamage(600);
  expect(castle.isDestroyed()).toBe(true);
  ```

---

### 모듈 B: Monster (몬스터)
- **파일**: `js/entities/Monster.js`
- **테스트**: `test/entities/Monster.test.js`
- **기능**:
  - `grade`, `type`, `speed`, `attackDamage`, `attackRange` 속성
  - `move(direction)` 메서드 (`direction`: 1 또는 -1)
  - `attack(target)` 메서드
  - `update(dt, enemies)` 메서드 (적 감지 및 공격/이동 판단)
- **검증 시나리오**:
  ```javascript
  const monster = new Monster('player', 'common', 'attacker');
  monster.move(1); // 오른쪽으로 이동
  expect(monster.x).toBeGreaterThan(0);
  ```

---

### 모듈 C: Projectile (투사체)
- **파일**: `js/entities/Projectile.js`
- **테스트**: `test/entities/Projectile.test.js`
- **기능**:
  - `speed`, `damage`, `targetX`, `targetY` 속성
  - `update(dt)` 메서드 (이동)
  - `hasReachedTarget()` 상태 체크
- **검증 시나리오**:
  ```javascript
  const proj = new Projectile(0, 300, 500, 300, 10, 50);
  proj.update(1);
  expect(proj.x).toBeGreaterThan(0);
  ```

---

## 🧪 브라우저 기반 검증 계획 (Browser Verification Plan)

### 1. 단위 테스트 (Unit Test via Browser)
**URL**: `http://localhost:5500/test/test_runner.html` (Live Server 또는 로컬 서버 필요)

| 테스트 파일          | 검증 내용             |
| -------------------- | --------------------- |
| `Castle.test.js`     | 성 피격, 파괴 조건    |
| `Monster.test.js`    | 이동, 공격, 상태 전이 |
| `Projectile.test.js` | 이동, 목표 도달       |

**실행 방법**:
1. `test/test_runner.html`을 브라우저에서 열기
2. 콘솔에서 Pass/Fail 결과 확인
3. 실패 시 에러 메시지 확인 후 코드 수정

### 2. 시각적 검증 (Visual Verification)
**URL**: `http://localhost:5500/index.html`

| 검증 항목   | 확인 방법                                                |
| ----------- | -------------------------------------------------------- |
| 성 렌더링   | 캔버스 좌우 끝에 성이 표시되는지 확인                    |
| 몬스터 이동 | 콘솔에서 `game.spawnMonster('player')` 호출 후 이동 확인 |
| 투사체 발사 | 성 근처에 적 몬스터 배치 후 크리스탈 발사 확인           |

### 3. 통합 검증 (Integration Verification)
**시나리오**: "게임 시작 -> 몬스터 소환 -> 전투 -> 승리/패배"

1. 브라우저에서 `index.html` 열기
2. 게임 시작 버튼 클릭
3. 덱에서 몬스터 선택하여 소환
4. AI와 전투 진행
5. 어느 한쪽 성이 파괴되면 게임 오버 화면 표시 확인

---

## 📁 파일 구조 (Final Structure)
```
castle-depense/
├── index.html
├── style.css
├── js/
│   ├── constants.js ✅
│   ├── utils.js ✅
│   ├── main.js
│   ├── Game.js
│   ├── entities/
│   │   ├── Entity.js ✅
│   │   ├── Castle.js ⏳
│   │   ├── Monster.js ⏳
│   │   └── Projectile.js ⏳
│   └── managers/
│       ├── SpawnManager.js
│       └── UIManager.js
├── test/
│   ├── test_runner.html ✅
│   ├── simple_test.js ✅
│   └── entities/
│       ├── Castle.test.js ⏳
│       ├── Monster.test.js ⏳
│       └── Projectile.test.js ⏳
└── docs/
    ├── introduction.md
    ├── ui_design.md
    ├── task.md
    ├── implementation_agent.md
    └── parallel_implementation_plan.md (이 문서)
```

---

## 🚀 다음 단계 (Next Steps)
1. **세션 A**: Castle 구현 및 테스트
2. **세션 B**: Monster 구현 및 테스트
3. **세션 C**: Projectile 구현 및 테스트
4. **통합**: `Game.js`, `SpawnManager.js`, `UIManager.js` 순차 구현
5. **최종 검증**: 브라우저에서 전체 게임 플레이 테스트
