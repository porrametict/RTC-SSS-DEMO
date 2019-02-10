<template>
  <div class="container">
    <h1>Subject Code</h1>
    <hr>
    <section>
        <input type="text" v-model="newRoomName" placeholder="ใส่ชื่อห้องที่ต้องการ"> 
        <input type="button" value="สร้างห้อง" @click="createRoom"> {{newRoomName}}
    </section>
    <section>
        <h2>ห้องสำหรับวิชานี้</h2>
        <ul>
            <li v-for="(r,index) in room" v-bind:key="index">
                {{r.name}}
                <input type="button" value="เข้าห้อง" @click="enterRoom(r.id)">
            </li>
        </ul>
    </section>
  </div>
</template>
<script>
export default {
  data: () => ({
    data: null,
    sj:null,
    newRoomName : "",
    room:null
  }),
  async created() {
    this.sj = this.$route.params.sj_code;
    this.room = await this.$store.dispatch("room/teacherGetRoom", this.sj);
  },
  methods : {
      createRoom() {
          this.$store.dispatch('room/createRoom',{sj_code:this.sj,name:this.newRoomName})
      },
      enterRoom  (id) {
          this.$router.push({name:'room-teacher',params:{"room_id":id}})
      }
  }
};
</script>
