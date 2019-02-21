<template>
  <div class="container">
    <h1>SET QUESTIONS</h1>
    <hr>
    <h2>คำถามของห้องนี้</h2>
    <ul v-if="questions.length">
      <li v-for="(q,index) in questions" :key="index">
          <!-- display -->
        <div v-if="inEdit != index">
          ข้อ {{q.sequence_number}} : {{q.question}}
          <button @click="inEdit = index ; QuestionEdit = q.question">เเก้ไข</button>
        </div>
        <!-- edit -->
        <div v-if="inEdit == index">
            <input type="text" v-model="QuestionEdit">
            <button @click="questionUpdate">อัพเดท</button>
        </div>

      </li>
    </ul>
    <div>
      <input type="text" v-model="newQuestion" placeholder="ใส่คำถามของคุณที่นี่">
      <button @click="storeQuestion()">เพิ่มคำถาม</button>
    </div>
    <br>
    <button @click="saveQuestion()">บันทึก</button>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    questions: [],
    newQuestion: null,
    inEdit: null,
    QuestionEdit  : null,
  }),
  computed: {},
  async created() {
    this.room_id = this.$route.params.room_id;
    this.questions = await this.$store.dispatch(
      "question/getQuestions",
      this.room_id
    );
  },
  methods: {
    storeQuestion() {
      // console.log(this.questions,"before")
      let sq_number;
      if (this.questions.length == 0) {
        sq_number = 1;
      } else {
        sq_number = this.questions.length + 1;
      }
      let newQ = {
        sequence_number: sq_number,
        question: this.newQuestion,
        room_id: this.room_id,
        options: null
      };
      this.questions.push(newQ);
      // console.log(this.questions,"after")
      this.newQuestion = null
    },
    questionUpdate () {
        this.questions[this.inEdit]["question"] = this.QuestionEdit
        this.inEdit = null
        this.QuestionEdit = null
    },
    async saveQuestion() {
      let data = await this.$store.dispatch("question/storeQuestion",this.questions);
    }
  }
};
</script>

