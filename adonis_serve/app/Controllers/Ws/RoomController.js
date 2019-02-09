'use strict'

// room states -> normal , active
//  game_state -> questioning , select_respondent , answering , end > report 

let players = [];
let host_room = {};


class RoomController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  async onEnterRoom  (user) {
    if(!this.checkHost(user)) { //ตรวจสอบว่าเป็นเจ้าของห้องหรือไม่ 
        players.push({ "user": user, "socket_id": this.socket.id })
    }else {
        host_room = {"host" : user,"socket_id": this.socket.id }
    }
    players.push()
    this.updatePlayer(user)

  }

  async checkHost(e) {
    //let room_code = this.socket.id
    // let end = room_code.indexOf("#")
    // room_code = room_code.substring(5, end)
    // //console.log(room_code)
    // let room = await Room.findBy("room_code", room_code)
    // // console.log(room.toJSON().host_id)
    // let host_id = room.toJSON().host_id
    // if (host_id == e.id) {
    //   host = { user: e, socket_id: this.socket.id }
    //   this.socket.emit("isHost", true)
    // }
  }


  updatePlayer(e) {
    // this.socket.broadcastToAll("getPlayers", players)
    // this.socket.broadcastToAll("newPlayer", e)
    // console.log(players)
  }
}

module.exports = RoomController
