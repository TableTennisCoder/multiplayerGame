export default class Player {
    constructor(canvas, player) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.name = player.name;
        this.id = player.id;
        this.x = player.x;
        this.y = player.y;
        this.radius = 15;
        this.speed = 5;
        this.color = player.color;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();
    }
}