import { DEPTH } from '../config/constants.js';
import { calculateMonsterStats, MONSTER_STATS } from '../config/monsterData.js';

/**
 * Monster 클래스 - Phaser.GameObjects.Container 기반
 */
export default class Monster extends Phaser.GameObjects.Container {
    constructor(scene, x, y, team, grade = 'common', type = 'attacker') {
        super(scene, x, y);

        console.log(`[Monster.constructor] 생성 시작: team=${team}, grade=${grade}, type=${type}, pos=(${x},${y})`);

        this.scene = scene;
        this.team = team;
        this.grade = grade;
        this.type = type;

        // 스탯 계산
        const stats = calculateMonsterStats(grade, type);
        console.log(`[Monster.constructor] 스탯 계산 완료:`, stats);

        this.hp = stats.hp;
        this.maxHp = stats.hp;
        this.speed = stats.speed;
        this.attackDamage = stats.attackDamage;
        this.attackRange = stats.attackRange;
        this.attackCooldown = stats.attackCooldown;
        this.width = stats.width;
        this.height = stats.height;
        this.color = stats.color;

        // 상태
        this.state = 'moving'; // 'moving', 'attacking', 'dead'
        this.canAttack = true;
        this.target = null;

        // 시각적 요소 생성
        try {
            this.createVisuals();
            console.log(`[Monster.constructor] createVisuals 완료`);
        } catch (e) {
            console.error(`[Monster.constructor] createVisuals 에러:`, e);
            throw e;
        }

        // 깊이 설정
        this.setDepth(DEPTH.MONSTER);

        // Container의 원점 설정 (좌상단)
        if (typeof this.setOrigin === 'function') {
            this.setOrigin(0, 0);
        }
        if (typeof this.setDisplayOrigin === 'function') {
            this.setDisplayOrigin(0, 0);
        }

        // 물리 바디 설정
        try {
            scene.physics.world.enable(this);
            this.body.setSize(this.width, this.height);
            console.log(`[Monster.constructor] 물리 바디 설정 완료`);
        } catch (e) {
            console.error(`[Monster.constructor] 물리 바디 설정 에러:`, e);
            throw e;
        }

        console.log(`[Monster.constructor] 생성 완료`);
    }

    createVisuals() {
        // 팀별 기본 색상
        const teamColor = this.team === 'player' ? 0x3388FF : 0xFF4444;
        const borderColor = this.team === 'player' ? 0x00DDFF : 0xFF6600;
        const glowColor = this.team === 'player' ? 0x88DDFF : 0xFF9944;

        // 타입별 시각적 특징 생성
        this.createMonsterShape(teamColor, borderColor, glowColor);

        // 등급 표시 (별 개수)
        this.createGradeIndicator(glowColor);

        // 체력 바 배경
        this.hpBarBg = this.scene.add.rectangle(0, -this.height - 8, this.width, 6, 0x333333);
        this.add(this.hpBarBg);

        // 체력 바
        this.hpBar = this.scene.add.rectangle(0, -this.height - 8, this.width, 6, 0x00FF00);
        this.add(this.hpBar);

        // 팀 아이콘 + 등급 텍스트
        const teamIcon = this.team === 'player' ? '▶' : '◀';
        this.gradeText = this.scene.add.text(0, -this.height - 18, `${teamIcon}${this.grade[0].toUpperCase()}`, {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add(this.gradeText);
    }

    createMonsterShape(teamColor, borderColor, glowColor) {
        if (this.type === 'attacker') {
            // 🗡️ Attacker: 뾰족한 삼각형 모양
            this.createAttackerShape(teamColor, borderColor);
        } else if (this.type === 'defender') {
            // 🛡️ Defender: 둥근 방패 모양
            this.createDefenderShape(teamColor, borderColor);
        } else {
            // ⚡ Speeder: 길쭉한 다이아몬드 모양
            this.createSpeederShape(teamColor, borderColor);
        }

        // 글로우 효과 추가 (등급에 따라 강도 조절)
        const glowStrength = this.getGlowStrength();
        if (glowStrength > 0) {
            this.createGlowEffect(glowColor, glowStrength);
        }
    }

    createAttackerShape(teamColor, borderColor) {
        // 메인 바디 (사각형)
        this.bodyRect = this.scene.add.rectangle(0, 0, this.width * 0.8, this.height * 0.7, teamColor);
        this.add(this.bodyRect);

        // 상단 뾰족한 부분 (삼각형 모양의 두 개 사각형)
        const peakWidth = this.width * 0.3;
        const peakHeight = this.height * 0.4;
        const peakColor = this.team === 'player' ? 0x5AACFF : 0xFF7777;

        this.peak1 = this.scene.add.rectangle(
            -this.width * 0.2,
            -this.height * 0.5,
            peakWidth,
            peakHeight,
            peakColor
        );
        this.add(this.peak1);

        this.peak2 = this.scene.add.rectangle(
            this.width * 0.2,
            -this.height * 0.5,
            peakWidth,
            peakHeight,
            peakColor
        );
        this.add(this.peak2);

        // 테두리
        this.border = this.scene.add.rectangle(0, 0, this.width * 0.8, this.height * 0.7)
            .setStrokeStyle(2, borderColor)
            .setFillStyle();
        this.add(this.border);
    }

    createDefenderShape(teamColor, borderColor) {
        // 메인 바디 (원형에 가까운 대원)
        const centerRadius = this.width * 0.35;
        this.bodyCircle = this.scene.add.circle(0, 0, centerRadius, teamColor);
        this.add(this.bodyCircle);

        // 아래쪽 방패 모양
        const shieldColor = this.team === 'player' ? 0x2266BB : 0xDD3333;
        this.shield = this.scene.add.rectangle(0, this.height * 0.2, this.width * 0.7, this.height * 0.5, shieldColor);
        this.add(this.shield);

        // 테두리 (굵은 방어적 테두리)
        this.border = this.scene.add.circle(0, 0, centerRadius)
            .setStrokeStyle(3, borderColor)
            .setFillStyle();
        this.add(this.border);

        // 방패 테두리
        this.shieldBorder = this.scene.add.rectangle(0, this.height * 0.2, this.width * 0.7, this.height * 0.5)
            .setStrokeStyle(3, borderColor)
            .setFillStyle();
        this.add(this.shieldBorder);
    }

    createSpeederShape(teamColor, borderColor) {
        // 메인 바디 (길쭉한 다이아몬드)
        const points = [
            new Phaser.Geom.Point(0, -this.height * 0.35),      // 위
            new Phaser.Geom.Point(this.width * 0.35, 0),         // 우
            new Phaser.Geom.Point(0, this.height * 0.35),        // 하
            new Phaser.Geom.Point(-this.width * 0.35, 0)         // 좌
        ];

        this.bodyDiamond = this.scene.add.polygon(0, 0, points, teamColor);
        this.add(this.bodyDiamond);

        // 속도 라인 (뒤쪽)
        const lineColor = this.team === 'player' ? 0x88DDFF : 0xFF9944;
        this.speedLine1 = this.scene.add.rectangle(-this.width * 0.4, -this.height * 0.15, this.width * 0.3, 2, lineColor);
        this.add(this.speedLine1);

        this.speedLine2 = this.scene.add.rectangle(-this.width * 0.4, this.height * 0.15, this.width * 0.3, 2, lineColor);
        this.add(this.speedLine2);

        // 테두리
        this.border = this.scene.add.polygon(0, 0, points)
            .setStrokeStyle(2, borderColor)
            .setFillStyle();
        this.add(this.border);
    }

    createGradeIndicator(glowColor) {
        const gradeStars = {
            'common': 1,
            'rare': 2,
            'epic': 3,
            'legend': 4
        };

        const starCount = gradeStars[this.grade] || 1;
        const starSize = 4;
        const starGap = 6;
        const totalWidth = starCount * starSize + (starCount - 1) * starGap;
        const startX = -totalWidth / 2;

        for (let i = 0; i < starCount; i++) {
            const starX = startX + i * (starSize + starGap) + starSize / 2;
            this.scene.add.star(starX, -this.height * 0.55, 5, starSize / 2, starSize / 2.5, glowColor)
                .setOrigin(0.5)
                .setDepth(this.depth + 1);
            this.add(
                this.scene.add.star(starX, -this.height * 0.55, 5, starSize / 2, starSize / 2.5, glowColor)
                    .setOrigin(0.5)
            );
        }
    }

    getGlowStrength() {
        const glowMap = { 'common': 0.3, 'rare': 0.5, 'epic': 0.7, 'legend': 1.0 };
        return glowMap[this.grade] || 0.3;
    }

    createGlowEffect(glowColor, strength) {
        // 타입별 글로우 효과
        if (this.type === 'attacker') {
            // Attacker: 빠른 스파클 애니메이션
            this.glowTween = this.scene.tweens.add({
                targets: this,
                alpha: 1,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.inOut'
            });
        } else if (this.type === 'defender') {
            // Defender: 느린 펄스
            this.glowTween = this.scene.tweens.add({
                targets: this,
                scale: 1 + strength * 0.05,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.inOut'
            });
        } else {
            // Speeder: 빠른 펄스
            this.glowTween = this.scene.tweens.add({
                targets: this,
                scale: 1 + strength * 0.03,
                duration: 300,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.inOut'
            });
        }
    }

    preUpdate(time, delta) {
        if (this.state === 'dead') return;

        // 이동 (적이 공격 범위에 없으면)
        if (this.state === 'moving') {
            const direction = this.team === 'player' ? 1 : -1;
            this.x += this.speed * direction * (delta / 1000);
        }

        // 적 탐색 및 공격
        this.findAndAttackEnemies();

        // 타겟이 있으면 공격
        if (this.target && this.state === 'attacking') {
            this.attackTarget(this.target);
        }
    }

    findAndAttackEnemies() {
        const scene = this.scene;
        const enemyGroup = this.team === 'player' ? scene.aiMonsters : scene.playerMonsters;
        const enemyCastle = this.team === 'player' ? scene.aiCastle : scene.playerCastle;

        // 공격 범위 내 적 찾기
        let target = null;
        let closestDist = this.attackRange;

        // 몬스터 체크
        enemyGroup.getChildren().forEach(enemy => {
            if (enemy.hp <= 0) return;
            const dist = Math.abs(enemy.x - this.x);
            if (dist < closestDist) {
                closestDist = dist;
                target = enemy;
            }
        });

        // 성 체크
        const castleDist = Math.abs(enemyCastle.x + enemyCastle.width / 2 - this.x);
        if (castleDist < closestDist) {
            target = enemyCastle;
        }

        // 타겟이 있으면 공격 상태
        if (target) {
            this.state = 'attacking';
            this.target = target;
        } else {
            this.state = 'moving';
            this.target = null;
        }
    }

    attackTarget(target) {
        if (!this.canAttack || this.state === 'dead') return;

        if (target && typeof target.takeDamage === 'function') {
            target.takeDamage(this.attackDamage);
        }

        // 쿨다운 시작
        this.canAttack = false;
        this.scene.time.delayedCall(this.attackCooldown, () => {
            this.canAttack = true;
        });
    }

    takeDamage(amount) {
        if (this.state === 'dead') return;

        this.hp -= amount;

        if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        }

        this.updateHpBar();
    }

    updateHpBar() {
        const ratio = this.hp / this.maxHp;
        this.hpBar.setDisplaySize(this.width * ratio, 6);
        this.hpBar.setX(-(this.width * (1 - ratio)) / 2);

        // 색상 변경
        let color;
        if (ratio > 0.5) {
            color = 0x00FF00;
        } else if (ratio > 0.2) {
            color = 0xFFFF00;
        } else {
            color = 0xFF0000;
        }
        this.hpBar.setFillStyle(color);
    }

    die() {
        this.state = 'dead';

        // 몬스터 사망 알림 (카운트 감소)
        if (this.scene && typeof this.scene.onMonsterDeath === 'function') {
            this.scene.onMonsterDeath(this.team);
        }

        // 타입별 죽음 애니메이션
        if (this.type === 'attacker') {
            // Attacker: 빠른 폭발 효과
            this.scene.tweens.add({
                targets: this,
                scale: 1.2,
                alpha: 0,
                duration: 200,
                ease: 'Power2.out',
                onComplete: () => this.destroy()
            });
        } else if (this.type === 'defender') {
            // Defender: 느린 부서지는 효과
            this.scene.tweens.add({
                targets: this,
                scale: 0.8,
                alpha: 0,
                duration: 400,
                ease: 'Sine.inOut',
                onComplete: () => this.destroy()
            });
        } else {
            // Speeder: 빠른 사라짐
            this.scene.tweens.add({
                targets: this,
                scale: 0.5,
                alpha: 0,
                duration: 150,
                ease: 'Power3.in',
                onComplete: () => this.destroy()
            });
        }
    }
}
