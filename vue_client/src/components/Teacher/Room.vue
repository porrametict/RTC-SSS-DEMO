<template>
  <div class="container" v-if="user">
    <h1>Room Teacher</h1>
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
    if(!this.user){
        await this.$store.dispatch('teacher/getUser')
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


