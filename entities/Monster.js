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
        const w = this.width;
        const h = this.height;
        const color = this.color;

        // 타입별 몬스터 형태 그리기
        if (this.type === 'attacker') {
            this.createAttackerVisuals(w, h, color);
        } else if (this.type === 'defender') {
            this.createDefenderVisuals(w, h, color);
        } else if (this.type === 'speeder') {
            this.createSpeederVisuals(w, h, color);
        }

        // 체력 바 배경
        this.hpBarBg = this.scene.add.rectangle(0, h / 2 + 10, w, 6, 0x333333);
        this.add(this.hpBarBg);

        // 체력 바
        this.hpBar = this.scene.add.rectangle(0, h / 2 + 10, w, 6, 0x00FF00);
        this.add(this.hpBar);

        // 등급 텍스트
        const teamIcon = this.team === 'player' ? '▶' : '◀';
        this.gradeText = this.scene.add.text(0, -h / 2 - 15, `${teamIcon}${this.grade[0].toUpperCase()}`, {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add(this.gradeText);
    }

    createAttackerVisuals(w, h, color) {
        // 몸통 (상단)
        const body = this.scene.add.rectangle(0, -h * 0.15, w * 0.75, h * 0.35, color);
        this.add(body);

        // 하단
        const bottom = this.scene.add.rectangle(0, h * 0.25, w * 0.65, h * 0.25, color);
        this.add(bottom);

        // 왼쪽 뿔
        const leftHorn = this.scene.add.polygon(-w * 0.35, -h * 0.25, [[-4, -6], [-1, 2], [3, -1]]);
        leftHorn.setFillStyle(0xFF6666);
        this.add(leftHorn);

        // 오른쪽 뿔
        const rightHorn = this.scene.add.polygon(w * 0.35, -h * 0.25, [[4, -6], [1, 2], [-3, -1]]);
        rightHorn.setFillStyle(0xFF6666);
        this.add(rightHorn);

        // 눈
        const eye = this.scene.add.circle(0, -h * 0.05, 2.5, 0xFFFFFF);
        this.add(eye);
    }

    createDefenderVisuals(w, h, color) {
        // 큰 몸통 (방패 모양)
        const body = this.scene.add.rectangle(0, -h * 0.1, w * 0.85, h * 0.5, color);
        this.add(body);

        // 하단 다리 (왼쪽)
        const leftLeg = this.scene.add.rectangle(-w * 0.2, h * 0.3, w * 0.25, h * 0.15, color);
        this.add(leftLeg);

        // 하단 다리 (오른쪽)
        const rightLeg = this.scene.add.rectangle(w * 0.2, h * 0.3, w * 0.25, h * 0.15, color);
        this.add(rightLeg);

        // 방어 패턴 (가로 줄)
        for (let i = 0; i < 3; i++) {
            const line = this.scene.add.rectangle(0, -h * 0.25 + i * 0.2 * h, w * 0.6, 2, 0x8888FF);
            this.add(line);
        }

        // 눈 (왼쪽)
        const leftEye = this.scene.add.circle(-w * 0.15, -h * 0.15, 2.5, 0xFFFFFF);
        this.add(leftEye);

        // 눈 (오른쪽)
        const rightEye = this.scene.add.circle(w * 0.15, -h * 0.15, 2.5, 0xFFFFFF);
        this.add(rightEye);
    }

    createSpeederVisuals(w, h, color) {
        // 앞쪽 뾰족한 부분
        const front = this.scene.add.polygon(-w * 0.25, 0, [[-6, -5], [0, 0], [-6, 5]]);
        front.setFillStyle(color);
        this.add(front);

        // 메인 바디
        const body = this.scene.add.rectangle(0, 0, w * 0.65, h * 0.3, color);
        this.add(body);

        // 뒤쪽 날개 (위쪽)
        const topWing = this.scene.add.polygon(w * 0.2, -h * 0.15, [[0, -4], [5, 0], [2, 4]]);
        topWing.setFillStyle(0xFF88FF);
        this.add(topWing);

        // 뒤쪽 날개 (아래쪽)
        const bottomWing = this.scene.add.polygon(w * 0.2, h * 0.15, [[0, -4], [5, 0], [2, 4]]);
        bottomWing.setFillStyle(0xFF88FF);
        this.add(bottomWing);

        // 속도감 선 (흘러가는 효과)
        const speedLine = this.scene.add.rectangle(-w * 0.3, 0, w * 0.3, 2, 0xFF88FF);
        this.add(speedLine);

        // 눈
        const eye = this.scene.add.circle(-w * 0.15, -h * 0.1, 2, 0xFFFFFF);
        this.add(eye);
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

        const beforeHp = this.hp;
        this.hp -= amount;

        console.log(`[Monster] ${this.team} 몬스터 데미지 받음: ${amount} (HP: ${beforeHp} → ${this.hp})`);

        if (this.hp <= 0) {
            this.hp = 0;
            console.log(`[Monster] ${this.team} 몬스터 HP 0 도달 - die() 호출 예정`);
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
        if (this.state === 'dead') return; // 중복 호출 방지

        this.state = 'dead';

        console.log(`[Monster] ${this.team} 몬스터 사망 - die() 호출됨`);

        // 씬에 몬스터 사망 알림 (페이드아웃 전에 즉시 호출)
        if (this.scene && typeof this.scene.onMonsterDeath === 'function') {
            this.scene.onMonsterDeath(this.team);
            console.log(`[Monster] onMonsterDeath(${this.team}) 호출 완료`);
        } else {
            console.warn(`[Monster] onMonsterDeath 함수를 찾을 수 없음!`);
        }

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
