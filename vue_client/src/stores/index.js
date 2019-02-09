import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import teacher from './modules/teacher'
import user from './modules/user'
import subject from './modules/subject'
import room from './modules/room'
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
      room : room

    }
})