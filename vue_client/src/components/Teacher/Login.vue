<template>
  <div class="container">
    <h1>teacher login</h1>
    <input type="text" v-model="username" placeholder="username">
    <input type="password" v-model="password" placeholder="password">
    <input type="button" value="login" @click="login">
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
            let data  = await this.$store.dispatch("teacher/login",{"username":this.username,"password":this.password})
            console.log(data,'data')
            if(data) {
                  this.$router.push({name:'home-teacher'})
            }
        }
  }
};
</script>


