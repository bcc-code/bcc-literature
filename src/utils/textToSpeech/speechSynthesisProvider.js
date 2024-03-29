import { getLanguageTag } from '../languageTags';
import store from '../../store/index';
import { logCustomEvent } from 'utils/appInsights';

const isExternal = false;
const speech = window.speechSynthesis;

export default { speak, stop, pause, isPlaying, isExternal };

/**
 * Force loading of synthesis langs
 */
if (speech.onvoiceschanged !== undefined) {
    speech.onvoiceschanged = speech.getVoices;
}

function speak(article) {
    if ( speech.articleId == article.id ) {
        speech.resume();
        speech.isPaused = false;
        return;
    }
    stop();

    let utterance = new SpeechSynthesisUtterance();
    utterance.text = article.content.replaceAll(/<[^>]*>?/gm, ' ');
    utterance.voice = getLanguageVoice(article.language);
    utterance.onerror = onError;
    utterance.onend = () => {
        store.commit("textToSpeech/updatePlayingState", { root: true });
    };

    utterance.onboundary = function(event) {
        const textLength = event.currentTarget.text.length,
            currentPos = event.charIndex + event.charLength,
            currentPosPercentage = currentPos / textLength * 100;

        store.commit("textToSpeech/setPlayingPercentage", currentPosPercentage, { root: true });
    };    
    
    speech.articleId = article.id;
    speech.speak(utterance);
    speech.isPaused = false;

    logTextToSpeech(article);
}

function stop() {
    speech.cancel();
}

function pause() {
    speech.pause();
    speech.isPaused = true; // paused prop is not working properly on all browsers, set manually
}

function isPlaying() {
    return speech.speaking && !speech.isPaused;
}

function onError() {
    console.error('Error: ', arguments);
}

function getLanguageVoice(id) {
    if ( !('speechSynthesis' in window) ) { 
        return null;
    }
    const langNo = 1, langDk = 8, langEn = 2, langTagEnGb = 'en-GB';
    let voices = window.speechSynthesis.getVoices(),
        langTag = getLanguageTag(id);
    
    let voice, voiceLocal = voices.find(e => e.lang.toLowerCase() == langTag.toLowerCase() && e.localService);
    if ( !voiceLocal && id === langEn ) {
        // Prefer local service => Chrome has problems with long texts and non local services.
        voiceLocal = voices.find(e => e.lang.toLowerCase() == langTagEnGb.toLowerCase() && e.localService);
    }

    voice = voiceLocal ? voiceLocal : voices.find(e => e.lang.toLowerCase() == langTag.toLowerCase());
    
    // Workaround: if 'nb-No' is not found, try 'no-NO'
    if ( !voice && id === langNo ) {
        voice = voices.find(e => e.lang.toLowerCase() == 'no-no');
    }

    return voice;
}

async function logTextToSpeech(article) {
    logCustomEvent("PlayTTS", {
        BookId: article.bookId,
        Language: article.language,
        BookTitle: article.title,
        ChapterId: article.chapterId,
        StartedFromBookOverview: article.startedFromBookOverview || false
    });
}