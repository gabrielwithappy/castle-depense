import { DEPTH, COLORS } from '../config/constants.js';

/**
 * Projectile 클래스 - 성에서 발사되는 크리스탈 투사체
 */
export default class Projectile extends Phaser.GameObjects.Container {
    constructor(scene, x, y, targetX, targetY, team, damage) {
        super(scene, x, y);

        this.scene = scene;
        this.team = team;
        this.damage = damage;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 350; // 픽셀/초 (느리게 하여 더 잘 보이게)
        this.isDead = false;

        // 크기
        this.width = 24;
        this.height = 24;

        // 방향 계산
        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.velocityX = (dx / dist) * this.speed;
        this.velocityY = (dy / dist) * this.speed;

        // 목표까지의 거리 저장
        this.totalDist = dist;
        this.traveledDist = 0;

        // 시각적 요소 생성
        this.createVisuals();

        // 깊이 설정
        this.setDepth(DEPTH.PROJECTILE);
    }

    createVisuals() {
        const color = this.team === 'player' ? COLORS.PROJECTILE_PLAYER : COLORS.PROJECTILE_AI;
        const glowColor = this.team === 'player' ? 0x00bfff : 0xff6600;

        // 외부 글로우 (더 큰 반투명 원)
        this.glow = this.scene.add.circle(0, 0, 20, glowColor, 0.4);
        this.add(this.glow);

        // 중간 글로우
        this.midGlow = this.scene.add.circle(0, 0, 14, glowColor, 0.6);
        this.add(this.midGlow);

        // 코어 (밝은 중심)
        this.core = this.scene.add.circle(0, 0, 10, color);
        this.add(this.core);

        // 중심 하이라이트
        this.highlight = this.scene.add.circle(-3, -3, 4, 0xffffff, 0.9);
        this.add(this.highlight);
    }

    preUpdate(time, delta) {
        if (this.isDead) return;

        // 이동
        const dt = delta / 1000;
        const moveX = this.velocityX * dt;
        const moveY = this.velocityY * dt;

        this.x += moveX;
        this.y += moveY;
        this.traveledDist += Math.sqrt(moveX * moveX + moveY * moveY);

        // 글로우 펄스 효과
        const pulse = 1 + Math.sin(time * 0.01) * 0.2;
        this.glow.setScale(pulse);

        // 목표 도달 체크
        if (this.traveledDist >= this.totalDist) {
            this.reachTarget();
        }
    }

    reachTarget() {
        if (this.isDead) return;
        this.isDead = true;

        // 히트 이펙트
        this.createHitEffect();

        // 제거
        this.scene.time.delayedCall(100, () => {
            this.destroy();
        });
    }

    createHitEffect() {
        const color = this.team === 'player' ? 0x00bfff : 0xff6600;

        // 간단한 폭발 효과 (원이 커지면서 사라짐)
        const explosion = this.scene.add.circle(this.x, this.y, 8, color, 0.8)
            .setDepth(DEPTH.PROJECTILE + 1);

        this.scene.tweens.add({
            targets: explosion,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                explosion.destroy();
            }
        });
    }
}
