import Monster from '../../js/entities/Monster.js';
import { describe, it, expect } from '../simple_test.js';

describe('Monster 클래스', () => {
    it('기본 생성자로 common/attacker 몬스터 생성', () => {
        const monster = new Monster('player');
        expect(monster.team).toBe('player');
        expect(monster.grade).toBe('common');
        expect(monster.type).toBe('attacker');
        expect(monster.state).toBe('moving');
    });

    it('rare/defender 몬스터 생성 시 스탯 적용', () => {
        const monster = new Monster('ai', 'rare', 'defender');
        expect(monster.grade).toBe('rare');
        expect(monster.type).toBe('defender');
        // defender는 hp 1.5배, 공격력 0.8배
        expect(monster.maxHp).toBe(300); // 200 * 1.5
        expect(monster.attackDamage).toBe(32); // 40 * 0.8
    });

    it('move() 호출 시 x 좌표 변경', () => {
        const monster = new Monster('player', 'common', 'attacker', 100, 300);
        const initialX = monster.x;
        monster.move(1, 1); // 오른쪽으로 1초 이동
        expect(monster.x).toBeGreaterThan(initialX);
    });

    it('move() 음수 방향 호출 시 왼쪽 이동', () => {
        const monster = new Monster('ai', 'common', 'attacker', 500, 300);
        const initialX = monster.x;
        monster.move(-1, 1); // 왼쪽으로 1초 이동
        expect(initialX).toBeGreaterThan(monster.x);
    });

    it('takeDamage() 호출 시 HP 감소', () => {
        const monster = new Monster('player', 'common', 'attacker');
        const initialHp = monster.hp;
        monster.takeDamage(30);
        expect(monster.hp).toBe(initialHp - 30);
    });

    it('HP가 0 이하가 되면 dead 상태', () => {
        const monster = new Monster('player', 'common', 'attacker');
        monster.takeDamage(monster.hp + 10);
        expect(monster.state).toBe('dead');
        expect(monster.isDead).toBe(true);
    });

    it('dead 상태에서 move() 무시', () => {
        const monster = new Monster('player', 'common', 'attacker', 100, 300);
        monster.takeDamage(monster.hp);
        const deadX = monster.x;
        monster.move(1, 1);
        expect(monster.x).toBe(deadX);
    });

    it('attack() 호출 시 타겟에 데미지', () => {
        const attacker = new Monster('player', 'common', 'attacker');
        const target = new Monster('ai', 'common', 'defender');
        const targetInitialHp = target.hp;

        attacker.attack(target);
        expect(target.hp).toBe(targetInitialHp - attacker.attackDamage);
    });

    it('distanceTo() 거리 계산', () => {
        const m1 = new Monster('player', 'common', 'attacker', 0, 300);
        const m2 = new Monster('ai', 'common', 'attacker', 100, 300);
        const dist = m1.distanceTo(m2);
        expect(dist).toBe(100); // 중심점 기준
    });

    it('findTarget() 범위 내 적 탐색', () => {
        const monster = new Monster('player', 'common', 'attacker', 100, 300);
        const enemy = new Monster('ai', 'common', 'attacker', 120, 300); // 가까움

        const target = monster.findTarget([enemy]);
        expect(target).toBe(enemy);
    });

    it('findTarget() 범위 밖 적은 null 반환', () => {
        const monster = new Monster('player', 'common', 'attacker', 0, 300);
        const enemy = new Monster('ai', 'common', 'attacker', 500, 300); // 멀리 있음

        const target = monster.findTarget([enemy]);
        expect(target).toBe(null);
    });

    it('update() - 적 없으면 이동', () => {
        const monster = new Monster('player', 'common', 'attacker', 100, 300);
        const initialX = monster.x;
        monster.update(1, []); // 1초, 적 없음
        expect(monster.x).toBeGreaterThan(initialX);
        expect(monster.state).toBe('moving');
    });

    it('update() - 적 범위 내에 있으면 공격 상태 전환', () => {
        const monster = new Monster('player', 'common', 'attacker', 100, 300);
        const enemy = new Monster('ai', 'common', 'attacker', 110, 300);

        monster.update(1, [enemy]);
        expect(monster.state).toBe('attacking');
    });

    it('speeder 타입은 빠른 속도', () => {
        const speeder = new Monster('player', 'common', 'speeder');
        const normal = new Monster('player', 'common', 'attacker');
        expect(speeder.speed).toBeGreaterThan(normal.speed);
    });

    it('legend 등급 스탯 확인', () => {
        const legend = new Monster('player', 'legend', 'attacker');
        expect(legend.grade).toBe('legend');
        expect(legend.maxHp).toBe(400); // 500 * 0.8 (attacker modifier)
        expect(legend.attackDamage).toBe(150); // 100 * 1.5
    });
});
