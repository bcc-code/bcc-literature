<template>
    <section>
        <app-header :backButtonRoute="$route.params.parent ? $route.params.parent : {name: 'authors'}" :pageName="$t('authors.author-index')"></app-header>
        <loader>
            <section>
                <section class="author-header container" v-if="author != null">
                    <section class="center small">
                        <card-cover v-if="author.coverId != null" :name="author.fullName" :cover-id="author.coverId" :type="'author'"></card-cover>
                        <h2>{{author.fullName}}</h2>
                    </section>
                </section>
                <section class="container">
                    <SearchableGrids>
                        <Grid :list="books" :title="$t('books.books-all')" :layout="GridLayout.TILES" :type="GridType.BOOK" v-if="books.length" />
                        <Grid :list="articles" :title="$t('articles.articles-all')" :layout="GridLayout.LIST" :type="GridType.ARTICLE" v-if="articles.length" />
                    </SearchableGrids>
                    <h5 class="empty-state" v-if="!articles.length && !books.length">{{$t('search.no-results')}}</h5>
                </section>
            </section>
        </loader>
    </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import SearchableGrids from 'components/grid/searchable-grids';
import CardCover from 'components/grid/tiles/card-cover';
import Grid from 'components/grid/grid';
import GridMixins from '@/mixins/grid.js';
import AppHeader from "components/layout/app-header";
import Loader from "components/la-loader";

export default {
    components: {
        SearchableGrids,
        CardCover,
        Grid,
        AppHeader,
        Loader
    },
    mixins: [GridMixins],
    methods: {
        ...mapActions('authors', {
            loadAuthor: 'load'
        }),
        ...mapActions('books', {
            loadAllBooksByAuthorId: 'loadAll'
        }),
        ...mapActions('articles', {
            loadAllArticlesByAuthorId: 'loadAllByAuthorId'
        }),
        async initialize(forceReload) {
            await this.loadAllBooksByAuthorId(this.$route.params.authorId);
            await this.loadAllArticlesByAuthorId({ authorId: this.$route.params.authorId, forceReload: forceReload });
            await this.loadAuthor(this.$route.params.authorId);
        }
    },
    computed : {
        author() {
            return this.$store.getters['authors/base/getById'](this.$route.params.authorId);
        },
        books() {
            return this.$store.getters['books/getAllByAuthorId'](this.$route.params.authorId);
        },
        ...mapState('articles', {
            articles: state => state.base.all
        })
    },
}
</script>