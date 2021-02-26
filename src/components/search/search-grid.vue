<template>
    <form class="search-form">
        <input type="text" 
            name="Search for books" 
            class="search" 
            id="search-books" 
            v-bind:placeholder="$t('search.search')"
            v-on:keyup="$emit('query-changed', $event.target.value)"
            @focus="focus=true"
            @blur="focus=false"
            required="">
            <button type="reset" class="button-reset" @click="$emit('query-changed', '')" v-show="notEmpty || focus"></button>
    </form>
</template>

<script>
export default {
    data: function(){
        return {
            focus: false
        }
    },
    props: ["notEmpty"]
}
</script>