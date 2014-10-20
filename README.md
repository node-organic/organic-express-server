# organic-express-server

Organelle constructing expressjs app and opening http server listening port

## dna

    "organic-express-server": {
      "source": "node_modules/organic-express-server",
      "port": 1337,
      "logRunning": true,
      "initScript": "init-express-app", 
      "emitReady": "ExpressServer",
      "closeOn": "kill",
      "forceConnectionsDestroyOnClose": false
    }

### `initScript` property

Optional, if provided will `require` given module using `process.cwd`+`initScript` as path.
Example module:

    module.exports = function(plasma, dna, next) {
      var app = express()
      next(err, app)
    }

Invoking `next(err, app)` will complete express server initialization by start listening for incoming requests and emit ready chemical.

### `logRunning` property

Optional, if provided will `console.log` when express server is listening for incoming requests.

### `forceConnectionsDestroyOnClose` property

Optional, if enabled on `kill` chemical all opened connections will be destroyed and server closed, otherwise the server will close when there are no longer open connections.

## `emitReady` chemical
Emitted once express server is listening for incoming requests

    {
      type: `emitReady value`,
      data: expressApplication,
      server: httpServer
    }

## `kill` chemical
Once received will close underlaying httpServer