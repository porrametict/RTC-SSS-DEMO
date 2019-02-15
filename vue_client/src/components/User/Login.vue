<template>
  <div class="container">
    <h1>user login</h1>
    <input type="text" v-model="username" placeholder="username">
    <input type="password" v-model="password" placeholder="password">
    <input type="button" value="login" @click="login">
    <br>
    <input type="button" value="for teacher" @click="$router.push({name:'teacher-login'})">
  </div>
</template>
<script>
export default {
  data: () => ({
        username : "",
        password : ""
  }),
  methods : {
        async login () {
            let data  = await this.$store.dispatch("user/login",{"username":this.username,"password":this.password})
            console.log(data,'data')
            if(data) {
                  this.$router.push({name:'home-user'})
            }
        }
  }
};
</script>


