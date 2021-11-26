import articleApi from 'utils/api/articleApi.js';
import bookApi from 'utils/api/bookApi.js';
import authorApi from 'utils/api/authorApi.js';
import { logCustomEvent } from 'utils/appInsights';

export default {
    namespaced: true,
    state: {
        BATCHSIZE: 50,
        searchParams: {
            query: '',
            facets: {
                AuthorFullName: [],
                BookName: [],
                Years: []
            },
            exactMatch: false,
            skip: 0,
            size: 50
        },
        id: '',
        noOfResults: 0,         
        results: [],
        bookResults: [],
        authorResults: [],
        facetsOptions: {
            "AuthorFullName": [],
            "BookName": []
        },
        showSpinner: false,
        hideOptions: {
            "AuthorFullName": true,
            "BookName": true
        }
    },
    mutations: {
        updateSearchResults: (state, value) => {
            state.results = state.results.concat(value.results);
            state.noOfResults = value.totalCount;

            logCustomEvent("Search", {
                SearchServiceName: "searchopenportal",
                IndexName: "ssf-content-index",
                QueryTerms: state.searchParams.query,
                ResultCount: state.noOfResults,
                ScoringProfile: "DefaultProfile"
            });
        },
        updateBookResults: (state, value) => {
            state.bookResults = value;
        },
        updateAuthorResults: (state, value) => {
            state.authorResults = value;
        },
        updateFacetsOptions: (state, value) => {
            state.facetsOptions.AuthorFullName = value.AuthorFullName;
            state.facetsOptions.BookName = value.BookName;
        },
        updateSearchQuery: (state, value) => {
            state.searchParams.query = value;
        },
        toggleLoader: (state) => {
            state.showSpinner = !state.showSpinner;
        },
        resetPaging: (state) => {
            state.searchParams.skip = 0;
        },
        resetResults: (state) => {
            state.bookResults = [];
            state.results = [];
            state.noOfResults = 0;      
        },
        resetFacets: (state) => {
            state.searchParams.facets.AuthorFullName = [];
            state.searchParams.facets.BookName = [];
            state.hideOptions.AuthorFullName = true;
            state.hideOptions.BookName = true;
        },
        updateLoadMore: (state) => {            
            state.searchParams.skip += state.BATCHSIZE;                              
        },
    },
    actions: {
        addSearchResults: ({commit}, query) => {
            commit('addSearchResults', query);
        },
        newSearch: async function({commit, dispatch}, query) {
            commit('updateSearchQuery', query.query);
            commit('resetPaging');
            commit('resetResults');
            if (query.newFacets) commit('resetFacets');
            dispatch("search", query.newFacets)            
        },
        search: async function({ commit, state, getters }, newFacets = true) {           
            var query = state.searchParams.query;
            var authorFullNameFacet = state.searchParams.facets.AuthorFullName;
            var bookNameFacet = state.searchParams.facets.BookName;
            var size = state.searchParams.size;
            var skip = state.searchParams.skip;
            var years = state.searchParams.facets.Years;
            var exactMatch = state.searchParams.exactMatch;

            commit("toggleLoader");

            if (getters.getSelectedFacetsLength == 0) {
                await bookApi.search(query).then((res)=>{
                    commit("updateBookResults", res.data);
                }).catch(() => commit("updateBookResults", []));
                await authorApi.search(query).then((res)=>{
                    commit("updateAuthorResults", res.data);
                }).catch(() => commit("updateAuthorResults", []));
            } 
            await articleApi.search(query, size, skip, authorFullNameFacet, bookNameFacet, years, exactMatch).then((res) => {
                if (res.data.results == null)
                    return commit("toggleLoader");

                commit("updateSearchResults", res.data || []);

                if (newFacets)
                    commit("updateFacetsOptions", res.data.facets);

                commit("toggleLoader");
            }).catch((err) => {
                console.log(err);
                commit("updateSearchResults", { results: [], totalCount: 0 });
                commit("updateFacetsOptions", {
                    "AuthorFullName": [],     
                    "BookName": []              
                });
                commit("toggleLoader");
            });   
        },
        newFilterSelection: function({dispatch, state}, newElement){
            var selections = state.searchParams.facets[newElement.facetName];
            var indexInSelections = selections.indexOf(newElement.value);

            if (indexInSelections > -1)
                selections.splice(indexInSelections, 1);
            else
                selections.push(newElement.value);       
            
            dispatch('newSearch', { query: state.searchParams.query, newFacets: false });
        },
        newYearsFilter: function({ dispatch, state }, newYears) {
            state.searchParams.facets.Years = newYears;   
            dispatch('newSearch', { query: state.searchParams.query, newFacets: false });
        },
        newExactMatch: function({ dispatch, state }, exactMatch) {
            state.searchParams.exactMatch = exactMatch;   
            dispatch('newSearch', { query: state.searchParams.query, newFacets: false });
        },
        loadMore: function({ commit, dispatch }) {
            commit("updateLoadMore");
            dispatch('search', false);
        }
    },
    getters: {
        getNumberOfResults: (state) => {
            return state.bookResults.length + state.authorResults.length + state.noOfResults;
        },
        getSelectedFacetsLength: (state) => {
            return state.searchParams.facets["BookName"].length + state.searchParams.facets["AuthorFullName"].length;
        }
    }
}