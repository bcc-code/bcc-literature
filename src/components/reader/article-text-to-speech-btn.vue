<template>
    <a class="button-main small play-pause-icon" v-bind:class="[isArticlePlaying ? 'pause-icon' : 'play-icon']" v-on:click="toggleSpeak({...article, bmmAlbumId, audioBookUrl})">{{ speechBtnText }}</a>   
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
            return this.isArticlePlaying ? this.$t('reader.pause-text-to-speech') : this.$t('reader.play-text-to-speech');
        },
        isArticlePlaying: function(){
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
<style scoped>

.play-pause-icon {
    cursor: pointer;
    padding-left: 40px !important;
    z-index: 50;
    float: right;
    margin-top: 0;
    margin-left: 0;

}
.play-icon {    
    background: url(/img/icon_24_play.svg) 20% 70% no-repeat, linear-gradient(to right, #666CF6 0%, #5EAFE2 100%);
}

.pause-icon{
    background: url(/img/icon_24_pause.svg) 20% 90% no-repeat, linear-gradient(to right, #666CF6 0%, #5EAFE2 100%);
}

@media only screen and (max-width: 648px) {
    .play-pause-icon{
        float: inherit;
        margin-top: 0;
    }
}
</style>