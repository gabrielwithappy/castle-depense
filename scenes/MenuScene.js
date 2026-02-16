import { AI_CONFIG } from '../config/aiConfig.js';

/**
 * MenuScene - 시작 화면 및 AI 레벨 선택
 */
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const { width, height } = this.scale;

        // 배경
        this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

        // 반응형 폰트 크기 계산 (화면 크기 기준)
        const titleFontSize = Math.max(32, Math.min(64, width * 0.05));
        const subtitleFontSize = Math.max(16, Math.min(24, width * 0.019));

        // 타이틀
        const title = this.add.text(width / 2, height * 0.25, '🏰 Castle Defense', {
            fontSize: `${titleFontSize}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);

        // 서브 타이틀
        const subtitle = this.add.text(width / 2, height * 0.25 + titleFontSize + 20, 'AI 난이도를 선택하세요', {
            fontSize: `${subtitleFontSize}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#aaaaaa'
        });
        subtitle.setOrigin(0.5);

        // 난이도 버튼 생성
        this.createLevelButtons(width, height);
    }

    createLevelButtons(width, height) {
        // 반응형 버튼 크기 계산 (모바일 최소 터치 영역 44px 보장)
        const buttonWidth = Math.max(200, Math.min(300, width * 0.4));
        const buttonHeight = Math.max(60, Math.min(80, height * 0.1));
        const gap = Math.max(15, Math.min(30, height * 0.03));

        // 세로 모드 감지 (높이가 너비보다 큰 경우)
        const isPortrait = height > width;
        const startY = isPortrait ? height * 0.45 : height * 0.5;

        const levels = [
            { key: 'easy', label: '초급', color: 0x4caf50, offset: 0 },
            { key: 'normal', label: '중급', color: 0xff9800, offset: 1 },
            { key: 'hard', label: '고급', color: 0xf44336, offset: 2 }
        ];

        levels.forEach(level => {
            const y = startY + level.offset * (buttonHeight + gap);
            this.createButton(width / 2, y, level.label, level.color, buttonWidth, buttonHeight, () => {
                this.startGame(level.key);
            });
        });
    }

    createButton(x, y, text, color, buttonWidth, buttonHeight, callback) {
        // 반응형 폰트 크기 (버튼 높이 기준)
        const fontSize = Math.max(20, Math.min(28, buttonHeight * 0.4));

        // 버튼 배경
        const button = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x333333)
            .setStrokeStyle(3, color)
            .setInteractive({ useHandCursor: true });

        // 버튼 텍스트
        const buttonText = this.add.text(x, y, text, {
            fontSize: `${fontSize}px`,
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff'
        });
        buttonText.setOrigin(0.5);

        // 호버 효과
        button.on('pointerover', () => {
            button.setFillStyle(color);
        });

        button.on('pointerout', () => {
            button.setFillStyle(0x333333);
        });

        // 클릭 이벤트
        button.on('pointerdown', () => {
            button.setScale(0.95);
        });

        button.on('pointerup', () => {
            button.setScale(1);
            callback();
        });

        return button;
    }

    startGame(level) {
        console.log(`MenuScene: AI 레벨 선택 - ${level}`);

        // GameScene으로 전환하면서 AI 레벨 전달
        this.scene.start('GameScene', { aiLevel: level });
    }
}
