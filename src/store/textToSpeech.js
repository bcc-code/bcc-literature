import bmmProvider from 'utils/textToSpeech/bmmAudioProvider';
import synthesisProvider from 'utils/textToSpeech/speechSynthesisProvider';
import { logCustomEvent } from 'utils/appInsights';

const TTS_EVENT_NAME = 'TTS_reading_started',
    allProviders = [bmmProvider, synthesisProvider];

export default {
    namespaced: true,
    state: {
        currentProvider: null,
        currentArticleId: -1,
        isPlaying: false,
    },
    mutations: {
        setProvider: (state, article) => {
            let provider = synthesisProvider;
            if (!navigator.onLine) {
                provider = synthesisProvider;
            }
            
            if (article.bmmAlbumId) {
                provider = bmmProvider;
            }

            state.currentProvider = provider;
        },
        setCurrentArticleId: (state, articleId) => {
            state.currentArticleId = articleId;
        },
        updatePlayingState: function(state) {
            let currentProvider = state.currentProvider;
            if (!currentProvider) {
                for (const provider of allProviders) {
                    if (provider.isPlaying()) {
                        state.currentProvider = provider;
                        break;
                    }
                }
            }
            state.isPlaying = !!state.currentProvider && state.currentProvider.isPlaying();
        },
    },
    actions: {
        toggleSpeak: ({ dispatch, state }, article) => {
            dispatch(isArticlePlaying(state, article) ? 'stop' : 'speak', article);
        },
        isArticlePlaying: ({state}, article) =>{
            return isArticlePlaying(state, article);
        },
        stop: ({ commit }) => {
            stopAllProviders();
            commit('setCurrentArticleId', -1);
            commit('updatePlayingState');
        },
        speak: async ({ commit, state, dispatch }, article) => {
            dispatch('stop', article);
            commit('setProvider', article);
            try {
                await state.currentProvider.speak(article);
                await logTextToSpeech(article);
            } catch (error) {
                commit('error/setDisplayMessage', $t('reader.cant-play-text-to-speech'), {root: true});
                commit('error/showError', true, {root: true});
            }

            commit('setCurrentArticleId', article.id);
            commit('updatePlayingState');
        },
        reset: ({dispatch}) => {
            dispatch('stop');
        },
    },
};

async function logTextToSpeech(article) {
    await logCustomEvent(TTS_EVENT_NAME, article);
}

function stopAllProviders() {
    for (const provider of allProviders) {
        provider.stop();
    }
}

function isArticlePlaying(state, article) {
    return state.isPlaying && state.currentArticleId == article.id;
}
