import BookApi from 'utils/api/bookApi';
import base from './base.js';

export default {
    namespaced: true,
    modules: {
        base
    },
    actions: {
        loadAll: async ({ commit, state }, forceReload = true) => {
            if (!state.base.updated || forceReload)
                return await BookApi.getAllBooks()
                    .then((result) => {
                        commit('base/patchAll', result.data);
                        commit('base/setUpdated', true);
                    });
        },
        load: async ({commit}, id) => {
            let book = null;
            await BookApi.getBook(id)
                .then((result) => {
                    if(result.data.length <= 0){
                        throw new Error('Book does not exist.');
                    }
                    result.data[0].redirectToCorrectLanguage = (id != result.data[0].id);
                    commit('base/patch', result.data[0]);
                    book = result.data[0];
                })
            return book;
        },
        loadTranslations: async ({}, id) => {
            let translations = null;
            await BookApi.getBookTranslations(id)
                .then((result) => {
                    if(result.data.length <= 0){
                        throw new Error('Book does not have any translation.');
                    }
                    translations = result.data;
                })
            return translations;
        },
        loadChapters: async ({commit}, bookId) => {
            return await BookApi.getChaptersByBookId(bookId)
                .then((result) => {
                    commit('base/patch', {
                        id: Number.parseInt(bookId, 10),
                        chapters: result.data
                    });
                    return;
                })
        },
    },
    getters: {
        getAllByAuthorId: (state) => (authorId) => {
            return state.base.all.filter((i) => i.author != null && i.author.id == authorId);
        },
    }
}