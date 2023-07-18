import Player from "./Player.js";
import Projectile from "./Projectile.js";

let socket = io();

const startScreen = document.getElementById('startScreen');
const playBtn = document.getElementById('playBtn');
const playerName = document.getElementById('inputPlayer1');
const playerColor = document.getElementById('colorPlayer1');
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let frontendPlayers = [];
let frontendProjectiles = [];
let timeTillNextProjectile = 0;

// const projectile = new Projectile(canvas, 100, 600, 123);

socket.on("updatePlayers", backendPlayers => {

    // Delete disconnected players from the frontendPlayers array
    frontendPlayers = frontendPlayers.filter(frontendPlayer => {
        return backendPlayers.some(backendPlayer => backendPlayer.id === frontendPlayer.id);
    });

    // Push each backendPlayers object into frontendPlayers array
    backendPlayers.forEach(backendPlayer => {
        // check if its still existing -> return and dont add it to the frontendPlayer array
        if (frontendPlayers.find(frontendPlayer => frontendPlayer.id === backendPlayer.id)) return;

        frontendPlayers.push(new Player(canvas, backendPlayer));
    })

})

socket.on("updatePlayerLocation", backendPlayer => {
    let player = frontendPlayers.find(frontendPlayer => frontendPlayer.id === backendPlayer.id);
    player.x = backendPlayer.x;
    player.y = backendPlayer.y;
})


socket.on("projectile", backendProjectile => {
    if (timeTillNextProjectile <= 0) {
        frontendProjectiles.push(new Projectile(canvas, backendProjectile.x, backendProjectile.y, backendProjectile.id));
        timeTillNextProjectile = backendProjectile.delay;
    }
    timeTillNextProjectile--;
})


let keyInputs = {};

window.addEventListener("keydown", (e) => {
    keyInputs[e.code] = true;
})

window.addEventListener("keyup", (e) => {
    delete keyInputs[e.code];
})


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
   
    // draw all the frontendPlayers in the frontendPlayers array
    frontendPlayers.forEach(frontendPlayer => {
        frontendPlayer.draw();
        drawPlayersName(frontendPlayer);
    });

    // draw all the frontendProjectiles in the frontendProjectiles array
    frontendProjectiles.forEach(projectile => {
        projectile.update();

        // check collision between projectile and player
        frontendPlayers.forEach(player => {
            const a = projectile.x - player.x;
            const b = projectile.y - player.y;
            const c = (a * a) + (b * b);
            const radii = projectile.radius + player.radius;

            if (radii * radii >= c) {
                console.log('COLLISION');
            }

        })
    })

    // // Player1 name from Input field
    socket.emit("keyDown", keyInputs);
}

// draw and display the name of the frontendPlayers
function drawPlayersName(player) {
    ctx.font = "15px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = player.color;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 8;
    ctx.fillText(player.name, player.x, player.y + player.radius * 2);
}


playBtn.addEventListener("click", () => {
    canvas.classList.remove("hidden");
    startScreen.classList.add("hidden");

    const playerInfos = {
        name: playerName.value,
        color: playerColor.value
    }

    socket.emit("playerHasRegistered", playerInfos);
    animate();
})
