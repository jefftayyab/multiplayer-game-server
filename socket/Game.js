const { v4: uuidv4 } = require("uuid");

class Game {
  constructor(
    gameName,
    environmentName,
    entryFee,
    maxPlayers,
    maxPlayersToStart,
    players,
    isPrivate,
    isGameStarted,
    sockets,
    playerStates,
    diceState
  ) {
    this.gameID = uuidv4();
    this.gameName = gameName;
    this.environmentName = environmentName;
    this.entryFee = entryFee;
    this.maxPlayers = maxPlayers;
    this.maxPlayersToStart = maxPlayersToStart;
    this.players = players;
    this.isPrivate = isPrivate;
    this.isGameStarted = isGameStarted;
    this.sockets = sockets;
    this.playerStates = playerStates;
    this.diceState = diceState;
  }

  join(player, socket) {
    const nullIndex = this.players.findIndex((i) => i == null);
    this.players.splice(nullIndex, 1, player);
    this.sockets.splice(nullIndex, 1, socket);
    const playerState = {
      playerNetworkID: player.playerNetworkID,
      state: [],
    };
    for (let j = 0; j < 5; j++) {
      playerState.state[j] = {
        position: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0.0, y: 0.0, z: 0.0 },
        scale: { x: 0.0, y: 0.0, z: 0.0 },
      };
    }
    this.playerStates.splice(nullIndex, 1, playerState);
  }

  findPlayersLength() {
    let length = 0;
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i] != null) {
        length += 1;
      }
    }
    return length;
  }

  checkGameStart() {
    return this.findPlayersLength() < this.maxPlayersToStart ? false : true;
  }

  checkGameFull() {
    return this.findPlayersLength() == this.maxPlayers ? true : false;
  }

  broadcast(data) {
    this.sockets.map((s) => {
      if (s != null) {
        s.send(JSON.stringify(data));
      }
    });
  }

  updatePlayerState(playerState) {
    const index = this.playerStates.findIndex((ps) => ps.playerNetworkID == playerState.playerNetworkID);
    this.playerStates[index].state = playerState;
  }

  updateDiceState(diceState) {
    this.diceState = diceState;
  }

  leaveGame(index) {
    this.players.splice(index, 1, null);
    this.sockets.splice(index, 1, null);
    this.playerStates.splice(index, 1, null);
  }
}

module.exports = Game;
