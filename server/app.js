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

//       //ONLINE
//       let playerIndex = -1;
//       for (const i in connections) {
//         if (connections[i] === null) {
//           playerIndex = i;
//         }
//       }
//       socket.emit('player-number', playerIndex);
//       console.log(`Player: ${playerIndex}  Conn ID: ${socket.id} has connected`);
//       if (playerIndex == -1) return;
//       connections[playerIndex] = socket;
//  // Tell everyone else what player number just connected
//       socket.broadcast.emit('player-connect', playerIndex);

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