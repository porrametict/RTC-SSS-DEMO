<template>
    <div class="container">
        <h1>Subject</h1>
        <section>
            <h2>ห้องสำหรับวิชานี้</h2>
            <ul>
                 <li v-for="(r,index) in rooms" v-bind:key="index">
                {{r.name}}
                <input type="button" value="เข้าห้อง" @click="enterRoom(r.id)">
            </li>
            </ul>
        </section>
    </div>
    
</template>
<script>
export default {
    data : () => ({
        rooms : null 
    }),
    async created () {
        this.sj  =this.$route.params.sj_code
        this.rooms = await this.$store.dispatch('room/GetRooms',this.sj)
        // console.log(this.rooms)
    },
    methods : {
        enterRoom (id) {
            this.$router.push({name:'room-user',params:{'room_id':id}})
        }
    }
}
</script>

