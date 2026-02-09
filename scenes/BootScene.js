/**
 * BootScene - 리소스 로딩 씬
 * 게임 시작 전 필요한 에셋을 로드합니다.
 */
export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // 로딩 화면 표시
        this.createLoadingScreen();

        // 현재는 에셋 없이 시작 (나중에 추가)
        // this.load.image('castle', 'assets/images/castle.png');
        // this.load.audio('bgm', 'assets/audio/bgm.mp3');
    }

    create() {
        console.log('BootScene: 리소스 로딩 완료');

        // 메뉴 씬으로 전환
        this.scene.start('MenuScene');
    }

    createLoadingScreen() {
        const { width, height } = this.scale;

        // 로딩 텍스트
        const loadingText = this.add.text(width / 2, height / 2 - 50, '🏰 Castle Defense', {
            fontSize: '48px',
            fontFamily: 'Arial, sans-serif',
            color: '#ffffff'
        });
        loadingText.setOrigin(0.5);

        // 로딩 바 배경
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2, 320, 30);

        // 로딩 바
        const progressBar = this.add.graphics();

        // 로딩 진행률 표시
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x4caf50, 1);
            progressBar.fillRect(width / 2 - 155, height / 2 + 5, 310 * value, 20);
        });

        // 로딩 완료
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
        });
    }
}
