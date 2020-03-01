const Party = require('./Party');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// our localhost port
const port = 3001;
const app = express();
const server = http.createServer(app);
// This creates our socket using the instance of the server
const io = socketIO(server);
const parties = {};
const memoryGame = io.of('/memory-game');
const PARTY_TIME_SEC = 60;
const clocks = {};
const endClocks = {};

memoryGame.on('connection', (socket) => {
  console.log('User connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('create', (send) => {
    const createdParty = new Party(require('./cards.json')); // SQL query
    parties[socket.id] = createdParty;
    send(createdParty.toJSON());
  });
  socket.on('start', () => {
    const currentParty = parties[socket.id]; // SQL query
    const clock = clocks[socket.id];
    const endClock = endClocks[socket.id];
    if (clock) {
      clearInterval(clock);
      clearTimeout(endClock);
      delete clocks[socket.id];
      delete endClocks[socket.id];
    }
    if (currentParty && !currentParty.started && !currentParty.stopped) {
      currentParty.start(); // SQL query
      clocks[socket.id] = setInterval(
        () => socket.emit('time', Date.now() - currentParty.startedTime),
        1000,
      );
      endClocks[socket.id] = setTimeout(() => {
        clearInterval(clock);
        currentParty.stop(); // SQL query
        delete parties[socket.id];
        socket.emit('end');
      }, PARTY_TIME_SEC * 1000);
    }
  });
  socket.on('reveal', (cardId, send) => {
    const currentParty = parties[socket.id];
    if (currentParty) {
      const reveal = currentParty.reveal(cardId);
      send(reveal);
      if (reveal === Party.REVEAL_RESPONSE.WIN) {
        currentParty.stop();
        delete parties[socket.id];
        const clock = clocks[socket.id];
        const endClock = endClocks[socket.id];
        if (clock) {
          clearInterval(clock);
          clearTimeout(endClock);
          delete clocks[socket.id];
          delete endClocks[socket.id];
        }
        socket.emit('win');
      }
    }
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
