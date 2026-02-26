import Entity from './Entity.js';

// Monster 등급별 스탯 정의
const MONSTER_STATS = {
    common: {
        width: 40,
        height: 60,
        speed: 50,       // pixels per second
        attackDamage: 20,
        attackRange: 30,
        attackCooldown: 1.0, // seconds
        hp: 100,
        color: '#8B4513', // 갈색
    },
    rare: {
        width: 50,
        height: 70,
        speed: 40,
        attackDamage: 40,
        attackRange: 40,
        attackCooldown: 1.2,
        hp: 200,
        color: '#4169E1', // 파란색
    },
    epic: {
        width: 60,
        height: 80,
        speed: 35,
        attackDamage: 60,
        attackRange: 50,
        attackCooldown: 1.5,
        hp: 350,
        color: '#9932CC', // 보라색
    },
    legend: {
        width: 70,
        height: 90,
        speed: 30,
        attackDamage: 100,
        attackRange: 60,
        attackCooldown: 2.0,
        hp: 500,
        color: '#FFD700', // 금색
    }
};

// Monster 타입별 수정자
const MONSTER_TYPE_MODIFIERS = {
    attacker: {
        attackDamage: 1.5,
        hp: 0.8,
        speed: 1.0
    },
    defender: {
        attackDamage: 0.8,
        hp: 1.5,
        speed: 0.8
    },
    speeder: {
        attackDamage: 0.7,
        hp: 0.6,
        speed: 1.8
    }
};

/**
 * Monster 클래스
 * - Entity를 상속하여 게임 내 몬스터 유닛을 표현
 * - grade (등급): common, rare, epic, legend
 * - type (타입): attacker, defender, speeder
 */
export default class Monster extends Entity {
    constructor(team, grade = 'common', type = 'attacker', x = 0, y = 300) {
        const baseStats = MONSTER_STATS[grade] || MONSTER_STATS.common;
        const modifiers = MONSTER_TYPE_MODIFIERS[type] || MONSTER_TYPE_MODIFIERS.attacker;

        super(x, y, baseStats.width, baseStats.height, baseStats.color, team);

        this.grade = grade;
        this.type = type;

        // 스탯 계산 (기본 스탯 * 타입 수정자)
        this.hp = Math.floor(baseStats.hp * modifiers.hp);
        this.maxHp = this.hp;
        this.speed = baseStats.speed * modifiers.speed;
        this.attackDamage = Math.floor(baseStats.attackDamage * modifiers.attackDamage);
        this.attackRange = baseStats.attackRange;
        this.attackCooldown = baseStats.attackCooldown;

        // 상태 변수
        this.state = 'moving'; // 'moving', 'attacking', 'dead'
        this.attackTimer = 0;
        this.target = null;
    }

    /**
     * 몬스터를 특정 방향으로 이동
     * @param {number} direction - 이동 방향 (1: 오른쪽, -1: 왼쪽)
     * @param {number} dt - 델타 타임 (초 단위, 기본값 1/60)
     */
    move(direction, dt = 1 / 60) {
        if (this.state === 'dead') return;
        this.x += this.speed * direction * dt;
    }

    /**
     * 타겟에게 데미지를 가함
     * @param {Entity} target - 공격 대상
     * @returns {number} - 가한 데미지
     */
    attack(target) {
        if (this.state === 'dead' || !target) return 0;
        if (typeof target.takeDamage === 'function') {
            target.takeDamage(this.attackDamage);
        }
        return this.attackDamage;
    }

    /**
     * 데미지를 받음
     * @param {number} amount - 받는 데미지 양
     */
    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            this.state = 'dead';
            this.isDead = true;
        }
    }

    /**
     * 두 엔티티 사이의 거리 계산
     * @param {Entity} other - 다른 엔티티
     * @returns {number} - 중심점 사이 거리
     */
    distanceTo(other) {
        const myCenter = this.x + this.width / 2;
        const otherCenter = other.x + other.width / 2;
        return Math.abs(myCenter - otherCenter);
    }

    /**
     * 공격 범위 내 적 탐색
     * @param {Entity[]} enemies - 적 엔티티 배열
     * @returns {Entity|null} - 가장 가까운 적 또는 null
     */
    findTarget(enemies) {
        let closest = null;
        let closestDist = Infinity;

        for (const enemy of enemies) {
            if (enemy.isDead) continue;
            const dist = this.distanceTo(enemy);
            if (dist < closestDist) {
                closestDist = dist;
                closest = enemy;
            }
        }

        return closestDist <= this.attackRange ? closest : null;
    }

    /**
     * 매 프레임 업데이트
     * @param {number} dt - 델타 타임 (초)
     * @param {Entity[]} enemies - 적 엔티티 배열
     */
    update(dt, enemies = []) {
        if (this.state === 'dead') return;

        // 공격 쿨다운 감소
        if (this.attackTimer > 0) {
            this.attackTimer -= dt;
        }

        // 적 탐색
        const target = this.findTarget(enemies);

        if (target) {
            // 적이 공격 범위 내에 있으면 공격 상태
            this.state = 'attacking';
            this.target = target;

            if (this.attackTimer <= 0) {
                this.attack(target);
                this.attackTimer = this.attackCooldown;
            }
        } else {
            // 적이 없으면 이동 상태
            this.state = 'moving';
            this.target = null;

            // 팀에 따라 이동 방향 결정 (player: 오른쪽, ai: 왼쪽)
            const direction = this.team === 'player' ? 1 : -1;
            this.move(direction, dt);
        }
    }

    /**
     * 캔버스에 몬스터 그리기 (타입별 시각적 차별화)
     * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
     */
    draw(ctx) {
        if (this.state === 'dead') return;

        // 팀별 색상
        const teamColor = this.team === 'player' ? '#3388FF' : '#FF4444';
        const borderColor = this.team === 'player' ? '#00DDFF' : '#FF6600';
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        // 타입별로 다른 형태 그리기
        if (this.type === 'attacker') {
            this.drawAttackerShape(ctx, centerX, centerY, teamColor, borderColor);
        } else if (this.type === 'defender') {
            this.drawDefenderShape(ctx, centerX, centerY, teamColor, borderColor);
        } else {
            this.drawSpeederShape(ctx, centerX, centerY, teamColor, borderColor);
        }

        // 등급 표시 (별 개수)
        this.drawGradeStars(ctx, centerX, this.y - 15);

        // 체력바
        this.drawHealthBar(ctx);

        // 팀 아이콘 + 등급 텍스트
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        const teamIcon = this.team === 'player' ? '▶' : '◀';
        ctx.fillText(teamIcon + this.grade[0].toUpperCase(), centerX, this.y - 25);
    }

    /**
     * Attacker 모양 그리기 (뾰족한 피크)
     */
    drawAttackerShape(ctx, centerX, centerY, bodyColor, borderColor) {
        const bodyWidth = this.width * 0.8;
        const bodyHeight = this.height * 0.7;
        const peakWidth = this.width * 0.3;
        const peakHeight = this.height * 0.4;
        const peakColor = this.team === 'player' ? '#5AACFF' : '#FF7777';

        // 메인 바디
        ctx.fillStyle = bodyColor;
        ctx.fillRect(centerX - bodyWidth / 2, centerY - bodyHeight / 2, bodyWidth, bodyHeight);

        // 상단 뾰족한 부분
        ctx.fillStyle = peakColor;
        ctx.fillRect(centerX - bodyWidth * 0.2 - peakWidth / 2, centerY - bodyHeight / 2 - peakHeight, peakWidth, peakHeight);
        ctx.fillRect(centerX + bodyWidth * 0.2 - peakWidth / 2, centerY - bodyHeight / 2 - peakHeight, peakWidth, peakHeight);

        // 테두리
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - bodyWidth / 2, centerY - bodyHeight / 2, bodyWidth, bodyHeight);
    }

    /**
     * Defender 모양 그리기 (원형 + 방패)
     */
    drawDefenderShape(ctx, centerX, centerY, bodyColor, borderColor) {
        const bodyRadius = this.width * 0.35;
        const shieldWidth = this.width * 0.7;
        const shieldHeight = this.height * 0.5;
        const shieldColor = this.team === 'player' ? '#2266BB' : '#DD3333';

        // 원형 바디
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, bodyRadius, 0, Math.PI * 2);
        ctx.fill();

        // 아래쪽 방패
        ctx.fillStyle = shieldColor;
        ctx.fillRect(centerX - shieldWidth / 2, centerY, shieldWidth, shieldHeight);

        // 테두리 (원형)
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, bodyRadius, 0, Math.PI * 2);
        ctx.stroke();

        // 방패 테두리
        ctx.strokeRect(centerX - shieldWidth / 2, centerY, shieldWidth, shieldHeight);
    }

    /**
     * Speeder 모양 그리기 (다이아몬드 + 속도라인)
     */
    drawSpeederShape(ctx, centerX, centerY, bodyColor, borderColor) {
        const diamondWidth = this.width * 0.7;
        const diamondHeight = this.height * 0.7;
        const lineColor = this.team === 'player' ? '#88DDFF' : '#FF9944';

        // 다이아몬드 바디
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - diamondHeight / 2); // 위
        ctx.lineTo(centerX + diamondWidth / 2, centerY); // 우
        ctx.lineTo(centerX, centerY + diamondHeight / 2); // 하
        ctx.lineTo(centerX - diamondWidth / 2, centerY); // 좌
        ctx.closePath();
        ctx.fill();

        // 속도 라인 (뒤쪽)
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        const lineLength = this.width * 0.3;
        ctx.beginPath();
        ctx.moveTo(centerX - diamondWidth / 2 - lineLength, centerY - this.height * 0.15);
        ctx.lineTo(centerX - diamondWidth / 2, centerY - this.height * 0.15);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX - diamondWidth / 2 - lineLength, centerY + this.height * 0.15);
        ctx.lineTo(centerX - diamondWidth / 2, centerY + this.height * 0.15);
        ctx.stroke();

        // 테두리
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - diamondHeight / 2);
        ctx.lineTo(centerX + diamondWidth / 2, centerY);
        ctx.lineTo(centerX, centerY + diamondHeight / 2);
        ctx.lineTo(centerX - diamondWidth / 2, centerY);
        ctx.closePath();
        ctx.stroke();
    }

    /**
     * 등급별 별 개수 그리기
     */
    drawGradeStars(ctx, centerX, y) {
        const starCount = { 'common': 1, 'rare': 2, 'epic': 3, 'legend': 4 }[this.grade] || 1;
        const starSize = 4;
        const starGap = 6;
        const totalWidth = starCount * starSize + (starCount - 1) * starGap;
        const startX = centerX - totalWidth / 2;

        ctx.fillStyle = this.team === 'player' ? '#88DDFF' : '#FF9944';
        for (let i = 0; i < starCount; i++) {
            const x = startX + i * (starSize + starGap);
            this.drawStar(ctx, x, y, starSize);
        }
    }

    /**
     * 별 모양 그리기
     */
    drawStar(ctx, x, y, size) {
        const spikes = 5;
        const outerRadius = size;
        const innerRadius = size * 0.4;

        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);

            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.fill();
    }

    /**
     * 체력바 그리기
     */
    drawHealthBar(ctx) {
        const hpBarWidth = this.width;
        const hpBarHeight = 6;
        const hpBarX = this.x;
        const hpBarY = this.y - 10;

        // 배경
        ctx.fillStyle = '#333';
        ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

        // 현재 HP
        const hpRatio = this.hp / this.maxHp;
        ctx.fillStyle = hpRatio > 0.5 ? '#00FF00' : hpRatio > 0.2 ? '#FFFF00' : '#FF0000';
        ctx.fillRect(hpBarX, hpBarY, hpBarWidth * hpRatio, hpBarHeight);
    }

    /**
     * 팀 색상 반환
     */
    getTeamColor(baseColor) {
        return baseColor;
    }
}
