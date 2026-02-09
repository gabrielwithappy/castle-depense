# GitHub Pages 배포 가이드

이 프로젝트는 GitHub Pages를 통해 자동으로 배포됩니다.

## 🌐 배포 URL

**게임 주소**: https://gabrielwithappy.github.io/castle-depense/

## ⚙️ GitHub Pages 설정 방법

1. **GitHub 저장소로 이동**
   - https://github.com/gabrielwithappy/castle-depense

2. **Settings > Pages 메뉴 접속**
   - 저장소 상단의 `Settings` 클릭
   - 왼쪽 메뉴에서 `Pages` 선택

3. **배포 설정**
   - **Source**: Deploy from a branch
   - **Branch**: `main` 
   - **Folder**: `/ (root)`
   - **Save** 버튼 클릭

4. **배포 완료 확인**
   - 1~2분 후 페이지 상단에 배포 URL이 표시됩니다
   - 주소: `https://gabrielwithappy.github.io/castle-depense/`

## 📂 파일 구조

GitHub Pages는 **루트 디렉토리의 `index.html`**을 진입점으로 사용합니다.

```
castle-depense/
├── index.html          ← GitHub Pages 진입점
├── main.js
├── config/
├── entities/
├── scenes/
├── src/                ← 개발용 원본 소스
└── docs/               ← 프로젝트 문서 (배포 X)
```

## 🔄 업데이트 방법

### 1. 소스 코드 수정
```bash
# src/ 폴더에서 개발
cd src/
# 파일 수정...
```

### 2. 루트로 복사 (배포 빌드)
```bash
# 프로젝트 루트로 이동
cd ..

# 변경사항을 루트로 복사
Copy-Item -Path src/index.html -Destination ./index.html -Force
Copy-Item -Path src/main.js -Destination ./main.js -Force
Copy-Item -Path src/config -Destination ./config -Recurse -Force
Copy-Item -Path src/entities -Destination ./entities -Recurse -Force
Copy-Item -Path src/scenes -Destination ./scenes -Recurse -Force
```

### 3. Git에 커밋 & 푸시
```bash
git add -A
git commit -m "Update game"
git push origin main
```

### 4. 자동 배포 확인
- GitHub Pages가 자동으로 감지하고 배포합니다
- 1~2분 후 변경사항이 라이브 사이트에 반영됩니다
- Actions 탭에서 배포 진행 상황을 확인할 수 있습니다

## ⚠️ 주의사항

1. **경로 문제**: GitHub Pages는 상대 경로를 사용해야 합니다
   - ✅ `./config/constants.js`
   - ❌ `/config/constants.js`

2. **캐시 문제**: 브라우저 캐시로 인해 즉시 반영 안 될 수 있음
   - 강력 새로고침: `Ctrl + Shift + R` (Windows) / `Cmd + Shift + R` (Mac)

3. **404 에러**: 배포 직후 1~2분간 404 에러가 발생할 수 있음
   - 기다리면 자동으로 해결됩니다

## 🧪 로컬 테스트

배포 전에 로컬에서 테스트:

```bash
# 루트 디렉토리에서 서버 실행
python -m http.server 8080

# 브라우저에서 접속
# http://localhost:8080
```

## 📱 모바일 테스트

GitHub Pages 배포 후:
- 스마트폰 브라우저에서 URL 접속
- 터치 입력 테스트
- 반응형 레이아웃 확인

## 🔗 유용한 링크

- [GitHub Pages 공식 문서](https://docs.github.com/en/pages)
- [Phaser 공식 사이트](https://phaser.io/)
