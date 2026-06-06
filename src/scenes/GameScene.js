import { GAME, CASTLE, ENERGY, TIMER, COLORS, DEPTH } from '../config/constants.js';
import { AI_CONFIG, PLAYER_DECK } from '../config/aiConfig.js';
import { calculateMonsterStats, getMonsterCost } from '../config/monsterData.js';
import Castle from '../entities/Castle.js';
import Monster from '../entities/Monster.js';
import Projectile from '../entities/Projectile.js';

/**
 * GameScene - ë©”ì¸ ê²Œì„ ?Œë ˆ????
 */
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        // MenuScene?ì„œ ?„ë‹¬ë°›ì? AI ?ˆë²¨
        this.aiLevel = data.aiLevel || 'normal';
        this.aiConfig = AI_CONFIG[this.aiLevel];
    }

    create() {
        const { width, height } = this.scale;

        // ?ˆì´?„ì›ƒ ?ìˆ˜ ?•ì˜
        this.UI_PANEL_HEIGHT = 120; // ?˜ë‹¨ ì¹´ë“œ UI ?ì—­ ?’ì´
        this.GAME_FIELD_HEIGHT = height - this.UI_PANEL_HEIGHT; // ê²Œì„ ?„ë“œ ?’ì´
        this.GROUND_HEIGHT = 50; // ë°”ë‹¥ ?’ì´
        this.GROUND_Y = this.GAME_FIELD_HEIGHT - this.GROUND_HEIGHT; // ë°”ë‹¥ Y ?„ì¹˜ (550)

        // ê²Œì„ ?íƒœ ì´ˆê¸°??
        this.initGameState();

        // ë°°ê²½ ë°?ë°”ë‹¥ ?ì„±
        this.createBackground(width, height);

        // ???ì„±
        this.createCastles(width, height);

        // ëª¬ìŠ¤???¬ì‚¬ì²?ê·¸ë£¹ ?ì„±
        this.createGroups();

        // UI ?ì„±
        this.createUI(width, height);

        // ?€?´ë¨¸ ë°??´ë²¤???¤ì •
        this.setupTimers();

        // ì¶©ëŒ ê°ì? ?¤ì •
        this.setupCollisions();

        // ??UI ?ì„± (?˜ë‹¨ ?¨ë„)
        this.createDeckUI(width, height);

        console.log(`GameScene: ê²Œì„ ?œì‘ (AI: ${this.aiLevel})`);
    }

    initGameState() {
        this.gameOver = false;
        this.winner = null;

        // ?ë„ˆì§€
        this.playerEnergy = ENERGY.INIT;
        this.aiEnergy = ENERGY.INIT;
        this.maxEnergy = ENERGY.MAX;

        // ?€?´ë¨¸
        this.remainingTime = TIMER.TOTAL_TIME;

        // ?Œë ˆ?´ì–´ ??
        this.playerDeck = [...PLAYER_DECK];

        // ë°°í??„ë“œ ëª¬ìŠ¤????ì¶”ì  (?”êµ¬?¬í•­: ?™ì‹œ??7ê°œê¹Œì§€ë§?ì¡´ì¬ ê°€??
        this.playerMonstersOnField = 0;
        this.maxPlayerMonsters = 7;

        // AI ë°°í??„ë“œ ëª¬ìŠ¤????ì¶”ì 
        this.aiMonstersOnField = 0;
        this.maxAiMonsters = 7;
    }

    createBackground(width, height) {
        // ê²Œì„ ?„ë“œ ë°°ê²½ (?ë‹¨)
        this.add.rectangle(width / 2, this.GAME_FIELD_HEIGHT / 2, width, this.GAME_FIELD_HEIGHT, COLORS.BACKGROUND)
            .setDepth(DEPTH.BACKGROUND);

        // ë°”ë‹¥ (ê²Œì„ ?„ë“œ ?˜ë‹¨)
        this.add.rectangle(width / 2, this.GROUND_Y + this.GROUND_HEIGHT / 2, width, this.GROUND_HEIGHT, COLORS.GROUND)
            .setDepth(DEPTH.GROUND);

        // ì¹´ë“œ UI ?¨ë„ ë°°ê²½ (?˜ë‹¨)
        this.add.rectangle(width / 2, this.GAME_FIELD_HEIGHT + this.UI_PANEL_HEIGHT / 2, width, this.UI_PANEL_HEIGHT, 0x0d0d1a)
            .setDepth(DEPTH.UI - 1);

        // ?¨ë„ ?ë‹¨ êµ¬ë¶„??
        this.add.rectangle(width / 2, this.GAME_FIELD_HEIGHT, width, 3, 0x444466)
            .setDepth(DEPTH.UI);
    }

    createCastles(width, height) {
        // ?±ì? ê²Œì„ ?„ë“œ ë°”ë‹¥??ë°°ì¹˜
        const castleY = this.GROUND_Y - CASTLE.HEIGHT;

        // ?Œë ˆ?´ì–´ ??(?¼ìª½)
        this.playerCastle = new Castle(this, 60, castleY, 'player');
        this.add.existing(this.playerCastle);

        // AI ??(?¤ë¥¸ìª?
        this.aiCastle = new Castle(this, width - 60 - CASTLE.WIDTH, castleY, 'ai');
        this.add.existing(this.aiCastle);
    }

    createGroups() {
        // ëª¬ìŠ¤??ê·¸ë£¹ (ë¬¼ë¦¬ ?ìš©)
        this.playerMonsters = this.physics.add.group({
            classType: Monster,
            runChildUpdate: true
        });

        this.aiMonsters = this.physics.add.group({
            classType: Monster,
            runChildUpdate: true
        });

        // ?¬ì‚¬ì²?ê·¸ë£¹
        this.projectiles = this.physics.add.group({
            runChildUpdate: true
        });
    }

    createUI(width, height) {
        const padding = 20;
        const fontSize = '24px';
        const fontStyle = { fontSize, fontFamily: 'Arial', color: '#ffffff' };

        // ?Œë ˆ?´ì–´ HP
        this.playerHpText = this.add.text(padding, padding, `HP: ${this.playerCastle.hp}`, fontStyle)
            .setDepth(DEPTH.UI);

        // ?Œë ˆ?´ì–´ ?ë„ˆì§€
        this.energyText = this.add.text(padding, padding + 30, `??${Math.floor(this.playerEnergy)}`, fontStyle)
            .setDepth(DEPTH.UI);

        // ?€?´ë¨¸ (ì¤‘ì•™)
        this.timerText = this.add.text(width / 2, padding, this.formatTime(this.remainingTime), {
            ...fontStyle,
            fontSize: '32px'
        }).setOrigin(0.5, 0).setDepth(DEPTH.UI);

        // AI HP
        this.aiHpText = this.add.text(width - padding, padding, `HP: ${this.aiCastle.hp}`, fontStyle)
            .setOrigin(1, 0).setDepth(DEPTH.UI);
    }

    createDeckUI(width, height) {
        // ì¹´ë“œ UI???˜ë‹¨ ?¨ë„ ì¤‘ì•™??ë°°ì¹˜
        const deckY = this.GAME_FIELD_HEIGHT + this.UI_PANEL_HEIGHT / 2;
        const cardWidth = 70;
        const cardHeight = 90;
        const gap = 10;
        const totalWidth = this.playerDeck.length * (cardWidth + gap) - gap;
        const startX = (width - totalWidth) / 2;

        this.deckButtons = [];

        const gradeEmojis = {
            common: '?‘»',
            rare: '?‘½',
            epic: '?¤–',
            legend: '?²'
        };

        const typeSymbols = {
            attacker: '?”ï¸',
            defender: '?›¡ï¸?,
            speeder: '??
        };

        this.playerDeck.forEach((slot, index) => {
            const x = startX + index * (cardWidth + gap) + cardWidth / 2;
            const cost = getMonsterCost(slot.grade);

            // ì¹´ë“œ ë°°ê²½ (?€ ?‰ìƒ)
            const cardBgColor = 0x2a3a5a;
            const card = this.add.rectangle(x, deckY, cardWidth, cardHeight, cardBgColor)
                .setStrokeStyle(2, 0x00DDFF)
                .setInteractive({ useHandCursor: true })
                .setDepth(DEPTH.UI);

            // ?±ê¸‰ ?´ëª¨ì§€
            const emoji = this.add.text(x, deckY - 20, gradeEmojis[slot.grade] || '??, {
                fontSize: '24px'
            }).setOrigin(0.5).setDepth(DEPTH.UI);

            // ?€???¬ë³¼
            const typeSymbol = this.add.text(x, deckY - 2, typeSymbols[slot.type] || '??, {
                fontSize: '16px'
            }).setOrigin(0.5).setDepth(DEPTH.UI);

            // ë¹„ìš©
            const costText = this.add.text(x, deckY + 22, `${cost}??, {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#88DDFF'
            }).setOrigin(0.5).setDepth(DEPTH.UI);

            // ?´ë¦­ ?´ë²¤??
            card.on('pointerdown', () => {
                console.log(`[createDeckUI] ì¹´ë“œ ?´ë¦­: ?¬ë¡¯ ${index}, ?±ê¸‰: ${slot.grade}, ?€?? ${slot.type}`);
                this.spawnPlayerMonster(index);
            });

            // ?¸ë²„ ?¨ê³¼
            card.on('pointerover', () => {
                card.setFillStyle(0x3a4a7a);
                card.setStrokeStyle(3, 0x00FFFF);
            });
            card.on('pointerout', () => {
                card.setFillStyle(cardBgColor);
                card.setStrokeStyle(2, 0x00DDFF);
            });

            this.deckButtons.push({ card, emoji, costText, typeSymbol, slot });
        });
    }

    setupTimers() {
        // 1ì´ˆë§ˆ???€?´ë¨¸ ?…ë°?´íŠ¸
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // ?ë„ˆì§€ ?¬ìƒ (100msë§ˆë‹¤)
        this.time.addEvent({
            delay: 100,
            callback: this.updateEnergy,
            callbackScope: this,
            loop: true
        });

        // AI ?ë™ ?Œí™˜
        this.time.addEvent({
            delay: this.aiConfig.spawnCooldown,
            callback: this.spawnAIMonster,
            callbackScope: this,
            loop: true
        });

        // ???¬ë¦¬?¤íƒˆ ê³µê²©
        this.time.addEvent({
            delay: CASTLE.ATTACK_COOLDOWN,
            callback: this.castleAttacks,
            callbackScope: this,
            loop: true
        });
    }

    setupCollisions() {
        // ?Œë ˆ?´ì–´ ëª¬ìŠ¤??vs AI ëª¬ìŠ¤??
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

        // UI ?…ë°?´íŠ¸
        this.updateUI();

        // ??UI ?…ë°?´íŠ¸ (ë¹„ìš© ì²´í¬)
        this.updateDeckUI();

        // ?¹ë¦¬ ì¡°ê±´ ì²´í¬
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

        // 0.1ì´ˆë§ˆ???¸ì¶œ?˜ë?ë¡?rate / 10
        this.playerEnergy = Math.min(this.playerEnergy + rate / 10, ENERGY.MAX);
        this.aiEnergy = Math.min(this.aiEnergy + rate / 10, ENERGY.MAX);
    }

    updateUI() {
        this.playerHpText.setText(`HP: ${Math.max(0, this.playerCastle.hp)}`);
        this.aiHpText.setText(`HP: ${Math.max(0, this.aiCastle.hp)}`);
        this.energyText.setText(`??${Math.floor(this.playerEnergy)}`);
        this.timerText.setText(this.formatTime(this.remainingTime));

        // ë¶€?¤íŠ¸ ?€?„ì— ?€?´ë¨¸ ?‰ìƒ ë³€ê²?
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

    getMonsterSpawnY(grade, type) {
        const monster = new Monster(this, 0, 0, 'player', grade, type);
        this.add.existing(monster);
        const spawnY = this.GROUND_Y - (monster.getBounds().bottom - monster.y);
        monster.destroy();
        return spawnY;
    }

    alignMonsterToGround(monster) {
        const contactOffset = monster.getBounds().bottom - monster.y;
        monster.y = this.GROUND_Y - contactOffset;
    }

    spawnPlayerMonster(slotIndex) {
        if (this.gameOver) return;

        const slot = this.playerDeck[slotIndex];
        if (!slot) return;

        if (this.playerMonstersOnField >= this.maxPlayerMonsters) return;

        const cost = getMonsterCost(slot.grade);
        if (this.playerEnergy < cost) return;

        this.playerEnergy -= cost;
        this.playerMonstersOnField++;

        const x = this.playerCastle.x + CASTLE.WIDTH + 20;
        const monster = new Monster(this, x, 0, 'player', slot.grade, slot.type);

        this.add.existing(monster);
        this.alignMonsterToGround(monster);
        this.playerMonsters.add(monster);
    }

    spawnAIMonster() {
        if (this.gameOver) return;

        const availableGrades = this.aiConfig.availableGrades;
        const affordable = availableGrades.filter((grade) => this.aiEnergy >= getMonsterCost(grade));
        if (affordable.length === 0) return;

        const grade = affordable[Math.floor(Math.random() * affordable.length)];

        let type;
        if (grade === 'legend') {
            type = 'speeder';
        } else if (grade === 'epic') {
            type = Math.random() > 0.5 ? 'defender' : 'attacker';
        } else {
            type = Math.random() > 0.3 ? 'attacker' : 'defender';
        }

        this.aiEnergy -= getMonsterCost(grade);

        const x = this.aiCastle.x - 20;
        const monster = new Monster(this, x, 0, 'ai', grade, type);

        this.add.existing(monster);
        this.alignMonsterToGround(monster);
        this.aiMonsters.add(monster);
    }

    onMonsterDeath(team) {
        // ëª¬ìŠ¤???¬ë§ ??ë°°í??„ë“œ ì¹´ìš´??ê°ì†Œ
        if (team === 'player') {
            const before = this.playerMonstersOnField;
            this.playerMonstersOnField = Math.max(0, this.playerMonstersOnField - 1);
            console.log(`[GameScene] ?Œë ˆ?´ì–´ ëª¬ìŠ¤???¬ë§ - ?„ë“œ: ${before} ??${this.playerMonstersOnField} (ìµœë?: ${this.maxPlayerMonsters})`);
        } else if (team === 'ai') {
            const before = this.aiMonstersOnField;
            this.aiMonstersOnField = Math.max(0, this.aiMonstersOnField - 1);
            console.log(`[GameScene] AI ëª¬ìŠ¤???¬ë§ - ?„ë“œ: ${before} ??${this.aiMonstersOnField} (ìµœë?: ${this.maxAiMonsters})`);
        }
    }

    castleAttacks() {
        if (this.gameOver) return;

        // ?Œë ˆ?´ì–´ ????AI ëª¬ìŠ¤??ê³µê²©
        this.castleAttack(this.playerCastle, this.aiMonsters);

        // AI ?????Œë ˆ?´ì–´ ëª¬ìŠ¤??ê³µê²©
        this.castleAttack(this.aiCastle, this.playerMonsters);
    }

    castleAttack(castle, enemies) {
        if (castle.hp <= 0) return;

        const children = enemies.getChildren();
        if (children.length === 0) return;

        // ê°€??ê°€ê¹Œìš´ ??ì°¾ê¸°
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
            // ?¬ì‚¬ì²?ë°œì‚¬ ?„ì¹˜ (???ë‹¨ ì¤‘ì•™)
            const startX = castle.x + castle.width / 2;
            const startY = castle.y - 10;

            // ?€ê²??„ì¹˜ (??ì¤‘ì•™)
            const targetX = closest.x;
            const targetY = closest.y - closest.height / 2;

            // ?¬ì‚¬ì²??ì„±
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

            // ?°ë?ì§€???¬ì‚¬ì²??„ë‹¬ ???ìš© (ì§€???œê°„ ê³„ì‚°)
            const dist = Math.sqrt(
                Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2)
            );
            const travelTime = ((dist / 350) * 1000) + projectile.chargeDuration; // 350 = projectile speed

            this.time.delayedCall(travelTime, () => {
                if (closest && closest.hp > 0 && !closest.isDead) {
                    closest.takeDamage(CASTLE.ATTACK_DAMAGE);
                }
            });

            console.log(`${castle.team} ?±ì´ ?¬ë¦¬?¤íƒˆ ë°œì‚¬!`);
        }
    }

    onMonsterCollision(playerMonster, aiMonster) {
        // ?œë¡œ ê³µê²©
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

        console.log(`ê²Œì„ ì¢…ë£Œ: ${winner} ?¹ë¦¬!`);

        // ? ì‹œ ??GameOverScene?¼ë¡œ ?„í™˜
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


