export const CONSTANTS = {
    GAME: {
        WIDTH: 1280,
        HEIGHT: 720,
        FPS: 60,
    },
    CASTLE: {
        MAX_HP: 1000,
        ATTACK_RANGE: 500,
        ATTACK_DAMAGE: 20, // reduced from 50 for balance
        ATTACK_COOLDOWN: 1.5, // seconds (slower attack)
    },
    MONSTER: {
        // defined later
    },
    ENERGY: {
        INIT: 10,
        MAX: 100, // example cap
        REGEN_RATE: 1, // per sec (normal)
        BOOST_RATE: 2, // per sec (last 30s)
    }
};
