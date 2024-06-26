const net = require('net');
const Parser = require('redis-parser');

const PORT = process.env.PORT || 5556;

const CACHE_STORAGE = {};

const server = net.createServer(connection => {
    console.log("Client connected...!");

    // *3 -> * represents an array & 3 is the length of that array 
    // $6 -> $ represents a string & 6 is the length of that string 
    // that's how redis gets the data into itself in the above representation according to the Redis serialization protocol specification

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

                    console.log("CACHE STORAGE => ", CACHE_STORAGE);
                        break;
                    
                    case 'get': {
                        const key = reply[1];
                        const value = CACHE_STORAGE[key];
                        if(!value) {
                            // if there's no data exists it should return (nil) according to redis convention
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

