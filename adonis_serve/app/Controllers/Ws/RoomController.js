'use strict'

const Score = use('App/Models/Score')
const Room= use('App/Models/Room')


// room states -> normal , active
//  game_state_taecher -> questioning ,select_respondents , answering ,consider_solutions, end > report 
//  game_state_student -> questioning , has_question,select_respondents , answering ,consider_solutions, end > report 
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

  async onClose(e) {
    console.log("close")
    this.removeUserFromSocket(this.socket.id)
    await this.updatePlayer()
    this.socket.close();
  }

  ///   game control
  async onGameStart() {
    this.socket.broadcastToAll('active')
  }

  onQuestion (e) {
    this.socket.broadcastToAll('hasQuestion',e)
  }

  onWantToAnswer (e) {
    this.socket.broadcastToAll('hasRespondents',e)
  }

  onGetRespondents (e) {
    this.socket.broadcastToAll('gotRespondents',e)
  }
  onAnswer (e) {
    this.socket.broadcastToAll('answer',e)
  }
  onSolution (e) {
    this.socket.broadcastToAll("solution",e)
  } 



  /// user control

  removeUserFromSocket(sk) {
    players = players.filter(function (value) {
      return value.socket_id != sk
    })
  }


  
  async updatePlayer(e) {
    // console.log('update',players)
    let empty = players.length == 0 ? true : false;
    await this.socket.broadcastToAll("updatePlayer", { players: players, empty: empty })
    //await console.log('finish')
    return "";

  }
}

module.exports = RoomController
