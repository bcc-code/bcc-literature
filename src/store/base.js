import Vue from 'vue';

export default {
    namespaced: true,
    state() {
        return {
            all: [],
            updated: false
        }
    },
    mutations: {
        setUpdated: (state, value) => { state.updated = value },
        setAll: (state, value) => {
            state.all = value || [];
        },
        patchAll : (state, value) => {
            value.map((el, index) => {
                var item = state.all.find(element => element.id == el.id);
                if (item != null)
                    Vue.set(value, index, Object.assign(item, el));
            });
            state.all = value;
        },
        patch: (state, patch) => {
            Object.keys(patch).forEach((key) => (patch[key] == null) && delete patch[key]);
            state.all = state.all || [];
            for (let i = 0; i < state.all.length; i++) {
                const item = state.all[i];
                if (item && item.id === patch.id) {
                    Vue.set(state.all, i, Object.assign(item, patch));
                    return;
                }
            }
            state.all.push(patch);
        },
    },
    actions: {
        reset: ({commit}) => {
            commit('setAll', []);
            commit('setUpdated', false);
        }
    },
    getters: {
        getById: (state) => (id) => {
            return state.all.find((i) => i.id == id);
        }
    }
}