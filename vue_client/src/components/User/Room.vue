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
        <h1>เกมได้เริ่มขึ้นเเล้ว ตั้งตารอคำถามได้เลย</h1>
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
        <h1>รอลุ้นกันดีกว่าว่าคุณจะได้ตอบหรือไม่</h1>
      </div>
      <!-- answering -->
      <div v-else-if="gameState == 'answering'">
        <!-- is Respondents -->
        <div v-if="isRespondents == true">
          <h1>ยินดีด้วยคุณได้โอกาศตอบข้อนี้</h1>
          <input
            type="text"
            placeholder="ใส่คำตอบของคุณลงที่นี่"
            v-model="answer"
            @click="sendAnswer(answer)"
          >
        </div>
        <!-- is not Respondents -->
        <div v-else>
           <h1>เสียใจด้วยคุณไม่ได้รับโอกาศตอบข้อนี้</h1>
        </div>
      </div>
      <!-- consider_solutions -->
      <div v-else-if="gameState == 'consider_solutions'">
        <h1>คำตอบ ;  {{answer}}</h1>
      </div>
    </section>
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
    isRespondents: false,
    answer: ""
  }),
  computed: {
    ...mapState({
      user: state => state.user.user
    })
  },
  async created() {
    window.onbeforeunload = this.confirmExit;
    window.onhashchange = function() {
      let v = confirm("ต้องการจะออกจากห้องจริงๆใช่ไหม");
      if (v == true) {
        this.exitRoom;
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
      this.room.on("gotRespondents", e => {
        if (e == this.user.id) {
          this.isRespondents = true;
        } else {
          this.isRespondents = false;
        }
        this.gameState = "answering";
      });
      this.room.on("answer",e=>{
        this.answer = e
        this.gameState = 'consider_solutions'
      })
    },
    sendMessage: async function(message) {
      this.room.emit("message", { body: message, user: this.user });
    },
    reciveMessage: async function(message) {
      this.messages.push(message);
    },
    exitRoom() {
      console.log("exitrRoom");
      this.room.emit("close");
    },

    confirmExit(e) {
      e.preventDefault();

      return "";
    },
    //game control
    wantToAnswer() {
      this.room.emit("wantToAnswer", this.user);
      this.gameState = "select_respondents";
    },
    sendAnswer (answer) {
      this.room.emit("answer",answer)
      this.gameState= 'consider_solutions'

    }
  }
};
</script>


