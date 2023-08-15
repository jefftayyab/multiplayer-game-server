const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const cors = require("cors");
const formidable = require("express-formidable");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const routesController = require("./routes");
const socketController = require("./socket");
const { notFound, errorHandler } = require("./middlewares/errors");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors("*"));
app.use(formidable());
app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", socketController);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Ludo" });
});
app.use("/", routesController);

app.use(notFound);
app.use(errorHandler);

const { NODE_ENV, PORT } = process.env;
server.listen(PORT || 5000, console.log(`App is running in ${NODE_ENV} environment on https://localhost:${PORT}/`));
