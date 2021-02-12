const webSocketsServerPort = 8000

const webSocketServer = require('websocket').server
const http = require('http')

const server = http.createServer()
server.listen(webSocketsServerPort)
console.log(`Good to go on port: ${webSocketsServerPort}`)

const wsServer = new webSocketServer({
    httpServer: server
})

const clients = {};

//Every User gets a unique ID
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    return s4() + s4() + '-' + s4()
}

wsServer.on('request', function(request){
    var userID = getUniqueID()
    console.log((new Date()) + 'Revieved a new connection from origin ' + request.origin + '.') 
    // Accept from all origins
    const connection = request.accept(null, request.origin)
    clients[userID] = connection
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))

    connection.on('message', function(message){
        if(message.type === 'utf8'){
            console.log('Recieved Message: ', message.utf8Data)

            //Broadcast to all connected clients
            for(key in clients){
                clients[key].sendUTF(message.utf8Data);
                console.log('sent message to: ', clients[key])
            }
        }
    })
})

