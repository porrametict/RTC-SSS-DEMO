'use strict'
let maxClick ; 
class MiniGameController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }
  onStartGame (e) {
    this.socket.broadcastToAll("startgame",e)
    maxClick = e
  } 
  onclickClick () {
    maxClick -= 1
    if(maxClick <= 0 ) {
      this.socket.emit("getwinner",true) // winner
      this.socket.broadcast("getwinner",false) // other
    }
  }
  onWinner (e) {
     this.socket.broadcastToAll("gameEnd",e)
  }
  
}

module.exports = MiniGameController
