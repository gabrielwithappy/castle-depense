import { DEPTH } from '../config/constants.js';
import { calculateMonsterStats, MONSTER_STATS } from '../config/monsterData.js';

/**
 * Monster 클래스 - Phaser.GameObjects.Container 기반
 */
export default class Monster extends Phaser.GameObjects.Container {
    constructor(scene, x, y, team, grade = 'common', type = 'attacker') {
        super(scene, x, y);

        this.scene = scene;
        this.team = team;
        this.grade = grade;
        this.type = type;

        // 스탯 계산
        const stats = calculateMonsterStats(grade, type);
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
        this.createVisuals();

        // 깊이 설정
        this.setDepth(DEPTH.MONSTER);

        // 물리 바디 설정
        scene.physics.world.enable(this);
        this.body.setSize(this.width, this.height);
    }

    createVisuals() {
        // 팀별 기본 색상
        const teamColor = this.team === 'player' ? 0x3388FF : 0xFF4444;

        // 몬스터 바디
        this.bodyRect = this.scene.add.rectangle(0, -this.height / 2, this.width, this.height, teamColor);
        this.add(this.bodyRect);

        // 등급 표시 (내부 사각형)
        const patternSize = Math.min(this.width, this.height) * 0.4;
        this.gradeIndicator = this.scene.add.rectangle(0, -this.height / 2, patternSize, patternSize, this.color);
        this.add(this.gradeIndicator);

        // 테두리
        const borderColor = this.team === 'player' ? 0x0066CC : 0xCC0000;
        this.border = this.scene.add.rectangle(0, -this.height / 2, this.width, this.height)
            .setStrokeStyle(3, borderColor)
            .setFillStyle();
        this.add(this.border);

        // 체력 바 배경
        this.hpBarBg = this.scene.add.rectangle(0, -this.height - 5, this.width, 6, 0x333333);
        this.add(this.hpBarBg);

        // 체력 바
        this.hpBar = this.scene.add.rectangle(0, -this.height - 5, this.width, 6, 0x00FF00);
        this.add(this.hpBar);

        // 등급 텍스트
        const teamIcon = this.team === 'player' ? '▶' : '◀';
        this.gradeText = this.scene.add.text(0, -this.height - 15, `${teamIcon}${this.grade[0].toUpperCase()}`, {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add(this.gradeText);
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

        // 페이드아웃 후 제거
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                this.destroy();
            }
        });
    }
}
