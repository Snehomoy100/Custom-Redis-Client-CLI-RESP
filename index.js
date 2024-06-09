const net = require('net');


const PORT = process.env.PORT || 5555;

const server = net.createServer(connection => {
    console.log("Client connected...!");

    // to get the data from redis-cli to this client
    connection.on('data', data => {
        console.log('=>', data.toString());
    });
})

server.listen(PORT, () => console.log(`Custom Redis Server is running on port ${PORT}`));

