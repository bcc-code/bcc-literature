export default {
    namespaced: true,
    state: {
        userInfo: null,
        appLanguage: localStorage.getItem('appLanguage') || 'no',
        isAuthenticated: false,
        topbarInitialized: false
    },
    mutations: {
        setUserInfo: (state, value) => {
            state.userInfo = value;
        },
        /*Authentication*/
        setAuthenticated: (state, value) => state.isAuthenticated = value,
        /*Languages*/
        setAppLanguage: (state, value) => {
            localStorage.setItem('appLanguage', value);
            state.appLanguage = value;
        },
        setTopbarInitialized: (state, value) => {
            state.topbarInitialized = value;
        }
    },
    actions: {
        updateUserInfo: ({state, commit}, userInfo) => {
            commit('setUserInfo', userInfo);
        }
    }
}