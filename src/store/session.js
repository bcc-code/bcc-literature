const nightMode = JSON.parse(localStorage.getItem('nightMode'))
const MIN_FONT_SIZE = 0.7;
const MAX_FONT_SIZE = 2;
export default {
    namespaced: true,
    state: {
        userInfo: null,
        appLanguage: localStorage.getItem('appLanguage') || 'no',
        nightMode: nightMode == null ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : nightMode,
        fontSize: +parseFloat(localStorage.getItem('fontSize')).toFixed(2) || 1,
        isAuthenticated: false,
        topbarInitialized: false, 
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
        changeFontSize: (state, value) => {
            if (isNaN(state.fontSize)) state.fontSize = 1
            if (value > 0)
                state.fontSize = Math.min(MAX_FONT_SIZE, state.fontSize + value)
            else
                state.fontSize = Math.max(MIN_FONT_SIZE, state.fontSize + value)
            localStorage.setItem('fontSize', +state.fontSize.toFixed(2))
        },
        setTopbarInitialized: (state, value) => {
            state.topbarInitialized = value;
        }
    },
    actions: {
        updateUserInfo: ({state, commit}, userInfo) => {
            commit('setUserInfo', userInfo);
        }
    },
    getters: {
        isMinFontSize: (state) => state.fontSize <= MIN_FONT_SIZE,
        isMaxFontSize: (state) => state.fontSize >= MAX_FONT_SIZE
    }
}