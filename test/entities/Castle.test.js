import { describe, it, expect } from '../simple_test.js';
import Castle from '../../js/entities/Castle.js';
import { CONSTANTS } from '../../js/constants.js';

describe('Castle', () => {
    it('생성 시 올바른 초기 상태를 가져야 한다', () => {
        const castle = new Castle(100, 200, 'player');

        expect(castle.x).toBe(100);
        expect(castle.y).toBe(200);
        expect(castle.team).toBe('player');
        expect(castle.hp).toBe(CONSTANTS.CASTLE.MAX_HP);
        expect(castle.maxHp).toBe(CONSTANTS.CASTLE.MAX_HP);
        expect(castle.isDead).toBe(false);
    });

    it('takeDamage로 체력이 감소해야 한다', () => {
        const castle = new Castle(0, 0, 'player');
        const initialHp = castle.hp;

        castle.takeDamage(100);

        expect(castle.hp).toBe(initialHp - 100);
        expect(castle.isDead).toBe(false);
    });

    it('체력이 0 이하가 되면 isDead가 true가 되어야 한다', () => {
        const castle = new Castle(0, 0, 'player');

        const destroyed = castle.takeDamage(CONSTANTS.CASTLE.MAX_HP + 100);

        expect(destroyed).toBe(true);
        expect(castle.hp).toBe(0);
        expect(castle.isDead).toBe(true);
    });

    it('heal로 체력이 회복되어야 한다', () => {
        const castle = new Castle(0, 0, 'player');
        castle.hp = 500;

        castle.heal(200);

        expect(castle.hp).toBe(700);
    });

    it('heal은 최대 체력을 초과할 수 없다', () => {
        const castle = new Castle(0, 0, 'player');
        castle.hp = castle.maxHp - 50;

        castle.heal(200);

        expect(castle.hp).toBe(castle.maxHp);
    });

    it('쿨다운이 없으면 공격 가능해야 한다', () => {
        const castle = new Castle(0, 0, 'player');

        expect(castle.canAttack()).toBe(true);
    });

    it('attack 호출 시 데미지를 반환하고 쿨다운이 시작되어야 한다', () => {
        const castle = new Castle(0, 0, 'player');

        const damage = castle.attack();

        expect(damage).toBe(CONSTANTS.CASTLE.ATTACK_DAMAGE);
        expect(castle.currentCooldown).toBe(CONSTANTS.CASTLE.ATTACK_COOLDOWN);
        expect(castle.canAttack()).toBe(false);
    });

    it('쿨다운 중에는 공격 데미지가 0이어야 한다', () => {
        const castle = new Castle(0, 0, 'player');
        castle.attack();

        const secondAttackDamage = castle.attack();

        expect(secondAttackDamage).toBe(0);
    });

    it('update로 쿨다운이 감소해야 한다', () => {
        const castle = new Castle(0, 0, 'player');
        castle.attack();
        const cooldownAfterAttack = castle.currentCooldown;

        castle.update(10);

        expect(castle.currentCooldown).toBe(cooldownAfterAttack - 10);
    });

    it('isInRange는 범위 내 대상에 대해 true를 반환해야 한다', () => {
        const castle = new Castle(0, 0, 'player');
        const target = { x: 100, width: 20 };

        expect(castle.isInRange(target)).toBe(true);
    });

    it('isInRange는 범위 밖 대상에 대해 false를 반환해야 한다', () => {
        const castle = new Castle(0, 0, 'player');
        const target = { x: 500, width: 20 };

        expect(castle.isInRange(target)).toBe(false);
    });

    it('getHpRatio는 올바른 체력 비율을 반환해야 한다', () => {
        const castle = new Castle(0, 0, 'player');
        castle.hp = castle.maxHp / 2;

        expect(castle.getHpRatio()).toBe(0.5);
    });

    it('AI 성은 다른 색상을 가져야 한다', () => {
        const playerCastle = new Castle(0, 0, 'player');
        const aiCastle = new Castle(0, 0, 'ai');

        expect(playerCastle.color).toBe('#4a90d9');
        expect(aiCastle.color).toBe('#d94a4a');
    });
});
