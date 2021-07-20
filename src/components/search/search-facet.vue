<template>
    <section>
        <div>
            <form>
                <input type="text" autocomplete="off" name="Search" class="search-filter" v-model="searchQuery" :placeholder="facetPlaceholder">
            </form>
            <section class="search-selection">
                <ul>
                    <li v-for="selection in selections" :key="selection" @click="toggleSelection(selection)">
                        <input type="checkbox" :name="selection" checked="checked">
                        <span>{{selection}}</span>
                    </li>
                </ul>
            </section>
            <section class="custom-select" :class="options.length > 0 ? 'show' : 'hide'">
                <ul>
                    <li v-for="option in options" :key="`author-${option.id}`" @click="toggleSelection(option[facetKey])">
                        <input type="checkbox" :name="option.id">
                        <span>{{option[facetKey]}}</span>
                    </li>
                </ul>
            </section>
        </div>
    </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import BookApi from '@/utils/api/bookApi';
import AuthorApi from '@/utils/api/authorApi'
export default {
    props:['facetName', 'facetTitle', 'facetPlaceholder', 'facetKey'],
    data:function () {
        return{
            searchQuery: null,
            options: []
        }
    },
    computed: {
        selections(){
            return this.$store.state.search.searchParams.facets[this.facetName];
        },
        api() {
            return this.facetName.includes("Book") ? BookApi : AuthorApi
        }
    },
    methods:{
        ...mapActions('search', {
            newFilterSelection:'newFilterSelection',            
        }),
        toggleSelection: function(value) {
            this.newFilterSelection({facetName: this.facetName, value: value});
            this.searchQuery = "";
            this.options = [];
        }
    },
    watch: {
        async searchQuery(val) {
            this.options = (val.length > 2) ? (await this.api.search(val)).data.filter((o) => !this.selections.includes(o[this.facetKey])) : [];
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