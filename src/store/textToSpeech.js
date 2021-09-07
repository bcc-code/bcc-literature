import bmmProvider from 'utils/textToSpeech/bmmAudioProvider';
import synthesisProvider from 'utils/textToSpeech/speechSynthesisProvider';
import { logCustomEvent } from 'utils/appInsights';

const TTS_EVENT_NAME = 'TTS_reading_started',
    allProviders = [bmmProvider, synthesisProvider];

let clockInterval = null;

export default {
    namespaced: true,
    state: {
        currentProvider: null,
        currentArticleId: -1,
        playingPercentage: 0,
        isPlaying: false,
        articleClock: {
            time: '00:00',
            startTime: null,
            pauseTime: null,
            pauseDuration: 0,
            articleId: -1
        }
        
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
        setPlayingPercentage: function(state, value){
            if (value > 100) value = 100;
            state.playingPercentage = value;
        },
        initClock: function(state, articleId){
            if (state.articleClock.articleId == articleId && state.articleClock.pauseTime !== null){
                state.articleClock.pauseDuration += (new Date() - state.articleClock.pauseTime);
            } else {
                state.articleClock.startTime = new Date();
                state.articleClock.pauseDuration = 0;
                state.articleClock.pauseTime = null;
                state.articleClock.time = '00:00';
            }

            state.articleClock.articleId = articleId;
        }, 
        updateClock: function(state){
            if(!state.isPlaying) return;
            let delta = new Date(new Date() - state.articleClock.startTime - state.articleClock.pauseDuration);
            state.articleClock.time = `${zeroPrefix(delta.getUTCMinutes())}:${zeroPrefix(delta.getUTCSeconds())}`;
        },
        pauseClock: function(state){
            state.articleClock.pauseTime = new Date();
        }
    },
    actions: {
        toggleSpeak: ({ dispatch, state }, article) => {
            dispatch(isArticlePlaying(state, article) ? 'pause' : 'speak', article);
        },
        isArticlePlaying: ({state}, article) => {
            return isArticlePlaying(state, article);
        },
        stop: ({ commit }) => {
            stopAllProviders();
            commit('setCurrentArticleId', -1);
            commit('updatePlayingState');
        },
        pause: ({commit}) =>{
            pauseAllProviders();
            clearInterval(clockInterval);
            commit('pauseClock');
            commit('updatePlayingState');
        },
        speak: ({ commit, state, dispatch }, article) => {
            commit('setProvider', article);
            try {
                commit('initClock', article.id);
                state.currentProvider.speak(article);
                logTextToSpeech(article);
                clockInterval = !state.currentProvider.isExternal ? setInterval(() => commit('updateClock'), 500) : null;
                
            } catch (ex) {
                dispatch('stop');
                commit('error/setDisplayMessage', "Error: Cannot play current article.", { root: true });
                commit('error/showError', true, { root: true });
                console.error("ERROR", ex);
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
        if(typeof(provider.stop) === 'function'){
            provider.stop();
        }
    }
}

function pauseAllProviders() {
    for (const provider of allProviders) {
        if(typeof(provider.pause) === 'function'){
            provider.pause();
        }
    }
}

function isArticlePlaying(state, article) {
    return state.isPlaying && state.currentArticleId == article.id;
}

function zeroPrefix(num) {
    if(num.toString().length <= 1){
        return `0${num}`;
    }
    return num;
}