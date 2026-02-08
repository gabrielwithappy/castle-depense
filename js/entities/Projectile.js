import Entity from './Entity.js';

/**
 * 투사체 클래스 (Projectile)
 * 성의 크리스탈이나 유닛이 발사하는 투사체를 나타냅니다.
 */
export default class Projectile extends Entity {
    /**
     * @param {number} x - 시작 X 좌표
     * @param {number} y - 시작 Y 좌표
     * @param {number} targetX - 목표 X 좌표
     * @param {number} targetY - 목표 Y 좌표
     * @param {number} damage - 데미지
     * @param {number} speed - 이동 속도 (pixels per second)
     * @param {string} team - 팀 ('player' 또는 'ai')
     */
    constructor(x, y, targetX, targetY, damage, speed, team = 'player') {
        // 투사체는 작은 원형으로 표현
        const size = 8;
        const color = team === 'player' ? '#00bfff' : '#ff6600';
        super(x, y, size, size, color, team);

        this.targetX = targetX;
        this.targetY = targetY;
        this.damage = damage;
        this.speed = speed;

        // 방향 벡터 계산
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 정규화된 방향 벡터
        this.directionX = distance > 0 ? dx / distance : 0;
        this.directionY = distance > 0 ? dy / distance : 0;

        // 목표까지의 초기 거리 저장
        this.initialDistance = distance;
        this.traveledDistance = 0;
    }

    /**
     * 투사체 업데이트 (이동)
     * @param {number} dt - 델타 타임 (초 단위)
     */
    update(dt) {
        if (this.isDead) return;

        // 이동 거리 계산
        const moveDistance = this.speed * dt;

        // 위치 업데이트
        this.x += this.directionX * moveDistance;
        this.y += this.directionY * moveDistance;

        // 이동한 총 거리 누적
        this.traveledDistance += moveDistance;

        // 목표에 도달했는지 확인
        if (this.hasReachedTarget()) {
            this.isDead = true;
        }
    }

    /**
     * 목표 지점에 도달했는지 확인
     * @returns {boolean}
     */
    hasReachedTarget() {
        return this.traveledDistance >= this.initialDistance;
    }

    /**
     * 투사체 렌더링 (원형)
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        if (this.isDead) return;

        ctx.save();

        // 원형 투사체 그리기
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // 광채 효과
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.fill();

        // 팀 표시 외곽선
        ctx.strokeStyle = this.team === 'player' ? 'blue' : 'red';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    }
}
