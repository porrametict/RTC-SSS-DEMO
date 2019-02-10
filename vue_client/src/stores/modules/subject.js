export default {
    namespaced: true,
    state: {
        subject: null,
    },
    mutations: {
        setSubject(state, data) {
            this.state.subject = data
        },

    },
    actions: {
        async getSubject(context, params) {
            // console.log(params, "in login actions Vuex")
            let data = await axios.get('public/subject')
                .then((response) => {
                    context.commit('setSubject',response.data)
                    return response.data
                }).catch((error) => {
                    console.log(error)
                    return null
                });
            return data
        },
      

    }
}