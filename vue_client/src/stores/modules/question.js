import Axios from "axios";

export default {
    namespaced : true,
    state : {
        question:null
    },
    mutations : {
        setQuestion (state,data) {
            this.state.question.question = data;
        }

    },
    actions : {
        async getQuestions (context,params) {
            let data = await axios.get("teacher/question",{params : {room_id:params}})
                .then ((response)=>{
                    context.commit("setQuestion",response.data)
                    return response.data 
                }).catch(e => {
                    console.log(e)
                })
            return data;
        },
        async storeQuestion (context,params) {
            let data = await axios.post("teacher/question",params)
            .then ((response)=>{
                return response.data 
            }).catch(e => {
                console.log(e)
            })
        return data;
        },
        
    }
}