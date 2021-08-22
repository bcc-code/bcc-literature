<template>
  <div>  
    <app-header :backButtonRoute="{name: 'books'}" :pageName="$t('search.search')"/>
    <section class="container search-header">   
        <section class="center small" style="padding: 0 10px">   
            <search-box />    
        </section>
    </section>

    <section class="container content">  
        <section class="center medium">
            <aside class="temp" id="filters" :style="{ top: isMobile ? isStandalone  ? '48px': '95px' : 'unset' }">
                <h3 v-if="!isMobile">{{$t('search.filter')}}</h3>
                <section class="filter" :class="showFilters ? 'open' : 'closed'" v-click-outside="() => showFilters = false">
                    <div class="header" @click="showFilters = !showFilters">
                        <h3 v-if="isMobile">{{$t('search.filter')}}</h3>
                        <a v-if="showFilters" class="minimize-button" @click="() => showFilters = false"></a>
                    </div>
                    <form v-if="!isMobile || showFilters">
                        <search-facet facetName="BookName"
                            :facetTitle="$t('search.books-filter')"
                            :facetPlaceholder="$t('search.books-filter-default')"
                            facetKey="title"/>
                        <search-facet facetName="AuthorFullName"
                            :facetTitle="$t('search.authors-filter')"
                            :facetPlaceholder="$t('search.authors-filter-default')"
                            facetKey="fullName"/>
                        <section>
                            <year-filter />
                        </section>
                        <section class="exact-match">
                            <input v-model="exactMatch" type="checkbox" name="search-exact-text">
                            <h5 @click="exactMatch = !exactMatch">{{$t('search.exact-match')}}</h5>
                        </section>
                    </form>
                </section>
            </aside>
            <section class="list">
                <loading-spinner v-if="showSpinner"/>
                <template v-else>
                    <h3>{{noOfResults == 0 ? $t('search.no-results') : noOfResults + " " + $t('search.search-results')}}</h3>
                    <search-result-author v-for="result in authorResults" :key="result.Id" :result="result" />
                    <search-result-book v-for="result in bookResults" :key="result.Id" :result="result" />
                    <search-result v-for="(result, index) in results" :key="result.articleId" :result="result" :rank="index+1" />        
                    <a v-if="noOfResults > results.length && !showSpinner" v-on:click="loadMore" class="pagination-button"><h5>{{$t('search.load-more')}}</h5></a>
                </template>
            </section>              
        </section>
    </section>    
  </div>
</template>

<script>
import SearchBox from 'components/search/search-box';
import AppHeader from 'components/layout/app-header';
import LoadingSpinner from 'components/loading-spinner';
import SearchResult from 'components/search/search-result.vue';
import SearchResultBook from 'components/search/search-result-book.vue';
import SearchResultAuthor from 'components/search/search-result-author.vue';
import SearchFacet from 'components/search/search-facet'
import YearFilter from 'components/search/year-filter'
import { mapActions, mapState, mapGetters } from 'vuex';
import { EventBus, Events } from '@/utils/eventBus';

export default {    
    components: {
        SearchBox,
        SearchResult,
        SearchResultBook,
        SearchResultAuthor,
        SearchFacet,
        AppHeader,
        LoadingSpinner,
        YearFilter
    },
    data: function() {
        return {
            exactMatch: false,
            initialized: false,
            width: null,
            showFilters: false
        }
    },
    methods: {      
        ...mapActions('search', {
            newSearch: 'newSearch',
            loadMore: 'loadMore',
            newExactMatch: 'newExactMatch'
        }),
        newSearchWithQuery() {
            this.newSearch({ query: this.computedQuery, newFacets: true });
        },
        handleResize() {
            this.width = window.innerWidth;
        },
        handleScroll() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            let filterElement = document.querySelector('#filters');

            if (filterElement != null) {
                let filterElementRect = filterElement.getBoundingClientRect();
                if (scrollTop > (filterElementRect.top + this.isStandalone ? 128 : 30)) {
                    filterElement.classList.add("pinned");
                } else {
                    filterElement.classList.remove("pinned"); 
                }
            }
        }
    },
    created: function() {     
        this.initialized = false;
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('scroll', this.handleScroll);
        this.handleResize();  
        this.exactMatch = this.$store.state.search.searchParams.exactMatch;
        setTimeout(() => this.initialized = true, 200)
        
        if (this.computedQuery != this.searchParams.query)
            this.newSearchWithQuery();

        EventBus.$on(Events.CONTENT_LANGUAGE_CHANGED, () => this.newSearchWithQuery());
    },
    destroyed: function() {
        EventBus.$off(Events.CONTENT_LANGUAGE_CHANGED, () => this.newSearchWithQuery());
        window.removeEventListener('resize', this.handleResize);
    },
    watch: {
        computedQuery: function() {
            this.newSearchWithQuery();                   
        },
        exactMatch: function(val) {
            if (this.initialized)
                this.newExactMatch(val)
        }
    },
    computed: {
        isMobile() {
            return this.width <= 768;
        },
        isStandalone() {
            return window.matchMedia('(display-mode: standalone)').matches
        },
        computedQuery: function() {
            return this.$route.params.query;                        
        },     
        ...mapState('search', {
            searchId: 'id',
            searchParams: 'searchParams',
            results: 'results',
            bookResults: 'bookResults',
            authorResults: 'authorResults',
            showSpinner: 'showSpinner'
        }),
        ...mapGetters('search', {
            noOfResults: 'getNumberOfResults',
        }),
    }
};
</script>
<style>
section.filter {
    display: inline-block;
    padding: 12px;
    margin: 0px 0px 24px 0px;
    width: 100%;
    border-radius: 8px;
    -webkit-box-shadow: inset 0px 0px 0px 2px var(--main-10);
    box-shadow: inset 0px 0px 0px 2px var(--main-10);
    -webkit-transition: all 0.1s;
    transition: all 0.1s;
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
    background: var(--white);
}

.filter .header {
    padding: 0px 4px;
}
.filter.open .header {
    padding-bottom: 12px;
}

.filter input[type="text"] {
    margin-bottom: 10px;
}

.filter .custom-select,
.filter .search-selection {
    font-family: 'Ubuntu', sans-serif;
    font-size: 1.8em;
    line-height: 1.4em;
    color: var(--base1);
}
.filter .custom-select ul,
.filter .search-selection ul {
    padding-left: 0;
    margin-top: 0;
}
.filter .custom-select li,
.filter .search-selection li {
    padding-left: 5px;
}
.filter .custom-select li:hover,
.filter .search-selection li:hover {
    color: #6291EB;
    cursor: pointer;
}
.filter .custom-select li,
.filter .search-selection li {
    display: flex;
    margin-bottom: 5px;
}
.filter .custom-select li,
.filter .search-selection li {
    list-style: none;
}
.filter .custom-select li::marker,
.filter .search-selection li::marker {
    display: none;
}

.exact-match {
    display: flex;
}
.exact-match input[type='checkbox'] {
    margin-right: 5px;
    cursor: pointer;
}
.exact-match h5 {
    cursor: pointer;
}

@media screen and (min-width: 768px) {
    #filters {
        width: 300px;
    }

    body[view="advanced-search"] .content .center aside.temp {
        float: right;
        margin-left: 20px;
    }
    
    #filters + .list h3, #filters > h3 {
        margin-bottom: 20px;
    }
}

@media screen and (max-width: 768px) {
    body[view="advanced-search"] .content .center aside section.filter div.header {
        color: var(--base1);
    }
    body[view="advanced-search"] .content .center aside section.filter div.header h3 {
        margin-bottom: 0px;
        color: var(--base1);
    }
    body[view="advanced-search"] .content .center aside.temp {
        width: 100%;
        top: 95px;
        z-index: 1;
        margin-bottom: 20px;
    }
    body[view="advanced-search"] .content .center aside.temp.pinned {
        position: sticky;
        width: 100vw;
        top: 95px;
        margin-left: -16px;
    }

    body[view="advanced-search"] .content .center aside.temp.pinned section.filter {
        border-radius: 0px 0px 8px 8px;
    }

    body[view="advanced-search"] .content .center.medium section.list {
        width: 100%;
        margin: 0;
    }

    body[view="advanced-search"] .content .center.medium section.list h3 {
        padding: 0 16px 20px;
    }

    .minimize-button {
        cursor: pointer;
        position: absolute;
        height: 16px;
        width: 16px;
        top: 8px;
        right: 8px;
        display: inline-block;
        padding: 0;
        margin: 8px;
        border-radius: 3em;
        background: hsla(0,0%,100%,.2) url(/img/icon_24_close-black.svg) 50% no-repeat;
        -webkit-transition: all .2s;
        transition: all .2s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
    }
}
</style>