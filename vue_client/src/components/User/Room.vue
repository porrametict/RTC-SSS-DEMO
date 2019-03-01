<template>
  <div class="container">
    <h1>room User</h1>
    <hr>
    <!-- normal -->
    <section v-if="roomState == 'normal'">
      <input type="text" v-model="inputMessage" @keypress.13="sendMessage(inputMessage)">

      <ul>
        <li v-for="(m,index) in messages" v-bind:key="index">{{m.body}} - {{m.user.first_name}}</li>
      </ul>
    </section>
    <!-- active -->
    <section v-else>
      <!-- questioning -->
      <div v-if="gameState == 'questioning'">
        <h1>การตั้งคำถามได้เริ่มขึ้นเเล้ว ตั้งตารอคำถามได้เลย</h1>
      </div>
      <!-- hasQuestion -->
      <div v-else-if="gameState == 'hasQuestion'">
        <h1>คำถาม</h1>
        <h2>{{question}}</h2>
        <br>
        <input type="button" value="ต้องการตอบ" @click="wantToAnswer()">
      </div>
      <!-- select_respondents -->
      <div v-else-if="gameState == 'select_respondents'">
        <h1>อยู่ระหว่างการเลือก</h1>
      </div>

      <!-- minigame -->
      <div v-if="gameState == 'miniGame'">
        <mini-game :room="roomData.id"/>
      </div>

      <!-- answering -->
      <div v-else-if="gameState == 'answering'">
        <!-- is Respondents -->
        <div v-if="isRespondents == true">
          <h1>ยินดีด้วยคุณได้โอกาศตอบข้อนี้</h1>
          <input type="text" placeholder="ใส่คำตอบของคุณลงที่นี่" v-model="answer">
          <input type="button" value="ส่งคำตอบ" @click="sendAnswer(answer)">
        </div>
        <!-- is not Respondents -->
        <div v-else>
          <h1>เป็นเรื่องที่น่าเสียดายที่คุณจะไม่ได้ตอบข้อนี้</h1>
        </div>
      </div>
      <!-- consider_solutions -->
      <div v-else-if="gameState == 'consider_solutions'">
        <h1>คำตอบ ; {{answer}}</h1>
        <h2>{{result_answer}}</h2>
      </div>
      <!-- endGame -->
      <div v-else-if="gameState == 'endGame'">
        <h1>เกมส์จบเเล้ว</h1>
        <ul>
          <li v-for="(s,index) in score_report" v-bind:key="index">{{s}}</li>
        </ul>
        <input type="button" value="ออก" @click="exitGame()">
      </div>
    </section>
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
    isRespondents: false,
    answer: "",
    result_answer: "กำลังพิจารณา",
    score_report: []
  }),
  computed: {
    ...mapState({
      user: state => state.user.user
    })
  },
  async created() {
    // window.onbeforeunload = this.confirmExit;
    window.onbeforeunload = this.exitRoom;
    let vm = this;
    window.onhashchange = function() {
      let v = confirm("ต้องการจะออกจากห้องจริงๆใช่ไหม");
      if (v == true) {
        vm.exitRoom();
        console.log("true")
      } else {
        window.history.forward();
      }
    };

    if (!this.user) {
      await this.$store.dispatch("user/getUser");
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
        this.room.emit("joinRoom", { user: this.user, ishost: false });
      });
      this.room.on("message", e => {
        this.reciveMessage(e);
      });
      this.room.on("close", e => {
        alert("คุณได้ออกจากห้องเเล้ว");
        this.$router.push({
          name: "subject-user",
          "sj-code": this.$route.params.sj_code
        });
      });

      //game
      this.room.on("active", () => {
        this.roomState = "active";
      });
      this.room.on("hasQuestion", e => {
        this.question = e;
        this.gameState = "hasQuestion";
      });
      this.room.on("useMinigame", e => {
        let useG = false;
        e.forEach(element => {
          //console.log(element.id,this.user.id , "=<")
          if(element.user.id == this.user.id){
               useG = true;
          }
        });
        console.log(useG,"useG",e)
        if (useG == true) {
          this.gameState = "miniGame";
        } else {
          this.gameState = 'answering'
        }
      });

      this.room.on("gotRespondents", e => {
        if (e == this.user.id) {
          this.isRespondents = true;
        } else {
          this.isRespondents = false;
        }
        this.gameState = "answering";
      });
      this.room.on("answer", e => {
        this.answer = e;
        this.gameState = "consider_solutions";
        this.result_answer = "กำลังพิจารณา";
      });
      this.room.on("checked_answer", e => {
        if (e) {
          this.result_answer = "ถูกต้อง";
        } else {
          this.result_answer = "ผิด";
        }
      });
      this.room.on("newRespondents", () => {
        this.gameState = "select_respondents";
        this.isRespondents = false;
        this.answer = "";
      });
      this.room.on("newQuestion", () => {
        this.gameState = "questioning";
        this.question = "";
        this.isRespondents = false;
        this.answer = "";
      });
      this.room.on("endGame", e => {
        this.gameState = "endGame";
        this.score_report = e;
        this.question = "";
        this.isRespondents = false;
        this.answer = "";
      });
    },
    sendMessage: async function(message) {
      this.room.emit("message", { body: message, user: this.user });
    },
    reciveMessage: async function(message) {
      this.messages.push(message);
    },
    exitRoom() {
      // console.log("exitrRoom");
      this.room.emit("exitRoom");
    },

    confirmExit(e) {
      e.preventDefault();
      this.exitRoom()

      return "";
    },
    //game control
    wantToAnswer() {
      this.room.emit("wantToAnswer", this.user);
      this.gameState = "select_respondents";
    },
    sendAnswer(answer) {
      this.room.emit("answer", answer);
      this.result_answer = "กำลังพิจารณา";
      this.gameState = "consider_solutions";
    },
    exitGame() {
      this.roomState = "normal";
    }
  }
};
</script>


