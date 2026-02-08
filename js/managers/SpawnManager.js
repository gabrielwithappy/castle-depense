/**
 * SpawnManager 클래스 - AI 및 플레이어의 유닛 소환 관리
 */
export default class SpawnManager {
    constructor(game) {
        this.game = game;

        // AI 설정
        this.aiLevel = 'normal'; // 'easy', 'normal', 'hard'
        this.aiSpawnTimer = 0;
        this.aiSpawnCooldown = 3; // 초

        // AI 등급별 사용 가능 몬스터
        this.aiGrades = {
            easy: ['common'],
            normal: ['common', 'rare'],
            hard: ['common', 'rare', 'epic', 'legend']
        };

        // 몬스터 비용 정의
        this.costs = {
            common: 2,
            rare: 4,
            epic: 6,
            legend: 10
        };

        // 플레이어 덱 (사용 가능한 몬스터 슬롯)
        this.playerDeck = [
            { grade: 'common', type: 'attacker' },
            { grade: 'common', type: 'defender' },
            { grade: 'rare', type: 'attacker' },
            { grade: 'rare', type: 'speeder' },
            { grade: 'epic', type: 'attacker' },
            { grade: 'epic', type: 'defender' },
            { grade: 'legend', type: 'attacker' }
        ];
    }

    /**
     * AI 난이도 설정
     */
    setAILevel(level) {
        if (this.aiGrades[level]) {
            this.aiLevel = level;
        }
    }

    /**
     * 매 프레임 업데이트 (AI 자동 소환)
     */
    update(dt) {
        this.aiSpawnTimer += dt;

        if (this.aiSpawnTimer >= this.aiSpawnCooldown) {
            this.aiSpawnTimer = 0;
            this.spawnAIMonster();
        }
    }

    /**
     * AI 몬스터 자동 소환
     */
    spawnAIMonster() {
        const availableGrades = this.aiGrades[this.aiLevel];

        // 현재 에너지로 소환 가능한 등급 필터
        const affordable = availableGrades.filter(grade => {
            return this.game.aiEnergy >= this.costs[grade];
        });

        if (affordable.length === 0) return;

        // 랜덤 선택
        const grade = affordable[Math.floor(Math.random() * affordable.length)];
        const types = ['attacker', 'defender', 'speeder'];
        const type = types[Math.floor(Math.random() * types.length)];

        this.game.spawnMonster('ai', grade, type);
    }

    /**
     * 플레이어 몬스터 소환 (덱 슬롯 번호로)
     */
    spawnPlayerMonster(slotIndex) {
        if (slotIndex < 0 || slotIndex >= this.playerDeck.length) {
            return false;
        }

        const slot = this.playerDeck[slotIndex];
        const cost = this.costs[slot.grade];

        if (this.game.playerEnergy < cost) {
            return false;
        }

        return this.game.spawnMonster('player', slot.grade, slot.type);
    }

    /**
     * 덱 정보 반환 (UI용)
     */
    getDeckInfo() {
        return this.playerDeck.map((slot, index) => ({
            index,
            grade: slot.grade,
            type: slot.type,
            cost: this.costs[slot.grade],
            affordable: this.game.playerEnergy >= this.costs[slot.grade]
        }));
    }
}
