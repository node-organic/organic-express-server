var express = require('express')
var path = require('path')

module.exports = function (plasma, dna) {
  var completeAppInit = function (app) {
    var server
    var callback = function () {
      if (dna.logRunning) {
        console.log('express server running on', (dna.host || '*') + ':' + dna.port)
      }
      plasma.emit({
        type: dna.emitReady || 'ExpressServer',
        data: app,
        server: server
      })
    }
    var args = [dna.port]
    if (typeof dna.host === 'string') {
      args.push(dna.host)
    }
    if (typeof dna.backlog === 'number') {
      args.push(dna.backlog)
    }
    args.push(callback)
    server = app.listen.apply(app, args)
    var sockets = {}
    var nextSocketId = 0
    if (dna.forceConnectionsDestroyOnClose) {
      server.on('connection', function (socket) {
        var socketId = nextSocketId++
        sockets[socketId] = socket
        socket.on('close', function () {
          delete sockets[socketId]
        })
      })
    }

    plasma.on(dna.closeOn || 'kill', function (c, next) {
      if (dna.forceConnectionsDestroyOnClose) {
        for (var socketId in sockets) {
          sockets[socketId].destroy()
        }
      }
      server.close(next)
    })
  }

  if (dna.initScript) {
    require(path.join(process.cwd(), dna.initScript))(plasma, dna, function (err, app) {
      if(err) throw err
      completeAppInit(app)
    })
  } else {
    completeAppInit(express())
  }
}
