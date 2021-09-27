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
                <h3 v-if="!isMobile">{{$t('search.filters.title')}}</h3>
                <section class="filter" :class="showFilters ? 'open' : 'closed'" v-click-outside="() => showFilters = false">
                    <div v-if="isMobile" class="header" @click="showFilters = !showFilters">
                        <h3>{{$t('search.filters.title')}}</h3>
                        <a v-if="showFilters" class="minimize-button" @click="removeAllFilters()"></a>
                    </div>
                    <div class="filters-wrapper" v-if="!isMobile || showFilters">
                        <search-facet facetName="BookName"
                            :facetTitle="$t('search.filters.books-title')"
                            :facetPlaceholder="$t('search.filters.search-for-book')"
                        />
                        <search-facet facetName="AuthorFullName"
                            :facetTitle="$t('search.filters.authors-title')"
                            :facetPlaceholder="$t('search.filters.search-for-author')"
                        />
                        <year-filter />
                        <section class="exact-match">
                            <p>{{$t('search.exact-match')}}</p>
                            <input v-model="exactMatch" type="checkbox" name="search-exact-text">
                        </section>
                    </div>
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
        },
        removeAllFilters() {
            this.$store.state.search.searchParams.facets['AuthorFullName'] = [];
            this.$store.state.search.searchParams.facets['BookName'] = [];
            this.$store.state.search.searchParams.facets['Years'] = [];

            this.newSearch({ query: this.computedQuery, newFacets: false });
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

section.filter .filters-wrapper > section {
    padding: 15px;
    position: relative;
}
section.filter .filters-wrapper > section:not(:last-child):after {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    left: 0;
    bottom: 0;
    background-color: var(--base4);
}
section.filter .filters-wrapper > section h4 {
    margin-bottom: 10px;
}
section.filter .filters-wrapper > section form {
    position: relative;
}

.filter .header {
    padding: 16px;
    position: relative;
}
.filter.open .header:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    left: 0;
    bottom: 0;
    background-color: var(--base4);
}

.filter.open .header {
    padding-bottom: 12px;
}

.filter input[type="text"] {
    margin: 0;
}

.filter .custom-select,
.filter .search-selection {
    font-family: 'Ubuntu', sans-serif;
    font-size: 1.8em;
    line-height: 1.4em;
    color: var(--base1);
    margin-top: 15px;
}
.filter .custom-select {
    width: 100%;
    position: absolute;
    background-color: #fff;
    border: 2px solid var(--base4);
    z-index: 10;
    left: 0;
    margin: 0;
    padding: 0 5px;
    top: 38px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
}
.filter .custom-select ul {
    position: relative;
    max-height: 320px;
    overflow: auto;
    padding: 8px 0;
}
.filter .custom-select:before,
.filter .custom-select:after {
    content: "";
    position: absolute;
    left: 0;
    width: calc(100% - 15px);
    height: 15px;
    z-index: 11;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
}
.filter .custom-select:before {
    top: 0;
    background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
}
.filter .custom-select:after {
    bottom: 0;
    background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
}
.filter .custom-select ul,
.filter .search-selection ul {
    padding-left: 0;
    margin: 0;
}
.filter .custom-select li,
.filter .search-selection li {
    padding-left: 5px;
}
.filter .custom-select li:hover {
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

.filter .search-selection li {
    flex-direction: row-reverse;
}
.filter .search-selection li img {
    margin-left: auto;
    filter: invert(57%) sepia(17%) saturate(462%) hue-rotate(188deg) brightness(94%) contrast(90%);
    cursor: pointer;
}
.filter .search-selection li img:hover + span {
    text-decoration: line-through;
}

.exact-match {
    display: flex;
}
.exact-match p {
    line-height: normal;
    color: var(--base1);
    align-self: center;
}
.exact-match input[type='checkbox'] {
    cursor: pointer;
    margin-left: auto;
    width: 18px;
    height: 18px;
    -moz-appearance: none;
    -webkit-appearance: none;
    -o-appearance: none;
    border: 2px solid #E6E9F2;
    border-radius: 4px;
}
.exact-match input[type='checkbox']:checked {
    background: url(../assets/icons/icon_checkmark_blue.svg);
    background-repeat: no-repeat;
    background-size: 18px;
    background-position: center;
    border-color: #6291EB;
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