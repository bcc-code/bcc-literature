<template>
    <section>
        <div>
            <form>
                <input type="text" autocomplete="off" name="Search" class="search-filter" v-model="searchQuery" :placeholder="facetPlaceholder" @click="toggleOptions()">
            </form>
            <section class="search-selection">
                <ul>
                    <li v-for="selection in selections" @click="toggleSelection(selection)">
                        <input type="checkbox" :name="selection" checked="checked">
                        <span>{{selection}}</span>
                    </li>
                </ul>
            </section>
            <section class="custom-select" :class="{hide: hideOptions}">
                <ul>
                    <li v-for="facet in availableFacets" @click="toggleSelection(facet.value)">
                        <input type="checkbox" :name="facet.value">
                        <span>{{facet.value}}</span>
                    </li>
                </ul>
            </section>
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
            options: [],
            hideOptions: true
        }
    },
    computed: {
        availableFacets() {
            return this.options.length ? this.options : this.$store.state.search.facetsOptions[this.facetName].filter(
                (f) => !this.selections.includes(f.value)
            );
        },
        selections() {
            return this.$store.state.search.searchParams.facets[this.facetName];
        },
        api() {
            return this.facetName.includes("Book") ? BookApi : AuthorApi
        }
    },
    methods:{
        ...mapActions('search', {
            newFilterSelection: 'newFilterSelection',            
        }),
        toggleSelection: function(value) {
            this.newFilterSelection({facetName: this.facetName, value: value});
            this.options = [];
            this.searchQuery = "";
        },
        toggleOptions: function() {
            this.hideOptions = !this.hideOptions;
        }
    },
    watch: {
        async searchQuery(val) {
            this.options = this.availableFacets.filter((o) => o.value.toLowerCase().includes(val.toLowerCase()));
        }
    }
}
</script>
<style>
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
</style>