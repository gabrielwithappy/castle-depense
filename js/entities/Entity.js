export default class Entity {
    constructor(x, y, width, height, color, team) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.team = team; // 'player' or 'ai'
        this.isDead = false;
    }

    update(dt) {
        // Base update logic (if any)
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Debug team indicator
        ctx.strokeStyle = this.team === 'player' ? 'blue' : 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}
