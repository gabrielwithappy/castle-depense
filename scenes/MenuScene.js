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

        // 타이틀
        const title = this.add.text(width / 2, height / 3, '🏰 Castle Defense', {
            fontSize: '64px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);

        // 서브 타이틀
        const subtitle = this.add.text(width / 2, height / 3 + 80, 'AI 난이도를 선택하세요', {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            color: '#aaaaaa'
        });
        subtitle.setOrigin(0.5);

        // 난이도 버튼 생성
        this.createLevelButtons(width, height);
    }

    createLevelButtons(width, height) {
        const levels = [
            { key: 'easy', label: '초급', color: 0x4caf50, y: height / 2 + 30 },
            { key: 'normal', label: '중급', color: 0xff9800, y: height / 2 + 110 },
            { key: 'hard', label: '고급', color: 0xf44336, y: height / 2 + 190 }
        ];

        levels.forEach(level => {
            this.createButton(width / 2, level.y, level.label, level.color, () => {
                this.startGame(level.key);
            });
        });
    }

    createButton(x, y, text, color, callback) {
        // 버튼 배경
        const button = this.add.rectangle(x, y, 200, 60, 0x333333)
            .setStrokeStyle(3, color)
            .setInteractive({ useHandCursor: true });

        // 버튼 텍스트
        const buttonText = this.add.text(x, y, text, {
            fontSize: '28px',
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
