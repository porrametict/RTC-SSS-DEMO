<template>
  <div class="container" v-if="room">
    <h1>miniGame Clickๆ at Room {{this.room}} User</h1>

    <!-- รอเริ่มเกมส์ -->
    <div v-if="gameState == 'waiting'">
      <h1>กดให้เร็วที่สุดเพื่อชนะ</h1>
      <h1>เตรียมตัวให้พร้อม</h1>
    </div>
    <!-- เกม -->
    <div v-if="gameState == 'ongame'">
      <h1>กดให้เร็วที่สุดเพื่อชนะ</h1>

      <h1>กดให้ครบ {{maxClick}} ครั้ง</h1>
      <input type="button" id="start_btn" value="กด!!" @click="clickClick()">
    </div>

    <div v-if="gameState == 'end'">
      <div v-if="isWinner == true">ยินดีด้วยคุณชนะ</div>
      <div v-else>คุณไม่ใช่ผู้ชนะ</div>
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
    gameState: "waiting",
    maxClick: 0,
    isWinner: false
  }),
  async mounted() {
    this.connectServer();
    if (!this.user) {
      await this.$store.dispatch("user/getUser");
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.user
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

      this.game.on("startgame", e => {
        this.maxClick = e;
        this.gameState = "ongame";
      });

      this.game.on("getwinner", e => {
        if (e == true) {
          this.isWinner = e;
          this.game.emit("winner", this.user);
        }
      });
      this.game.on("gameEnd", e => {
        this.gameState = "end";
      });
    },
    clickClick() {
      this.game.emit("clickClick");
    }
  }
};
</script>