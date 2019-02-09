// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Ws from "@adonisjs/websocket-client";
import store from './stores/index'


Vue.config.productionTip = false

// window.ws = Ws("ws://localhost:3333");

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
