/**
 * 몬스터 등급별 스탯 정의
 */
export const MONSTER_STATS = {
    common: {
        width: 40,
        height: 60,
        speed: 50,
        attackDamage: 20,
        attackRange: 30,
        attackCooldown: 1000, // ms
        hp: 100,
        color: 0x8B4513,
        cost: 2
    },
    rare: {
        width: 50,
        height: 70,
        speed: 40,
        attackDamage: 40,
        attackRange: 40,
        attackCooldown: 1200,
        hp: 200,
        color: 0x4169E1,
        cost: 4
    },
    epic: {
        width: 60,
        height: 80,
        speed: 35,
        attackDamage: 60,
        attackRange: 50,
        attackCooldown: 1500,
        hp: 350,
        color: 0x9932CC,
        cost: 6
    },
    legend: {
        width: 70,
        height: 90,
        speed: 30,
        attackDamage: 100,
        attackRange: 60,
        attackCooldown: 2000,
        hp: 500,
        color: 0xFFD700,
        cost: 10
    }
};

/**
 * 몬스터 타입별 수정자
 */
export const MONSTER_TYPE_MODIFIERS = {
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
 * 몬스터 비용 계산
 */
export function getMonsterCost(grade) {
    return MONSTER_STATS[grade]?.cost || 2;
}

/**
 * 몬스터 스탯 계산 (등급 + 타입)
 */
export function calculateMonsterStats(grade, type) {
    const baseStats = MONSTER_STATS[grade] || MONSTER_STATS.common;
    const modifiers = MONSTER_TYPE_MODIFIERS[type] || MONSTER_TYPE_MODIFIERS.attacker;

    return {
        ...baseStats,
        hp: Math.floor(baseStats.hp * modifiers.hp),
        attackDamage: Math.floor(baseStats.attackDamage * modifiers.attackDamage),
        speed: baseStats.speed * modifiers.speed
    };
}
