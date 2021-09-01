const Socketio = require ("socket.io");
const express = require ("express");
const http = require("http");
const app = express();

const PORT = process.env.PORT || 3333;

const server=http.createServer(app)

const io = Socketio(server, {
    cors :{
        origin:"*",
        methods: ["GET", "POST", "OPTION"],
    },
});

server.listen(PORT, () => {
io.on("connection", socket => {
    console.log(socket.id);
    //Karşılama
    socket.emit("WELCOME_MESSAGE", `Hoşgeldin: ${socket.id}`)
});
});