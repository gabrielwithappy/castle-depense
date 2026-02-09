import { GAME, CASTLE, ENERGY, TIMER, COLORS, DEPTH } from '../config/constants.js';
import { AI_CONFIG, PLAYER_DECK } from '../config/aiConfig.js';
import { getMonsterCost } from '../config/monsterData.js';
import Castle from '../entities/Castle.js';
import Monster from '../entities/Monster.js';
import Projectile from '../entities/Projectile.js';

/**
 * GameScene - 메인 게임 플레이 씬
 */
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        // MenuScene에서 전달받은 AI 레벨
        this.aiLevel = data.aiLevel || 'normal';
        this.aiConfig = AI_CONFIG[this.aiLevel];
    }

    create() {
        const { width, height } = this.scale;

        // 레이아웃 상수 정의
        this.UI_PANEL_HEIGHT = 120; // 하단 카드 UI 영역 높이
        this.GAME_FIELD_HEIGHT = height - this.UI_PANEL_HEIGHT; // 게임 필드 높이
        this.GROUND_HEIGHT = 50; // 바닥 높이
        this.GROUND_Y = this.GAME_FIELD_HEIGHT - this.GROUND_HEIGHT; // 바닥 Y 위치 (550)

        // 게임 상태 초기화
        this.initGameState();

        // 배경 및 바닥 생성
        this.createBackground(width, height);

        // 성 생성
        this.createCastles(width, height);

        // 몬스터/투사체 그룹 생성
        this.createGroups();

        // UI 생성
        this.createUI(width, height);

        // 타이머 및 이벤트 설정
        this.setupTimers();

        // 충돌 감지 설정
        this.setupCollisions();

        // 덱 UI 생성 (하단 패널)
        this.createDeckUI(width, height);

        console.log(`GameScene: 게임 시작 (AI: ${this.aiLevel})`);
    }

    initGameState() {
        this.gameOver = false;
        this.winner = null;

        // 에너지
        this.playerEnergy = ENERGY.INIT;
        this.aiEnergy = ENERGY.INIT;

        // 타이머
        this.remainingTime = TIMER.TOTAL_TIME;

        // 플레이어 덱
        this.playerDeck = [...PLAYER_DECK];
    }

    createBackground(width, height) {
        // 게임 필드 배경 (상단)
        this.add.rectangle(width / 2, this.GAME_FIELD_HEIGHT / 2, width, this.GAME_FIELD_HEIGHT, COLORS.BACKGROUND)
            .setDepth(DEPTH.BACKGROUND);

        // 바닥 (게임 필드 하단)
        this.add.rectangle(width / 2, this.GROUND_Y + this.GROUND_HEIGHT / 2, width, this.GROUND_HEIGHT, COLORS.GROUND)
            .setDepth(DEPTH.GROUND);

        // 카드 UI 패널 배경 (하단)
        this.add.rectangle(width / 2, this.GAME_FIELD_HEIGHT + this.UI_PANEL_HEIGHT / 2, width, this.UI_PANEL_HEIGHT, 0x0d0d1a)
            .setDepth(DEPTH.UI - 1);

        // 패널 상단 구분선
        this.add.rectangle(width / 2, this.GAME_FIELD_HEIGHT, width, 3, 0x444466)
            .setDepth(DEPTH.UI);
    }

    createCastles(width, height) {
        // 성은 게임 필드 바닥에 배치
        const castleY = this.GROUND_Y - CASTLE.HEIGHT;

        // 플레이어 성 (왼쪽)
        this.playerCastle = new Castle(this, 60, castleY, 'player');
        this.add.existing(this.playerCastle);

        // AI 성 (오른쪽)
        this.aiCastle = new Castle(this, width - 60 - CASTLE.WIDTH, castleY, 'ai');
        this.add.existing(this.aiCastle);
    }

    createGroups() {
        // 몬스터 그룹 (물리 적용)
        this.playerMonsters = this.physics.add.group({
            classType: Monster,
            runChildUpdate: true
        });

        this.aiMonsters = this.physics.add.group({
            classType: Monster,
            runChildUpdate: true
        });

        // 투사체 그룹
        this.projectiles = this.physics.add.group({
            runChildUpdate: true
        });
    }

    createUI(width, height) {
        const padding = 20;
        const fontSize = '24px';
        const fontStyle = { fontSize, fontFamily: 'Arial', color: '#ffffff' };

        // 플레이어 HP
        this.playerHpText = this.add.text(padding, padding, `HP: ${this.playerCastle.hp}`, fontStyle)
            .setDepth(DEPTH.UI);

        // 플레이어 에너지
        this.energyText = this.add.text(padding, padding + 30, `⚡ ${Math.floor(this.playerEnergy)}`, fontStyle)
            .setDepth(DEPTH.UI);

        // 타이머 (중앙)
        this.timerText = this.add.text(width / 2, padding, this.formatTime(this.remainingTime), {
            ...fontStyle,
            fontSize: '32px'
        }).setOrigin(0.5, 0).setDepth(DEPTH.UI);

        // AI HP
        this.aiHpText = this.add.text(width - padding, padding, `HP: ${this.aiCastle.hp}`, fontStyle)
            .setOrigin(1, 0).setDepth(DEPTH.UI);
    }

    createDeckUI(width, height) {
        // 카드 UI는 하단 패널 중앙에 배치
        const deckY = this.GAME_FIELD_HEIGHT + this.UI_PANEL_HEIGHT / 2;
        const cardWidth = 70;
        const cardHeight = 90;
        const gap = 10;
        const totalWidth = this.playerDeck.length * (cardWidth + gap) - gap;
        const startX = (width - totalWidth) / 2;

        this.deckButtons = [];

        const gradeEmojis = {
            common: '👻',
            rare: '👽',
            epic: '🤖',
            legend: '🐲'
        };

        this.playerDeck.forEach((slot, index) => {
            const x = startX + index * (cardWidth + gap) + cardWidth / 2;
            const cost = getMonsterCost(slot.grade);

            // 카드 배경
            const card = this.add.rectangle(x, deckY, cardWidth, cardHeight, 0x444444)
                .setStrokeStyle(2, 0x666666)
                .setInteractive({ useHandCursor: true })
                .setDepth(DEPTH.UI);

            // 이모지
            const emoji = this.add.text(x, deckY - 15, gradeEmojis[slot.grade] || '❓', {
                fontSize: '28px'
            }).setOrigin(0.5).setDepth(DEPTH.UI);

            // 비용
            const costText = this.add.text(x, deckY + 25, `${cost}⚡`, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }).setOrigin(0.5).setDepth(DEPTH.UI);

            // 클릭 이벤트
            card.on('pointerdown', () => {
                this.spawnPlayerMonster(index);
            });

            // 호버 효과
            card.on('pointerover', () => card.setFillStyle(0x555555));
            card.on('pointerout', () => card.setFillStyle(0x444444));

            this.deckButtons.push({ card, emoji, costText, slot });
        });
    }

    setupTimers() {
        // 1초마다 타이머 업데이트
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // 에너지 재생 (100ms마다)
        this.time.addEvent({
            delay: 100,
            callback: this.updateEnergy,
            callbackScope: this,
            loop: true
        });

        // AI 자동 소환
        this.time.addEvent({
            delay: this.aiConfig.spawnCooldown,
            callback: this.spawnAIMonster,
            callbackScope: this,
            loop: true
        });

        // 성 크리스탈 공격
        this.time.addEvent({
            delay: CASTLE.ATTACK_COOLDOWN,
            callback: this.castleAttacks,
            callbackScope: this,
            loop: true
        });
    }

    setupCollisions() {
        // 플레이어 몬스터 vs AI 몬스터
        this.physics.add.overlap(
            this.playerMonsters,
            this.aiMonsters,
            this.onMonsterCollision,
            null,
            this
        );
    }

    update(time, delta) {
        if (this.gameOver) return;

        // UI 업데이트
        this.updateUI();

        // 덱 UI 업데이트 (비용 체크)
        this.updateDeckUI();

        // 승리 조건 체크
        this.checkWinCondition();
    }

    updateTimer() {
        if (this.gameOver) return;

        this.remainingTime--;

        if (this.remainingTime <= 0) {
            this.endGame('time');
        }
    }

    updateEnergy() {
        if (this.gameOver) return;

        const isBoostTime = this.remainingTime <= ENERGY.BOOST_TIME;
        const rate = isBoostTime ? ENERGY.BOOST_RATE : ENERGY.REGEN_RATE;

        // 0.1초마다 호출되므로 rate / 10
        this.playerEnergy = Math.min(this.playerEnergy + rate / 10, ENERGY.MAX);
        this.aiEnergy = Math.min(this.aiEnergy + rate / 10, ENERGY.MAX);
    }

    updateUI() {
        this.playerHpText.setText(`HP: ${Math.max(0, this.playerCastle.hp)}`);
        this.aiHpText.setText(`HP: ${Math.max(0, this.aiCastle.hp)}`);
        this.energyText.setText(`⚡ ${Math.floor(this.playerEnergy)}`);
        this.timerText.setText(this.formatTime(this.remainingTime));

        // 부스트 타임에 타이머 색상 변경
        if (this.remainingTime <= ENERGY.BOOST_TIME) {
            this.timerText.setColor('#ff6600');
        }
    }

    updateDeckUI() {
        this.deckButtons.forEach(({ card, slot }) => {
            const cost = getMonsterCost(slot.grade);
            const affordable = this.playerEnergy >= cost;

            card.setAlpha(affordable ? 1 : 0.5);
        });
    }

    formatTime(seconds) {
        const mins = Math.floor(Math.max(0, seconds) / 60);
        const secs = Math.max(0, seconds) % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    spawnPlayerMonster(slotIndex) {
        if (this.gameOver) return;

        const slot = this.playerDeck[slotIndex];
        if (!slot) return;

        const cost = getMonsterCost(slot.grade);
        if (this.playerEnergy < cost) return;

        this.playerEnergy -= cost;

        // 몬스터는 게임 필드 바닥에 소환
        const x = this.playerCastle.x + CASTLE.WIDTH + 20;
        const y = this.GROUND_Y;

        const monster = new Monster(this, x, y, 'player', slot.grade, slot.type);
        this.playerMonsters.add(monster);
        this.add.existing(monster);

        console.log(`플레이어 몬스터 소환: ${slot.grade} ${slot.type}`);
    }

    spawnAIMonster() {
        if (this.gameOver) return;

        const availableGrades = this.aiConfig.availableGrades;

        // 비용 지불 가능한 등급 필터
        const affordable = availableGrades.filter(grade => {
            return this.aiEnergy >= getMonsterCost(grade);
        });

        if (affordable.length === 0) return;

        // 랜덤 등급 선택
        const grade = affordable[Math.floor(Math.random() * affordable.length)];
        const types = ['attacker', 'defender', 'speeder'];
        const type = types[Math.floor(Math.random() * types.length)];

        const cost = getMonsterCost(grade);
        this.aiEnergy -= cost;

        // AI 몬스터도 게임 필드 바닥에 소환
        const x = this.aiCastle.x - 20;
        const y = this.GROUND_Y;

        const monster = new Monster(this, x, y, 'ai', grade, type);
        this.aiMonsters.add(monster);
        this.add.existing(monster);

        console.log(`AI 몬스터 소환: ${grade} ${type}`);
    }

    castleAttacks() {
        if (this.gameOver) return;

        // 플레이어 성 → AI 몬스터 공격
        this.castleAttack(this.playerCastle, this.aiMonsters);

        // AI 성 → 플레이어 몬스터 공격
        this.castleAttack(this.aiCastle, this.playerMonsters);
    }

    castleAttack(castle, enemies) {
        if (castle.hp <= 0) return;

        const children = enemies.getChildren();
        if (children.length === 0) return;

        // 가장 가까운 적 찾기
        let closest = null;
        let closestDist = CASTLE.ATTACK_RANGE;

        children.forEach(enemy => {
            if (enemy.hp <= 0) return;

            const dist = Math.abs(enemy.x - castle.x);
            if (dist < closestDist) {
                closestDist = dist;
                closest = enemy;
            }
        });

        if (closest) {
            // 투사체 발사 위치 (성 상단 중앙)
            const startX = castle.x + castle.width / 2;
            const startY = castle.y - 10;

            // 타격 위치 (적 중앙)
            const targetX = closest.x;
            const targetY = closest.y - closest.height / 2;

            // 투사체 생성
            const projectile = new Projectile(
                this,
                startX,
                startY,
                targetX,
                targetY,
                castle.team,
                CASTLE.ATTACK_DAMAGE
            );
            this.add.existing(projectile);
            this.projectiles.add(projectile);

            // 데미지는 투사체 도달 시 적용 (지연 시간 계산)
            const dist = Math.sqrt(
                Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2)
            );
            const travelTime = (dist / 350) * 1000; // 350 = projectile speed

            this.time.delayedCall(travelTime, () => {
                if (closest && closest.hp > 0 && !closest.isDead) {
                    closest.takeDamage(CASTLE.ATTACK_DAMAGE);
                }
            });

            console.log(`${castle.team} 성이 크리스탈 발사!`);
        }
    }

    onMonsterCollision(playerMonster, aiMonster) {
        // 서로 공격
        playerMonster.attackTarget(aiMonster);
        aiMonster.attackTarget(playerMonster);
    }

    checkWinCondition() {
        if (this.aiCastle.hp <= 0) {
            this.endGame('player');
        } else if (this.playerCastle.hp <= 0) {
            this.endGame('ai');
        }
    }

    endGame(winner) {
        if (this.gameOver) return;

        this.gameOver = true;
        this.winner = winner;

        console.log(`게임 종료: ${winner} 승리!`);

        // 잠시 후 GameOverScene으로 전환
        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene', {
                winner: this.winner,
                playerHp: Math.max(0, this.playerCastle.hp),
                aiHp: Math.max(0, this.aiCastle.hp),
                timeRemaining: this.remainingTime
            });
        });
    }
}

