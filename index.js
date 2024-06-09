const net = require('net');
const Parser = require('redis-parser');

const PORT = process.env.PORT || 5556;

const CACHE_STORAGE = {};

const server = net.createServer(connection => {
    console.log("Client connected...!");

    // to get & set the data from redis-cli to this client
    connection.on('data', data => {
        const parser = new Parser({
            returnReply: (reply) => {
                const command = reply[0];
                switch(command){
                    case 'set': {
                        const key = reply[1];
                        const value = reply[2];
                        CACHE_STORAGE[key] = value;
                        connection.write('+OK\r\n');
                    }
                        break;
                    
                    case 'get': {
                        const key = reply[1];
                        const value = CACHE_STORAGE[key];
                        if(!value) {
                            connection.write('$-1\r\n');
                        } else {
                            connection.write(`$${value.length}\r\n${value}\r\n`);
                        }
                    }

                    break;
                        
                }
            },
            returnError: (error) => {
                console.log('=>', error);
            }
        })

        parser.execute(data);

        // to send back an acknowledgement to redis-cli from custom client
        connection.write('+OK\r\n');
    });
})

server.listen(PORT, () => console.log(`Custom Redis Server is running on port ${PORT}`));

