<template>
    <section class="center song-treasures-notice">
        <a href="https://songtreasures.org" class="song-treasures-logo" target="_blank"><img src="/img/song-treasures-logo-dark.svg" alt="SongTreasures"></a>
        <p class="notice-description" v-html="$t('app.song-treasures-notice')"></p>
    </section>
</template>

<style scoped>
.song-treasures-notice {
    border-radius: 8px;
    margin-top: 20px;
    border: 2px solid var(--base4);
    display: flex;
    margin-right: 11px;
}
.song-treasures-logo {
    display: flex;
    flex: 0 0 180px;
    padding-right: 20px;
    border-right: 1px solid var(--base4);
    align-items: flex-start;
    padding: 30px 20px;
    background: rgba(230, 233, 242, 0.25) url(/img/songbooks.png) no-repeat;
    background-position: left 50% bottom -40px;
    background-size: 96px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
}
body.dark .song-treasures-logo {
    background-color: #1c1c1c;
}
.song-treasures-logo img {
    max-width: 100%;
}
.song-treasures-notice .notice-description {
    padding: 20px;
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
        border-bottom: 2px solid var(--base4);
        padding: 0;
        background-position: right 20px bottom -40px;
        border-bottom-left-radius: 0px;
        border-top-right-radius: 8px;
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