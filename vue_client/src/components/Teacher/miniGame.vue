<template>
  <div class="container" v-if="room">
      <!-- setting -->
    <div v-if="gameState == 'setting'" >
      <h1>miniGame Clickๆ at Room {{this.room}} Teacher</h1>ใส่ตัวเลขที่เป็นเส้นชัย
      <input type="number" v-model="maxClick">
      <input type="button" id="start_btn" value="เริ่มเกมส์" @click="startGame()">
    </div>
    <!-- ongame -->
    <div v-if="gameState == 'ongame'">
            <h1>เกมส์ดำเนินอยู่</h1>
    </div>
    <!-- end -->
    <div v-if="gameState == 'end'">
        <h1>เกมส์จบลงเเล้ว</h1>
        <h1>ผู้ชนะคือ {{winner.first_name}} {{winner.last_name}}</h1>
        <button @click="exitGame()">Exit</button>
    </div>

  </div>
</template>
<script>
import { mapState } from "vuex";
import Ws from "@adonisjs/websocket-client";
const ws = Ws("ws://localhost:3333");

export default {
  props: {
    room: Number
  },
  data: () => ({
    maxClick: 0,
    gameState: "setting",
    winner : null
  }),
  async mounted() {
    this.connectServer();
    if (!this.user) {
      await this.$store.dispatch("teacher/getUser");
    }
  },
  computed: {
    ...mapState({
      user: state => state.teacher.teacher
    })
  },
  methods: {
    connectServer: function() {
      ws.connect();
      /// must fix
      try {
        this.game = ws.subscribe(`minigame:${this.room}`);
      } catch (e) {
        this.game = ws.getSubscription(`minigame:${this.room}`);
      }
      this.game.on("ready", () => {});
      this.game.on("gameEnd",(e)=>{
          this.gameState = "end"
          this.winner = e
      })
    },
    startGame() {
      console.log("start")
      this.game.emit("startGame", this.maxClick);
      this.gameState = 'ongame'
    },
    exitGame () {
        this.$emit("change",this.winner.id)
    } 

  }
};
</script>
