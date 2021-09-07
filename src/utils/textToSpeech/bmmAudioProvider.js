const isExternal = true;

export default { speak, stop, isPlaying, isExternal};

function speak(article) {
    window.open(article.audioBookUrl, 'blank');
}

function stop() {
    
}

function pause(){
    
}

function isPlaying() {
    return false;
}
