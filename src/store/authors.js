import AuthorApi from 'utils/api/authorApi';
import base from './base';

export default {
    namespaced: true,
    modules: {
        base
    },
    state: {
        popular: [],
    },
    mutations:{
        setPopular: (state, value) => {
            state.popular = value || [];
        },
    },
    actions:{
        loadAll: async ({commit, state}, forceReload = true) => {
            if (!state.base.updated || forceReload)
                return await AuthorApi.getAllAuthors().then((result) => {
                    commit('base/setAll', result.all);
                    commit('setPopular', result.popular);
                    commit('base/setUpdated', true);
                })
        },
        load: async ({commit}, id) => {
            let author = null;
            await AuthorApi.getAuthor(id)
                .then((result) => {
                    if(result.data.length <= 0){
                        throw new Error('Author does not exist.');
                    }
                    commit('base/patch', result.data);
                    author = result.data;
                })
            return author;
        }
    },
}