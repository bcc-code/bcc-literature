<template>
    <article class="publication-month">
        <router-link :to="{name: 'read-publication', params: { bookId: book.id, year: publicationMonth.year, month: publicationMonth.month }}">
            <book-card-cover :cover-id="book.coverId"></book-card-cover>
            <h3>{{publicationMonth.monthName | capitalize}}</h3>
            <p class="small">{{chapterText}}</p>
        </router-link>
    </article>
</template>

<script>

import BookCardCover from 'components/grid/tiles/card-cover';

export default {
    components: {        
        BookCardCover,
    },
    props: {
        publicationMonth: {
            type: Object,
            required: true
        },
        book:{
            type: Object,
            required: true
        }
    },
    computed: {
        chapterText(){
            return this.publicationMonth.isPdf ? "PDF" : this.publicationMonth.numberOfArticles + " " + this.$t('book-index.chapters');
        }
    }

};
</script>
