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

let users = []
let messages = []

server.listen(PORT, () => {
io.on("connection", socket => {
    socket.on('new_user', (name) => {
        users.push({
          id: socket.id,
          name
        });
        io.emit('users', users);
        console.log(process.env.PORT);
      });
      socket.on('sendmessageclient',(info) => {
          messages.push(info)
          console.log(info);
          io.emit("messagesserver",messages.slice(-10))
      })
      io.emit("messagesserver",messages)

      socket.on('disconnect', () => {
        const index = users.indexOf(socket.id);
        users.splice(index, 1);
        io.emit('users', users);
        console.log(users);
      })
    });
  });