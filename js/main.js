import Game from './Game.js';
import SpawnManager from './managers/SpawnManager.js';
import UIManager from './managers/UIManager.js';

/**
 * 게임 진입점
 */
class Main {
    constructor() {
        this.game = null;
        this.spawnManager = null;
        this.uiManager = null;
        this.selectedLevel = 'normal';
    }

    /**
     * 초기화 및 시작
     */
    init() {
        // 캔버스 요소 가져오기
        const canvas = document.getElementById('game-canvas');
        if (!canvas) {
            console.error('Canvas element not found!');
            return;
        }

        // 게임 인스턴스 생성
        this.game = new Game(canvas);

        // 매니저 인스턴스 생성
        this.spawnManager = new SpawnManager(this.game);
        this.uiManager = new UIManager();

        // 콜백 연결
        this.setupCallbacks();

        // 시작 화면 표시 (게임 시작 대기)
        this.uiManager.showStartScreen();
    }

    /**
     * 콜백 설정
     */
    setupCallbacks() {
        // 게임 업데이트 콜백
        this.game.onUpdate = (data) => {
            this.uiManager.updateGameUI(data);
            this.uiManager.updateDeckUI(this.spawnManager.getDeckInfo());

            // AI 업데이트
            this.spawnManager.update(this.game.deltaTime);
        };

        // 게임 오버 콜백
        this.game.onGameOver = (winner) => {
            this.uiManager.showGameOver(winner);
        };

        // 카드 클릭 콜백
        this.uiManager.onCardClick = (index) => {
            this.spawnManager.spawnPlayerMonster(index);
        };

        // 재시작 콜백
        this.uiManager.onRestart = () => {
            this.uiManager.hideGameOver();
            this.uiManager.showStartScreen();
        };

        // AI 난이도 선택 콜백
        this.uiManager.onLevelSelect = (level) => {
            this.selectedLevel = level;
            this.spawnManager.setAILevel(level);
            this.uiManager.hideStartScreen();
            this.uiManager.createDeckUI(this.spawnManager.getDeckInfo());
            this.startGame();
        };
    }

    /**
     * 게임 시작
     */
    startGame() {
        this.game.start();
    }
}

// DOM 로드 완료 후 실행
window.addEventListener('DOMContentLoaded', () => {
    const main = new Main();
    main.init();

    // 디버깅용 전역 참조
    window.gameInstance = main;
});
