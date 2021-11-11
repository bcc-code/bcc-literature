export default {
    namespaced: true,
    state: {
        message: "",
        failedRequest: "",
        showNotice: false,
        displayMessage: null
    },
    mutations: {
        showError: (state, value) => {
            state.showNotice = value;
            if(!value) {
                state.displayMessage = null;
            }
        },
        setMessage: (state, value) => { state.message = value },
        setFailedRequest: (state, value) => {state.failedRequest = value },
        setDisplayMessage: (state, value) => {state.displayMessage = value },
    },
    actions: {
        setError: ({commit}, error) => {
            commit('setMessage', error.request ? error.request.responseText : error);
            commit('setFailedRequest', error.request ? error.request.responseURL : "Front-end error");
            commit('showError', true);
        }
    }
}