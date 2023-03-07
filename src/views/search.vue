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
                <div class="header" v-if="!isMobile">
                    <h3>{{$t('search.filters.title')}}</h3>
                    <p class="remove-filters" v-if="anyActiveFilter" @click.prevent="removeAllFilters()"><a href="#">{{ $t('search.filters.clear') }}</a></p>
                </div>
                <section class="filter" :class="showFilters ? 'open' : 'closed'" v-click-outside="() => showFilters = false">
                    <div v-if="isMobile" class="header" @click="showFilters = !showFilters">
                        <h3>{{$t('search.filters.title')}}</h3>
                        <p class="remove-filters" v-if="anyActiveFilter" @click.prevent="removeAllFilters()"><a href="#">{{ $t('search.filters.clear') }}</a></p>
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
                        <year-filter ref="yearFilter"/>
                        <section class="exact-match">
                            <p>{{$t('search.exact-match')}}</p>
                            <input v-model="exactMatch" @click="updateExactMatch" type="checkbox" name="search-exact-text">
                        </section>
                    </div>
                </section>
            </aside>
            <section class="search-results list">
                <h3 v-if="!showSpinner">{{this.noOfResults == 0 ? $t('search.no-results') : this.noOfResults + " " + $t('search.search-results')}}</h3>
                <search-result-author v-for="result in authorResults" :key="result.Id" :result="result" />
                <search-result-book v-for="result in bookResults" :key="result.Id" :result="result" />
                <search-result v-for="(result, index) in results" :key="result.articleId" :result="result" :rank="index+1" />        
                <loading-spinner v-if="showSpinner" />
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
            this.exactMatch = this.computedQueryFields.filters.exactMatch;
            this.newSearch({ fields: this.computedQueryFields, newFacets: true });
        },
        updateExactMatch() {
            this.newExactMatch(!this.exactMatch);
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

            this.loadMoreSearchResults();
        },
        loadMoreSearchResults() {
            const {
                scrollTop,
                scrollHeight,
                clientHeight
            } = document.documentElement;
            
            if (scrollTop >= scrollHeight - clientHeight &&
                this.noOfResults > this.results.length && !this.showSpinner) {
                this.loadMore();
            }
        },
        removeAllFilters() {
            this.$store.state.search.searchParams.facets.AuthorFullName = [];
            this.$store.state.search.searchParams.facets.BookName = [];
            this.$store.state.search.searchParams.facets.Years = [];
            this.$refs.yearFilter.clear();

            this.newSearch({ fields: { query: this.$route.params.query, filters: { facets: { Years: [] } } }, newFacets: true });
            history.pushState(null, null, '?');
        }
    },
    created: function() {
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('scroll', this.handleScroll);
        this.handleResize();
        this.exactMatch = this.computedQueryFields.filters.exactMatch;

        if (this.computedQueryFields.query != this.searchParams.query)
            this.newSearchWithQuery();

        EventBus.$on(Events.CONTENT_LANGUAGE_CHANGED, () => this.newSearchWithQuery());
    },
    destroyed: function() {
        EventBus.$off(Events.CONTENT_LANGUAGE_CHANGED, () => this.newSearchWithQuery());
        window.removeEventListener('resize', this.handleResize);
    },
    watch: {
        computedQueryFields: function() {
            this.newSearchWithQuery();
        }
    },
    computed: {
        ...mapGetters('session', ['isStandalone']),
        isMobile() {
            return this.width <= 768;
        },
        anyActiveFilter() {
            var searchParams = this.$store.state.search.searchParams;
            var years = searchParams.facets.Years;
            var defaultYears = !!years.length
                ? ( years[0] == 1900 && years[1] == new Date().getFullYear() )
                : true;

            return !!searchParams.facets.BookName.length
                || !!searchParams.facets.AuthorFullName.length
                || !defaultYears;
        },
        computedQueryFields: function() {
            var query = this.$route.params.query;
            var bookName = this.$route.query.bookName;
            var authorFullName = this.$route.query.authorFullName;
            var years = this.$route.query.years;
            var exactMatch = Boolean(this.$route.query.exactMatch);

            return { 
                query: query,
                filters: {
                    facets: {
                        BookName: bookName ? decodeURI(bookName).split(',') : [],
                        AuthorFullName: authorFullName ? decodeURI(authorFullName).split(',') : [],
                        Years: years ? years.split('-') : [],
                    },
                    exactMatch: exactMatch
                }
            };
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

#filters .header {
    position: relative;
    display: flex;
}
.filter.open .header:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    left: 0;
    bottom: -2px;
    background-color: var(--base4);
}
.filter.open .header {
    padding-bottom: 12px;
}

.remove-filters {
    align-self: center;
    margin-left: auto;
    font-size: 12px;
    font-style: italic;
}
.remove-filters a {
    text-decoration: none;
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
    background-color: var(--white);
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
.filter .custom-select.no-result ul {
    display: none;
}
.filter .custom-select:not(.no-result):before,
.filter .custom-select:not(.no-result):after {
    content: "";
    position: absolute;
    left: 0;
    width: calc(100% - 22px);
    height: 15px;
    z-index: 11;
}
.filter .custom-select:before {
    top: 0;
    background: var(--white-to-transparent);
}
.filter .custom-select:after {
    bottom: 0;
    background: var(--white-to-transparent);
    transform: rotate(180deg);
    border-top-right-radius: 15px;
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

@media screen and (min-width: 769px) {
    #filters {
        width: 300px;
    }

    body[view="advanced-search"] .content .center aside.temp {
        float: right;
        margin-left: 20px;
    }
    
    #filters + .list h3, #filters .header > h3 {
        margin-bottom: 20px;
    }
    #filters .remove-filters {
        align-self: flex-start;
        padding-right: 20px;
        font-size: 14px;
        margin-top: 3px;
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
        width: calc(100% + 32px);
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
        background: url(/img/icon_24_close-black.svg) 50% no-repeat;
        -webkit-transition: all .2s;
        transition: all .2s;
        -webkit-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
    }
    .dark .minimize-button {
        filter: invert(100%);
    }

    #filters .header {
        padding: 16px;
    }

    header ~ .container #filters.pinned {
	    transition: transform 0.2s;
    }
    header.header--hidden ~ .container #filters.pinned {
        transform: translateY(-48px);
    }
}
</style>