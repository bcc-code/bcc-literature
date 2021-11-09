<template>
    <section>
        <a alt="Font Smaller" class="font-smaller button-circular white" :class="{ 'dark': nightMode }" @click="changeFontSize(-0.1)"></a>
        <a alt="Font Bigger" class="font-bigger button-circular white" :class="{ 'dark': nightMode }" @click="changeFontSize(0.1)"></a>
        <section class="sidebar">
            <div class="section-header">
                <h5>{{$t('book-index.chapters')}} <span>{{chaptersLength}}</span></h5>
            </div>
            <section class="list">
                <ol class="chapters">
                    <li v-for="chapter in chapters.sort((a, b) => parseInt(a.id) - parseInt(b.id))" 
                        :key="chapter.id"
                        :class="['chapter', { 'current-chapter': chapter.id == selectedChapter }]" 
                        @click="$emit('chapterChanged', chapter.id)">
                        <a v-bind:alt="chapter.title"><h5>{{chapter.title}}</h5></a>
                    </li>
                </ol>
            </section>
        </section>
        <section class="overlay" />
    </section>
</template>

<script>
import BookMixins from '@/mixins/book'
import { mapMutations, mapState } from 'vuex'
export default {
    mixins: [BookMixins],
    computed: {
        ...mapState('session', ['nightMode']),
        chaptersLength(){
            if (this.chapters == null)
                return 0;
            return this.chapters.length;
        },
        selectedChapter(){
            return this.$route.params.chapterId
        }
    },
    methods: {
        ...mapMutations('session', ['changeFontSize'])
    }
}
</script>
<style scoped>
/* Temporary style */
.chapters .chapter a {
    cursor: pointer;
}
</style>