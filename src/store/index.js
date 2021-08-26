import Vue from 'vue';
import Vuex from 'vuex';
import books from './books';
import articles from './articles';
import session from './session';
import search from './search';
import publications from './publications';
import authors from './authors';
import error from './error';
import textToSpeech from './textToSpeech';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        books,
        articles,
        session,
        search,
        publications,
        authors,
        error,
        textToSpeech,
    },
});
