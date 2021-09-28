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

const users = []
const messages = []
// const connections = [null, null];


server.listen(PORT, () => {
io.on("connection", socket => {
    socket.on('new_user', (name) => {
        users.push({
          id: socket.id,
          name
        });
        socket.emit('users', users);
      });

      //CHAT
      socket.on('sendmessageclient',(info) => {
          messages.push(info)
          console.log(info);
          socket.emit("messagesserver",messages.slice(-20))
          socket.broadcast.emit("Notification")
      })
      
      setInterval(() => {
      socket.emit("messagesserver",messages)
      }, 500);


      socket.on('disconnect', () => {
        const index = users.indexOf(socket.id);
        users.splice(index, 1);
        socket.emit('users', users);
        console.log(users);
      })
    });
  });