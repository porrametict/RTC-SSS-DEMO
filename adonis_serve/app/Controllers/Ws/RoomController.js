'use strict'

const Score = use('App/Models/Score')
const Room= use('App/Models/Room')


// room states -> normal , active
//  game_state_taecher -> questioning ,select_respondents , answering ,consider_solutions, end > report 
//  game_state_student -> questioning , has_question,select_respondents , answering ,consider_solutions, end > report 
let players = [];
let host_room = {};
let respondents_id = '';
let scores = []



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

  async onClose(e) {  // unuse
    // this.removeUserFromSocket(this.socket.id)
    // // console.log("close")
    // await this.updatePlayer()
    // console.log("Socketclose")
    // setTimeout(this.socket.close(),500)
  }

  async onExitRoom() {
    this.removeUserFromSocket(this.socket.id)
    console.log("close")
    await this.updatePlayer()
    // console.log("Socketclose")
    this.socket.close()
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
    respondents_id = e
  }
  async onUseMinigame (users) {
    this.socket.broadcastToAll("useMinigame",users)
  }
 
  onAnswer (e) {
    this.socket.broadcastToAll('answer',e)
  }
  onSolution (e) {
    this.socket.broadcastToAll("solution",e)
    if(e){ // true
        this.collectScore(1,respondents_id)    
    }
    this.socket.broadcastToAll("checked_answer",e)
  } 
  onNewRespondents () {
    this.socket.broadcastToAll("newRespondents")
  }
  onNewQuestion () {
    this.socket.broadcastToAll('newQuestion')
  }
  onEndGame () {
    this.socket.broadcastToAll('endGame',scores)
    //console.log(scores,"scores")
  }
  async onExitGame () {
   await scores.forEach(async (val)=> {
      let newScore = new Score();
      let r_id = this.getRoomId()
      let new_score_data = {"room_id":r_id,"std_code":val.userId,"score":val.score}
      newScore.fill(new_score_data)
      await newScore.save()
    })
    scores = []
  }
  /// room
  getRoomId () {
    let room = this.socket.topic
    let room_id = room.substring(room.indexOf(":")+1)
    return room_id
  }


  /// user control

  removeUserFromSocket(sk) {
    players = players.filter(function (value) {
      return value.socket_id != sk
    })
    // console.log(players)
  }

  getSocketsFromUsers (users) {
    let sockets = [];
    players.forEach(p => {
      users.forEach(u => {
        // console.log(u.id,p.user.id)
        if(u.id == p.user.id){
          sockets.push(p.socket_id)
        }
      })
    })
    // console.log(sockets)
    return sockets

  }

  
  async updatePlayer(e) {
    //  console.log('update',players)
    let empty = players.length == 0 ? true : false;
    this.socket.broadcastToAll("updatePlayer", { players: players, empty: empty })
    // await console.log('finish')
    // return "";

  }
   // score
   collectScore (score,r_id) {
    let new_user_score = true
    scores.forEach(val=>{
      if(val.userId == r_id){
        val.score += score
        new_user_score = false
      }
    })
    if(new_user_score){
      scores.push({userId:r_id,score:score})
    }
    // console.log('collectScore',scores)
  }

}

module.exports = RoomController
