// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './stores/index'
import axios from 'axios'

window.axios =axios.create({
  baseURL : process.env.API_URL,
  timeout : 10000
})
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.access_token;


// axios.defaults.headers.post['Content-Type'] ='application/json';
// axios.defaults.headers.common['Access-Control-Allow-Methods'] ='GET, PUT, POST, DELETE, OPTIONS';
// axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;


Vue.config.productionTip = false




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
