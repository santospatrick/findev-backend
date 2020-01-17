const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

function setupWebsocket(server) {
  io = socketio(server);

  io.on('connection', socket => {
    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coords: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: parseStringAsArray(techs),
    });
  });
}

function findConnections(coords, techs) {
  return connections.filter(connection => {
    return (
      calculateDistance(coords, connection.coords) < 10 &&
      connection.techs.some(tech => techs.includes(tech))
    );
  });
}

function sendMessage(to, message, data) {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  });
}

module.exports = { setupWebsocket, findConnections, sendMessage };
