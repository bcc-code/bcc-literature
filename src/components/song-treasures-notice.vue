<template>
    <section class="center song-treasures-notice">
        <i class="notice-icon"></i>
        <p v-html="$t('app.song-treasures-notice')"></p>
    </section>
</template>

<style scoped>
.song-treasures-notice {
    padding: 16px;
    background: #E6E9F2;
    border-radius: 8px;
    margin-top: 20px;
    display: flex;
}
.notice-icon:before {
    content: "!";
}
.notice-icon {
    width: 40px;
    height: 40px;
    line-height: 40px;
    flex: 0 0 40px;
    font-style: normal;
    font-size: 24px;
    color: #fff;
    background: linear-gradient(to right, #666CF6 0%, #5EAFE2 100%);
    border-radius: 50px;
    text-align: center;
    margin-right: 15px;
    font-weight: bold;
}
.song-treasures-notice p {
    white-space: pre-wrap;
}
</style>