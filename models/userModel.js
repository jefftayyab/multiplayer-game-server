const { model, Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    textImage: {
      type: String,
      default: "",
    },
    coins: {
      type: Number,
      default: 50,
    },
    diamonds: {
      type: Number,
      default: 10,
    },
    country: {
      type: String,
      default: "pakistan",
    },
    appleUserId: {
      type: String,
      default: "",
    },
    totalGames: {
      type: Number,
      default: 0,
    },
    gameWon: {
      type: Number,
      default: 0,
    },
    twoPlayerWins: {
      type: Number,
      default: 0,
    },
    threePlayerWins: {
      type: Number,
      default: 0,
    },
    fourPlayerWins: {
      type: Number,
      default: 0,
    },
    fivePlayerWins: {
      type: Number,
      default: 0,
    },
    sixPlayerWins: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", UserSchema);
