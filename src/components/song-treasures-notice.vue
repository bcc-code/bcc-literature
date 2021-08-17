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
    margin-right: 11px;
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

@media only screen and (max-width: 1049px) {
    .song-treasures-notice {
        display: block;
        margin-right: 0;
        padding: 0;
    }
    .song-treasures-logo {
        display: block;
        width: 100%;
        border: none;
        padding: 0;
        background-color: rgba(230, 233, 242, 0.25);
    }
    .song-treasures-logo img {
        max-width: 180px;
        padding: 15px 20px 10px;
    }
    .song-treasures-notice p {
        padding: 10px 20px 20px;
    }
}
</style>