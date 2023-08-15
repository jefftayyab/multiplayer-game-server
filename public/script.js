const socket = new WebSocket("wss://ludobackendws.herokuapp.com");
let resNum = 0;
socket.onmessage = ({ data }) => {
  resNum += 1;
  console.log(`Server response |${resNum}|:`, JSON.parse(data));
};
socket.onerror = (error) => {
  console.log(error);
};

const createGame = (e) => {
  e.preventDefault();
  const gameName = document.getElementById("cl-game-name").value;
  const environmentName = document.getElementById("cl-environment-name").value;
  const entryFee = document.getElementById("cl-entry-fee").value;
  const maxPlayers = document.getElementById("cl-max-players").value;
  const maxPlayersToStart = document.getElementById("cl-max-players-to-start").value;
  const playerName = document.getElementById("cl-player-name").value;
  const countryName = document.getElementById("cl-country-name").value;
  const isPrivate = document.getElementById("cl-is-private").checked;
  const token = document.getElementById("token").value;
  const data = {
    meta: "create game",
    payload: {
      gameName,
      environmentName,
      entryFee,
      maxPlayers,
      maxPlayersToStart,
      player: [
        {
          playerName,
          countryName,
        },
      ],
      isPrivate,
    },
    token,
  };
  socket.send(JSON.stringify(data));
};

const joinGame = (e) => {
  e.preventDefault();
  const gameID = document.getElementById("jl-game-id").value;
  const playerNetworkID = document.getElementById("jl-player-network-id").value;
  const playerName = document.getElementById("jl-player-name").value;
  const countryName = document.getElementById("jl-country-name").value;
  const token = document.getElementById("token").value;
  const data = {
    meta: "join game",
    payload: {
      gameID,
      player: {
        playerNetworkID,
        playerName,
        countryName,
      },
    },
    token,
  };
  socket.send(JSON.stringify(data));
};

const playerStateUpdate = (e) => {
  e.preventDefault();
  const gameID = document.getElementById("psu-game-id").value;
  const playerNetworkID = document.getElementById("psu-player-network-id").value;
  const token = document.getElementById("token").value;
  const startTime = new Date().getTime();
  const interval = setInterval(() => {
    const currentTime = new Date().getTime();
    if (currentTime - startTime > 1000) {
      clearInterval(interval);
      return;
    }
    const data = {
      meta: "update player state",
      payload: {
        gameID,
        playerState: {
          playerNetworkID,
          state: [
            {
              position: { x: 0.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
              scale: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              position: { x: 0.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
              scale: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              position: { x: 0.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
              scale: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              position: { x: 0.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
              scale: { x: 0.0, y: 0.0, z: 0.0 },
            },
            {
              position: { x: 0.0, y: 0.0, z: 0.0 },
              rotation: { x: 0.0, y: 0.0, z: 0.0 },
              scale: { x: 0.0, y: 0.0, z: 0.0 },
            },
          ],
        },
      },
      token,
    };
    socket.send(JSON.stringify(data));
  }, 16);
};

const diceStateUpdate = (e) => {
  e.preventDefault();
  const gameID = document.getElementById("dsu-game-id").value;
  const token = document.getElementById("token").value;
  const startTime = new Date().getTime();
  const interval = setInterval(() => {
    const currentTime = new Date().getTime();
    if (currentTime - startTime > 1000) {
      clearInterval(interval);
      return;
    }
    const data = {
      meta: "update dice state",
      payload: {
        gameID,
        diceState: {
          position: { x: 0.0, y: 0.0, z: 0.0 },
          rotation: { x: 0.0, y: 0.0, z: 0.0 },
          scale: { x: 0.0, y: 0.0, z: 0.0 },
        },
      },
      token,
    };
    socket.send(JSON.stringify(data));
  }, 16);
};

const leaveGame = (e) => {
  e.preventDefault();
  const gameID = document.getElementById("lg-game-id").value;
  const playerNetworkID = document.getElementById("lg-player-network-id").value;
  const token = document.getElementById("token").value;
  const data = {
    meta: "leave game",
    payload: {
      gameID,
      player: {
        playerNetworkID,
      },
    },
    token,
  };
  socket.send(JSON.stringify(data));
};
