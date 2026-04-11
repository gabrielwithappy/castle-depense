import { describe, it, expect } from '../simple_test.js';
import Projectile from '../../js/entities/Projectile.js';

describe('Projectile', () => {

    describe('생성자 (constructor)', () => {
        it('시작 위치가 올바르게 설정되어야 한다', () => {
            const proj = new Projectile(0, 300, 500, 300, 50, 100, 'player');
            expect(proj.x).toBe(0);
            expect(proj.y).toBe(300);
        });

        it('목표 위치가 올바르게 설정되어야 한다', () => {
            const proj = new Projectile(0, 300, 500, 300, 50, 100, 'player');
            expect(proj.targetX).toBe(500);
            expect(proj.targetY).toBe(300);
        });

        it('데미지와 속도가 올바르게 설정되어야 한다', () => {
            const proj = new Projectile(0, 300, 500, 300, 75, 200, 'player');
            expect(proj.damage).toBe(75);
            expect(proj.speed).toBe(200);
        });

        it('팀이 올바르게 설정되어야 한다', () => {
            const playerProj = new Projectile(0, 300, 500, 300, 50, 100, 'player');
            const aiProj = new Projectile(0, 300, 500, 300, 50, 100, 'ai');
            expect(playerProj.team).toBe('player');
            expect(aiProj.team).toBe('ai');
        });

        it('기본 팀은 player 여야 한다', () => {
            const proj = new Projectile(0, 300, 500, 300, 50, 100);
            expect(proj.team).toBe('player');
        });

        it('초기화 시 isDead는 false여야 한다', () => {
            const proj = new Projectile(0, 300, 500, 300, 50, 100);
            expect(proj.isDead).toBe(false);
        });
    });

    describe('update() 메서드', () => {
        it('update 후 x 위치가 증가해야 한다 (오른쪽으로 이동)', () => {
            const proj = new Projectile(0, 300, 500, 300, 50, 100, 'player');
            const initialX = proj.x;
            proj.update(1); // 1초 경과
            expect(proj.x).toBeGreaterThan(initialX);
        });

        it('속도에 비례하여 이동해야 한다', () => {
            const proj = new Projectile(0, 300, 500, 300, 50, 100, 'player');
            proj.update(1); // 1초 경과, 100 pixels/sec
            expect(proj.x).toBe(100); // 수평 이동
        });

        it('대각선 이동이 올바르게 작동해야 한다', () => {
            const proj = new Projectile(0, 0, 300, 400, 50, 500, 'player');
            // 3-4-5 삼각형 (거리 = 500)
            proj.update(1); // 1초 경과, 500 pixels
            // 목표에 도달해야 함
            expect(proj.hasReachedTarget()).toBe(true);
        });

        it('isDead가 true면 update가 작동하지 않아야 한다', () => {
            const proj = new Projectile(0, 300, 500, 300, 50, 100, 'player');
            proj.isDead = true;
            const initialX = proj.x;
            proj.update(1);
            expect(proj.x).toBe(initialX);
        });
    });

    describe('hasReachedTarget() 메서드', () => {
        it('초기 상태에서는 false여야 한다', () => {
            const proj = new Projectile(0, 300, 500, 300, 50, 100, 'player');
            expect(proj.hasReachedTarget()).toBe(false);
        });

        it('목표에 도달하면 true여야 한다', () => {
            const proj = new Projectile(0, 300, 100, 300, 50, 200, 'player');
            proj.update(1); // 200 pixels 이동, 목표까지 100 pixels
            expect(proj.hasReachedTarget()).toBe(true);
        });

        it('목표 도달 시 isDead가 true가 되어야 한다', () => {
            const proj = new Projectile(0, 300, 100, 300, 50, 200, 'player');
            proj.update(1);
            expect(proj.isDead).toBe(true);
        });
    });

    describe('draw() 메서드', () => {
        it('isDead가 true면 draw가 작동하지 않아야 한다', () => {
            const proj = new Projectile(0, 300, 500, 300, 50, 100, 'player');
            proj.isDead = true;

            // Mock context
            const mockCtx = {
                save: () => { },
                restore: () => { },
                beginPath: () => { },
                arc: () => { },
                fill: () => { },
                stroke: () => { },
                fillStyle: '',
                strokeStyle: '',
                lineWidth: 0,
                shadowColor: '',
                shadowBlur: 0
            };

            // draw 호출 시 아무것도 하지 않아야 함
            let arcCalled = false;
            mockCtx.arc = () => { arcCalled = true; };
            proj.draw(mockCtx);
            expect(arcCalled).toBe(false);
        });
    });

    describe('방향 벡터 계산', () => {
        it('오른쪽으로 이동 시 directionX가 1이어야 한다', () => {
            const proj = new Projectile(0, 300, 500, 300, 50, 100, 'player');
            expect(proj.directionX).toBe(1);
            expect(proj.directionY).toBe(0);
        });

        it('왼쪽으로 이동 시 directionX가 -1이어야 한다', () => {
            const proj = new Projectile(500, 300, 0, 300, 50, 100, 'player');
            expect(proj.directionX).toBe(-1);
            expect(proj.directionY).toBe(0);
        });

        it('위쪽으로 이동 시 directionY가 -1이어야 한다', () => {
            const proj = new Projectile(300, 500, 300, 0, 50, 100, 'player');
            expect(proj.directionX).toBe(0);
            expect(proj.directionY).toBe(-1);
        });

        it('같은 위치일 경우 방향 벡터가 0이어야 한다', () => {
            const proj = new Projectile(300, 300, 300, 300, 50, 100, 'player');
            expect(proj.directionX).toBe(0);
            expect(proj.directionY).toBe(0);
        });
    });

});
