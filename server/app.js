const Socketio = require ("socket.io");
const express = require ("express");
const http = require("http");
const app = express();
let users = []
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

    socket.on('new_user', (name) => {
        users.push({
          id: socket.id,
          name
        });
        io.emit('users', users);
      });
    
      socket.on('disconnect', () => {
        const index = users.indexOf(socket.id);
        users.splice(index, 1);
        io.emit('users', users);
      })

});
});