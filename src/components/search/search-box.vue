<template>
    <form class="search-form" v-on:submit.prevent="'onSubmit'">
        <span @click="search" class="main-search-button"></span>
        <input class="main-search" 
            type="text"
            name="Search"
            v-on:keyup.enter="search"                 
            v-model="searchQuery" 
            v-bind:placeholder="$t('search.search-box')" />
        <span v-show="searchQuery" @click="clearInput" class="clear-search-input"></span>
    </form>
</template>

<script>
export default {   
    data: function() {
        return {
            searchQuery: this.$store.state.search.searchParams.query
        }
    },
    methods: {
        search: function() {
            if (this.searchQuery == null || this.searchQuery == '')
                this.$router.push('/search/q=');    
            else this.$router.push({ name: 'search', path: '/search', params: { query: this.searchQuery || '' } });
        },
        clearInput: function() {
            this.searchQuery = '';
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
.clear-search-input {
    width: 20px;
    height: 20px;
    background-color: var(--base5);
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 50%;
    cursor: pointer;
    transition: 250ms ease;
}
.dark .clear-search-input {
    background-color: var(--base1);
}
.clear-search-input:hover {
    background-color: var(--base4);
}
.dark .clear-search-input:hover {
    background-color: var(--base2);
}
.clear-search-input:after {
    content: '';
    background-image: url(/img/icon_24_close-black.svg);
    background-size: 16px;
    background-position: center;
    background-repeat: no-repeat;
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>