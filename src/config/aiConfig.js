/**
 * AI 난이도별 설정
 */
export const AI_CONFIG = {
    easy: {
        name: '초급',
        spawnCooldown: 4000, // ms
        availableGrades: ['common'],
        decisionDelay: 500  // AI 반응 속도
    },
    normal: {
        name: '중급',
        spawnCooldown: 3000,
        availableGrades: ['common', 'rare'],
        decisionDelay: 300
    },
    hard: {
        name: '고급',
        spawnCooldown: 2000,
        availableGrades: ['common', 'rare', 'epic', 'legend'],
        decisionDelay: 100
    }
};

/**
 * 플레이어 기본 덱 구성
 */
export const PLAYER_DECK = [
    { grade: 'common', type: 'attacker' },
    { grade: 'common', type: 'defender' },
    { grade: 'rare', type: 'attacker' },
    { grade: 'rare', type: 'speeder' },
    { grade: 'epic', type: 'attacker' },
    { grade: 'epic', type: 'defender' },
    { grade: 'legend', type: 'attacker' }
];
