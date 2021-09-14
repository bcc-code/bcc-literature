<template>
    <section>
        <div>
            <form>
                <input type="text" autocomplete="off" name="Search" class="search-filter" v-model="searchQuery" :placeholder="facetPlaceholder" @click="toggleOptions()">
            </form>
            <section class="search-selection">
                <ul>
                    <li v-for="selection in selections" v-bind:key="selection" @click="toggleSelection(selection)">
                        <input type="checkbox" :name="selection" checked="checked">
                        <span>{{ selection }}</span>
                    </li>
                </ul>
            </section>
            <section class="custom-select" :class="{hide: hideOptions}">
                <ul>
                    <li v-for="option in options" v-bind:key="option.value" @click="toggleSelection(option.value)">
                        <input type="checkbox" :name="option.value">
                        <span>{{ option.value }}</span>
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
    methods: {
        ...mapActions('search', {
            newFilterSelection: 'newFilterSelection',            
        }),
        toggleSelection: function(value) {
            this.newFilterSelection({ facetName: this.facetName, value: value });
            this.setAvailableFacets();
            this.searchQuery = "";
        },
        toggleOptions: function() {
            this.setAvailableFacets();
            this.$store.state.search.hideOptions[this.facetName] = !this.$store.state.search.hideOptions[this.facetName];
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