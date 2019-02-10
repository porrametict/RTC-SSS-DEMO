export default {
    namespaced: true,
    state: {
        teacher: null,
    },
    mutations: {
        setUser(state, data) {
            this.state.teacher = data
        },
        resetUser(state) {
            this.state.teacher = null
        },

    },
    actions: {
        async login(context, params) {
            // console.log(params, "in login actions Vuex")
            let data = await axios.post('teacher/login', params)
                .then((response) => {
                    console.log(response.data)
                    localStorage.access_token = response.data.token;
                    return response.data.token
                }).catch((error) => {
                    console.log(error)
                    return null
                });
            return data
        },
        async getUser(context, token) {
            let user = null;

            if (!token) {
                console.log('has token ')
                token = localStorage.access_token
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            }
            if (token) {
                console.log('no token ')
                user = await axios.get('/teacher/getuser').then((response) => {
                    context.commit("setUser", response.data)
                    console.log('setUser',response.data)
                    return response.data;
                }).catch((error) => {
                    return null;
                })
                localStorage.user = JSON.stringify(user);
                return user
            }
            return null;
        },
        logout: async function (context) {
            context.commit('resetUser');
            localStorage.removeItem("user")
            localStorage.removeItem("access_token")
        },

    }
}