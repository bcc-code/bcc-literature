import { getLanguageTag } from '../languageTags';

export default { speak, stop, isPlaying };

const speech = window.speechSynthesis;
/**
 * Force loading of synthesis langs
 */
if (speech.onvoiceschanged !== undefined)
{
    speech.onvoiceschanged = speech.getVoices;
}

function speak(article) {
    let utterance = new SpeechSynthesisUtterance();
    utterance.text = article.content.replaceAll(/<[^>]*>?/gm, ' ');
    utterance.voice = getLanguageVoice(article.language);
    speech.speak(utterance);
}

function stop() {
    speech.cancel();
}

function isPlaying() {
    return speech.speaking;
}

function getLanguageVoice(id){
    if(!('speechSynthesis' in window)){ 
        return null;
    }
    const langNo = 1, langDk = 8;
    let voices = window.speechSynthesis.getVoices(),
        langTag = getLanguageTag(id);

    //workaround => nb-No is not found try da-DK
    let voice = voices.find(e => e.lang.toLowerCase() == langTag.toLowerCase());
    if(!voice && id === langNo){
        voice = voices.find(e => e.lang.toLowerCase() == getLanguageTag(langDk).toLowerCase());
    }

    return voice;
}


