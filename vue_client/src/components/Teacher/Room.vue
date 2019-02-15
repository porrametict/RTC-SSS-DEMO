<template>
  <div class="container" v-if="user">
    <h1>Room Teacher</h1>
    <hr>
    <!-- normal -->
    <div v-if="roomState =='normal'">
      <input type="button" @click="gameStart" value="Game Start"> <br>
      <input type="text" v-model="inputMessage" @keypress.13="sendMessage(inputMessage)">
    </div>
    <div class="flex_container" v-if="roomState =='normal'">

      <aside>
        <h3>All players ({{players.length}})</h3>
        <ul>
          <li
            v-for="(p,index) in players"
            v-bind:key="index"
          >{{p.user.first_name}} {{p.user.last_name}}</li>
        </ul>
      </aside>
      <section>
        <ul>
          <li v-for="(m,index) in messages" v-bind:key="index">{{m.body}} - {{m.user.first_name}}</li>
        </ul>
      </section>
    </div>
    <!-- active -->
    <div v-else>
      <!-- questioning -->
      <div v-if="gameState =='questioning'">
        <h1>เกมได้เริ่มขึ้นเเล้ว ตั้งคำถามได้เลย</h1>
        <input type="text" placeholder="กรอกคำถามของคุณ" v-model="question">
        <input type="button" value="ส่งคำถาม" @click="sendQuestion(question)">
      </div>
      <!-- select_respondent -->
      <div v-else-if="gameState == 'select_respondents'">
        <h1>นี่คือคนที่ต้องการจะตอบ</h1>
        <ul>
          <li v-for="(r,index) in responents" v-bind:key="index">
            {{r.first_name}} {{r.last_name}} 
              <input type="button" value="เลือกคนนี้" @click="selectRespondents(r.id)">
          </li>
        </ul>
      </div>
       <!-- consider_solutions -->
      <div v-else-if="gameState == 'consider_solutions'">
        <h1>คำตอบ ;  {{answer}}</h1>
        <input type="button" value="ถูกต้อง" @click="solution(true)">
        <input type="button" value="ผิด" @click="solution(false)">
      </div>

    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Ws from "@adonisjs/websocket-client";
const ws = Ws("ws://localhost:3333");

export default {
  data: () => ({
    players: [],
    roomData: null,
    room: null,
    messages: [],
    inputMessage: null,
    roomState: "normal",
    gameState: "questioning",
    question: "",
    responents: [],
    answer : ''
  }),
  computed: {
    ...mapState({
      user: state => state.teacher.teacher
    })
  },
  async created() {
    window.addEventListener("beforeunload", this.confirmExit);
    window.onhashchange = function() {
      let v = confirm("ต้องการจะออกจากห้องจริงๆใช่ไหม");
      if (v == true) {
        this.exitRoom;
      } else {
        window.history.forward();
      }
    };

    if (!this.user) {
      await this.$store.dispatch("teacher/getUser");
    }

    let room_id = this.$route.params.room_id;
    this.roomData = await this.$store.dispatch("room/GetSingleRoom", room_id);
    this.connectServe();
  },

  methods: {
    connectServe: function() {
      ws.connect();
      this.room = ws.subscribe(`room:${this.roomData.id}`);
      this.room.on("ready", () => {
        this.room.emit("joinRoom", { user: this.user, ishost: true });
      });
      this.room.on("message", e => {
        this.reciveMessage(e);
      });
      this.room.on("updatePlayer", e => {
        console.log("up", e, e.players);
        this.players = e.players;
      });
      this.room.on("close", e => {
        alert("คุณได้ออกจากห้องเเล้ว");
        this.$router.push({
          name: "subject-teacher",
          "sj-code": this.$route.params.sj_code
        });
      });

      // game
      this.room.on("active", () => {
        this.roomState = "active";
      });
      this.room.on("hasRespondents", e => {
        this.responents.push(e);
      });
      this.room.on('answer',e=>{
        this.answer = e
        this.gameState = 'consider_solutions'
      })
    },
    // room control
    sendMessage: async function(message) {
      this.room.emit("message", { body: message, user: this.user });
    },
    reciveMessage: async function(message) {
      this.messages.push(message);
    },
    confirmExit(e) {
      e.preventDefault();
      return "";
    },
    exitRoom() {
      this.room.emit("close");
    },

    /// game Control
    gameStart() {
      this.room.emit("gameStart");
    },

    //game state
    sendQuestion(question) {
      this.room.emit("question", question);
      this.gameState = "select_respondents";
    },
    selectRespondents (id) {
      this.room.emit("getRespondents",id)
      this.gameState = 'answering'
    },
    solution(result) {
      this.room.emit('solution',result)
    }
  }
};
</script>
<style scoped>
.flex_container {
  display: flex;
}
</style>



