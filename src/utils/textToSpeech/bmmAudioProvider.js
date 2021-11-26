import { logCustomEvent } from 'utils/appInsights';

const isExternal = true;

export default { speak, stop, pause, isPlaying, isExternal};

function speak(article) {
    logTextToSpeech(article);
    window.open(article.audioBookUrl, 'blank');
}

function stop() {}
function pause() {}

function isPlaying() {
    return false;
}

async function logTextToSpeech(article) {
    logCustomEvent("OpenAudioBook", {
        BookId: article.bookId,
        Language: article.language,
        BookTitle: article.bookTitle
    });
}