<template>
    <div v-if="showPlayer" class="text-to-speech-player-outer">
        <div class="text-to-speech-player-inner">
            <div class="progress-bar">
                    <div :style="{width: playingPercentage + '%'} " class="progress-bar-progress" />
                </div>
            <div class="player-info">
                <h4 class="chapter-id">#{{article.chapterId}}</h4>
                <h3 class="article-title">{{article.title}}</h3>
                <h4 class="article-clock">{{articleClock.time}}</h4>
                <a v-bind:class="[isPlaying ? 'pause-icon' : 'play-icon']" class="button-main play-pause-button button-circular" v-on:click="toggleSpeak(article)"> </a>
            </div>      
        </div>
    </div>    
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
    props: ["articles"],
    computed: { 
        ...mapState('textToSpeech', {
            speechArticleId: 'currentArticleId',
            isPlaying: 'isPlaying',
            playingPercentage: 'playingPercentage',
            articleClock: 'articleClock',
            currentProvider: 'currentProvider'
        }), 
        article() {
            return this.articles.find(e => e.id == this.speechArticleId);
        },
        showPlayer() {
            return this.article && !this.currentProvider.isExternal;
        }
    },
    methods: {
        ...mapActions('textToSpeech', {
            toggleSpeak: 'toggleSpeak',
            stop: 'stop',
        }),
    },
    deactivated() {
        this.stop();
    },
    destroyed() {
        this.stop();
    }
};
</script>
