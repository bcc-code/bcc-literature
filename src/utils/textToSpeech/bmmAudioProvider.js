import bmmApi from "../api/bmmApi";
export default { speak, stop, isPlaying, getAudioBook };

let hasBeenRedirected = false;
async function getAudioBook(id) {
    return await bmmApi.getAudioBookTracks(id);
}

async function speak(article) {
    // let tracks = await getAudioBook(article.bmmAlbumId),
    //     track = tracks.find(e => e.chapterId == article.chapterId);

    // if(!track){
    //     return;
    // }

    hasBeenRedirected = true;
    debugger;
    window.open(article.audioBookUrl, 'blank');
}

function stop() {
    hasBeenRedirected = false;
}

function isPlaying() {
    return hasBeenRedirected;
}
