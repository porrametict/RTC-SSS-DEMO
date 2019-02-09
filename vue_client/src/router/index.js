import Vue from 'vue'
import Router from 'vue-router'
import UserLogin from '@/components/User/Login'
import UserHome from '@/components/User/Home'
import UserRoom from '@/components/User/Room'
import UserTemplate from '@/components/User/Template'

import TeacherLogin from '@/components/Teacher/Login'
import TeacherHome from '@/components/Teacher/Home'
import TeacherRoom from '@/components/Teacher/Room'
import TeacherTemplate from '@/components/Teacher/Template'


Vue.use(Router)


// function view(name) {
//   return function (resolve) {
//     require(['@/components/' + name + '.vue'], resolve);
//   }
// }

export default new Router({
  routes: [
    {
      path: '/',
      name: 'user-login',
      component: UserLogin
    },
    {
      path: '/teacher-login',
      name: 'teacher-login',
      component: TeacherLogin
    },
    {
      path: '/user',
      name: 'user',
      component: UserTemplate,
      children: [
        {
          path: '/',
          name: 'home-user',
          component:  UserHome
        },
        {
          path: 'room',
          name: 'room-user',
          component: UserRoom
        },
      ]
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: TeacherTemplate,
      children: [
        {
          path: '/',
          name: 'home-teacher',
          component: TeacherHome
        },
        {
          path: 'room',
          name: 'room-teacher',
          component: TeacherRoom
        },
      ]
    },

  ]
})
