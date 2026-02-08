# 성 디펜스 게임 개발 작업 목록

## ✅ 완료된 작업
- [x] 프로젝트 구조 및 공통 모듈 (`constants.js`, `utils.js`)
- [x] 테스트 인프라 (`test_runner.html`, `simple_test.js`)
- [x] 엔트리 포인트 (`index.html`, `style.css`)
- [x] `Entity` (부모 클래스) 구현

---

## ✅ 병렬 구현 작업 (완료)

### 세션 A: Castle 구현
- [x] `js/entities/Castle.js` 작성
- [x] `test/entities/Castle.test.js` 작성
- [x] 브라우저 테스트 실행 및 검증

### 세션 B: Monster 구현
- [x] `js/entities/Monster.js` 작성
- [x] `test/entities/Monster.test.js` 작성
- [x] 브라우저 테스트 실행 및 검증

### 세션 C: Projectile 구현
- [x] `js/entities/Projectile.js` 작성
- [x] `test/entities/Projectile.test.js` 작성
- [x] 브라우저 테스트 실행 및 검증

---

## ✅ 순차 구현 작업 (완료)
- [x] `js/Game.js` (메인 루프, 충돌 처리)
- [x] `js/managers/SpawnManager.js` (AI 및 소환 로직)
- [x] `js/managers/UIManager.js` (점수, 자원 표시)
- [x] `js/main.js` (게임 시작 진입점)

---

## 🧪 검증 계획
- [x] 단위 테스트: `test/test_runner.html` 브라우저 실행 ✅
- [ ] 시각적 검증: `index.html` 브라우저 실행 (Live Server 필요)
- [ ] 통합 테스트: 전체 게임 플레이
