<template>
    <section class="container">
        <section class="center" :class="{ 'popular-authors' : isAuthor }" v-if="typedList.length > 0">
            <div class="section-header border">
                <h5>{{title}}</h5>
                <!-- We show thhe search box only if it is the first grid in a group of searchable grids -->
                <Search v-if="$parent.searchQuery != undefined && firstChild" 
                :notEmpty="$parent.searchQuery.length > 0" 
                @query-changed="(query) => {$parent.searchQuery = query}" />
            </div>
            <section :class="[isPublication ? 'subscriptions-grid' : 'grid', {'articles' : isArticle}]">
                <ArticleList :list="list" :searchQuery="$parent.searchQuery" v-if="isArticle && isList" />
                <AuthorList :list="list" :searchQuery="$parent.searchQuery" v-else-if="isAuthor && isList" />
                <PublicationCard v-else-if="isPublication" v-for="element in typedList"
                    :key="element.id" 
                    :element="element"/> 
                <Card v-else v-for="element in typedList"
                    :key="element.id"
                    :element="element"
                    :searchQuery="$parent.searchQuery" />
            </section>
        </section>
    </section>
</template>

<script>
import AuthorList from 'components/grid/list/author'
import ArticleList from 'components/grid/list/article'
import Search from 'components/search/search-grid';
import Card from 'components/grid/tiles/card';
import PublicationCard from 'components/grid/tiles/publication-card';
import GridMixin from '@/mixins/grid.js';

export default {
    components: {
        Card,
        PublicationCard,
        Search,
        ArticleList,
        AuthorList
    },
    mixins: [GridMixin],
    props: {
        title: {
            type: String,
            required: true
        },
        list: {
            type: Array,
            required: true
        },
        type: {
            type: Number,
            required: true
        },
        layout: {
            type: Number,
            required: true
        }
    },
    computed: {
        firstChild(){
            return this.$parent.$children.findIndex((el) => { return el == this}) == 0;
        },
        typedList(){
            return this.list.map((el) => {el.type = this.type; return el});
        },
    }
}
</script>