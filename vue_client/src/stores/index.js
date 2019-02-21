import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import teacher from './modules/teacher'
import user from './modules/user'
import subject from './modules/subject'
import room from './modules/room'
import teacherSubject from './modules/teacherSubject'
import studentSubject from './modules/studentSubject'
import question from './modules/question'
function store(name) {
    return function (resolve) {
      require(['./modules/' + name], resolve);
    }
  }
  

export default new Vuex.Store ({
    modules : {
      teacher :teacher,
      user : user,
      subject :subject,
      room : room,
      teacherSubject : teacherSubject,
      studentSubject :  studentSubject ,
      question : question

    }
})