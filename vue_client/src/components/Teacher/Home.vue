<template>
      <h1> home Teacher {{user}}</h1>
      
</template>
<script>
export default {
      data : () => ({
            user :null 
      }),
      async created () {
            this.user = await this.$store.dispatch('teacher/getUser')
      }
}
</script>


