<template>
  <div class="container" v-if="user">
    <h1>Room Teacher</h1>
    <input type="button" @click="gameStart" value="Game Start">
    <hr>
    <input type="text" v-model="inputMessage" @keypress.13="sendMessage(inputMessage)">

    <div class="flex_container">
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
    inputMessage: null
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
    //console.log(this.room)
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
        console.log("up",e,e.players)
        this.players = e.players;
      });
      this.room.on("close", e => {
        alert("คุณได้ออกจากห้องเเล้ว");
        this.$router.push({
          name: "subject-teacher",
          "sj-code": this.$route.params.sj_code
        });
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

      // if (this.windowState) {
      //   alert("You leave this room.");

      // } else {
      //   this.windowState = true;
      //   e.returnValue = "";
      // }
      return "";
    },
    exitRoom() {
      
      this.room.emit("close");
    },

    /// game Control
    gameStart() {
      this.room.emit("gameStart");
    }
  }
};
</script>
<style scoped>
.flex_container {
  display: flex;
}
</style>



