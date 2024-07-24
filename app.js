const express = require('express');
const http = require('http');
const socketio = require("socket.io");
const chalk = require('chalk');
const path = require('path');

const PORT = 8080;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log(chalk.hex('#fc03fc').bold("~ Connected!"));
    
    socket.on("send-location", (data) => {
        io.emit("receive-location", {
            id: socket.id,
            ...data
        });
    });
    
    socket.on("disconnect", () => {
        io.emit("user-disconnect", socket.id);
        console.log(chalk.hex('#ebbd34').bold("~ Disconnected!"));
    });
});

app.get('/', (req, res) => {
    res.render("index");
});

server.listen(PORT, () => {
    console.log(chalk.hex('#00ff00').underline.bold(`<--- SERVER RUNNING AT PORT ${PORT} --->`));
});