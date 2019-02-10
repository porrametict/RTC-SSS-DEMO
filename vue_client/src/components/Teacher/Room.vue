<template>
  <div class="container" v-if="user">
    <h1>Room Teacher</h1>
    <hr>
    <input type="text" v-model="inputMessage" @keypress.13="sendMessage(inputMessage)">

    <section>
      <ul>
        <li v-for="(m,index) in messages" v-bind:key="index">{{m.body}} - {{m.user}}</li>
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
    roomData: null,
    room: null,
    messages: [],
    inputMessage: null
  }),
  computed: {
//     ...mapState({
//       user: state => state.teacher
//     })
  },
  async created() {
      this.user = localStorage.getItem('user')
    console.log('catll',this.user['first_name'])

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
        this.sendMessage("Hello World");
      });
      this.room.on("message", e => {
        this.reciveMessage(e);
      });
    },
    sendMessage: async function(message) {
      this.room.emit("message", { body: message, user: this.user });
    },
    reciveMessage: async function(message) {
      this.messages.push(message);
    }
  }
};
</script>


