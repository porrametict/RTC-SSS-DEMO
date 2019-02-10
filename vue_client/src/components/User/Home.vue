<template>
      <h1> home User {{user}}</h1>
      
</template>
<script>
export default {
      data : () => ({
            user :null 
      }),
      async created () {
            this.user = await this.$store.dispatch('user/getUser')
      }
}
</script>


