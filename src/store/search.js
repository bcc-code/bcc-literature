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
                IndexName: "sssf-content-index",
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
        updateSearchFields: (state, fields) => {
            state.searchParams.query = fields.query;
            state.searchParams.facets.AuthorFullName = fields.filters.facets.AuthorFullName;
            state.searchParams.facets.BookName = fields.filters.facets.BookName;
            state.searchParams.facets.Years = fields.filters.facets.Years;
            state.searchParams.exactMatch = fields.filters.exactMatch;
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
        resetFacets: (state, facetName) => {
            if (facetName) {
                state.searchParams.facets[facetName] = [];
                state.hideOptions[facetName] = true;
            }
            else {
                state.searchParams.facets.AuthorFullName = [];
                state.searchParams.facets.BookName = [];
                state.hideOptions.AuthorFullName = true;
                state.hideOptions.BookName = true;
            }
        },
        updateLoadMore: (state) => {            
            state.searchParams.skip += state.BATCHSIZE;                              
        },
    },
    actions: {
        addSearchResults: ({commit}, query) => {
            commit('addSearchResults', query);
        },
        newSearch: async function({commit, dispatch}, search) {
            if (search.fields) commit('updateSearchFields', search.fields);
            commit('resetPaging');
            commit('resetResults');
            if (search.newFacets) commit('resetFacets', search.facetName);
            dispatch("search", search.newFacets)            
        },
        search: async function({ commit, state, getters }, newFacets = true) {
            commit("toggleLoader");

            var query = state.searchParams.query;

            if (getters.getSelectedFacetsLength == 0) {
                await bookApi.search(query).then((res)=>{
                    commit("updateBookResults", res.data);
                }).catch(() => commit("updateBookResults", []));
                await authorApi.search(query).then((res)=>{
                    commit("updateAuthorResults", res.data);
                }).catch(() => commit("updateAuthorResults", []));
            } 

            var authorFullNameFacet = state.searchParams.facets.AuthorFullName;
            var bookNameFacet = state.searchParams.facets.BookName;
            var size = state.searchParams.size;
            var skip = state.searchParams.skip;
            var years = state.searchParams.facets.Years;
            var exactMatch = state.searchParams.exactMatch;

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

            updateUrl(newElement.facetName, encodeURI(selections.join(',')));
            dispatch('newSearch', { newFacets: !selections.length, facetName: newElement.facetName });
        },
        newYearsFilter: function({ dispatch, state }, newYears) {
            state.searchParams.facets.Years = newYears;
            updateUrl("years", encodeURI(newYears.join('-')));
            dispatch('newSearch', { newFacets: false });
        },
        newExactMatch: function({ dispatch, state }, exactMatch) {
            state.searchParams.exactMatch = exactMatch;
            updateUrl("exactMatch", exactMatch);
            dispatch('newSearch', { newFacets: false });
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
            return state.searchParams.facets.BookName.length + state.searchParams.facets.AuthorFullName.length;
        }
    }
}

function updateUrl(key, value) {
    var queryParams = new URLSearchParams(window.location.search);
    value = removeDefaultsFromUrl(key, value.toString());
    
    if (value)
        queryParams.set(camelize(key), value);
    else
        queryParams.delete(camelize(key));

    history.pushState(null, null, "?"+queryParams.toString());
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

function removeDefaultsFromUrl(key, value) {
    if (key == 'exactMatch')
        value = value.replace('false', '');

    if (key == 'years')
        value = value.replace('1900-' + new Date().getFullYear(), '');

    return value;
}