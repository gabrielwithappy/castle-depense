import Entity from './Entity.js';
import { CONSTANTS } from '../constants.js';

/**
 * Castle 클래스
 * - 플레이어 또는 AI의 성 (기지)
 * - 체력, 공격 범위, 공격 데미지, 공격 쿨다운 관리
 */
export default class Castle extends Entity {
    constructor(x, y, team) {
        const width = 80;
        const height = 120;
        const color = team === 'player' ? '#4a90d9' : '#d94a4a';

        super(x, y, width, height, color, team);

        this.maxHp = CONSTANTS.CASTLE.MAX_HP;
        this.hp = this.maxHp;
        this.attackRange = CONSTANTS.CASTLE.ATTACK_RANGE;
        this.attackDamage = CONSTANTS.CASTLE.ATTACK_DAMAGE;
        this.attackCooldown = CONSTANTS.CASTLE.ATTACK_COOLDOWN;
        this.currentCooldown = 0;
    }

    /**
     * 데미지를 받아 체력을 감소시킴
     * @param {number} damage - 받은 데미지량
     * @returns {boolean} - 성이 파괴되었으면 true
     */
    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;
            return true;
        }
        return false;
    }

    /**
     * 체력 회복
     * @param {number} amount - 회복량
     */
    heal(amount) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
    }

    /**
     * 공격 가능 여부 확인
     * @returns {boolean}
     */
    canAttack() {
        return this.currentCooldown <= 0 && !this.isDead;
    }

    /**
     * 공격 실행 (쿨다운 시작)
     * @returns {number} - 공격 데미지
     */
    attack() {
        if (!this.canAttack()) {
            return 0;
        }
        this.currentCooldown = this.attackCooldown;
        return this.attackDamage;
    }

    /**
     * 대상이 공격 범위 내에 있는지 확인
     * @param {Entity} target - 대상 엔티티
     * @returns {boolean}
     */
    isInRange(target) {
        const castleCenterX = this.x + this.width / 2;
        const targetCenterX = target.x + target.width / 2;
        const distance = Math.abs(targetCenterX - castleCenterX);
        return distance <= this.attackRange;
    }

    /**
     * 매 프레임 업데이트
     * @param {number} dt - 델타 타임 (프레임 단위)
     */
    update(dt) {
        super.update(dt);

        // 쿨다운 감소
        if (this.currentCooldown > 0) {
            this.currentCooldown -= dt;
        }
    }

    /**
     * 성 렌더링
     * @param {CanvasRenderingContext2D} ctx - 캔버스 컨텍스트
     */
    draw(ctx) {
        // 성 본체
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // 성벽 상단 장식 (톱니)
        const battlementCount = 4;
        const battlementWidth = this.width / (battlementCount * 2);
        const battlementHeight = 15;
        ctx.fillStyle = this.color;
        for (let i = 0; i < battlementCount; i++) {
            ctx.fillRect(
                this.x + i * battlementWidth * 2,
                this.y - battlementHeight,
                battlementWidth,
                battlementHeight
            );
        }

        // 성문 (아치형)
        const doorWidth = this.width * 0.4;
        const doorHeight = this.height * 0.4;
        const doorX = this.x + (this.width - doorWidth) / 2;
        const doorY = this.y + this.height - doorHeight;

        ctx.fillStyle = '#2d1b0e';
        ctx.beginPath();
        ctx.moveTo(doorX, doorY + doorHeight);
        ctx.lineTo(doorX, doorY + doorWidth / 2);
        ctx.arc(doorX + doorWidth / 2, doorY + doorWidth / 2, doorWidth / 2, Math.PI, 0);
        ctx.lineTo(doorX + doorWidth, doorY + doorHeight);
        ctx.closePath();
        ctx.fill();

        // 체력 바 배경
        const hpBarWidth = this.width;
        const hpBarHeight = 8;
        const hpBarX = this.x;
        const hpBarY = this.y - 25;

        ctx.fillStyle = '#333';
        ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

        // 체력 바 현재값
        const hpRatio = this.hp / this.maxHp;
        const hpColor = hpRatio > 0.5 ? '#4caf50' : hpRatio > 0.25 ? '#ff9800' : '#f44336';
        ctx.fillStyle = hpColor;
        ctx.fillRect(hpBarX, hpBarY, hpBarWidth * hpRatio, hpBarHeight);

        // 체력 바 테두리
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

        // 팀 표시 (테두리)
        ctx.strokeStyle = this.team === 'player' ? '#2196f3' : '#f44336';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    /**
     * 체력 비율 반환
     * @returns {number} - 0~1 사이의 체력 비율
     */
    getHpRatio() {
        return this.hp / this.maxHp;
    }
}
