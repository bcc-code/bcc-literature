<template>
    <section class="center song-treasures-notice">
        <a href="https://songtreasures.org" class="song-treasures-logo" target="_blank"><img src="/img/song-treasures-logo-dark.svg" alt="SongTreasures"></a>
        <p v-html="$t('app.song-treasures-notice')"></p>
    </section>
</template>

<style scoped>
.song-treasures-notice {
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
    border: 2px solid #e6e9f2;
    display: flex;
}
.song-treasures-logo {
    display: flex;
    flex: 0 0 160px;
    padding-right: 20px;
    border-right: 1px solid #e6e9f2;
    margin-right: 20px;
}
.song-treasures-logo img {
    max-width: 100%;
}

@media only screen and (max-width: 648px) {
    .song-treasures-notice {
        flex-direction: column;
    }
    .song-treasures-logo {
        flex: 0 0 auto;
        width: 140px;
        border: none;
        padding: 0;
        margin: 0 0 15px;
    }
}
</style>