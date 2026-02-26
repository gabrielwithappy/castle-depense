# 게임 디버깅 가이드

## 🎮 몬스터 카드 클릭 문제 추적

### 문제 상황
카드를 클릭해도 몬스터가 소환되지 않음

### 디버깅 방법

#### 1. 게임 실행
- VSCode에서 `index.html` 파일을 브라우저로 엽니다 (Live Server 사용 권장)
- 또는 로컬 웹 서버를 시작합니다

#### 2. 브라우저 개발자 도구 열기
- `F12` 또는 `Ctrl+Shift+I` 키를 눌러 개발자 도구 열기
- **Console** 탭으로 이동

#### 3. 로그 확인
게임이 시작되면 다음과 같은 로그를 확인하세요:

```
GameScene: 게임 시작 (AI: normal)
[createDeckUI] 카드 클릭: 슬롯 0, 등급: common, 타입: attacker
```

#### 4. 카드 클릭 시나리오

**Step 1: 카드 클릭**
```
[createDeckUI] 카드 클릭: 슬롯 [인덱스], 등급: [등급], 타입: [타입]
```

**Step 2: spawnPlayerMonster 호출**
```
[spawnPlayerMonster] 호출됨: slotIndex=[인덱스]
[spawnPlayerMonster] 슬롯 찾음: [등급] [타입]
[spawnPlayerMonster] 비용: [비용], 현재 에너지: [에너지]
```

**Step 3: Monster 생성**
```
[Monster.constructor] 생성 시작: team=player, grade=[등급], type=[타입], pos=(x,y)
[Monster.constructor] 스탯 계산 완료: {hp: ..., speed: ..., ...}
[Monster.constructor] createVisuals 완료
[Monster.constructor] 물리 바디 설정 완료
[Monster.constructor] 생성 완료
```

**Step 4: 씬 추가**
```
[spawnPlayerMonster] 그룹에 추가 완료
[spawnPlayerMonster] 씬에 추가 완료
플레이어 몬스터 소환: [등급] [타입] at (x, y) (필드: 1/7)
```

### 디버깅 체크리스트

#### ❌ 카드 클릭 로그가 보이지 않음
- **원인**: 카드 클릭 이벤트가 바인드되지 않았거나 클릭되지 않음
- **확인**:
  1. 카드가 화면에 보이는가?
  2. 마우스 커서가 카드에서 손 모양으로 변하는가?
  3. 브라우저 콘솔에서 에러가 있는가?

#### ❌ spawnPlayerMonster 로그가 없음
- **원인**: 카드 클릭 이벤트 핸들러가 제대로 작동하지 않음
- **확인**:
  ```javascript
  // 브라우저 콘솔에서 실행:
  window.game.scene.scenes[2].spawnPlayerMonster(0);
  ```

#### ❌ 에너지 부족 메시지
```
[spawnPlayerMonster] 에너지 부족! (10 < 20)
```
- **원인**: 플레이어의 에너지가 부족함
- **해결**: 타이머가 진행될 때까지 기다리거나 (에너지 자동 회복), 덱의 값싼 카드를 시도하세요

#### ❌ 배틀필드 가득 참
```
[spawnPlayerMonster] 배틀필드 가득! (7/7)
```
- **원인**: 이미 7마리의 몬스터가 필드에 있음
- **해결**: 기존 몬스터가 죽을 때까지 기다리세요

#### ❌ Monster 생성 중 에러
```
[Monster.constructor] createVisuals 에러: TypeError: ...
```
- **원인**: createVisuals() 메서드에서 에러 발생
- **확인**: 에러 메시지를 자세히 읽고 해당 메서드를 확인하세요

### 성공적인 몬스터 소환
모든 로그가 순서대로 나타나고 게임 화면에 몬스터가 보이면 성공입니다! ✅

### 추가 디버깅

#### 게임 객체 확인
```javascript
// 브라우저 콘솔에서:
window.game.scene.scenes[2].playerMonstersOnField  // 필드의 플레이어 몬스터 수
window.game.scene.scenes[2].playerEnergy           // 플레이어의 현재 에너지
window.game.scene.scenes[2].playerMonsters.getChildren() // 플레이어 몬스터 배열
```

#### 에너지 수동 추가
```javascript
// 브라우저 콘솔에서:
window.game.scene.scenes[2].playerEnergy = 100;
```

---

## 🧪 게임 헬스 체크 테스트

모든 수정 후에 다음 명령어로 게임이 정상동작하는지 검증하세요:

```bash
npm test
```

성공 시 메시지:
```
🎉 모든 테스트 통과! 게임이 정상동작합니다.
```

---

## 📝 로그 메시지 정리

### Monster 클래스 (entities/Monster.js)
- `[Monster.constructor]` - Monster 인스턴스 생성 관련

### GameScene 클래스 (scenes/GameScene.js)
- `[createDeckUI]` - 카드 UI 생성 및 클릭 이벤트
- `[spawnPlayerMonster]` - 플레이어 몬스터 소환 로직

### 게임 시작
- `GameScene: 게임 시작 (AI: [난이도])` - 게임 초기화 완료
