import { DEPTH, COLORS } from '../config/constants.js';

export default class Projectile extends Phaser.GameObjects.Container {
    constructor(scene, x, y, targetX, targetY, team, damage) {
        super(scene, x, y);

        this.scene = scene;
        this.team = team;
        this.damage = damage;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 350;
        this.isDead = false;

        this.width = 34;
        this.height = 28;

        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));

        this.velocityX = (dx / dist) * this.speed;
        this.velocityY = (dy / dist) * this.speed;
        this.totalDist = dist;
        this.traveledDist = 0;

        this.createVisuals();
        this.setDepth(DEPTH.PROJECTILE);
    }

    createVisuals() {
        const color = this.team === 'player' ? COLORS.PROJECTILE_PLAYER : COLORS.PROJECTILE_AI;
        const glowColor = this.team === 'player' ? 0x00bfff : 0xff6600;

        this.rotation = Math.atan2(this.velocityY, this.velocityX);

        this.trail = this.scene.add.graphics();
        this.trail.lineStyle(4, glowColor, 0.45);
        this.trail.beginPath();
        this.trail.moveTo(-12, 0);
        this.trail.lineTo(-34, 0);
        this.trail.moveTo(-8, -5);
        this.trail.lineTo(-24, -11);
        this.trail.moveTo(-8, 5);
        this.trail.lineTo(-24, 11);
        this.trail.strokePath();
        this.add(this.trail);

        this.glow = this.scene.add.circle(0, 0, 24, glowColor, 0.35);
        this.add(this.glow);

        this.midGlow = this.scene.add.circle(0, 0, 15, glowColor, 0.55);
        this.add(this.midGlow);

        this.crystal = this.scene.add.graphics();
        this.crystal.fillStyle(color, 1);
        this.crystal.lineStyle(2, 0xffffff, 0.85);
        this.crystal.beginPath();
        this.crystal.moveTo(18, 0);
        this.crystal.lineTo(4, -11);
        this.crystal.lineTo(-14, 0);
        this.crystal.lineTo(4, 11);
        this.crystal.closePath();
        this.crystal.fillPath();
        this.crystal.strokePath();
        this.add(this.crystal);

        this.facets = this.scene.add.graphics();
        this.facets.lineStyle(1, 0xffffff, 0.65);
        this.facets.beginPath();
        this.facets.moveTo(4, -11);
        this.facets.lineTo(1, 0);
        this.facets.lineTo(4, 11);
        this.facets.moveTo(-14, 0);
        this.facets.lineTo(1, 0);
        this.facets.lineTo(18, 0);
        this.facets.strokePath();
        this.add(this.facets);

        this.highlight = this.scene.add.circle(7, -4, 4, 0xffffff, 0.9);
        this.add(this.highlight);

        this.createLaunchEffect(glowColor);
    }

    createLaunchEffect(color) {
        const flash = this.scene.add.circle(this.x, this.y, 10, color, 0.9)
            .setDepth(DEPTH.PROJECTILE + 1);

        this.scene.tweens.add({
            targets: flash,
            scaleX: 3.2,
            scaleY: 3.2,
            alpha: 0,
            duration: 220,
            ease: 'Quad.easeOut',
            onComplete: () => flash.destroy()
        });

        for (let i = 0; i < 6; i++) {
            const shard = this.scene.add.graphics()
                .setPosition(this.x, this.y)
                .setRotation(Math.random() * Math.PI * 2)
                .setDepth(DEPTH.PROJECTILE + 1);

            shard.fillStyle(color, 0.85);
            shard.beginPath();
            shard.moveTo(8, 0);
            shard.lineTo(-3, -4);
            shard.lineTo(-6, 0);
            shard.lineTo(-3, 4);
            shard.closePath();
            shard.fillPath();

            const shardAngle = Math.random() * Math.PI * 2;
            const distance = 18 + Math.random() * 18;

            this.scene.tweens.add({
                targets: shard,
                x: this.x + Math.cos(shardAngle) * distance,
                y: this.y + Math.sin(shardAngle) * distance,
                alpha: 0,
                scaleX: 0.35,
                scaleY: 0.35,
                duration: 260,
                ease: 'Quad.easeOut',
                onComplete: () => shard.destroy()
            });
        }
    }

    preUpdate(time, delta) {
        if (this.isDead) return;

        const dt = delta / 1000;
        const moveX = this.velocityX * dt;
        const moveY = this.velocityY * dt;

        this.x += moveX;
        this.y += moveY;
        this.traveledDist += Math.sqrt(moveX * moveX + moveY * moveY);

        const pulse = 1 + Math.sin(time * 0.01) * 0.2;
        this.glow.setScale(pulse);
        this.midGlow.setScale(0.95 + Math.sin(time * 0.014) * 0.12);
        this.highlight.setAlpha(0.75 + Math.sin(time * 0.018) * 0.2);

        if (this.traveledDist >= this.totalDist) {
            this.reachTarget();
        }
    }

    reachTarget() {
        if (this.isDead) return;
        this.isDead = true;

        this.createHitEffect();

        this.scene.time.delayedCall(100, () => {
            this.destroy();
        });
    }

    createHitEffect() {
        const color = this.team === 'player' ? 0x00bfff : 0xff6600;

        const explosion = this.scene.add.circle(this.x, this.y, 8, color, 0.8)
            .setDepth(DEPTH.PROJECTILE + 1);

        this.scene.tweens.add({
            targets: explosion,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 200,
            onComplete: () => explosion.destroy()
        });
    }
}
