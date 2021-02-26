import ArticleApi from 'utils/api/articleApi';
import base from './base.js';

export default {
    namespaced: true,
    modules: {
        base
    },
    state: {
        lastId: 0
    },
    mutations: {
        setLastId: (state, value) => {
            state.lastId = value;
        }
    },
    actions: {
        load: async ({ commit }, id) => {
            let article;
            await ArticleApi.getArticle(id)
                .then((result) => {
                    article = result.data;
                })
            commit('base/patch', article);
            return article;
        },
        loadAllByAuthorId: async ({commit, state}, {authorId, forceReload = false}) => {
            if (authorId == state.lastId && !forceReload)
                return;
            return await ArticleApi.getArticlesByAuthor(authorId)
                .then((result) => {
                    result.data.forEach(article => {
                        var date = new Date(article.publishingDate);
                        article.year = date.getFullYear();
                        article.month = date.getMonth()+1;
                    });
                    commit('base/setAll', result.data);
                    commit('setLastId', authorId);
                })
        },
        loadChapter: async ({commit}, {bookId, chapterId}) => {
            let article = null;
            await ArticleApi.getByBookAndChapter(bookId, chapterId)
                .then((result) => {
                    article = result.data
                })
            commit('base/patch', article);
            return article;
        },
        ensureSurroundingChapters: async ({commit}, {bookId, chapterId, count}) => {
            const articles = new Array();
            for (let i = -count; i < (count * 2 + 1); i++) {
                if (chapterId+i > 0)
                    articles.push(chapterId+i);
            }
            return await Promise.all(
                articles.map(async (a) => {
                    await ArticleApi.getByBookAndChapter(bookId, a)
                        .then((result) => {
                            commit('base/patch', result.data);
                        })
                }));
        },
        loadArticlesByMonth: async ({commit}, {bookId, year, month}) => {
            let articles = null;
            await ArticleApi.getArticlesForPublicationMonth(bookId, year, month)
                .then((result) => {
                    articles = result.data;
                    articles.forEach((article) => {
                        article.year = year;
                        article.month = month;
                        commit('base/patch', article);
                    });
                })
            return articles;
        }
    },
    getters: {
        getAllByBookId: (state) => (bookId) => {
            return state.base.all.filter((i) => i.bookId == bookId).sort((a, b) => parseInt(a.chapterId) - parseInt(b.chapterId));
        },
        getTitlesByMonth: (state) => (bookId, year, month) => {
            return state.base.all.filter((i) => i.bookId == bookId && i.year == year && i.month == month)
                .map((a) => { return {id: a.chapterId, title: a.title }})
                .sort((a, b) => parseInt(a.chapterId) - parseInt(b.chapterId))
        }
    }
}