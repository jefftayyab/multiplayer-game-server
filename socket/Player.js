const { v4: uuidv4 } = require("uuid");
class Player {
  constructor(playerName, countryName) {
    this.playerNetworkID = uuidv4();
    this.playerName = playerName;
    this.countryName = countryName
  }
}

module.exports = Player;
