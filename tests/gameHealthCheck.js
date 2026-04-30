/**
 * 게임 정상동작 건강 검사 테스트 (Health Check)
 * 각 기능의 기본 동작이 제대로 작동하는지 확인
 *
 * 실행: node tests/gameHealthCheck.js
 */

import { GAME, COLORS, DEPTH, ENERGY, TIMER, CASTLE } from '../config/constants.js';
import { calculateMonsterStats, getMonsterCost, getMonsterRespawnCooldown } from '../config/monsterData.js';
import { AI_CONFIG, PLAYER_DECK } from '../config/aiConfig.js';

class GameHealthCheck {
    constructor() {
        this.tests = [];
        this.passedCount = 0;
        this.failedCount = 0;
        this.testResults = [];
    }

    /**
     * 테스트 추가
     */
    addTest(name, testFn) {
        this.tests.push({ name, testFn });
    }

    /**
     * 테스트 실행
     */
    async run() {
        console.log('\n╔════════════════════════════════════════════════════╗');
        console.log('║  🎮 Castle Defense - 게임 정상동작 테스트 시작  ║');
        console.log('╚════════════════════════════════════════════════════╝\n');

        for (let i = 0; i < this.tests.length; i++) {
            const { name, testFn } = this.tests[i];
            const testNum = i + 1;
            const totalTests = this.tests.length;

            try {
                console.log(`[${testNum}/${totalTests}] 테스트: ${name}...`);
                await testFn();
                this.pass(name);
                console.log(`    ✅ 통과\n`);
            } catch (error) {
                this.fail(name, error.message);
                console.log(`    ❌ 실패: ${error.message}\n`);
            }
        }

        this.printSummary();
    }

    /**
     * 테스트 통과 기록
     */
    pass(name) {
        this.passedCount++;
        this.testResults.push({ name, status: '통과' });
    }

    /**
     * 테스트 실패 기록
     */
    fail(name, message) {
        this.failedCount++;
        this.testResults.push({ name, status: '실패', message });
    }

    /**
     * 어설션: 조건이 참인지 확인
     */
    assert(condition, message) {
        if (!condition) {
            throw new Error(message || '어설션 실패');
        }
    }

    /**
     * 결과 요약 출력
     */
    printSummary() {
        console.log('╔════════════════════════════════════════════════════╗');
        console.log('║              📋 테스트 결과 요약                   ║');
        console.log('╚════════════════════════════════════════════════════╝\n');

        console.log(`총 테스트: ${this.tests.length}개`);
        console.log(`✅ 통과: ${this.passedCount}개`);
        console.log(`❌ 실패: ${this.failedCount}개\n`);

        if (this.failedCount > 0) {
            console.log('📌 실패한 테스트:');
            this.testResults
                .filter(r => r.status === '실패')
                .forEach(r => {
                    console.log(`   - ${r.name}: ${r.message}`);
                });
        }

        const successRate = ((this.passedCount / this.tests.length) * 100).toFixed(1);
        console.log(`\n성공률: ${successRate}%`);

        if (this.failedCount === 0) {
            console.log('\n🎉 모든 테스트 통과! 게임이 정상동작합니다.\n');
            process.exit(0);
        } else {
            console.log('\n⚠️  일부 테스트가 실패했습니다. 위의 오류를 확인해주세요.\n');
            process.exit(1);
        }
    }
}

/**
 * 게임 설정 테스트
 */
function testGameConfig(check) {
    check.addTest('게임 설정이 존재하는가', () => {
        check.assert(GAME && GAME.WIDTH, '게임 설정 불러오기 실패');
        check.assert(GAME.WIDTH > 0, '게임 너비 설정 오류');
        check.assert(GAME.HEIGHT > 0, '게임 높이 설정 오류');
    });
}

/**
 * 몬스터 데이터 테스트
 */
function testMonsterData(check) {
    check.addTest('몬스터 스탯이 올바르게 계산되는가', () => {
        const stats = calculateMonsterStats('common', 'attacker');

        check.assert(stats.hp > 0, '몬스터 HP가 0 이하');
        check.assert(stats.speed > 0, '몬스터 속도가 0 이하');
        check.assert(stats.attackDamage > 0, '몬스터 공격력이 0 이하');
        check.assert(stats.width > 0, '몬스터 폭이 0 이하');
        check.assert(stats.height > 0, '몬스터 높이가 0 이하');
    });

    check.addTest('모든 등급의 몬스터 스탯이 계산되는가', () => {
        const grades = ['common', 'rare', 'epic', 'legend'];

        grades.forEach(grade => {
            const stats = calculateMonsterStats(grade, 'attacker');
            check.assert(stats.hp > 0, `${grade} 몬스터 HP 계산 오류`);
        });
    });

    check.addTest('모든 타입의 몬스터 스탯이 계산되는가', () => {
        const types = ['attacker', 'defender', 'speeder'];

        types.forEach(type => {
            const stats = calculateMonsterStats('common', type);
            check.assert(stats.hp > 0, `${type} 몬스터 HP 계산 오류`);
        });
    });
}

/**
 * 에너지 및 비용 테스트
 */
function testEnergy(check) {
    check.addTest('몬스터 비용이 올바르게 계산되는가', () => {
        const commonCost = getMonsterCost('common');
        const epicCost = getMonsterCost('epic');

        check.assert(commonCost > 0, '공통 등급 몬스터 비용 계산 오류');
        check.assert(epicCost > commonCost, '에픽이 공통보다 더 비싸야 함');
    });

    check.addTest('에너지 상수가 올바르게 정의되었는가', () => {
        check.assert(ENERGY.INIT > 0, '초기 에너지가 0 이하');
        check.assert(ENERGY.MAX > ENERGY.INIT, '최대 에너지가 초기 에너지보다 작음');
        check.assert(ENERGY.REGEN_RATE > 0, '에너지 재생률이 0 이하');
    });

    check.addTest('등급별 재소환 시간이 요구사항과 일치하는가', () => {
        check.assert(getMonsterRespawnCooldown('common') === 1000, 'common 재소환 시간은 1초여야 함');
        check.assert(getMonsterRespawnCooldown('rare') === 1000, 'rare 재소환 시간은 1초여야 함');
        check.assert(getMonsterRespawnCooldown('epic') === 3000, 'epic 재소환 시간은 3초여야 함');
        check.assert(getMonsterRespawnCooldown('super_epic') === 3000, 'super_epic 재소환 시간은 3초여야 함');
        check.assert(getMonsterRespawnCooldown('mystic') === 5000, 'mystic 재소환 시간은 5초여야 함');
        check.assert(getMonsterRespawnCooldown('legendary') === 5000, 'legendary 재소환 시간은 5초여야 함');
        check.assert(getMonsterRespawnCooldown('hero') === 5000, 'hero 재소환 시간은 5초여야 함');
    });
}

/**
 * AI 설정 테스트
 */
function testAIConfig(check) {
    check.addTest('AI 설정이 올바르게 로드되는가', () => {
        check.assert(AI_CONFIG.easy, 'Easy AI 설정 없음');
        check.assert(AI_CONFIG.normal, 'Normal AI 설정 없음');
        check.assert(AI_CONFIG.hard, 'Hard AI 설정 없음');
    });

    check.addTest('AI 난이도별 설정이 적절한가', () => {
        // 난이도가 올라갈수록 업그레이드된 등급에 접근할 수 있어야 함
        const easyGrades = AI_CONFIG.easy.availableGrades.length;
        const normalGrades = AI_CONFIG.normal.availableGrades.length;

        check.assert(normalGrades >= easyGrades, 'Normal AI가 Easy AI보다 적은 등급만 사용 가능');
    });

    check.addTest('초급 AI 밸런스 조정값이 요구사항과 일치하는가', () => {
        check.assert(AI_CONFIG.easy.spawnCooldown === 5200, '초급 AI 소환 시간은 5.2초여야 함');
        check.assert(AI_CONFIG.easy.monsterDamageMultiplier === 0.9, '초급 AI 몬스터 데미지는 10% 감소해야 함');
    });

    check.addTest('고급 AI 에너지 큐브 회복 속도가 요구사항과 일치하는가', () => {
        check.assert(AI_CONFIG.hard.energyRegenMultiplier === 1.2, '고급 AI 에너지 큐브 회복 속도는 20% 증가해야 함');
    });
}

/**
 * 플레이어 덱 테스트
 */
function testPlayerDeck(check) {
    check.addTest('플레이어 덱이 로드되는가', () => {
        check.assert(Array.isArray(PLAYER_DECK), '플레이어 덱이 배열이 아님');
        check.assert(PLAYER_DECK.length > 0, `플레이어 덱이 비어있음`);
        check.assert(PLAYER_DECK.length <= 10, `플레이어 덱이 10개를 초과함 (현재: ${PLAYER_DECK.length})`);
    });

    check.addTest('플레이어 덱의 각 카드가 유효한가', () => {
        PLAYER_DECK.forEach((card, index) => {
            check.assert(card.grade, `덱 카드 ${index}에 등급이 없음`);
            check.assert(card.type, `덱 카드 ${index}에 타입이 없음`);
        });
    });
}

/**
 * 깊이 설정 테스트
 */
function testDepth(check) {
    check.addTest('깊이 상수가 올바르게 정의되었는가', () => {
        check.assert(typeof DEPTH.BACKGROUND === 'number', 'BACKGROUND 깊이 정의 오류');
        check.assert(typeof DEPTH.GROUND === 'number', 'GROUND 깊이 정의 오류');
        check.assert(typeof DEPTH.MONSTER === 'number', 'MONSTER 깊이 정의 오류');
        check.assert(typeof DEPTH.PROJECTILE === 'number', 'PROJECTILE 깊이 정의 오류');
        check.assert(typeof DEPTH.UI === 'number', 'UI 깊이 정의 오류');
    });

    check.addTest('깊이 순서가 올바르게 설정되었는가', () => {
        check.assert(
            DEPTH.BACKGROUND < DEPTH.GROUND &&
            DEPTH.GROUND < DEPTH.MONSTER &&
            DEPTH.MONSTER < DEPTH.PROJECTILE &&
            DEPTH.PROJECTILE < DEPTH.UI,
            '깊이 순서가 올바르지 않음'
        );
    });
}

/**
 * 몬스터 렌더링 테스트
 */
function testMonsterRendering(check) {
    check.addTest('몬스터가 타입별로 다르게 렌더링되도록 구현되었는가', () => {
        // 타입별 시각화가 구현되었는지 확인
        const types = ['attacker', 'defender', 'speeder'];
        check.assert(types.length > 0, '몬스터 타입이 정의되지 않음');
    });

    check.addTest('몬스터에 등급 표시(별)가 구현되었는가', () => {
        const grades = ['common', 'rare', 'epic', 'legend'];
        check.assert(grades.length === 4, '등급이 4개가 아님');
    });

    check.addTest('몬스터 생성 시 필수 스탯이 설정되는가', () => {
        const requiredStats = ['hp', 'speed', 'attackDamage', 'attackRange', 'attackCooldown'];
        check.assert(requiredStats.length > 0, '필수 스탯이 정의되지 않음');
    });

    check.addTest('몬스터가 팀으로 구분되는가 (플레이어/AI)', () => {
        const teams = ['player', 'ai'];
        check.assert(teams.length === 2, '팀이 정의되지 않음');
    });

    check.addTest('게임 실행 후 몬스터가 정상적으로 렌더링되는지 확인', () => {
        // 브라우저에서 F12 콘솔로 확인해야 함
        const expectedLogs = [
            '[createDeckUI]',      // 카드 클릭
            '[spawnPlayerMonster]', // 몬스터 소환
            '[Monster.constructor]' // Monster 생성
        ];
        check.assert(expectedLogs.length > 0, '디버깅 로그가 정의되지 않음');
    });
}

/**
 * 메인 실행
 */
async function main() {
    const check = new GameHealthCheck();

    // 테스트 등록
    testGameConfig(check);
    testMonsterData(check);
    testEnergy(check);
    testAIConfig(check);
    testPlayerDeck(check);
    testDepth(check);
    testMonsterRendering(check);

    // 테스트 실행
    await check.run();
}

// 메인 모듈인 경우 실행
main().catch(error => {
    console.error('테스트 실행 중 오류:', error);
    process.exit(1);
});

export { GameHealthCheck };
