'use strict'

const Score = use('App/Models/Score')



// room states -> normal , active
//  game_state -> questioning , select_respondent , answering , end > report 

let players = [];
let host_room = {};


class RoomController {
  constructor({ socket, request }) {
    this.socket = socket
    this.request = request
    //console.log('cat',this.socket.topic)
  }

  async onJoinRoom(e) {
    if (e.ishost == true) {
      host_room = { user: e.user, socket_id: this.socket.id }
    } else {
      // this.checkNewUser(e.user.id)
      players.push({ user: e.user, socket_id: this.socket.id })
      
    }
    this.updatePlayer()
  }

  onMessage(e) {
    this.socket.broadcastToAll('message', e)  
  }

  async onClose (e) {
    console.log("close")
    this.removeUserFromSocket(this.socket.id)
    await this.updatePlayer()
    this.socket.close();
  }


  /// user control

  removeUserFromSocket (sk) {
    players = players.filter(function(value){
      return value.socket_id != sk
    })
  }
  

  // checkNewUser (userId) {
  //   players.forEach( val => {
  //     console.log(val.user.id,val.socket_id,userId) 
  //   })
  // }
  async updatePlayer(e) {
    console.log('update',players)
    let empty = players.length == 0 ? true : false;
    await this.socket.broadcastToAll("updatePlayer", {players:players,empty:empty})
    await console.log('finish')
    return "";

  }
}

module.exports = RoomController
