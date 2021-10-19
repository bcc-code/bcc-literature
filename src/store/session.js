const nightMode = JSON.parse(localStorage.getItem('nightMode'))
export default {
    namespaced: true,
    state: {
        userInfo: null,
        appLanguage: localStorage.getItem('appLanguage') || 'no',
        nightMode: nightMode == null ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : nightMode,
        isAuthenticated: false,
        topbarInitialized: false
    },
    mutations: {
        setUserInfo: (state, value) => state.userInfo = value,
        /*Authentication*/
        setAuthenticated: (state, value) => state.isAuthenticated = value,
        /*Languages*/
        setAppLanguage: (state, value) => {
            localStorage.setItem('appLanguage', value);
            state.appLanguage = value;
        },
        toggleNightMode: (state) => {
            state.nightMode = !state.nightMode;
            localStorage.setItem('nightMode', state.nightMode);
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