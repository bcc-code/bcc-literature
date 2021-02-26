export default {
    namespaced: true,
    state: {
        message: "",
        failedRequest: "",
        showNotice: false
    },
    mutations: {
        showError: (state, value) => { state.showNotice = value },
        setMessage: (state, value) => { state.message = value },
        setFailedRequest: (state, value) => {state.failedRequest = value }
    },
    actions: {
        setError: ({commit}, error) => {
            commit('setMessage', error.request ? error.request.responseText : error);
            commit('setFailedRequest', error.request ? error.request.responseURL : "Front-end error");
            commit('showError', true);
        }
    }
}