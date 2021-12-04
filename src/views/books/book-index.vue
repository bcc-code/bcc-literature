<template>
  <section>
    <app-header :backButtonRoute="$route.params.parent ? $route.params.parent : {name: 'books'}"
                :pageName="$t('book-index.book-index')"/>
    <loader>
      <not-found v-if="notFound"/>
      <book-overview-publication v-else-if="isPublication"/>
      <book-overview-chapters v-else/>
    </loader>
  </section>
</template>

<script>
import AppHeader from 'components/layout/app-header';
import {mapActions} from 'vuex';
import BookOverviewPublication from 'components/books/overviews/book-overview-publication';
import BookOverviewChapters from 'components/books/overviews/book-overview-chapters';
import NotFound from 'components/not-found';
import Loader from 'components/la-loader';
import BookMixins from '@/mixins/book';
import BookMetaHeaderMixins from '@/mixins/book-meta-header';

export default {
    components: {
        BookOverviewChapters,
        BookOverviewPublication,
        NotFound,
        AppHeader,
        Loader
    },
    data() {
        return {
            notFound: false,
        }
    },
    mixins: [BookMixins, BookMetaHeaderMixins],
    methods: {
        async initialize() {
            this.notFound = false;
            await this.loadBook(this.$route.params.bookId).then((book) => {
                if (book.redirectToCorrectLanguage) 
                    this.$router.push({name: 'book-index', params: {bookId: book.id}})
            }).catch((error) => {
                this.notFound = true;
            });
        },
        ...mapActions('books', {
            loadBook: 'load',
            loadChapters: 'loadChapters'
        })
    },
};
</script>
