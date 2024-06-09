const net = require('net');

const server = net.createServer(connection => {
    console.log("Client connected...!");
})