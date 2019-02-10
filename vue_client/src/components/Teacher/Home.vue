<template>
  <div class="container" v-if="user">
    <h1>home Teacher : {{user.last_name}}</h1>
    <hr>
    <div class="content">
      <aside v-if="subject">
        <select v-model="sjSelect" aria-placeholder="select">
          <option selected disabled>Choose here</option>
          <option v-bind:key="index" v-for="(s,index) in subject">{{s.code}} - {{s.name}}</option>
        </select>
        <input type="button" value="ลงทะเบียนสอน" @click="goenroll">
        {{sjSelect}}
      </aside>

      <section v-if="sjenroll">
        <h1>วิชาที่คุณสอน</h1>
        <ul>
          <li v-for="(se,index) in sjenroll" v-bind:key="index">
            {{se.code}} - {{se.name}} 
            <input type="button" value="เลือก" @click="goSubject(se.code)">
          </li>
        </ul>
      </section>
      <section v-else>
        <h2>ไม่มีข้อมูล</h2>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    user: null,
    sjSelect: "Choose here",
    subject: null,
    sjenroll: null
  }),
  async created() {
    this.user = await this.$store.dispatch("teacher/getUser");

    this.subject = await this.$store.dispatch("subject/getSubject");
    this.sjenroll = await this.$store.dispatch("teacherSubject/getSubjectEnrolled");
  },
  methods: {
    goenroll() {
      let posDash = this.sjSelect.indexOf("-");
      let sj = this.sjSelect.substring(0, posDash - 1);
      this.$store.dispatch("teacherSubject/enrollSubject", sj);
    },
    goSubject (sj_code) {
        this.$router.push({name:'subject-teacher',params:{sj_code:sj_code}})
    }
  }
};
</script>


