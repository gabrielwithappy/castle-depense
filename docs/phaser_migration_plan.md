# 🎮 Phaser.js 마이그레이션 계획

## 📋 개요

Castle Defense 게임을 **순수 JavaScript**에서 **Phaser.js 3.x**로 마이그레이션합니다.

### 마이그레이션 목표
- ✅ 모바일 친화적 반응형 구조
- ✅ 터치 이벤트 기본 지원
- ✅ 배경화면 및 사운드 효과 추가 준비
- ✅ 확장 가능한 아키텍처

---

## 📊 현재 vs 목표 구조 비교

### 현재 구조 (순수 JS)
```
js/
├── main.js              # 진입점
├── Game.js              # 게임 루프
├── constants.js         # 상수
├── utils.js             # 유틸리티
├── entities/
│   ├── Entity.js        # 기본 클래스
│   ├── Castle.js        
│   ├── Monster.js       
│   └── Projectile.js    
└── managers/
    ├── SpawnManager.js  
    └── UIManager.js     
```

### 목표 구조 (Phaser.js)
```
src/
├── index.html           # 진입점 HTML
├── main.js              # Phaser 설정 및 시작
├── config.js            # 게임 설정
│
├── scenes/              # Phaser 씬 시스템
│   ├── BootScene.js     # 리소스 로딩
│   ├── MenuScene.js     # 시작 화면 + AI 레벨 선택
│   ├── GameScene.js     # 메인 게임 플레이
│   └── GameOverScene.js # 게임 종료 화면
│
├── entities/            # 게임 오브젝트 (Phaser.Sprite 기반)
│   ├── Castle.js        
│   ├── Monster.js       
│   └── Projectile.js    
│
├── managers/            # 게임 로직 관리
│   ├── SpawnManager.js  # AI 및 플레이어 소환
│   ├── EnergyManager.js # 에너지 시스템
│   └── UIManager.js     # HUD 관리
│
├── config/              # 데이터 설정
│   ├── constants.js     # 게임 상수
│   ├── monsterData.js   # 몬스터 스탯
│   └── aiConfig.js      # AI 설정
│
└── assets/              # 게임 리소스
    ├── images/          # 스프라이트, 배경
    ├── audio/           # 사운드 효과, BGM
    └── fonts/           # 커스텀 폰트 (선택)
```

---

## 🔄 마이그레이션 단계

### Phase 1: 프로젝트 설정 (30분)
- [ ] Phaser.js CDN 또는 npm 설치
- [ ] 새 디렉터리 구조 생성
- [ ] 기본 Phaser 설정 파일 작성
- [ ] 반응형 Scale Manager 설정

### Phase 2: 씬 시스템 구축 (1시간)
- [ ] BootScene: 리소스 프리로딩
- [ ] MenuScene: AI 레벨 선택 화면
- [ ] GameScene: 메인 게임 로직
- [ ] GameOverScene: 결과 화면

### Phase 3: 엔티티 마이그레이션 (2시간)
- [ ] Castle 클래스 → Phaser.Sprite
- [ ] Monster 클래스 → Phaser.Sprite + Physics
- [ ] Projectile 클래스 → Phaser.Sprite + Physics

### Phase 4: 게임 로직 마이그레이션 (1시간)
- [ ] SpawnManager 적용
- [ ] 충돌 감지 → Phaser Physics
- [ ] 타이머 → Phaser Timer Events
- [ ] 에너지 시스템

### Phase 5: UI 시스템 구축 (1시간)
- [ ] HUD (HP, 에너지, 타이머)
- [ ] 덱 카드 버튼
- [ ] 터치 친화적 버튼 크기

### Phase 6: 모바일 최적화 (30분)
- [ ] 터치 입력 테스트
- [ ] 세로/가로 모드 대응
- [ ] 성능 최적화

---

## ⚙️ Phaser 기본 설정

### main.js (새 진입점)
```javascript
import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

const config = {
    type: Phaser.AUTO,  // WebGL 우선, Canvas 폴백
    
    // 반응형 설정
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container',
        width: 1280,
        height: 720,
        min: {
            width: 320,
            height: 180
        }
    },
    
    // 물리 엔진
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    
    // 씬 목록
    scene: [BootScene, MenuScene, GameScene, GameOverScene],
    
    // 입력 설정
    input: {
        touch: true,
        mouse: true
    },
    
    // 배경색
    backgroundColor: '#1a1a2e'
};

const game = new Phaser.Game(config);
```

---

## 📁 파일별 마이그레이션 매핑

### 기존 파일 → 새 파일

| 기존 파일                     | 새 파일                        | 변경 사항                 |
| ----------------------------- | ------------------------------ | ------------------------- |
| `index.html`                  | `src/index.html`               | Phaser CDN 추가, 간소화   |
| `style.css`                   | `src/style.css`                | 최소화 (Phaser가 UI 담당) |
| `js/main.js`                  | `src/main.js`                  | Phaser 설정으로 교체      |
| `js/Game.js`                  | `src/scenes/GameScene.js`      | Phaser.Scene 상속         |
| `js/constants.js`             | `src/config/constants.js`      | 구조 유지                 |
| `js/entities/Castle.js`       | `src/entities/Castle.js`       | Phaser.Sprite 상속        |
| `js/entities/Monster.js`      | `src/entities/Monster.js`      | Phaser.Sprite + Physics   |
| `js/entities/Projectile.js`   | `src/entities/Projectile.js`   | Phaser.Sprite + Physics   |
| `js/managers/SpawnManager.js` | `src/managers/SpawnManager.js` | 구조 유지, API 변경       |
| `js/managers/UIManager.js`    | `src/managers/UIManager.js`    | Phaser UI 시스템 사용     |

---

## 🎨 에셋 준비 (선택)

### 당장 필요한 에셋
```
assets/
├── images/
│   └── placeholder.png  # 임시 이미지 (색상 사각형으로 대체 가능)
└── audio/
    └── (나중에 추가)
```

### 나중에 추가할 에셋
- 배경 이미지
- 성 스프라이트
- 몬스터 스프라이트 (애니메이션)
- 공격 이펙트
- BGM 및 효과음

---

## 🚀 시작하기

### 옵션 A: CDN 사용 (빠른 시작)
```html
<script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
```

### 옵션 B: npm 사용 (빌드 도구 필요)
```bash
npm init -y
npm install phaser
```

---

## ✅ 마이그레이션 체크리스트

### 준비 단계
- [ ] 기존 코드 백업 (Git 커밋)
- [ ] 새 디렉터리 구조 생성
- [ ] Phaser.js 설치/연결

### Phase 1: 기본 설정
- [ ] main.js Phaser 설정
- [ ] BootScene 생성
- [ ] 게임 실행 확인

### Phase 2: 씬 구현
- [ ] MenuScene (AI 레벨 선택)
- [ ] GameScene (기본 구조)
- [ ] GameOverScene

### Phase 3: 엔티티
- [ ] Castle 렌더링
- [ ] Monster 렌더링 + 이동
- [ ] Projectile 렌더링 + 이동

### Phase 4: 게임 로직
- [ ] 충돌 감지
- [ ] 소환 시스템
- [ ] 타이머/에너지

### Phase 5: UI
- [ ] HUD 표시
- [ ] 덱 카드 버튼
- [ ] 게임오버 화면

### Phase 6: 모바일
- [ ] 터치 테스트
- [ ] 반응형 테스트

---

## 📅 예상 소요 시간

| 단계     | 예상 시간  |
| -------- | ---------- |
| Phase 1  | 30분       |
| Phase 2  | 1시간      |
| Phase 3  | 2시간      |
| Phase 4  | 1시간      |
| Phase 5  | 1시간      |
| Phase 6  | 30분       |
| **총계** | **~6시간** |

---

## 🔜 다음 단계

**Phase 1부터 시작합니다:**
1. 기존 코드 Git 커밋
2. `src/` 디렉터리 생성
3. Phaser CDN 연결
4. 기본 설정 파일 작성
