<template>
    <form class="search-form" v-on:submit.prevent="'onSubmit'">
        <span @click="search" class="main-search-button"></span>
        <input class="main-search" 
                type="text"
                name="Search"
                v-on:keyup.enter="search"                 
                v-model="searchQuery" 
                v-bind:placeholder="$t('search.search-box')" />        
    </form>
</template>

<script>
import { mapState } from 'vuex';

export default {   
    data: function(){
        return {
            searchQuery: this.$store.state.search.searchParams.query
        }
    },
    methods: {
        search:function(){            
            this.$router.push({ name: 'search', params: { query: this.searchQuery } })         
        }
    }
};
</script>
<style scoped>
.main-search-button {
    cursor: pointer;
    width: 38px;
    height: 100%;
    position: absolute;
}
</style>