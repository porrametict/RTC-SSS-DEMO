export default {
    namespaced: true,
    state: {
        teacherSubject: null,
    },
    mutations: {
        setTeacherSubject(state, data) {
            this.state.teacherSubject = data
        },
      
    },
    actions: {
        async getSubjectEnrolled (context) {
            let t_id = this.state.teacher.teacher.id 
            // console.log(t_id,'t_is')
            let data = await axios.get('teacher/subject',{params:{'id':t_id}})
            .then ((response)=> {
                console.log('tsEn',response.data)
                context.commit('setTeacherSubject',response.data)
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
            let teacher_id = this.state.teacher.teacher.id
            let form = {"sj_code":params,"t_id":teacher_id}
           // console.log('fa',form)
            let data = await axios.post('teacher/subject',form )
    
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