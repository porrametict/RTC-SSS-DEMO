export default {
    namespaced: true,
    state: {
        //subject: null,
    },
    mutations: {
        // setSubject(state, data) {
        //     this.state.subject = data
        // },

    },
    actions: {
        async teacherGetRoom(context, params) {
            // console.log(params, "in login actions Vuex")
            //console.log('sj',params)
            let data = await axios.get('teacher/room', { params: { 'sj': params } })
                .then((response) => {
                    // context.commit('setSubject',response.data)
                    return response.data
                }).catch((error) => {
                    console.log(error)
                    return null
                });
            return data
        },
        async createRoom(context, params) {
            let data = await axios.post('teacher/room', params)
                .then((response) => {
                    return response.data
                }).catch((error) => {
                    console.log(error)
                    return null
                });
            return data
        },
        async GetSingleRoom (context,params) {
            let data = await axios.get('teacher/room/'+params)
                .then((response) => {
                    // context.commit('setSubject',response.data)
                    return response.data
                }).catch((error) => {
                    console.log(error)
                    return null
                });
            return data
        }


    }
}