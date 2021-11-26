<template>
    <a class="button-main small article-tts-btn play-pause-icon" 
        v-bind:class="[isArticlePlaying ? 'pause-icon' : 'play-icon', {'bmm-icon' : audioBookUrl}]"
        v-on:click="toggleSpeak({...article, audioBookUrl, bookTitle})">{{ speechBtnText }}</a>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
    props: ['article', 'audioBookUrl', 'bookTitle'],

    computed: { 
        ...mapState('textToSpeech', {
            speechArticleId: 'currentArticleId',
            isPlaying: 'isPlaying'
        }),
        speechBtnText: function() {
            return this.audioBookUrl
                ? this.$t('audiobooks.listen-on-bmm')
                : this.isArticlePlaying 
                    ? this.$t('audiobooks.pause-text-to-speech')
                    : this.$t('audiobooks.play-text-to-speech');
        },
        isArticlePlaying: function() {
            return this.isPlaying && this.speechArticleId === this.article.id;
        }
    },
    methods: {
        ...mapActions('textToSpeech', {
            toggleSpeak: 'toggleSpeak',
        }),
    },
};
</script>