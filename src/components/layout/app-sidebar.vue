<template>
    <section>
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

export default {
    mixins: [BookMixins],
    computed: {
        chaptersLength(){
            if (this.chapters == null)
                return 0;
            return this.chapters.length;
        },
        selectedChapter(){
            return this.$route.params.chapterId
        },
    }
}
</script>
<style scoped>
/* Temporary style */
.chapters .chapter a {
    cursor: pointer;
}
</style>