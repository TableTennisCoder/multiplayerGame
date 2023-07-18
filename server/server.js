const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const publicPath = path.join(__dirname, "/../public");

app.use(express.static(publicPath));

// store all the players
let backendPlayers = [];

io.on("connection", (socket) => {
  // user has connected

  // When the new Player has entered his username and pressed PLAY
  socket.on("playerHasRegistered", (playerInfos) => {
    const player = {
      id: socket.id,
      x: 500 * Math.random(),
      y: 500 * Math.random(),
      name: playerInfos.name,
      color: playerInfos.color
    };

    // add a new player inside the backednPlayers array when a new user connects
    backendPlayers.push(player);

    // send an event to all the clients with the backendPlayers array as data
    io.emit("updatePlayers", backendPlayers);
  });

  // when user disconnects
  socket.on("disconnect", () => {
    // delete the disconnected player from the backendPlayers array
    backendPlayers = backendPlayers.filter(
      (backendPlayer) => backendPlayer.id !== socket.id
    );
    io.emit("updatePlayers", backendPlayers);
  });

  socket.on("keyDown", (keyInputs) => {
    // find the specific player in the backendPlayers array which pressed the key on the keyboard
    const player = backendPlayers.find(
      (backendPlayer) => backendPlayer.id === socket.id
    );

    if (player) {
      if (keyInputs["ArrowUp"]) {
        player.y -= 5;
      }
      if (keyInputs["ArrowRight"]) {
        player.x += 5;
      }
      if (keyInputs["ArrowDown"]) {
        player.y += 5;
      }
      if (keyInputs["ArrowLeft"]) {
        player.x -= 5;
      }

      io.emit("updatePlayerLocation", player);

      if (keyInputs["Space"]) {
        const projectile = {
          id: player.id,
          x: player.x,
          y: player.y,
          delay: 7,
        };

        io.emit("projectile", projectile);
      }
    }
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
