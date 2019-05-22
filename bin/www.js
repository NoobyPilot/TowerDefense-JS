var app = require('../app');
var debug = require('debug')('expressapp:server');
var http = require('http');

var port = normalizePort(process.env.PORT || '7555');
var ip = '127.0.0.1';

app.set('port', port);

var server = http.createServer(app);

server.listen(port, ip);
server.on('error.hbs', onError);
server.on('listening', onListening);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messafes
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privilefes');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
