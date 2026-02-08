/**
 * UIManager 클래스 - DOM 요소 업데이트 및 UI 이벤트 처리
 */
export default class UIManager {
    constructor() {
        // DOM 요소 캐싱
        this.playerHpEl = document.getElementById('player-hp');
        this.playerEnergyEl = document.getElementById('player-energy');
        this.aiHpEl = document.getElementById('ai-hp');
        this.timerEl = document.getElementById('timer');
        this.deckContainer = document.getElementById('deck-container');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.gameResultEl = document.getElementById('game-result');
        this.restartBtn = document.getElementById('restart-btn');

        // 콜백
        this.onCardClick = null;
        this.onRestart = null;

        this.setupEventListeners();
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', () => {
                if (this.onRestart) this.onRestart();
            });
        }
    }

    /**
     * 덱 UI 생성
     */
    createDeckUI(deckInfo) {
        if (!this.deckContainer) return;

        this.deckContainer.innerHTML = '';

        const gradeEmojis = {
            common: '👻',
            rare: '👽',
            epic: '🤖',
            legend: '🐲'
        };

        deckInfo.forEach((slot, index) => {
            const btn = document.createElement('button');
            btn.className = 'card-btn';
            btn.dataset.index = index;
            btn.innerHTML = `
                <span class="emoji">${gradeEmojis[slot.grade] || '❓'}</span>
                <span class="cost">${slot.cost}⚡</span>
            `;

            btn.addEventListener('click', () => {
                if (this.onCardClick) {
                    this.onCardClick(index);
                }
            });

            this.deckContainer.appendChild(btn);
        });
    }

    /**
     * 덱 UI 업데이트 (비용 가능 여부)
     */
    updateDeckUI(deckInfo) {
        if (!this.deckContainer) return;

        const buttons = this.deckContainer.querySelectorAll('.card-btn');
        buttons.forEach((btn, index) => {
            const slot = deckInfo[index];
            if (slot) {
                btn.classList.toggle('disabled', !slot.affordable);
            }
        });
    }

    /**
     * 게임 상태 UI 업데이트
     */
    updateGameUI(data) {
        if (this.playerHpEl) {
            this.playerHpEl.textContent = `HP: ${data.playerHp}`;
        }
        if (this.aiHpEl) {
            this.aiHpEl.textContent = `HP: ${data.aiHp}`;
        }
        if (this.playerEnergyEl) {
            this.playerEnergyEl.textContent = `⚡ ${data.playerEnergy}`;
        }
        if (this.timerEl) {
            const minutes = Math.floor(data.time / 60);
            const seconds = data.time % 60;
            this.timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    /**
     * 게임 오버 화면 표시
     */
    showGameOver(winner) {
        if (!this.gameOverScreen) return;

        this.gameOverScreen.classList.remove('hidden');

        if (this.gameResultEl) {
            if (winner === 'player') {
                this.gameResultEl.textContent = '🎉 VICTORY! 🎉';
                this.gameResultEl.style.color = '#4caf50';
            } else if (winner === 'ai') {
                this.gameResultEl.textContent = '☠️ DEFEAT ☠️';
                this.gameResultEl.style.color = '#f44336';
            } else {
                this.gameResultEl.textContent = '⏰ TIME OUT ⏰';
                this.gameResultEl.style.color = '#ff9800';
            }
        }
    }

    /**
     * 게임 오버 화면 숨기기
     */
    hideGameOver() {
        if (this.gameOverScreen) {
            this.gameOverScreen.classList.add('hidden');
        }
    }
}
