// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Ws from "@adonisjs/websocket-client";
import store from './stores/index'
import axios from 'axios'

window.axios =axios.create({
  baseURL : process.env.API_URL,
  timeout : 10000
})
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.get['Accepts'] = 'application/json';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.access_token;
axios.defaults.headers.common['Access-Control-Allow-Headers'] ='*';


// axios.defaults.headers.post['Content-Type'] ='application/json';
// axios.defaults.headers.common['Access-Control-Allow-Methods'] ='GET, PUT, POST, DELETE, OPTIONS';
// axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true;


Vue.config.productionTip = false



window.ws = Ws("ws://localhost:3333");

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
