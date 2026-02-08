export const CONSTANTS = {
    GAME: {
        WIDTH: 1280,
        HEIGHT: 720,
        FPS: 60,
    },
    CASTLE: {
        MAX_HP: 1000,
        ATTACK_RANGE: 300,
        ATTACK_DAMAGE: 50,
        ATTACK_COOLDOWN: 60, // frames (1 sec)
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
