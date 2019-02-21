<template>
  <div class="container" v-if="user">
    <h1>Room Teacher</h1>
    <br>
    <button @click="$router.push({name:'set-question-teacher',params : {room_id : roomData.id}})">set question</button>
    <hr>
    <!-- normal -->
    <div v-if="roomState =='normal'">
      <input type="button" @click="gameStart" value="Game Start">
      <br>
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
        <!-- question package -->
        <div v-if="question_package">
          <hr>
          <button @click="selectQuestion(question_package[0]);">ใช้ข้อบนสุด</button>
          <hr>
          คำถามที่ยังไม่ได้ใช้
            <ul>
              <li v-for="(q,index) in question_package" :key="index">
                 ข้อ {{q.sequence_number}} : {{q.question}}
                 <button @click="selectQuestion(q)">ใช้คำถามนี้</button>
              </li>
            </ul>
          <hr>
        </div>
      </div>
      <!-- select_respondent -->
      <div v-else-if="gameState == 'select_respondents'">
        <h1>นี่คือคนที่ต้องการจะตอบ</h1>
        <input
          type="button"
          @click="random_respondents(responents)"
          value="สุ่มคนตอบ"
          v-if="responents.length >= 2"
        >
        <input
          type="button"
          @click="useMiniGame()"
          value="ใช้มินิเกมส์"
          v-if="responents.length >= 2"
        >
        <ul>
          <li v-for="(r,index) in responents" v-bind:key="index">
            {{r.first_name}} {{r.last_name}}
            <input
              type="button"
              value="เลือกคนนี้"
              @click="selectRespondents(r.id)"
            >
          </li>
        </ul>
      </div>
      <!-- minigame -->
      <div v-if="gameState == 'miniGame'">
        <mini-game :room="roomData.id" @change="selectRespondents($event)"/>
      </div>

      <!-- answering -->
      <div v-else-if="gameState == 'answering'">
        <h1>ผู้ถูกเลือกกำลังตอบ</h1>
      </div>

      <!-- consider_solutions -->
      <div v-else-if="gameState == 'consider_solutions'">
        <h1>คำตอบ ; {{answer}}</h1>
        <input type="button" value="ถูกต้อง" @click="solution(true)">
        <input type="button" value="ผิด" @click="solution(false)">
        <hr>
      </div>

      <div v-else-if="gameState == 'checked_answer'">
        <div v-if="solution_q==false">
          <h1>จะดำเนินการอย่างไรต่อ</h1>
          <input type="button" value="ใช้คำถามเดิม เลือกคนตอบใหม่" @click="newRespondents()">
          <input type="button" value="ข้ามข้อนี้ ไปข้อใหม่" @click="newQuestion()">
          <input type="button" value="จบเกมส์" @click="endGame()">
        </div>
        <div v-else>
          <h1>จะดำเนินการอย่างไรต่อ</h1>
          <input type="button" value="ไปข้อใหม่" @click="newQuestion()">
          <input type="button" value="จบเกมส์" @click="endGame()">
        </div>
      </div>

      <!-- endGame -->
      <div v-else-if="gameState == 'endGame'">
        <h1>เกมส์จบเเล้ว</h1>
        <ul>
          <li v-for="(s,index) in score_report" v-bind:key="index">{{s}}</li>
        </ul>
        <input type="button" value="บันทึกเเละออก" @click="exitGame()">
      </div>
    </div>
  </div>
</template>
<script>
import miniGame from "./miniGame";
import { mapState } from "vuex";
import Ws from "@adonisjs/websocket-client";
const ws = Ws("ws://localhost:3333");

export default {
  components: {
    miniGame
  },
  data: () => ({
    players: [],
    roomData: null,
    room: null,
    messages: [],
    inputMessage: null,
    roomState: "normal",
    gameState: "questioning",
    question: "",
    question_package : null,
    responents: [],
    answer: "",
    solution_q: null,
    score_report: []
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
    this.question_package = await this.$store.dispatch("question/getQuestions",room_id)

    this.connectServe();
  },

  methods: {
    connectServe: function() {
      ws.connect();
      this.room = ws.subscribe(`room:${this.roomData.id}`);
      this.room.on("resady", () => {
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
      this.room.on("answer", e => {
        this.answer = e;
        this.gameState = "consider_solutions";
      });
      this.room.on("checked_answer", () => {
        this.gameState = "checked_answer";
      });
      this.room.on("endGame", e => {
        this.score_report = e;
      });
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

    arrayRemove (arr,value) {
        return arr.filter(function(ele){
          return ele != value
        })
    },

    //game state
    selectQuestion(q){
      this.sendQuestion(q.question)
      this.question_package =  this.arrayRemove(this.question_package,q)
      console.log("selectQuestion",this.question_package)
    },
    sendQuestion(question) {
      this.room.emit("question", question);
      this.gameState = "select_respondents";
    },
    selectRespondents(id) {
      this.room.emit("getRespondents", id);
      this.gameState = "answering";
    },
    random_respondents(items) {
      let ramdom_item = items[Math.floor(Math.random() * items.length)];
      //console.log(ramdom_item,"ramdom")
      let confirm_response = confirm(`เลือก ${ramdom_item.first_name}`);
      //console.log(confirm_response,'ca')
      if (confirm_response == true) {
        this.selectRespondents(ramdom_item.id);
      }
    },
    useMiniGame() {
      this.room.emit("useMinigame",this.responents);
      this.gameState = 'miniGame'
    },
    solution(result) {
      this.room.emit("solution", result);
      this.solution_q = result;
    },
    newRespondents() {
      this.gameState = "select_respondents";
      this.room.emit("newRespondents");
    },
    newQuestion() {
      this.room.emit("newQuestion");
      this.gameState = "questioning";
      this.question = "";
      this.responents = [];
      this.answer = "";
    },
    endGame() {
      this.room.emit("endGame");
      this.gameState = "endGame";
      this.question = "";
      this.responents = [];
      this.answer = "";
    },
    exitGame() {
      this.room.emit("exitGame");
      this.roomState = "normal";
    }
  }
};
</script>
<style scoped>
.flex_container {
  display: flex;
}
</style>



