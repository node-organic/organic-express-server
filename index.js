var express = require("express")
var path = require("path")

module.exports = function(plasma, dna) {
  var completeAppInit = function(app){
    var server = app.listen(dna.port, function(){
      if(dna.logRunning)
        console.log("express server running on", dna.port)
      plasma.emit({
        type: dna.emitReady || "ExpressServer",
        data: app,
        server: server
      })
    });
    plasma.on(dna.closeOn || "kill", function(){
      server.close()
    })
  }
  if(dna.initScript) {
    require(path.join(process.cwd(), dna.initScript))(plasma, dna, function(err, app){
      if(err) throw err
      completeAppInit(app)
    })
  } else {
    completeAppInit(express())
  }
}