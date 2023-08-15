const { verifyToken } = require("../helpers/tokenHelper");
const User = require("../models/userModel");
const Game = require("./Game");
const Player = require("./Player");

const games = [];

function socketController(socket) {
  socket.send(JSON.stringify({ meta: "connection made" }));

  socket.on("message", async (data) => {
    data = JSON.parse(data);

    const { token } = data;
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      socket.send(JSON.stringify({ meta: "error", payload: { message: "You are not authorized" } }));
    } else {
      const { meta } = data;
      switch (meta) {
        case "create game": {
          const { gameName, environmentName, entryFee, maxPlayers, maxPlayersToStart, player, isPrivate } =
            data.payload;
          const { playerName, countryName } = player[0];

          const player_c = new Player(playerName, countryName);
          const players = [];
          const sockets = [];
          const playerStates = [];
          for (let i = 0; i < maxPlayers; i++) {
            if (i == 0) {
              players[i] = player_c;
              sockets[i] = socket;
              playerStates[i] = {
                playerNetworkID: player_c.playerNetworkID,
                state: [],
              };
              for (let j = 0; j < 5; j++) {
                playerStates[i].state[j] = {
                  position: { x: 0.0, y: 0.0, z: 0.0 },
                  rotation: { x: 0.0, y: 0.0, z: 0.0 },
                  scale: { x: 0.0, y: 0.0, z: 0.0 },
                };
              }
            } else {
              players[i] = null;
              sockets[i] = null;
              playerStates[i] = null;
            }
          }
          const game_c = new Game(
            gameName,
            environmentName,
            entryFee,
            maxPlayers,
            maxPlayersToStart,
            players,
            isPrivate,
            false,
            sockets,
            playerStates
          );
          games.push(game_c);

          const { gameID, isGameStarted } = game_c;
          game_c.broadcast({ meta: "game created", payload: { gameID, players, isGameStarted } });
          break;
        }
        case "join game": {
          const { gameID, player } = data.payload;
          const game = games.find((g) => g.gameID == gameID);
          if (game) {
            if (game.checkGameFull()) {
              socket.send(JSON.stringify({ meta: "error", payload: { message: "Game is full" } }));
            } else {
              const { playerName, countryName } = player;
              const player_c = new Player(playerName, countryName);
              game.join(player_c, socket);

              const { players, isGameStarted } = game;
              game.broadcast({ meta: "game joined", payload: { players, isGameStarted } });

              if (game.checkGameStart()) {
                game.isGameStarted = true;
                const { players, isGameStarted } = game;
                game.broadcast({
                  meta: "game ready",
                  payload: { players, isGameStarted },
                });
              }
            }
          } else {
            socket.send(JSON.stringify({ meta: "error", payload: { message: "Game not found" } }));
          }
          break;
        }
        case "update player state": {
          const { gameID, playerState } = data.payload;
          const game = games.find((g) => g.gameID == gameID);
          if (game) {
            game.updatePlayerState(playerState);
            const { playerStates } = game;
            game.broadcast({ meta: "player state updated", payload: { playerStates } });
          } else {
            socket.send(JSON.stringify({ meta: "error", payload: { message: "Game not found" } }));
          }
          break;
        }
        case "update dice state": {
          const { gameID, diceState } = data.payload;
          const game = games.find((g) => g.gameID == gameID);
          if (game) {
            game.updateDiceState(diceState);
            game.broadcast({ meta: "dice state updated", payload: { diceState } });
          } else {
            socket.send(JSON.stringify({ meta: "error", payload: { message: "Game not found" } }));
          }
          break;
        }
        case "leave game": {
          const { gameID, player } = data.payload;
          const gameIndex = games.findIndex((g) => g.gameID == gameID);
          const game = games[gameIndex];
          if (game) {
            if (game.findPlayersLength() == 1) {
              game.broadcast({ meta: "game ended" });
              games.splice(gameIndex, 1);
            } else {
              const playerIndex = game.players.findIndex((p) => (p.playerNetworkID = player.playerNetworkID));
              const { players } = game;
              game.leaveGame(playerIndex);
              game.broadcast({ meta: "player left", payload: { players } });
            }
          } else {
            socket.send(JSON.stringify({ meta: "error", payload: { message: "Game not found" } }));
          }
          break;
        }
      }
    }
  });
}

module.exports = socketController;
