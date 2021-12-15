<template>
    <section>
        <h4>{{ facetTitle }}</h4>
        <form v-click-outside="() => disableOptions()">
            <input type="text" autocomplete="off" name="Search" class="search-filter" :class="{'open': !hideOptions}" v-model="searchQuery" :placeholder="facetPlaceholder"
                @click="toggleOptions()">
            <div class="custom-select" :class="{ 'hide': hideOptions, 'no-result': options.length === 0 }">
                <ul>
                    <li v-for="option in options" v-bind:key="option.value" @click="toggleSelection(option.value)">
                        <input type="checkbox" :name="option.value">
                        <span>{{ option.value }}</span>
                    </li>
                </ul>
                <div class="no-match" v-if="options.length === 0">{{ $t('search.filters.no-match') }} ...</div>
            </div>
        </form>
        <div class="search-selection" v-if="selections.length">
            <ul>
                <li v-for="selection in selections" v-bind:key="selection">
                    <img src="../../assets/icons/icon_24_close-small.svg" @click="toggleSelection(selection)">
                    <span>{{ selection }}</span>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import { mapActions } from 'vuex';
import BookApi from '@/utils/api/bookApi';
import AuthorApi from '@/utils/api/authorApi'
export default {
    props: ['facetName', 'facetTitle', 'facetPlaceholder'],
    data: function() {
        return {
            searchQuery: null,
            options: []
        }
    },
    computed: {
        selections() {
            return this.$store.state.search.searchParams.facets[this.facetName];
        },
        api() {
            return this.facetName.includes("Book") ? BookApi : AuthorApi
        },
        hideOptions() {
            return this.$store.state.search.hideOptions[this.facetName];
        }
    },
    mounted() {
        for (const key of Object.keys(this.$store.state.search.hideOptions)) {
            this.$store.state.search.hideOptions[key] = true;
        }

        var query = this.$route.query;
        if (camelize(this.facetName) in query)
            this.$store.state.search.searchParams.facets[this.facetName] = decodeURI(query[camelize(this.facetName)]).split(',');
    },
    methods: {
        ...mapActions('search', {
            newFilterSelection: 'newFilterSelection',            
        }),
        toggleSelection: function(value) {
            this.newFilterSelection({ facetName: this.facetName, value: value });
            this.setAvailableFacets();
            this.searchQuery = "";
            this.disableOptions();
        },
        toggleOptions: function() {
            this.setAvailableFacets();
            this.$store.state.search.hideOptions[this.facetName] = !this.$store.state.search.hideOptions[this.facetName];
        },
        disableOptions: function() {
            this.$store.state.search.hideOptions[this.facetName] = true;
        },
        setAvailableFacets: function() {
            this.options = this.$store.state.search.facetsOptions[this.facetName].filter(o => !this.selections.includes(o.value));
        }
    },
    watch: {
        searchQuery(val) {
            this.options = this.$store.state.search.facetsOptions[this.facetName].filter(
                (o) => o.value.toLowerCase().includes(val.toLowerCase())
                       && !this.selections.includes(o.value)
            );
        }
    }
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}
</script>
<style>
.filter input[type="text"]::-webkit-input-placeholder {
    background: url("../../assets/icons/icon_12_union.svg");
    background-repeat: no-repeat;
    background-size: 12px;
    background-position: left;
    padding-left: 20px;
}

.filter input[type=text].open {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}
.custom-select::-webkit-scrollbar {
    width: 0
}
.custom-select::-webkit-scrollbar-track {
    display: none
}
.custom-select {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.custom-select.hide {
    display: none;
}
.no-match {
    width: 100%;
    padding: 10px;
    font-style: italic;
}

.filter li input[type="checkbox"] {
    margin-right: 5px;
    min-width: 16px; /* Fix for iOS */
}
</style>