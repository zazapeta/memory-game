const io = require('socket.io-client');
const expect = require('expect');
const app = require('../src/index');

describe('Suite of unit tests', function() {
  let socket;

  beforeEach(function(done) {
    // Setup
    socket = io.connect('http://localhost:3001/memory-game', {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
    });
    socket.on('connect', function() {
      console.log('worked...');
      done();
    });
    socket.on('disconnect', function() {
      console.log('disconnected...');
    });
  });

  afterEach(function(done) {
    // Cleanup
    if (socket.connected) {
      console.log('disconnecting...');
      socket.disconnect();
    } else {
      // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
      console.log('no connection to break...');
    }
    done();
  });

  it('Should connect', (done) => {
    expect(socket.connected).toBe(true);
    done();
  });
});
