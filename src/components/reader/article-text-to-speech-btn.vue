<template>
    <a class="button-main small article-tts-btn play-pause-icon" 
    v-bind:class="[isArticlePlaying ? 'pause-icon' : 'play-icon', {'bmm-icon' : isBmmProvider}]"
    v-on:click="toggleSpeak({...article, bmmAlbumId, audioBookUrl})">
        {{ speechBtnText }}
    </a>   
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
    props: ['article', 'bmmAlbumId', 'audioBookUrl'],

    computed: { 
        ...mapState('textToSpeech',{
            speechArticleId: 'currentArticleId',
            isPlaying: 'isPlaying'
        }),
        speechBtnText: function() {
            //return this.isArticlePlaying ? this.$t('reader.pause-text-to-speech') : this.$t('reader.play-text-to-speech');
            return this.$t('reader.play-text-to-speech');
        },
        isArticlePlaying: function(){
            return this.isPlaying && this.speechArticleId === this.article.id;
        },
        isBmmProvider: function(){
            return this.bmmAlbumId != undefined;
        }
    },
    methods: {
        ...mapActions('textToSpeech', {
            toggleSpeak: 'toggleSpeak',
        }),

    },
};
</script>