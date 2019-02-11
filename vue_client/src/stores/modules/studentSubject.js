export default {
    namespaced: true,
    state: {
        userSubject: null,
    },
    mutations: {
        setUserSubject(state, data) {
            this.state.userSubject = data
        },
      
    },
    actions: {
        async getSubjectEnrolled (context) {
            let std_id = this.state.user.id 
            // console.log(t_id,'t_is')
            let data = await axios.get('user/subject',{params:{'id':std_id}})
            .then ((response)=> {
                console.log('tsEn',response.data)
                context.commit('setUserSubject',response.data)
                return response.data
            })
            .catch ((error)=> {
                console.log(error)
                return null
            })
            return data;
        },
        async enrollSubject(context, params) {
            // console.log(params, "in login actions Vuex")
            let user_id = this.state.user.id
            let form = {"sj_code":params,"std_id":user_id}
           // console.log('fa',form)
            let data = await axios.post('user/subject',form )
    
                .then((response) => {
                    //console.log(response.data)
                    return response.data
                }).catch((error) => {
                    console.log(error)
                    return null
                });
            return data
        },
       
    }
}