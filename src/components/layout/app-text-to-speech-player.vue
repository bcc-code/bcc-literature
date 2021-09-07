<template>
    <div v-if="article" class="text-to-speech-player-wrapper">
        <div class="progress-bar">
                <div :style="{width: playingPercentage + '%'} " class="progress-bar-progress" />
            </div>
        <div class="player-info">
            <h4 class="chapter-id">#{{article.chapterId}}</h4>
            <h3>{{article.title}}</h3>
            <h4 class="article-clock">{{articleClock.time}}</h4>
        </div>      
        <a  v-bind:class="[isPlaying ? 'pause-icon' : 'play-icon']" class="button-main play-pause-button button-circular" v-on:click="toggleSpeak(article)"> </a>
    </div>    
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
    props: ["articles"],
    computed: { 
        ...mapState('textToSpeech',{
            speechArticleId: 'currentArticleId',
            isPlaying: 'isPlaying',
            playingPercentage: 'playingPercentage',
            articleClock: 'articleClock'
        }), 
        article() {
            return this.articles.find(e => e.id == this.speechArticleId);
        },
    },
    methods: {
        ...mapActions('textToSpeech', {
            toggleSpeak: 'toggleSpeak',
            stop: 'stop',
        }),

    },
    mounted() {
        console.log('mounted')
    },
    deactivated() {
        console.log('deactivated')
        this.stop();
    }
};
</script>
