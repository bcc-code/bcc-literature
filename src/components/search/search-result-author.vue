<template>
    <article class="search-result">   
          <router-link class="result-author-only" :to="{ name: 'author-index', params: { authorId: result.id, parent: $route }}">          
              <card-cover v-if="result.coverId != null" :cover-id="result.coverId" type="author"></card-cover>
              <h4> {{ result.fullName }}</h4>
          </router-link>
    </article>  
</template>
<script>
import CardCover from 'components/grid/tiles/card-cover';
export default {
    props: {
        result: {
            type: Object,
            required: true
        },
    },
    components: {
        CardCover
    },
};
</script>

<style scoped>
.result-author-only {
    display: flex;
    text-decoration: none;
    line-height: 20px;
    padding: 8px;
    margin: 0px;
    border-radius: 4px;
    -webkit-transition: background 0.2s;
    transition: background 0.2s;
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
}

article.search-result a.result-author-only figure {
    position: relative;
    display: block;
    width: 75px;
    height: 106px;
    padding: 0px;
    background: #838CA8;
    background-size: cover;
    margin: 0px 12px 0px 0px;
    float: left;
    border-radius: 2px;
}

article.search-result a.result-author-only figure + h4 {
    padding-top: 15px;
    position: relative;
    margin: 0px;
    color: var(--base1);
}
</style>