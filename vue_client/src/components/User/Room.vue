<template>
  <div class="container">
    <h1>room User</h1>
    <hr>
    <input type="text" v-model="inputMessage" @keypress.13="sendMessage(inputMessage)">

    <section>
      <ul>
        <li v-for="(m,index) in messages" v-bind:key="index">{{m.body}} - {{m.user.first_name}}</li>
      </ul>
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
    inputMessage: null
  }),
  computed: {
    ...mapState({
      user: state => state.user.user
    })
  },
  async created() {
    // window.addEventListener("beforeunload", this.confirmExit);

    window.onbeforeunload = this.confirmExit
    window.onhashchange = function () {
      let v = confirm('ต้องการจะออกจากห้องจริงๆใช่ไหม');
      if (v == true) { 
          this.exitRoom
      }else{
        window.history.forward()
      }
    }

    if (!this.user) {
      await this.$store.dispatch("user/getUser");
    }
    let room_id = this.$route.params.room_id;
    this.roomData = await this.$store.dispatch("room/GetSingleRoom", room_id);
    this.connectServe();
  },
  beforeDestroy () {
    // window.removeEventListener("backbutton", this.confirmExit);
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
    },
    sendMessage: async function(message) {
      this.room.emit("message", { body: message, user: this.user });
    },
    reciveMessage: async function(message) {
      this.messages.push(message);
    },
     exitRoom() {
       console.log("exitrRoom")
      this.room.emit('close')
    },

    confirmExit(e) {
       //alert("pop");
      e.preventDefault();

      // if (this.windowState) {
      //   //alert("You leave this room.");
      // } else {
      //   this.windowState = true;
      //   e.returnValue = "";
      // }
      return "";
    }
  }
};
</script>


