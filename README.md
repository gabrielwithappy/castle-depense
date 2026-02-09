# Castle Defense - Phaser.js Game

> 타워 디펜스 장르의 웹 게임 - Phaser.js로 구현

[![Play Game](https://img.shields.io/badge/Play-Game-brightgreen)](https://gabrielwithappy.github.io/castle-depense/)

## 🎮 게임 플레이

**[여기를 클릭하여 게임을 플레이하세요!](https://gabrielwithappy.github.io/castle-depense/)**

### 게임 방법
- **목표**: AI 성을 파괴하세요!
- **조작**: 하단 카드를 클릭하여 몬스터 소환
- **에너지**: 시간에 따라 자동 충전되며, 몬스터 소환에 필요
- **제한 시간**: 3분 안에 승부를 결정하세요

### 난이도
- **초급**: 느린 소환 속도
- **중급**: 보통 속도
- **고급**: 빠른 소환 속도 + 강력한 몬스터

---

## 🚀 기술 스택

- **Phaser 3.x**: HTML5 게임 엔진
- **JavaScript (ES6+)**: 모듈 시스템
- **HTML5 Canvas**: 렌더링
- **GitHub Pages**: 정적 호스팅

---

## 📁 프로젝트 구조

```
castle-depense/
├── index.html           # 게임 진입점
├── main.js              # Phaser Config
├── config/              # 게임 설정 (상수, 몬스터 데이터)
├── scenes/              # Phaser 씬 (Boot, Menu, Game, GameOver)
├── entities/            # 게임 엔티티 (Castle, Monster, Projectile)
├── src/                 # 개발 소스 (원본)
└── docs/                # 프로젝트 문서
```

---

## 🛠️ 로컬 실행 방법

### 1. 저장소 클론
```bash
git clone https://github.com/gabrielwithappy/castle-depense.git
cd castle-depense
```

### 2. 로컬 서버 실행
```bash
# Python 3.x
python -m http.server 8080

# 또는 Node.js (http-server 사용)
npx http-server -p 8080
```

### 3. 브라우저에서 실행
```
http://localhost:8080
```

---

## 📖 개발 문서

자세한 개발 과정 및 기술 문서는 [`docs/` 폴더](./docs/)를 참조하세요:

- [요구사항 명세](./docs/requirements.md)
- [아키텍처 설계](./docs/architecture.md)
- [Phaser.js 마이그레이션 계획](./docs/phaser_migration_plan.md)

---

## ✨ 주요 기능

- ✅ **모바일 친화적**: 반응형 스케일 매니저
- ✅ **AI 전투**: 3단계 난이도
- ✅ **카드 덱 시스템**: 전략적 몬스터 소환
- ✅ **시각 효과**: 크리스탈 투사체, 애니메이션
- ✅ **에너지 시스템**: 자동 충전

---

## 🔧 개발

### 파일 수정 후 배포
```bash
# src/ 폴더에서 개발 후
# 루트로 복사 (배포용)
Copy-Item -Path src/* -Destination ./ -Recurse -Force

# Git 커밋 & 푸시
git add -A
git commit -m "feat: your feature"
git push origin main
```

GitHub Pages는 자동으로 업데이트됩니다 (1~2분 소요).

---

## 📝 라이선스

MIT License

---

## 👨‍💻 개발자

**Gabriel**
- GitHub: [@gabrielwithappy](https://github.com/gabrielwithappy)
