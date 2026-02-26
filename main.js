import { GAME, COLORS } from './config/constants.js';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

/**
 * Phaser 게임 설정
 */
const config = {
    type: Phaser.AUTO,  // WebGL 우선, Canvas 폴백

    // 반응형 스케일 설정 (모바일 지원)
    scale: {
        mode: Phaser.Scale.FIT,              // 화면에 맞추기
        autoCenter: Phaser.Scale.CENTER_BOTH, // 중앙 정렬
        parent: 'game-container',
        width: GAME.WIDTH,
        height: GAME.HEIGHT,
        min: {
            width: GAME.MIN_WIDTH,
            height: GAME.MIN_HEIGHT
        }
    },

    // 물리 엔진 설정
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },  // 중력 없음 (횡스크롤)
            debug: false        // 디버그 모드 끄기
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
    backgroundColor: COLORS.BACKGROUND,

    // 픽셀 아트 스타일 (선택)
    pixelArt: false,

    // 안티앨리어싱
    antialias: true
};

// 게임 인스턴스 생성
const game = new Phaser.Game(config);

// 디버깅용 전역 참조
window.game = game;
