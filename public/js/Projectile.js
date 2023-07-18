export default class Projectile {
    constructor(canvas, x, y, id) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.id = id;
        this.radius = 5;
        this.x = x;
        this.y = y -25;
        this.speed = 5;

        this.delete = false;
    }

    draw() {
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();
    }

    update() {

        if (this.y - this.radius < 0 ||
            this.y + this.radius > this.canvas.height ||
            this.x - this.radius < 0 ||
            this.x + this.radius > this.canvas.width
            ) {
                this.delete = true;
            }
        this.draw();
        this.y -= this.speed;
    }
}