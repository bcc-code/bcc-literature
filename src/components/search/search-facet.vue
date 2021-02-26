<template>
    <section>
        <h5>{{facetTitle}}</h5>
        <div>
            <form>
                <input type="text" autocomplete="off" name="Search" class="search-filter" v-model="searchQuery" :placeholder="facetPlaceholder">
            </form>
            <section class="custom-select" :class="{ 'show': options.length > 0 }">
                <ul>
                    <li v-for="option in options" :key="`author-${option.id}`" @click="toggleSelection(option[facetKey])">
                        {{option[facetKey]}}
                    </li>
                </ul>
            </section>
        </div>
        <ul>
            <li v-for="selection in selections" :key="selection">
                <p>{{selection}}</p>
                <button class="button-remove" @click="toggleSelection(selection)"></button>
            </li>
        </ul>   
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
        toggleSelection:function(value){
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
</style>