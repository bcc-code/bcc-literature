<template>
    <div v-if="isPlaying" class="text-to-speech-player-wrapper">
        <a class="button-main play-pause-button button-circular pause-icon" v-on:click="toggleSpeak(article)"> </a>
        <div class="player-info" v-if="article">
            <h4>{{article.title}}</h4>
            <h5>#{{$t('reader.chapter')}} {{article.chapterId}}</h5>
        </div>      
    </div>    
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
    props: ["articles"],
    computed: { 
        ...mapState('textToSpeech',{
            speechArticleId: 'currentArticleId',
            isPlaying: 'isPlaying'
        }), 
        article() {
            return this.articles.find(e => e.id == this.speechArticleId);
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

.play-icon {    
    background: url(/img/icon_24_play_black.svg) 65% 65% no-repeat, linear-gradient(to right, #666CF6 0%, #5EAFE2 100%);
}

.pause-icon{
    background: url(/img/icon_24_pause_black.svg) 65% 65% no-repeat;
    border: 1px solid #666CF6 !important;
}

.text-to-speech-player-wrapper{
    position: fixed;
    top: 160px;
    right: 10px;
}

.player-info{
    display: none;
}

@media only screen and (max-width: 648px) {
    .text-to-speech-player-wrapper{
        width: 100%;
        background-color: white;
        bottom: 0;
        padding-bottom: 7px;
        padding-right: 10px;
        right: unset;
        top: unset;
        left: 0;
        
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .player-info{
        display: flex;
        flex-direction: column;
        padding-top: 10px;
        padding-left: 10px;
        flex: 2;
    }

    .pause-icon{
        flex: 1;
        align-self: flex-end;
        max-width: 44px;
        max-height: 44px;
    }
}
</style>