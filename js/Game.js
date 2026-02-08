import Castle from './entities/Castle.js';
import Monster from './entities/Monster.js';
import Projectile from './entities/Projectile.js';
import { CONSTANTS } from './constants.js';
import { checkCollision } from './utils.js';

/**
 * Game 클래스 - 메인 게임 루프 및 상태 관리
 */
export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // 캔버스 크기 설정
        this.canvas.width = CONSTANTS.GAME.WIDTH;
        this.canvas.height = CONSTANTS.GAME.HEIGHT;

        // 게임 상태
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;
        this.winner = null;

        // 게임 타이머 (초 단위)
        this.totalTime = 180; // 3분
        this.remainingTime = this.totalTime;

        // 에너지 시스템
        this.playerEnergy = CONSTANTS.ENERGY.INIT;
        this.aiEnergy = CONSTANTS.ENERGY.INIT;
        this.energyTimer = 0;

        // 엔티티 컨테이너
        this.playerCastle = null;
        this.aiCastle = null;
        this.monsters = [];
        this.projectiles = [];

        // 시간 관리
        this.lastTime = 0;
        this.deltaTime = 0;

        // 콜백
        this.onGameOver = null;
        this.onUpdate = null;
    }

    /**
     * 게임 초기화
     */
    init() {
        // 플레이어 성 (왼쪽)
        this.playerCastle = new Castle(20, this.canvas.height - 170, 'player');

        // AI 성 (오른쪽)
        this.aiCastle = new Castle(this.canvas.width - 100, this.canvas.height - 170, 'ai');

        // 초기화
        this.monsters = [];
        this.projectiles = [];
        this.playerEnergy = CONSTANTS.ENERGY.INIT;
        this.aiEnergy = CONSTANTS.ENERGY.INIT;
        this.remainingTime = this.totalTime;
        this.gameOver = false;
        this.winner = null;
    }

    /**
     * 게임 시작
     */
    start() {
        this.init();
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    /**
     * 게임 일시정지
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * 게임 재개
     */
    resume() {
        this.isPaused = false;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    /**
     * 메인 게임 루프
     */
    gameLoop() {
        if (!this.isRunning || this.isPaused) return;

        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastTime) / 1000; // 초 단위
        this.lastTime = currentTime;

        this.update(this.deltaTime);
        this.draw();

        if (!this.gameOver) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    /**
     * 게임 상태 업데이트
     */
    update(dt) {
        if (this.gameOver) return;

        // 타이머 업데이트
        this.remainingTime -= dt;
        if (this.remainingTime <= 0) {
            this.remainingTime = 0;
            this.endGame('time');
            return;
        }

        // 에너지 재생
        this.updateEnergy(dt);

        // 성 업데이트 및 공격
        this.updateCastles(dt);

        // 몬스터 업데이트
        this.updateMonsters(dt);

        // 투사체 업데이트
        this.updateProjectiles(dt);

        // 충돌 체크
        this.checkCollisions();

        // 죽은 엔티티 제거
        this.removeDeadEntities();

        // 승리 조건 체크
        this.checkWinCondition();

        // UI 업데이트 콜백
        if (this.onUpdate) {
            this.onUpdate({
                playerHp: this.playerCastle.hp,
                aiHp: this.aiCastle.hp,
                playerEnergy: Math.floor(this.playerEnergy),
                time: Math.ceil(this.remainingTime)
            });
        }
    }

    /**
     * 에너지 재생 업데이트
     */
    updateEnergy(dt) {
        const isBoostTime = this.remainingTime <= 30;
        const rate = isBoostTime ? CONSTANTS.ENERGY.BOOST_RATE : CONSTANTS.ENERGY.REGEN_RATE;

        this.playerEnergy = Math.min(this.playerEnergy + rate * dt, CONSTANTS.ENERGY.MAX);
        this.aiEnergy = Math.min(this.aiEnergy + rate * dt, CONSTANTS.ENERGY.MAX);
    }

    /**
     * 성 업데이트 (크리스탈 공격 포함)
     */
    updateCastles(dt) {
        this.playerCastle.update(dt);
        this.aiCastle.update(dt);

        // 플레이어 성의 크리스탈 공격
        this.castleAttack(this.playerCastle, 'ai');

        // AI 성의 크리스탈 공격
        this.castleAttack(this.aiCastle, 'player');
    }

    /**
     * 성 크리스탈 공격 로직
     */
    castleAttack(castle, targetTeam) {
        if (!castle.canAttack()) return;

        // 공격 범위 내 적 찾기
        const enemies = this.monsters.filter(m => m.team === targetTeam && !m.isDead);
        for (const enemy of enemies) {
            if (castle.isInRange(enemy)) {
                const damage = castle.attack();
                if (damage > 0) {
                    // 투사체 생성
                    const projX = castle.x + castle.width / 2;
                    const projY = castle.y + 20;
                    const targetX = enemy.x + enemy.width / 2;
                    const targetY = enemy.y + enemy.height / 2;

                    const proj = new Projectile(projX, projY, targetX, targetY, damage, 400, castle.team);
                    this.projectiles.push(proj);
                }
                break; // 한 번에 하나만 공격
            }
        }
    }

    /**
     * 몬스터 업데이트
     */
    updateMonsters(dt) {
        for (const monster of this.monsters) {
            // 적 몬스터 및 적 성 찾기
            const targetTeam = monster.team === 'player' ? 'ai' : 'player';
            const enemies = this.monsters.filter(m => m.team === targetTeam && !m.isDead);
            const enemyCastle = targetTeam === 'ai' ? this.aiCastle : this.playerCastle;

            // 적 성도 타겟에 포함
            const allEnemies = [...enemies, enemyCastle];

            monster.update(dt, allEnemies);
        }
    }

    /**
     * 투사체 업데이트
     */
    updateProjectiles(dt) {
        for (const proj of this.projectiles) {
            proj.update(dt);
        }
    }

    /**
     * 충돌 체크
     */
    checkCollisions() {
        // 투사체와 몬스터 충돌
        for (const proj of this.projectiles) {
            if (proj.isDead) continue;

            const targetTeam = proj.team === 'player' ? 'ai' : 'player';
            const enemies = this.monsters.filter(m => m.team === targetTeam && !m.isDead);

            for (const enemy of enemies) {
                if (checkCollision(proj, enemy)) {
                    enemy.takeDamage(proj.damage);
                    proj.isDead = true;
                    break;
                }
            }
        }
    }

    /**
     * 죽은 엔티티 제거
     */
    removeDeadEntities() {
        this.monsters = this.monsters.filter(m => !m.isDead);
        this.projectiles = this.projectiles.filter(p => !p.isDead);
    }

    /**
     * 승리 조건 체크
     */
    checkWinCondition() {
        if (this.aiCastle.isDead) {
            this.endGame('player');
        } else if (this.playerCastle.isDead) {
            this.endGame('ai');
        }
    }

    /**
     * 게임 종료
     */
    endGame(winner) {
        this.gameOver = true;
        this.isRunning = false;
        this.winner = winner;

        if (this.onGameOver) {
            this.onGameOver(winner);
        }
    }

    /**
     * 몬스터 소환 (플레이어용)
     */
    spawnMonster(team, grade = 'common', type = 'attacker') {
        // 에너지 비용 체크 (간단 버전)
        const costs = { common: 2, rare: 4, epic: 6, legend: 10 };
        const cost = costs[grade] || 2;

        if (team === 'player') {
            if (this.playerEnergy < cost) return false;
            this.playerEnergy -= cost;

            const x = this.playerCastle.x + this.playerCastle.width + 10;
            const y = this.canvas.height - 110;
            const monster = new Monster(team, grade, type, x, y);
            this.monsters.push(monster);
            return true;
        } else {
            if (this.aiEnergy < cost) return false;
            this.aiEnergy -= cost;

            const x = this.aiCastle.x - 50;
            const y = this.canvas.height - 110;
            const monster = new Monster(team, grade, type, x, y);
            this.monsters.push(monster);
            return true;
        }
    }

    /**
     * 화면 렌더링
     */
    draw() {
        // 배경 클리어
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 바닥 그리기
        this.ctx.fillStyle = '#3d3d5c';
        this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);

        // 성 그리기
        this.playerCastle.draw(this.ctx);
        this.aiCastle.draw(this.ctx);

        // 몬스터 그리기
        for (const monster of this.monsters) {
            monster.draw(this.ctx);
        }

        // 투사체 그리기
        for (const proj of this.projectiles) {
            proj.draw(this.ctx);
        }
    }
}
